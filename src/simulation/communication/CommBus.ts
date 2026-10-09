import { CommPacket, CommMessageType, CommunicationLevel, Vector2D, AgentState } from '../../types/simulation';
import { distance2D } from '../utils/math';

export class CommBus {
  public packets: CommPacket[] = [];
  public activeBeams: {
    id: string;
    from: Vector2D;
    to: Vector2D;
    progress: number;
    senderId: string;
    type: CommMessageType;
  }[] = [];
  public totalMessagesTransmitted: number = 0;
  public totalMessagesDelivered: number = 0;
  public totalMessagesDropped: number = 0;

  private idCounter: number = 0;

  public reset(): void {
    this.packets = [];
    this.activeBeams = [];
    this.totalMessagesTransmitted = 0;
    this.totalMessagesDelivered = 0;
    this.totalMessagesDropped = 0;
  }

  public sendMessage(
    sender: AgentState,
    receiverId: string | 'BROADCAST',
    type: CommMessageType,
    payload: any,
    currentStep: number,
    commLevel: CommunicationLevel,
    commRange: number = 25,
    delaySteps: number = 1
  ): CommPacket | null {
    if (commLevel === 'NONE') return null;

    // Check rate limit and cooldown
    if (commLevel === 'RESTRICTED' && sender.commCooldown > 0) {
      this.totalMessagesDropped++;
      return null;
    }

    const latency = commLevel === 'HIGH' ? 0 : commLevel === 'NORMAL' ? delaySteps : delaySteps + 1;
    const packet: CommPacket = {
      id: `pkt-${++this.idCounter}`,
      step: currentStep,
      senderId: sender.id,
      receiverId,
      type,
      payload,
      senderPos: { ...sender.position },
      receiverPos: { ...sender.position }, // will update upon recipient query
      transmittedStep: currentStep,
      deliverStep: currentStep + latency,
      status: 'IN_FLIGHT'
    };

    sender.messagesSent++;
    this.totalMessagesTransmitted++;
    sender.commCooldown = commLevel === 'RESTRICTED' ? 8 : commLevel === 'NORMAL' ? 3 : 0;
    this.packets.push(packet);

    return packet;
  }

  public update(
    currentStep: number,
    agents: AgentState[],
    commLevel: CommunicationLevel,
    maxRange: number = 25,
    reliabilityPercent: number = 100
  ): {
    deliveredPackets: CommPacket[];
  } {
    const deliveredPackets: CommPacket[] = [];
    const agentMap = new Map<string, AgentState>();
    for (const a of agents) agentMap.set(a.id, a);

    this.activeBeams = [];

    for (const pkt of this.packets) {
      if (pkt.status !== 'IN_FLIGHT') continue;

      const sender = agentMap.get(pkt.senderId);
      if (!sender) continue;

      // Update 3D visual beam progress
      const totalDuration = Math.max(1, pkt.deliverStep - pkt.transmittedStep + 1);
      const elapsed = currentStep - pkt.transmittedStep;
      const progress = Math.min(1.0, elapsed / totalDuration);

      // In flight beam visualization
      if (pkt.receiverId === 'BROADCAST') {
        for (const other of agents) {
          if (other.id === sender.id) continue;
          const dist = distance2D(sender.position, other.position);
          const allowedDist = commLevel === 'HIGH' ? 9999 : maxRange;
          if (dist <= allowedDist) {
            this.activeBeams.push({
              id: `${pkt.id}-${other.id}`,
              from: { ...sender.position },
              to: { ...other.position },
              progress,
              senderId: sender.id,
              type: pkt.type
            });
          }
        }
      } else {
        const receiver = agentMap.get(pkt.receiverId);
        if (receiver) {
          this.activeBeams.push({
            id: pkt.id,
            from: { ...sender.position },
            to: { ...receiver.position },
            progress,
            senderId: sender.id,
            type: pkt.type
          });
        }
      }

      // Check delivery step and channel reliability
      if (currentStep >= pkt.deliverStep) {
        // Channel packet loss check
        const lossRoll = Math.random() * 100;
        if (lossRoll > reliabilityPercent) {
          pkt.status = 'DROPPED';
          this.totalMessagesDropped++;
          continue;
        }

        pkt.status = 'DELIVERED';
        this.totalMessagesDelivered++;
        deliveredPackets.push(pkt);

        // Process message receipt for agent internal belief updating
        if (pkt.receiverId === 'BROADCAST') {
          for (const recipient of agents) {
            if (recipient.id === pkt.senderId) continue;
            const dist = distance2D(sender.position, recipient.position);
            const allowedDist = commLevel === 'HIGH' ? 9999 : maxRange;
            if (dist <= allowedDist) {
              recipient.messagesReceived++;
              this.applyPacketToAgentMemory(recipient, pkt);
            }
          }
        } else {
          const recipient = agentMap.get(pkt.receiverId);
          if (recipient) {
            recipient.messagesReceived++;
            this.applyPacketToAgentMemory(recipient, pkt);
          }
        }
      }
    }

    // Retain only recent in-flight or freshly delivered packets
    this.packets = this.packets.filter((p) => currentStep - p.deliverStep <= 10);

    return { deliveredPackets };
  }

  private applyPacketToAgentMemory(agent: AgentState, packet: CommPacket): void {
    if (packet.type === 'GATE_BLOCKED' || packet.type === 'GATE_OPENED') {
      const { ringIndex, angle, isOpen } = packet.payload;
      const existing = agent.knownGates.find(
        (g) => g.ringIndex === ringIndex && Math.abs(g.angle - angle) < 0.2
      );
      if (existing) {
        existing.isOpen = isOpen;
        existing.lastObservedStep = packet.step;
        existing.confidence = 0.9;
      } else {
        agent.knownGates.push({
          ringIndex,
          angle,
          isOpen,
          lastObservedStep: packet.step,
          confidence: 0.9
        });
      }
    } else if (packet.type === 'TARGET_DISCOVERED' && packet.payload?.target) {
      agent.knownTarget = { ...packet.payload.target };
    }
  }

  public sendPacket(packetData: Omit<CommPacket, 'id' | 'step'>): CommPacket {
    const packet: CommPacket = {
      id: `pkt-${++this.idCounter}`,
      step: packetData.transmittedStep,
      ...packetData
    };
    this.totalMessagesTransmitted++;
    this.packets.push(packet);
    return packet;
  }

  public getPacketsForAgent(agentId: string, currentStep: number): CommPacket[] {
    return this.packets.filter(
      (p: CommPacket) =>
        (p.receiverId === agentId || p.receiverId === 'BROADCAST') &&
        p.status === 'DELIVERED' &&
        p.senderId !== agentId &&
        p.deliverStep === currentStep
    );
  }
}

