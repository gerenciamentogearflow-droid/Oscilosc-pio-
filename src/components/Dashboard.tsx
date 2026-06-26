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
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RealSignalsList } from "./RealSignalsList";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"didactic" | "real_signals">(
    "didactic",
  );
  const [selectedRealSignalComponent, setSelectedRealSignalComponent] =
    useState<ComponentData | null>(null);

  const filteredComponents = componentsDB.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col">
      <header className="px-5 pt-12 pb-2 bg-white border-b border-zinc-200 z-10 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-600" />
            <h1 className="text-xl font-bold tracking-tight">MotoScope Pro</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onAdminClick}
              className="p-2 rounded-full bg-zinc-100 text-blue-600 hover:bg-zinc-200 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-red-50 text-zinc-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {activeTab === "didactic" ||
        (activeTab === "real_signals" && !selectedRealSignalComponent) ? (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar componente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-xl pl-12 pr-4 py-4 text-base text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-sm"
            />
          </div>
        ) : null}

        <div className="flex gap-4 border-b border-zinc-200">
          <button
            onClick={() => {
              setActiveTab("didactic");
              setSelectedRealSignalComponent(null);
            }}
            className={`pb-3 text-base font-semibold transition-colors flex items-center gap-2 ${activeTab === "didactic" ? "text-cyan-600 border-b-2 border-cyan-600" : "text-zinc-500 hover:text-zinc-800"}`}
          >
            <BookOpen className="w-5 h-5" /> Aprender
          </button>
          <button
            onClick={() => setActiveTab("real_signals")}
            className={`pb-3 text-base font-semibold transition-colors flex items-center gap-2 ${activeTab === "real_signals" ? "text-cyan-600 border-b-2 border-cyan-600" : "text-zinc-500 hover:text-zinc-800"}`}
          >
            <Camera className="w-5 h-5" /> Sinais Reais
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 relative">
        <AnimatePresence mode="wait">
          {activeTab === "didactic" ? (
            <motion.div
              key="didactic"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="pb-8"
            >
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-1">
                Componentes Disponíveis ({filteredComponents.length})
              </h2>

              <div className="grid gap-4">
                {filteredComponents.map((comp, idx) => (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={comp.id}
                    onClick={() => onSelectComponent(comp)}
                    className="text-left w-full bg-white hover:bg-zinc-50 border border-zinc-200 rounded-2xl p-5 transition-colors flex items-start gap-4 active:scale-[0.98] shadow-sm"
                  >
                    <div
                      className={`p-4 rounded-xl ${comp.type === "sensor" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}
                    >
                      <Cpu className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg text-zinc-900">
                          {comp.name}
                        </h3>
                      </div>
                      <p className="text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                        {comp.shortDescription}
                      </p>
                      <span
                        className={`inline-block mt-3 text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-lg ${comp.type === "sensor" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}
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
          ) : (
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
                  <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-1">
                    Toque em um componente para ver fotos
                  </h2>
                  <div className="grid gap-4">
                    {filteredComponents.map((comp, idx) => (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={comp.id}
                        onClick={() => setSelectedRealSignalComponent(comp)}
                        className="text-left w-full bg-white hover:bg-zinc-50 border border-zinc-200 rounded-2xl p-5 transition-colors flex items-center justify-between active:scale-[0.98] shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-4 rounded-xl ${comp.type === "sensor" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}
                          >
                            <Camera className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-zinc-900">
                              {comp.name}
                            </h3>
                            <span
                              className={`inline-block mt-2 text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-lg ${comp.type === "sensor" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}
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
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
