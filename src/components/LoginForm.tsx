import React, { useState } from "react";
import { login } from "../lib/auth";
import { User } from "../types";
import { Activity } from "lucide-react";
import { motion } from "motion/react";

interface LoginFormProps {
  onSuccess: (user: User) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(username, password);
    if (user) {
      if (rememberMe) {
        localStorage.setItem("motostore_remembered_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("motostore_remembered_user");
      }
      onSuccess(user);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-cyan-500/10 p-4 rounded-full border border-cyan-500/20">
            <Activity className="w-10 h-10 text-cyan-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-white mb-2 tracking-tight">
          MotoScope Pro
        </h1>
        <p className="text-zinc-400 text-center text-sm mb-8">
          Diagnóstico Avançado de Injeção Eletrônica
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-base font-medium text-zinc-300 mb-2">
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-4 text-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-colors"
              placeholder="Digite seu usuário"
              required
            />
          </div>
          <div>
            <label className="block text-base font-medium text-zinc-300 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-4 text-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center pt-2 pb-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-5 h-5 rounded border-zinc-600 bg-zinc-950 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-zinc-900"
            />
            <label htmlFor="remember" className="ml-3 text-base text-zinc-300">
              Lembrar meu acesso
            </label>
          </div>

          {error && (
            <p className="text-red-400 text-base text-center font-medium">
              Credenciais inválidas. Tente novamente.
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-lg font-semibold py-4 px-4 rounded-xl transition-colors mt-6 shadow-lg shadow-cyan-900/20"
          >
            Acessar Sistema
          </button>
        </form>
      </motion.div>
      <div className="mt-8 text-center px-4 max-w-sm">
        <p className="text-zinc-500 text-xs leading-relaxed">
          Desenvolvido por{" "}
          <span className="font-semibold text-zinc-300">Mafran junior</span>
          <br />
          31 9 8613-8576
          <br />
          Mecânico de motocicletas e programador low-code.
          <br />
          <span className="text-cyan-500 mt-1 block font-medium">
            Crie o seu site ou aplicativo conosco
          </span>
        </p>
      </div>
    </div>
  );
}
