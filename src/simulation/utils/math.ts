import { Vector2D } from '../../types/simulation';

/**
 * Deterministic Pseudo-Random Number Generator (Mulberry32)
 * Ensures reproducible simulations for exact scientific replication.
 */
export class PRNG {
  private state: number;

  constructor(seed: number = 1000) {
    this.state = seed >>> 0;
  }

  public next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  public range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  public rangeInt(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  public choice<T>(array: T[]): T {
    const index = Math.floor(this.next() * array.length);
    return array[index];
  }
}

export function distance2D(a: Vector2D, b: Vector2D): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function distanceSq2D(a: Vector2D, b: Vector2D): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

export function normalize2D(v: Vector2D): Vector2D {
  const len = Math.sqrt(v.x * v.x + v.y * v.y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function normalizeAngle(rad: number): number {
  let a = rad % (2 * Math.PI);
  if (a < 0) a += 2 * Math.PI;
  return a;
}

export function angleDiff(a: number, b: number): number {
  let diff = (b - a + Math.PI) % (2 * Math.PI) - Math.PI;
  return diff < -Math.PI ? diff + 2 * Math.PI : diff;
}

export function isAngleBetween(target: number, start: number, end: number): boolean {
  const nTarget = normalizeAngle(target);
  const nStart = normalizeAngle(start);
  const nEnd = normalizeAngle(end);

  if (nStart <= nEnd) {
    return nTarget >= nStart && nTarget <= nEnd;
  } else {
    return nTarget >= nStart || nTarget <= nEnd;
  }
}
