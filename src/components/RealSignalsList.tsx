import React, { useState, useEffect, useRef } from "react";
import { RealSignal, ComponentData, User } from "../types";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import {
  ArrowLeft,
  Upload,
  Camera,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { motion } from "motion/react";

interface RealSignalsListProps {
  component: ComponentData;
  user: User;
  onBack: () => void;
}

export function RealSignalsList({
  component,
  user,
  onBack,
}: RealSignalsListProps) {
  const [signals, setSignals] = useState<RealSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [motorcycleName, setMotorcycleName] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSignals();
  }, [component.id]);

  const loadSignals = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "real_signals"),
        where("componentId", "==", component.id),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(q);
      const loadedSignals = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as RealSignal[];
      setSignals(loadedSignals);
    } catch (error) {
      console.error("Erro ao carregar sinais:", error);
      // fallback in case index is missing or rules are restrictive
      if (error instanceof Error && error.message.includes("index")) {
        const qFallback = query(
          collection(db, "real_signals"),
          where("componentId", "==", component.id),
        );
        const snapshot = await getDocs(qFallback);
        const loadedSignals = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as RealSignal[];
        // sort manually
        loadedSignals.sort((a, b) => b.createdAt - a.createdAt);
        setSignals(loadedSignals);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !motorcycleName.trim()) return;

    setUploading(true);

    try {
      // Create an image element
      const image = new window.Image();
      const objectUrl = URL.createObjectURL(file);

      image.onload = async () => {
        URL.revokeObjectURL(objectUrl);
        // Create a canvas to resize the image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Target max dimension
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(image, 0, 0, width, height);

        // Get base64 string
        const base64String = canvas.toDataURL("image/jpeg", 0.7);

        // Save to firestore
        await addDoc(collection(db, "real_signals"), {
          componentId: component.id,
          motorcycleName: motorcycleName.trim(),
          userName: user.username,
          imageUrl: base64String,
          createdAt: Date.now(),
        });

        setUploading(false);
        setShowUploadForm(false);
        setMotorcycleName("");
        loadSignals();
      };

      image.src = objectUrl;
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert("Erro ao processar imagem.");
    }
  };

  const openCamera = () => {
    if (!motorcycleName.trim()) {
      alert("Por favor, informe o nome da moto primeiro.");
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment");
      fileInputRef.current.click();
    }
  };

  const openGallery = () => {
    if (!motorcycleName.trim()) {
      alert("Por favor, informe o nome da moto primeiro.");
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-zinc-100">{component.name}</h2>
          <p className="text-xs text-cyan-400">Sinais Reais da Comunidade</p>
        </div>
      </div>

      {!showUploadForm ? (
        <button
          onClick={() => setShowUploadForm(true)}
          className="w-full mb-6 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-4 px-4 rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-cyan-900/20 text-lg"
        >
          <Camera className="w-6 h-6" />
          Tirar Foto do Sinal
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6 shadow-md"
        >
          <h3 className="font-semibold text-base mb-4 text-zinc-200">
            Enviar Novo Sinal
          </h3>

          <input
            type="text"
            placeholder="Qual a moto/modelo? (Ex: Honda CG 160)"
            value={motorcycleName}
            onChange={(e) => setMotorcycleName(e.target.value)}
            disabled={uploading}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-4 text-base text-zinc-100 mb-5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center py-6">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mb-3" />
              <div className="w-full bg-zinc-800 rounded-full h-2 mb-2">
                <div className="bg-cyan-400 h-2 rounded-full transition-all duration-300 w-full animate-pulse"></div>
              </div>
              <span className="text-sm text-zinc-400">
                Processando e Enviando...
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  onClick={openCamera}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-colors border border-zinc-700"
                >
                  <Camera className="w-5 h-5" /> Câmera
                </button>
                <button
                  onClick={openGallery}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-colors border border-zinc-700"
                >
                  <ImageIcon className="w-5 h-5" /> Galeria
                </button>
              </div>
              <button
                onClick={() => setShowUploadForm(false)}
                className="w-full py-3 bg-zinc-950 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 rounded-xl text-base font-medium transition-colors border border-zinc-800"
              >
                Cancelar
              </button>
            </div>
          )}
        </motion.div>
      )}

      <div className="flex-1 overflow-y-auto pb-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-zinc-600" />
          </div>
        ) : signals.length > 0 ? (
          <div className="grid gap-6">
            {signals.map((signal) => (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-md"
              >
                <div className="w-full aspect-video bg-black relative">
                  <img
                    src={signal.imageUrl}
                    alt={`Sinal de ${signal.motorcycleName}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-lg text-zinc-100">
                    {signal.motorcycleName}
                  </h4>
                  <p className="text-sm text-zinc-400 mt-2 flex items-center gap-1">
                    Enviado por:{" "}
                    <span className="text-cyan-400 font-medium">
                      {signal.userName}
                    </span>
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">
                    {new Date(signal.createdAt).toLocaleDateString("pt-BR")} às{" "}
                    {new Date(signal.createdAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-zinc-900/50 rounded-2xl border-2 border-zinc-800 border-dashed">
            <Camera className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-300 font-medium text-lg">
              Nenhum sinal registrado.
            </p>
            <p className="text-zinc-500 text-sm mt-2">
              Seja o primeiro a enviar uma foto!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
