import React, { useState } from 'react';
import { Download, X, Share, PlusSquare } from 'lucide-react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { motion, AnimatePresence } from 'motion/react';

export function InstallPrompt() {
  const { isInstallable, isIOS, isStandalone, handleInstallClick } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  // If already installed, dismissed, or not mobile/installable, don't show
  // We'll also show it for iOS since it doesn't fire beforeinstallprompt
  if (isStandalone || dismissed) return null;
  
  const showPrompt = isInstallable || isIOS;
  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 z-50 bg-white rounded-2xl p-5 shadow-2xl border border-cyan-100 flex flex-col gap-4"
      >
        <button 
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4">
          <div className="bg-cyan-100 p-3 rounded-xl">
            <Download className="w-8 h-8 text-cyan-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-zinc-900 text-lg">Instalar MotoScope Pro</h3>
            <p className="text-zinc-500 text-sm leading-tight mt-1">
              Adicione à tela inicial para acesso rápido, uso offline e melhor experiência.
            </p>
          </div>
        </div>

        {isInstallable ? (
          <button
            onClick={handleInstallClick}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md shadow-cyan-600/20"
          >
            Instalar Agora
          </button>
        ) : isIOS ? (
          <div className="bg-zinc-50 p-3 rounded-lg text-sm text-zinc-600 mt-2 border border-zinc-200">
            <p className="flex items-center gap-2 mb-2 font-medium">
              Para instalar no iOS (iPhone/iPad):
            </p>
            <ol className="list-decimal list-inside space-y-1.5 ml-1">
              <li className="flex items-center gap-1">
                Toque em <Share className="w-4 h-4 inline text-blue-500" /> (Compartilhar)
              </li>
              <li className="flex items-center gap-1">
                Selecione <PlusSquare className="w-4 h-4 inline" /> "Adicionar à Tela de Início"
              </li>
            </ol>
          </div>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}
