import React, { useState } from "react";
import { ComponentData } from "../types";
import { ArrowLeft, Zap, Info, Activity, Thermometer } from "lucide-react";
import { motion } from "motion/react";
import { MultimeterVisual } from "./MultimeterVisual";

interface MultimeterDetailProps {
  component: ComponentData;
  onBack: () => void;
}

export function MultimeterDetail({ component, onBack }: MultimeterDetailProps) {
  const [displayType, setDisplayType] = useState<"min" | "max" | null>(null);

  if (!component.multimeter) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Dados de multímetro indisponíveis para este componente.</p>
          <button onClick={onBack} className="text-cyan-500 font-bold">Voltar</button>
        </div>
      </div>
    );
  }

  const mm = component.multimeter;
  
  let currentDisplayValue: number | string | undefined = undefined;
  if (displayType === "min" && mm.minValue !== undefined) {
    currentDisplayValue = mm.minValue;
  } else if (displayType === "max" && mm.maxValue !== undefined) {
    currentDisplayValue = mm.maxValue;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="px-5 pt-12 pb-4 bg-zinc-900 border-b border-zinc-800 z-10 shadow-lg">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cyan-500 font-semibold mb-4 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" /> Voltar
        </button>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-900/30 text-cyan-400 rounded-xl">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{component.name}</h1>
            <p className="text-sm text-cyan-500 font-medium tracking-wide">Teste com Multímetro</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-5 pb-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Visual Multimeter Component */}
          <div className="flex flex-col gap-4 py-4 px-2 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden items-center">
             <MultimeterVisual setting={mm.setting} displayValue={currentDisplayValue} />
             
             {mm.minValue !== undefined && mm.maxValue !== undefined && (
               <div className="flex gap-4 mt-2 w-full max-w-[320px]">
                 <button
                   onClick={() => setDisplayType(displayType === "min" ? null : "min")}
                   className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all text-sm flex justify-between items-center ${displayType === "min" ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
                 >
                   <span>Mínimo</span>
                   {displayType === "min" && <span className="text-xs opacity-70 font-mono">{mm.minValue}{mm.unit}</span>}
                 </button>
                 <button
                   onClick={() => setDisplayType(displayType === "max" ? null : "max")}
                   className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all text-sm flex justify-between items-center ${displayType === "max" ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
                 >
                   <span>Máximo</span>
                   {displayType === "max" && <span className="text-xs opacity-70 font-mono">{mm.maxValue}{mm.unit}</span>}
                 </button>
               </div>
             )}
          </div>

          {mm.temperatureObservation && (
            <div className="bg-blue-900/20 border border-blue-800/50 rounded-2xl p-4 flex gap-3">
              <Thermometer className="w-6 h-6 text-blue-400 shrink-0" />
              <p className="text-sm text-blue-200/90 leading-relaxed">
                <strong className="text-blue-400 block mb-1">Temperatura e Comportamento:</strong>
                {mm.temperatureObservation}
              </p>
            </div>
          )}

          {mm.variesByModel && (
            <div className="bg-orange-900/20 border border-orange-800/50 rounded-2xl p-4 flex gap-3">
              <Info className="w-6 h-6 text-orange-400 shrink-0" />
              <p className="text-sm text-orange-300/90 leading-relaxed">
                <strong className="text-orange-400 block mb-1">Nota Importante:</strong>
                Os valores de resistência e voltagem exatos podem variar dependendo do modelo e ano da motocicleta. Consulte sempre o manual de serviço específico para confirmar os valores de tolerância.
              </p>
            </div>
          )}

          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-500" />
              Como Testar
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {mm.instructions}
              </p>
            </div>
          </section>

          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-500" />
              Valores Esperados
            </h2>
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap font-medium">
                {mm.expectedValues}
              </p>
            </div>
          </section>

        </motion.div>
      </main>
    </div>
  );
}
