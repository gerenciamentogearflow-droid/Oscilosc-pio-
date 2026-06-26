import React, { useState, useEffect } from "react";
import { User } from "../types";
import { registerUser, getAllUsers } from "../lib/auth";
import { ArrowLeft, UserPlus, Users, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

interface AdminPanelProps {
  adminUser: User;
  onBack: () => void;
}

export function AdminPanel({ adminUser, onBack }: AdminPanelProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    setUsers(getAllUsers(adminUser));
  }, [adminUser]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;

    const success = registerUser(adminUser, newUsername, newPassword);
    if (success) {
      setStatusMsg({
        text: "Usuário cadastrado com sucesso!",
        type: "success",
      });
      setNewUsername("");
      setNewPassword("");
      setUsers(getAllUsers(adminUser));
    } else {
      setStatusMsg({
        text: "Erro: Usuário já existe ou permissão negada.",
        type: "error",
      });
    }

    setTimeout(() => setStatusMsg({ text: "", type: "" }), 4000);
  };

  if (adminUser.role !== "admin") {
    return (
      <div className="min-h-screen p-6 bg-zinc-950 flex flex-col items-center justify-center text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Acesso Negado</h2>
        <p className="text-zinc-400 mb-6">
          Apenas administradores (Mafran) podem acessar esta tela.
        </p>
        <button
          onClick={onBack}
          className="bg-zinc-800 text-white px-6 py-3 rounded-lg font-medium"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="px-4 pt-12 pb-4 bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-zinc-800 text-zinc-400 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Painel Admin</h1>
            <p className="text-xs text-zinc-400">Gerenciamento de acessos</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-4 text-emerald-500">
            <UserPlus className="w-5 h-5" />
            <h2 className="font-semibold text-white">
              Cadastrar Novo Mecânico
            </h2>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Nome de Usuário
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {statusMsg.text && (
              <p
                className={`text-sm font-medium ${statusMsg.type === "success" ? "text-emerald-400" : "text-red-400"}`}
              >
                {statusMsg.text}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Criar Conta
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg"
        >
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <Users className="w-5 h-5" />
            <h2 className="font-semibold text-white">Usuários Cadastrados</h2>
          </div>

          <div className="space-y-2">
            {users.map((u, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-zinc-950 rounded-lg border border-zinc-800"
              >
                <span className="font-medium text-zinc-200">{u.username}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === "admin" ? "bg-blue-500/20 text-blue-400" : "bg-emerald-500/20 text-emerald-400"}`}
                >
                  {u.role.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
