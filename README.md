# CHAKRAFORGE
**Strategic Coordination Laboratory**

An interactive, 3D academic simulation exploring multi-agent coordination, epistemic logic, and distributed communication within the framework of the historical *Chakravyuha* formation as described in the *Droṇa Parva* of the *Mahābhārata*.

## Overview
CHAKRAFORGE is a web-based computational laboratory built to visualize and experiment with complex, multi-agent systems. It abstracts the ancient defensive formation into a continuous 2D/3D physics simulation to study:
- Multi-Agent Coordination under incomplete information
- Dynamic pathfinding in adversarial geometries
- Single point of failure (chokepoint) analysis
- Monte Carlo hypothesis testing for team resilience

## Technology Stack
- **Core Framework**: React 18, TypeScript, Vite
- **3D Rendering**: Three.js, React Three Fiber (R3F)
- **Styling**: Tailwind CSS
- **Data Visualization**: Recharts
- **Icons**: Lucide React

## Features
- **3D Battlefield Simulator**: A fully interactive, WebGL-powered visualization of the 7-ring rotating formation.
- **Agent Mechanics**: Configurable policies (Random, Greedy, Shortest Path, Coordinated) exploring how agents navigate dynamic mazes.
- **Experiment Workspace**: Run batch Monte Carlo simulations varying communication reliability and exit knowledge to measure success rates and path efficiency.
- **Academic Context**: Detailed mappings explaining how ancient Sanskrit texts are computationally modeled as Markov Decision Processes (POMDPs).

## Local Development
To run this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/hell-codes/chakraforge.git
   ```
2. Navigate to the directory:
   ```bash
   cd chakraforge
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Design Philosophy
The aesthetic follows a "Premium Academic Dark" theme, combining Kurukṣetra-inspired gold accents (`#d4af37`), deep earth/shadow backgrounds, and glassmorphism UI components to ensure it feels like a modern, state-of-the-art research platform rather than a simple minimum viable product.

## Limitations
This simulation abstracts complex human warfare into simplified kinematic agent dynamics. Textual Sanskrit sources describe tactical intentions and formations rather than Euclidean blueprints; geometry and rotation parameters here serve strictly as conceptual computational models.
