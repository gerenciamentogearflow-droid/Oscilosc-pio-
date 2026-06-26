import React, { useState, useEffect } from "react";
import { User } from "../types";
import { registerUser, getAllUsers, updateUserCredentials, deleteUser, adminUpdateUser } from "../lib/auth";
import { ArrowLeft, UserPlus, Users, Settings, KeyRound, Pencil, Trash2, Eye, EyeOff, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AdminPanelProps {
  adminUser: User;
  onBack: () => void;
  onUserUpdate: (updatedUser: User) => void;
}

export function AdminPanel({ adminUser, onBack, onUserUpdate }: AdminPanelProps) {
  const [users, setUsers] = useState<any[]>([]);
  
  // State for editing other users
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editUserUsername, setEditUserUsername] = useState("");
  const [editUserPassword, setEditUserPassword] = useState("");
  const [editUserRole, setEditUserRole] = useState<"admin" | "mechanic">("mechanic");
  const [editUserShowPassword, setEditUserShowPassword] = useState(false);
  const [editUserMsg, setEditUserMsg] = useState({ text: "", type: "" });

  // State for deleting other users
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
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

  const startEditUser = (userToEdit: any) => {
    setEditingUser(userToEdit);
    setEditUserUsername(userToEdit.username);
    setEditUserPassword(userToEdit.password || "");
    setEditUserRole(userToEdit.role);
    setEditUserShowPassword(false);
    setEditUserMsg({ text: "", type: "" });
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const success = adminUpdateUser(
      adminUser,
      editingUser.username,
      editUserUsername,
      editUserPassword,
      editUserRole
    );

    if (success) {
      setEditUserMsg({ text: "Usuário atualizado com sucesso!", type: "success" });
      setUsers(getAllUsers(adminUser));
      setTimeout(() => {
        setEditingUser(null);
      }, 1500);
    } else {
      setEditUserMsg({ text: "Erro ao atualizar. Nome já em uso?", type: "error" });
    }
  };

  const confirmDeleteUser = (username: string) => {
    setUserToDelete(username);
  };

  const executeDeleteUser = () => {
    if (!userToDelete) return;
    const success = deleteUser(adminUser, userToDelete);
    if (success) {
      setUsers(getAllUsers(adminUser));
      setUserToDelete(null);
    }
  };

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
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-900 text-base">{u.username}</span>
                      <span
                        className={`text-[10px] w-max px-2 py-0.5 mt-1 rounded-full font-bold ${
                          u.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditUser(u)}
                        className="p-2 text-zinc-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                        title="Editar usuário"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      
                      {u.username !== adminUser.username && (
                        <button
                          onClick={() => confirmDeleteUser(u.username)}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir usuário"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </main>

      {/* MODAL EDITAR USUÁRIO */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setEditingUser(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-zinc-950 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-600" /> Editar Usuário: {editingUser.username}
              </h3>

              <form onSubmit={handleEditUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Nome de Usuário
                  </label>
                  <input
                    type="text"
                    value={editUserUsername}
                    onChange={(e) => setEditUserUsername(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:border-cyan-500 shadow-sm text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={editUserShowPassword ? "text" : "password"}
                      value={editUserPassword}
                      onChange={(e) => setEditUserPassword(e.target.value)}
                      placeholder="Deixe em branco para manter a atual"
                      className="w-full bg-white border border-zinc-300 rounded-lg pl-3 pr-10 py-2 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-cyan-500 shadow-sm text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setEditUserShowPassword(!editUserShowPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 focus:outline-none"
                    >
                      {editUserShowPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {editingUser.username !== adminUser.username && (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Nível de Acesso
                    </label>
                    <select
                      value={editUserRole}
                      onChange={(e: any) => setEditUserRole(e.target.value)}
                      className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:border-cyan-500 shadow-sm text-sm"
                    >
                      <option value="mechanic">Mecânico</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                )}

                {editUserMsg.text && (
                  <p
                    className={`text-sm font-medium ${editUserMsg.type === "success" ? "text-cyan-600" : "text-red-600"}`}
                  >
                    {editUserMsg.text}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors border border-zinc-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors shadow-sm shadow-cyan-600/15"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL CONFIRMAR EXCLUSÃO */}
      <AnimatePresence>
        {userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white border border-zinc-200 rounded-2xl p-6 shadow-2xl relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-red-50 p-3 rounded-full border border-red-100 mb-4 text-red-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-950 mb-1">Excluir Usuário?</h3>
                <p className="text-sm text-zinc-500 mb-6">
                  Tem certeza que deseja excluir o usuário <span className="font-semibold text-zinc-800">"{userToDelete}"</span>? Esta ação não pode ser desfeita.
                </p>

                <div className="flex w-full gap-2">
                  <button
                    type="button"
                    onClick={() => setUserToDelete(null)}
                    className="flex-1 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors border border-zinc-200"
                  >
                    Não, cancelar
                  </button>
                  <button
                    type="button"
                    onClick={executeDeleteUser}
                    className="flex-1 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm shadow-red-600/15"
                  >
                    Sim, excluir
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
