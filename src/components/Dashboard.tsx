import React, { useState } from "react";
import { User, ComponentData } from "../types";
import { componentsDB } from "../data/componentsDB";
import {
  Search,
  Activity,
  Cpu,
  Settings,
  LogOut,
  BookOpen,
  Camera,
  Zap,
  SlidersHorizontal,
  Share2,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RealSignalsList } from "./RealSignalsList";
import { MultimeterDetail } from "./MultimeterDetail";

interface DashboardProps {
  user: User;
  onSelectComponent: (comp: ComponentData) => void;
  onAdminClick: () => void;
  onLogout: () => void;
}

export function Dashboard({
  user,
  onSelectComponent,
  onAdminClick,
  onLogout,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"home" | "didactic" | "real_signals" | "multimeter" | "parameters" | "pinouts">(
    "home",
  );
  const [selectedRealSignalComponent, setSelectedRealSignalComponent] =
    useState<ComponentData | null>(null);
  const [selectedMultimeterComponent, setSelectedMultimeterComponent] =
    useState<ComponentData | null>(null);
  const [selectedParameterComponent, setSelectedParameterComponent] =
    useState<ComponentData | null>(null);
  const [selectedPinoutComponent, setSelectedPinoutComponent] =
    useState<ComponentData | null>(null);

  const filteredComponents = componentsDB.filter(
    (c) =>
      !c.hidden &&
      (activeTab !== "multimeter" || c.multimeter)
  );

  const [showStatorModal, setShowStatorModal] = useState<{ mode: "didactic" | "real" | "multimeter" | "parameters" | "pinouts" } | null>(null);

  const handleComponentClick = (comp: ComponentData, mode: "didactic" | "real" | "multimeter" | "parameters" | "pinouts" = "didactic") => {
    if (comp.id === "estator") {
      setShowStatorModal({ mode });
    } else {
      if (mode === "didactic") {
        onSelectComponent(comp);
      } else if (mode === "real") {
        setSelectedRealSignalComponent(comp);
      } else if (mode === "multimeter") {
        setSelectedMultimeterComponent(comp);
      } else if (mode === "parameters") {
        setSelectedParameterComponent(comp);
      } else if (mode === "pinouts") {
        setSelectedPinoutComponent(comp);
      }
    }
  };

  const handleStatorSelection = (phaseId: string) => {
    const mode = showStatorModal?.mode || "didactic";
    setShowStatorModal(null);
    const statorComp = componentsDB.find(c => c.id === phaseId);
    if (statorComp) {
      if (mode === "didactic") {
        onSelectComponent(statorComp);
      } else if (mode === "real") {
        setSelectedRealSignalComponent(statorComp);
      } else if (mode === "multimeter") {
        setSelectedMultimeterComponent(statorComp);
      } else if (mode === "parameters") {
        setSelectedParameterComponent(statorComp);
      } else if (mode === "pinouts") {
        setSelectedPinoutComponent(statorComp);
      }
    }
  };

  if (selectedMultimeterComponent) {
    return <MultimeterDetail component={selectedMultimeterComponent} onBack={() => setSelectedMultimeterComponent(null)} />;
  }

  if (selectedParameterComponent) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Parâmetros: {selectedParameterComponent.name}</h2>
        <p className="text-zinc-400 mb-8">Esta área está em desenvolvimento.</p>
        <button onClick={() => setSelectedParameterComponent(null)} className="px-6 py-3 bg-purple-600 rounded-xl font-bold">Voltar</button>
      </div>
    );
  }

  if (selectedPinoutComponent) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Pinagens: {selectedPinoutComponent.name}</h2>
        <p className="text-zinc-400 mb-8">Esta área está em desenvolvimento.</p>
        <button onClick={() => setSelectedPinoutComponent(null)} className="px-6 py-3 bg-rose-600 rounded-xl font-bold">Voltar</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="px-5 pt-12 pb-4 bg-zinc-900 border-b border-zinc-800 z-10 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-500" />
            <h1 className="text-xl font-bold tracking-tight text-white">MotoScope Pro</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onAdminClick}
              className="p-2 rounded-full bg-zinc-800 text-cyan-500 hover:bg-zinc-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 relative">
        <AnimatePresence mode="wait">
          {activeTab === "home" ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="pb-8 grid gap-4 grid-cols-1 md:grid-cols-2"
            >
              <button
                onClick={() => setActiveTab("didactic")}
                className="flex items-center gap-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-6 rounded-3xl transition-all active:scale-95 shadow-lg text-left"
              >
                <div className="p-4 rounded-2xl bg-cyan-900/20 text-cyan-500 shrink-0">
                  <BookOpen className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Aprender sobre Ondas</h2>
                  <p className="text-zinc-400 text-sm leading-snug">
                    Aprenda teoria e como analisar ondas no osciloscópio.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("real_signals")}
                className="flex items-center gap-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-6 rounded-3xl transition-all active:scale-95 shadow-lg text-left"
              >
                <div className="p-4 rounded-2xl bg-emerald-900/20 text-emerald-500 shrink-0">
                  <Camera className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Sinais Reais (Osciloscópio)</h2>
                  <p className="text-zinc-400 text-sm leading-snug">
                    Veja fotos reais de testes com osciloscópio.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("multimeter")}
                className="flex items-center gap-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-6 rounded-3xl transition-all active:scale-95 shadow-lg text-left"
              >
                <div className="p-4 rounded-2xl bg-orange-900/20 text-orange-500 shrink-0">
                  <Zap className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Multímetro</h2>
                  <p className="text-zinc-400 text-sm leading-snug">
                    Aprenda a testar passo a passo com multímetro.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("parameters")}
                className="flex items-center gap-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-6 rounded-3xl transition-all active:scale-95 shadow-lg text-left"
              >
                <div className="p-4 rounded-2xl bg-purple-900/20 text-purple-500 shrink-0">
                  <SlidersHorizontal className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Parâmetros</h2>
                  <p className="text-zinc-400 text-sm leading-snug">
                    Consulte tabelas e parâmetros base dos sistemas.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("pinouts")}
                className="flex items-center gap-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-6 rounded-3xl transition-all active:scale-95 shadow-lg text-left md:col-span-2"
              >
                <div className="p-4 rounded-2xl bg-rose-900/20 text-rose-500 shrink-0">
                  <Share2 className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Pinagens</h2>
                  <p className="text-zinc-400 text-sm leading-snug">
                    Verifique diagramas de conectores e fiação.
                  </p>
                </div>
              </button>
            </motion.div>
          ) : activeTab === "didactic" ? (
            <motion.div
              key="didactic"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="pb-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setActiveTab("home")}
                  className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-xl transition-colors active:scale-95"
                >
                  <ArrowLeft className="w-5 h-5 text-zinc-400" />
                </button>
                <h2 className="text-xl font-bold text-white tracking-wider px-1">
                  Aprender sobre Ondas ({filteredComponents.length})
                </h2>
              </div>

              <div className="grid gap-4">
                {filteredComponents.map((comp, idx) => (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={comp.id}
                    onClick={() => handleComponentClick(comp, "didactic")}
                    className="text-left w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl p-5 transition-colors flex items-start gap-4 active:scale-[0.98] shadow-sm"
                  >
                    <div
                      className={`p-4 rounded-xl ${comp.type === "sensor" ? "bg-cyan-900/20 text-cyan-500" : "bg-orange-900/20 text-orange-500"}`}
                    >
                      <Cpu className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg text-white">
                          {comp.name}
                        </h3>
                      </div>
                      <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                        {comp.shortDescription}
                      </p>
                      <span
                        className={`inline-block mt-3 text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-lg ${comp.type === "sensor" ? "bg-cyan-900/30 text-cyan-400" : "bg-orange-900/30 text-orange-400"}`}
                      >
                        {comp.type === "sensor" ? "Sensor" : "Atuador"}
                      </span>
                    </div>
                  </motion.button>
                ))}
                {filteredComponents.length === 0 && (
                  <div className="text-center py-12 text-zinc-500 text-lg">
                    <p>Nenhum componente encontrado.</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : activeTab === "real_signals" ? (
            <motion.div
              key="real_signals"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="pb-8 h-full"
            >
              {selectedRealSignalComponent ? (
                <RealSignalsList
                  component={selectedRealSignalComponent}
                  user={user}
                  onBack={() => setSelectedRealSignalComponent(null)}
                />
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      onClick={() => setActiveTab("home")}
                      className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-xl transition-colors active:scale-95"
                    >
                      <ArrowLeft className="w-5 h-5 text-zinc-400" />
                    </button>
                    <h2 className="text-xl font-bold text-white tracking-wider px-1">
                      Sinais Reais Osciloscópio ({filteredComponents.length})
                    </h2>
                  </div>
                  <div className="grid gap-4">
                    {filteredComponents.map((comp, idx) => (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={comp.id}
                        onClick={() => handleComponentClick(comp, "real")}
                        className="text-left w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl p-5 transition-colors flex items-center justify-between active:scale-[0.98] shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-4 rounded-xl ${comp.type === "sensor" ? "bg-cyan-900/20 text-cyan-500" : "bg-orange-900/20 text-orange-500"}`}
                          >
                            <Camera className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-white">
                              {comp.name}
                            </h3>
                            <span
                              className={`inline-block mt-2 text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-lg ${comp.type === "sensor" ? "bg-cyan-900/30 text-cyan-400" : "bg-orange-900/30 text-orange-400"}`}
                            >
                              {comp.type === "sensor" ? "Sensor" : "Atuador"}
                            </span>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                    {filteredComponents.length === 0 && (
                      <div className="text-center py-12 text-zinc-500 text-lg">
                        <p>Nenhum componente encontrado.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          ) : activeTab === "multimeter" ? (
            <motion.div
              key="multimeter"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="pb-8 h-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setActiveTab("home")}
                  className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-xl transition-colors active:scale-95"
                >
                  <ArrowLeft className="w-5 h-5 text-zinc-400" />
                </button>
                <h2 className="text-xl font-bold text-white tracking-wider px-1">
                  Multímetro ({filteredComponents.length})
                </h2>
              </div>
              <div className="grid gap-4">
                {filteredComponents.map((comp, idx) => (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={comp.id}
                    onClick={() => handleComponentClick(comp, "multimeter")}
                    className="text-left w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl p-5 transition-colors flex items-center justify-between active:scale-[0.98] shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-xl bg-orange-900/20 text-orange-500">
                        <Zap className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">
                          {comp.name}
                        </h3>
                        <p className="text-sm text-zinc-400 mt-1">
                          Valores esperados e pinagem
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
                {filteredComponents.length === 0 && (
                  <div className="text-center py-12 text-zinc-500 text-lg">
                    <p>Nenhum teste de multímetro encontrado.</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : activeTab === "parameters" ? (
            <motion.div
              key="parameters"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="pb-8 h-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setActiveTab("home")}
                  className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-xl transition-colors active:scale-95"
                >
                  <ArrowLeft className="w-5 h-5 text-zinc-400" />
                </button>
                <h2 className="text-xl font-bold text-white tracking-wider px-1">
                  Parâmetros por Montadora
                </h2>
              </div>
              <div className="grid gap-4">
                {["Honda", "Yamaha", "Shineray"].map((brand, idx) => (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={brand}
                    onClick={() => {}}
                    className="text-left w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl p-5 transition-colors flex items-center justify-between active:scale-[0.98] shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-xl bg-purple-900/20 text-purple-500">
                        <SlidersHorizontal className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">
                          {brand}
                        </h3>
                        <p className="text-sm text-zinc-400 mt-1">
                          Consulte os parâmetros da linha {brand}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : activeTab === "pinouts" ? (
            <motion.div
              key="pinouts"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="pb-8 h-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setActiveTab("home")}
                  className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-xl transition-colors active:scale-95"
                >
                  <ArrowLeft className="w-5 h-5 text-zinc-400" />
                </button>
                <h2 className="text-xl font-bold text-white tracking-wider px-1">
                  Pinagens por Montadora
                </h2>
              </div>
              <div className="grid gap-4">
                {["Honda", "Yamaha", "Shineray"].map((brand, idx) => (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={brand}
                    onClick={() => {}}
                    className="text-left w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-2xl p-5 transition-colors flex items-center justify-between active:scale-[0.98] shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-xl bg-rose-900/20 text-rose-500">
                        <Share2 className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">
                          {brand}
                        </h3>
                        <p className="text-sm text-zinc-400 mt-1">
                          Verifique conectores e fios da linha {brand}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Modal de Seleção de Estator */}
        <AnimatePresence>
          {showStatorModal !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center sm:p-4"
              onClick={() => setShowStatorModal(null)}
            >
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-zinc-900 border border-zinc-800 w-full sm:w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-12 sm:pb-6 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-6 sm:hidden"></div>
                <h3 className="text-xl font-bold text-white mb-2">Qual o tipo de estator?</h3>
                <p className="text-zinc-400 mb-6">Selecione a configuração de fases da motocicleta para ver os testes específicos.</p>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => handleStatorSelection("estator-1f")}
                    className="w-full bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-xl text-left transition-colors flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300">1</div>
                    <div>
                      <h4 className="font-bold text-white text-lg">1 Fase (Monofásico)</h4>
                      <p className="text-sm text-zinc-500">1 saída, retorna pelo chassi</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleStatorSelection("estator-2f")}
                    className="w-full bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-xl text-left transition-colors flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300">2</div>
                    <div>
                      <h4 className="font-bold text-white text-lg">2 Fases (Bifásico)</h4>
                      <p className="text-sm text-zinc-500">Bobina flutuante, 2 saídas</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleStatorSelection("estator-3f")}
                    className="w-full bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-xl text-left transition-colors flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300">3</div>
                    <div>
                      <h4 className="font-bold text-white text-lg">3 Fases (Trifásico)</h4>
                      <p className="text-sm text-zinc-500">Ligação estrela/triângulo, 3 saídas</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
