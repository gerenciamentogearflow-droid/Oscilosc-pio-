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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white border border-zinc-200 rounded-2xl p-8 shadow-xl"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-cyan-50 p-4 rounded-full border border-cyan-100">
            <Activity className="w-10 h-10 text-cyan-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-zinc-900 mb-2 tracking-tight">
          MotoScope Pro
        </h1>
        <p className="text-zinc-500 text-center text-sm mb-8">
          Diagnóstico Avançado de Injeção Eletrônica
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-base font-medium text-zinc-700 mb-2">
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-4 text-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-colors shadow-sm"
              placeholder="Digite seu usuário"
              required
            />
          </div>
          <div>
            <label className="block text-base font-medium text-zinc-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-4 text-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-colors shadow-sm"
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
              className="w-5 h-5 rounded border-zinc-300 bg-white text-cyan-600 focus:ring-cyan-500 focus:ring-offset-zinc-50"
            />
            <label htmlFor="remember" className="ml-3 text-base text-zinc-700">
              Lembrar meu acesso
            </label>
          </div>

          {error && (
            <p className="text-red-600 text-base text-center font-medium">
              Credenciais inválidas. Tente novamente.
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-lg font-semibold py-4 px-4 rounded-xl transition-colors mt-6 shadow-md shadow-cyan-600/20"
          >
            Acessar Sistema
          </button>
        </form>
      </motion.div>
      <div className="mt-8 text-center px-4 max-w-sm">
        <p className="text-zinc-600 text-xs leading-relaxed">
          Desenvolvido por{" "}
          <span className="font-semibold text-zinc-800">Mafran junior</span>
          <br />
          31 9 8613-8576
          <br />
          Mecânico de motocicletas e programador low-code.
          <br />
          <span className="text-cyan-600 mt-1 block font-medium">
            Crie o seu site ou aplicativo conosco
          </span>
        </p>
      </div>
    </div>
  );
}
