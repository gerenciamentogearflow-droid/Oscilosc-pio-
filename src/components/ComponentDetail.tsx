import React, { useState } from "react";
import { ComponentData } from "../types";
import { OscilloscopeDisplay } from "./OscilloscopeDisplay";
import {
  ArrowLeft,
  Sliders,
  Info,
  Zap,
  Settings2,
  Activity,
  Cable,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ComponentDetailProps {
  component: ComponentData;
  onBack: () => void;
}

export function ComponentDetail({ component, onBack }: ComponentDetailProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "oscilloscope">(
    "overview",
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col">
      <header className="px-4 pt-12 pb-4 bg-white border-b border-zinc-200 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight leading-tight">
              {component.name}
            </h1>
            <span
              className={`text-xs uppercase font-bold tracking-wider ${component.type === "sensor" ? "text-blue-600" : "text-orange-600"}`}
            >
              {component.type === "sensor" ? "Sensor" : "Atuador"}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mt-6 bg-zinc-50 p-1.5 rounded-xl border border-zinc-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 flex justify-center items-center gap-2 py-3 text-base font-semibold rounded-lg transition-all ${activeTab === "overview" ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" : "text-zinc-500 hover:text-zinc-800"}`}
          >
            <Info className="w-5 h-5" /> Funcionamento
          </button>
          <button
            onClick={() => setActiveTab("oscilloscope")}
            className={`flex-1 flex justify-center items-center gap-2 py-3 text-base font-semibold rounded-lg transition-all ${activeTab === "oscilloscope" ? "bg-cyan-50 text-cyan-700 shadow-sm border border-cyan-100" : "text-zinc-500 hover:text-zinc-800"}`}
          >
            <Activity className="w-5 h-5" /> Osciloscópio
          </button>
        </div>
      </header>

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="p-5 space-y-6 pb-12"
            >
              <section>
                <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-500 mb-3">
                  <Info className="w-5 h-5" /> Descrição Técnica
                </h3>
                <p className="text-zinc-700 text-base leading-relaxed whitespace-pre-wrap">
                  {component.fullDescription}
                </p>
              </section>

              {component.connectionInstructions && (
                <section className="bg-cyan-50 border border-cyan-200 rounded-2xl p-5">
                  <h3 className="flex items-center gap-2 text-base font-bold text-cyan-700 mb-3">
                    <Cable className="w-5 h-5" /> Como Conectar as Pontas de
                    Prova
                  </h3>
                  <p className="text-cyan-900 text-base leading-relaxed whitespace-pre-wrap">
                    {component.connectionInstructions}
                  </p>
                </section>
              )}
            </motion.div>
          )}

          {activeTab === "oscilloscope" && (
            <motion.div
              key="oscilloscope"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="p-5 space-y-8 pb-12"
            >
              <OscilloscopeDisplay component={component} />

              <section className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-zinc-50 px-5 py-4 flex items-center gap-3 border-b border-zinc-200">
                  <Settings2 className="w-6 h-6 text-cyan-600" />
                  <h3 className="font-bold text-zinc-900 text-lg">
                    Configuração (Setup)
                  </h3>
                </div>
                <div className="p-5 grid grid-cols-2 gap-y-6 gap-x-4 text-base">
                  <div>
                    <span className="block text-sm text-zinc-500 mb-1 font-medium">
                      Tempo / Div
                    </span>
                    <span className="font-mono font-bold text-zinc-900">
                      {component.oscilloscopeSetup.timeDiv}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm text-zinc-500 mb-1 font-medium">
                      Tensão / Div
                    </span>
                    <span className="font-mono font-bold text-zinc-900">
                      {component.oscilloscopeSetup.voltageDiv}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm text-zinc-500 mb-1 font-medium">
                      Trigger (Borda)
                    </span>
                    <span className="font-mono font-bold text-zinc-900">
                      {component.oscilloscopeSetup.triggerEdge}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm text-zinc-500 mb-1 font-medium">
                      Modo & Nível
                    </span>
                    <span className="font-mono font-bold text-zinc-900">
                      {component.oscilloscopeSetup.triggerMode} @{" "}
                      {component.oscilloscopeSetup.triggerLevel}
                    </span>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="flex items-center gap-2 text-base font-bold text-cyan-600 mb-5 px-1">
                  <Zap className="w-5 h-5" /> Análise do Sinal (Por Fases)
                </h3>

                {component.waveformPhases ? (
                  <div className="grid gap-4">
                    {component.waveformPhases.map((phase) => (
                      <div
                        key={phase.id}
                        className="bg-white border border-zinc-200 rounded-2xl p-5 flex gap-4 items-start shadow-sm"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-50 border-2 border-cyan-100 flex items-center justify-center text-cyan-600 font-bold text-lg">
                          {phase.id}
                        </div>
                        <div>
                          <h4 className="text-zinc-900 font-bold mb-2 text-lg">
                            {phase.title}
                          </h4>
                          <p className="text-zinc-600 text-base leading-relaxed">
                            {phase.description}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Fallback to explanation if there is additional text we want to keep */}
                    <div className="mt-6 bg-zinc-50 border border-zinc-200 rounded-2xl p-5">
                      <p className="text-zinc-600 text-sm leading-relaxed italic">
                        {component.waveformExplanation}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-zinc-700 text-base leading-relaxed whitespace-pre-line">
                      {component.waveformExplanation}
                    </p>
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// Importing Activity again for tab icon since we used it up there implicitly
import { Activity } from "lucide-react";
