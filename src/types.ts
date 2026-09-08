export type Part = {
  id: string;
  name: string;
  mesh: string;
  body: string;
  group: string;
  kind: string;
  description: string;
  triangles: number;
  dimensionsMm: number[];
  center: number[];
  color: number[];
  download: string;
};
export type Body = {
  name: string;
  group: string;
  position: number[];
  quaternion: number[];
  massGrams: number;
};
export type Manifest = {
  revision: string;
  partCount: number;
  uniqueMeshCount: number;
  modelMassGrams: number;
  boundsMm: number[];
  parts: Part[];
  bodies: Body[];
  joints: {
    name: string;
    actionIndex: number;
    servoId: number;
    body: string;
    home: number;
    range: number[];
    axis: number[];
    position: number[];
  }[];
};
export type SimState = {
  time: number;
  steps: number;
  paused: boolean;
  mode: string;
  fault: string | null;
  engine: string;
  controlHz: number;
  physicsHz: number;
  inferenceMs: number;
  height: number;
  tilt: number;
  contacts: number;
  command: number[];
  joints: number[];
  positions: number[][];
  quaternions: number[][];
  bodies: string[];
  basePosition: number[];
};
export type Tab =
  "assembly" | "simulation" | "architecture" | "parts" | "guide";
