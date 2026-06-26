import React from "react";
import { ComponentData } from "../types";
import { Battery, Activity, ArrowUp, ArrowDown } from "lucide-react";

interface OscilloscopeDisplayProps {
  component: ComponentData;
}

export function OscilloscopeDisplay({ component }: OscilloscopeDisplayProps) {
  // Generate SVG path based on wave type
  const getPath = () => {
    switch (component.waveType) {
      case "sine":
        // Pure continuous sine wave
        return "M 0 50 C 2 20 6 20 8 50 C 10 80 14 80 16 50 C 18 20 22 20 24 50 C 26 80 30 80 32 50 C 34 20 38 20 40 50 C 42 80 46 80 48 50 C 50 20 54 20 56 50 C 58 80 62 80 64 50 C 66 20 70 20 72 50 C 74 80 78 80 80 50 C 82 20 86 20 88 50 C 90 80 94 80 96 50 C 98 20 100 20 102 50";
      case "sine-gap":
        // Inductive CKP - organic AC wave, amplitude & freq increase, clear gap
        return "M 0 50 C 2 20 6 20 8 50 C 10 80 14 80 16 50 C 18 20 22 20 24 50 C 26 80 30 80 32 50 C 34 20 38 20 40 50 C 42 80 46 80 48 50 C 52 0 65 0 70 50 C 72 80 76 80 78 50 C 80 20 84 20 86 50 C 88 80 92 80 94 50 C 96 20 100 20 102 50";
      case "square":
        // Pure continuous square wave
        return "M 0 80 L 10 80 L 11 20 L 25 20 L 26 80 L 40 80 L 41 20 L 55 20 L 56 80 L 70 80 L 71 20 L 85 20 L 86 80 L 100 80";
      case "square-gap":
        // Digital Hall effect - slight tilt on rising/falling edges for realism
        return "M 0 80 L 10 80 L 11 20 L 20 20 L 21 80 L 30 80 L 31 20 L 40 20 L 41 80 L 65 80 L 66 20 L 75 20 L 76 80 L 85 80 L 86 20 L 95 20 L 96 80 L 100 80";
      case "injector":
        // Injector: 12V -> 0V (Dwell) -> 100V Flyback -> Pintle Bump (mechanical close) -> 12V
        return "M 0 70 L 29 70 L 29.5 90 L 35 89.5 L 40 90.5 L 45 89.5 L 50 90.5 L 55 90 L 55.5 15 L 57.5 50 L 58.5 48 L 59.5 55 C 61 65 63 70 68 70 L 100 70";
      case "ignition":
        // Ignition Coil: Dwell -> Spark Spike -> Burn Line (noisy) -> Extinguish -> Ringing
        return "M 0 40 L 15 40 L 16 80 L 45 80 L 46 -10 L 47 50 L 50 48 L 53 50 L 56 48 L 59 40 Q 62 60 64 35 T 68 35 T 72 40 L 100 40";
      case "tps":
        // TPS: Idle noise -> smooth slope -> WOT noise
        return "M 0 85 L 2 84 L 4 86 L 6 85 L 20 85 L 80 15 L 90 14 L 92 16 L 94 15 L 100 15";
      case "lambda":
        // Lambda: Rich/Lean cycling analog wave
        return "M 0 80 C 10 80 20 20 30 20 C 40 20 50 80 60 80 C 70 80 80 20 90 20 C 95 20 100 40 100 40";
      case "map":
        // MAP: Idle ripple -> Snap Throttle Drop -> WOT spike -> Decel vacuum
        return "M 0 70 Q 2 68 4 70 T 8 70 T 12 70 T 16 70 L 20 70 L 23 45 L 26 55 L 40 40 L 65 40 L 70 85 Q 75 85 80 80 Q 85 75 90 70 T 100 70";
      case "pwm":
        // PWM for Heater: 12V (20) -> 0V (80)
        return "M 0 20 L 10 20 L 10 80 L 35 80 L 35 20 L 60 20 L 60 80 L 85 80 L 85 20 L 100 20";
      default:
        return "M 0 50 L 100 50";
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#77aed4] to-[#4A85B3] p-3 sm:p-5 rounded-2xl shadow-2xl mx-auto w-full max-w-4xl flex flex-col sm:flex-row gap-3 sm:gap-5 border-2 border-[#85BDE8]">
      {/* Screen Section */}
      <div className="flex-1 bg-[#020202] rounded-lg overflow-hidden flex flex-col font-mono text-xs text-white border-[6px] border-zinc-900 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative aspect-[4/3] sm:aspect-auto sm:h-[340px]">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-3 py-1.5 bg-zinc-950 border-b border-zinc-800 z-10 text-[#00FF00]">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 md:w-4 md:h-4" />
            <span className="font-semibold text-[10px] md:text-xs">
              H={component.oscilloscopeSetup.timeDiv}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-[#00FF00] text-black px-2 py-0.5 rounded-sm font-bold text-[9px] md:text-[10px]">
              RUN
            </span>
            <div className="flex gap-2 text-zinc-400 font-bold text-[10px]">
              <span>V</span>
              <span>H</span>
            </div>
            <Battery className="w-3 h-3 md:w-4 md:h-4" />
          </div>
        </div>

        {/* Main Display Grid */}
        <div className="relative flex-1 overflow-hidden flex flex-col justify-center items-center">
          {/* Grid background */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[...Array(9)].map((_, i) => (
              <div
                key={`h-${i}`}
                className={`w-full h-[1px] ${i === 4 ? "bg-zinc-600/70" : "bg-zinc-700/40 border-t border-dotted border-zinc-600/40"}`}
              />
            ))}
          </div>
          <div className="absolute inset-0 flex justify-between pointer-events-none">
            {[...Array(13)].map((_, i) => (
              <div
                key={`v-${i}`}
                className={`h-full w-[1px] ${i === 6 ? "bg-zinc-600/70" : "bg-zinc-700/40 border-l border-dotted border-zinc-600/40"}`}
              />
            ))}
          </div>

          {/* Wave SVG */}
          <svg
            className="absolute w-full h-full scale-y-[0.85]"
            style={{
              filter: "drop-shadow(0px 0px 4px rgba(0, 255, 255, 0.8))",
            }}
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path
              d={getPath()}
              fill="none"
              stroke="#00FFFF"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {component.waveformPhases?.map((phase) =>
              phase.x !== undefined && phase.y !== undefined ? (
                <g key={phase.id}>
                  {/* Line pointing to wave */}
                  <line
                    x1={phase.labelX ?? phase.x}
                    y1={phase.labelY ?? phase.y - 10}
                    x2={phase.x}
                    y2={phase.y}
                    stroke="#FFFFFF"
                    strokeWidth="0.5"
                    strokeDasharray="1,1"
                    className="opacity-70"
                  />

                  {/* Label Badge */}
                  <circle
                    cx={phase.labelX ?? phase.x}
                    cy={phase.labelY ?? phase.y - 10}
                    r="5"
                    fill="#00FFFF"
                    stroke="#FFFFFF"
                    strokeWidth="0.5"
                    className="drop-shadow-md"
                  />
                  <text
                    x={phase.labelX ?? phase.x}
                    y={(phase.labelY ?? phase.y - 10) + 1.8}
                    fontSize="4.5"
                    fill="#000000"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {phase.id}
                  </text>
                </g>
              ) : null,
            )}
          </svg>
        </div>

        {/* Bottom Status Bar */}
        <div className="w-full bg-zinc-950 border-t border-zinc-800 px-3 py-1.5 flex justify-between items-center text-white text-[10px] sm:text-xs z-10 min-h-[32px]">
          <span
            className="font-bold truncate max-w-[50%] mr-2"
            title={component.oscilloscopeSetup.voltageDiv}
          >
            {component.oscilloscopeSetup.voltageDiv}
          </span>
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <span className="bg-[#00FF00] text-black w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px]">
              T
            </span>
            <span className="font-semibold hidden sm:inline">
              {component.oscilloscopeSetup.triggerMode}
            </span>
            <span className="font-semibold sm:hidden">Auto</span>
            <ArrowUp
              className={`w-3 h-3 ${component.oscilloscopeSetup.triggerEdge.includes("Descida") ? "rotate-180 text-cyan-400" : "text-cyan-400"}`}
            />
            <span className="font-semibold text-zinc-400">X10</span>
            <span className="font-semibold text-zinc-400">DC</span>
          </div>
        </div>
      </div>

      {/* Hardware Buttons Panel */}
      <div className="grid grid-cols-5 sm:flex sm:flex-col gap-2 sm:gap-3 sm:w-[72px] sm:py-2">
        <button className="bg-[#1C1E21] hover:bg-zinc-800 text-zinc-200 text-[9px] sm:text-[10px] font-bold rounded-md shadow-[0_4px_0_#0F1113] active:translate-y-[4px] active:shadow-none h-10 sm:h-12 flex items-center justify-center border border-zinc-700/50 transition-all">
          AUTO
        </button>
        <button className="bg-[#1C1E21] hover:bg-zinc-800 text-zinc-200 text-[9px] sm:text-[10px] font-bold rounded-md shadow-[0_4px_0_#0F1113] active:translate-y-[4px] active:shadow-none h-10 sm:h-12 flex items-center justify-center border border-zinc-700/50 transition-all">
          MODE
        </button>
        <button className="bg-[#1C1E21] hover:bg-zinc-800 text-zinc-200 font-bold rounded-md shadow-[0_4px_0_#0F1113] active:translate-y-[4px] active:shadow-none h-10 sm:h-12 flex items-center justify-center border border-zinc-700/50 transition-all">
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button className="bg-[#1C1E21] hover:bg-zinc-800 text-zinc-200 font-bold rounded-md shadow-[0_4px_0_#0F1113] active:translate-y-[4px] active:shadow-none h-10 sm:h-12 flex items-center justify-center border border-zinc-700/50 transition-all">
          <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button className="bg-[#1C1E21] hover:bg-zinc-800 text-zinc-200 text-[9px] sm:text-[10px] font-bold rounded-md shadow-[0_4px_0_#0F1113] active:translate-y-[4px] active:shadow-none h-10 sm:h-12 flex items-center justify-center border border-zinc-700/50 transition-all">
          RUN
        </button>
      </div>
    </div>
  );
}
