export interface OscilloscopeSetup {
  timeDiv: string;
  voltageDiv: string;
  triggerEdge: string;
  triggerMode: string;
  triggerLevel: string;
}

export interface WaveformPhase {
  id: number;
  title: string;
  description: string;
  x?: number;
  y?: number;
  labelX?: number;
  labelY?: number;
}

export interface ComponentData {
  id: string;
  name: string;
  type: "sensor" | "actuator";
  shortDescription: string;
  fullDescription: string;
  oscilloscopeSetup: OscilloscopeSetup;
  connectionInstructions?: string;
  waveformExplanation: string;
  waveformPhases?: WaveformPhase[];
  waveType: string;
}

export interface User {
  username: string;
  role: "admin" | "mechanic";
}

export interface RealSignal {
  id: string;
  componentId: string;
  motorcycleName: string;
  userName: string;
  imageUrl: string;
  createdAt: number;
}
