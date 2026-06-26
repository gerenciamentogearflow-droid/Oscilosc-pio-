import React, { useState, useEffect } from "react";
import { User } from "../types";
import { registerUser, getAllUsers, updateUserCredentials } from "../lib/auth";
import { ArrowLeft, UserPlus, Users, Settings, KeyRound } from "lucide-react";
import { motion } from "motion/react";

interface AdminPanelProps {
  adminUser: User;
  onBack: () => void;
  onUserUpdate: (updatedUser: User) => void;
}

export function AdminPanel({ adminUser, onBack, onUserUpdate }: AdminPanelProps) {
  const [users, setUsers] = useState<any[]>([]);
  
  // Registration state
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });

  // Profile edit state
  const [editUsername, setEditUsername] = useState(adminUser.username);
  const [editPassword, setEditPassword] = useState("");
  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    if (adminUser.role === "admin") {
      setUsers(getAllUsers(adminUser));
    }
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

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUsername) return;

    const updated = updateUserCredentials(adminUser, editUsername, editPassword);
    if (updated) {
      setProfileMsg({
        text: "Dados atualizados com sucesso!",
        type: "success",
      });
      setEditPassword("");
      onUserUpdate(updated);
      if (adminUser.role === "admin") {
         setUsers(getAllUsers(updated));
      }
    } else {
      setProfileMsg({
        text: "Erro ao atualizar. Nome já em uso?",
        type: "error",
      });
    }
    setTimeout(() => setProfileMsg({ text: "", type: "" }), 4000);
  }

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
          <div>
            <h1 className="text-xl font-bold tracking-tight">Configurações</h1>
            <p className="text-xs text-zinc-500">Perfil e conta</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-6">
        
        {/* PROFILE EDIT SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4 text-cyan-600">
            <Settings className="w-5 h-5" />
            <h2 className="font-semibold text-zinc-900">
              Minha Conta
            </h2>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">
                Nome de Login
              </label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:border-cyan-500 shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">
                Nova Senha
              </label>
              <input
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Deixe em branco para manter a atual"
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-cyan-500 shadow-sm"
              />
            </div>

            {profileMsg.text && (
              <p
                className={`text-sm font-medium ${profileMsg.type === "success" ? "text-cyan-600" : "text-red-600"}`}
              >
                {profileMsg.text}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              <KeyRound className="w-4 h-4" /> Salvar Alterações
            </button>
          </form>
        </motion.div>

        {/* ADMIN SECTION */}
        {adminUser.role === "admin" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4 text-emerald-600">
                <UserPlus className="w-5 h-5" />
                <h2 className="font-semibold text-zinc-900">
                  Cadastrar Novo Mecânico
                </h2>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">
                    Nome de Usuário
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">
                    Senha
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                    required
                  />
                </div>

                {statusMsg.text && (
                  <p
                    className={`text-sm font-medium ${statusMsg.type === "success" ? "text-emerald-600" : "text-red-600"}`}
                  >
                    {statusMsg.text}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                  Criar Conta
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4 text-blue-600">
                <Users className="w-5 h-5" />
                <h2 className="font-semibold text-zinc-900">Usuários Cadastrados</h2>
              </div>

              <div className="space-y-2">
                {users.map((u, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 bg-zinc-50 rounded-lg border border-zinc-200"
                  >
                    <span className="font-medium text-zinc-900">{u.username}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
