import { useState, useEffect } from "react";
import { User, ComponentData } from "./types";
import { initAuth } from "./lib/auth";
import { LoginForm } from "./components/LoginForm";
import { Dashboard } from "./components/Dashboard";
import { AdminPanel } from "./components/AdminPanel";
import { ComponentDetail } from "./components/ComponentDetail";
import { InstallPrompt } from "./components/InstallPrompt";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<"login" | "dashboard" | "admin" | "detail">(
    "login",
  );
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentData | null>(null);

  useEffect(() => {
    // Inicializa o banco com o usuário master caso não exista no Firestore
    const runInit = async () => {
      await initAuth();
    };
    runInit();

    // Verifica se há um acesso lembrado
    const remembered = localStorage.getItem("motostore_remembered_user");
    if (remembered) {
      try {
        const parsedUser = JSON.parse(remembered);
        if (parsedUser && parsedUser.username) {
          setUser(parsedUser);
          setView("dashboard");
        }
      } catch (e) {
        console.error("Erro ao carregar usuário salvo", e);
      }
    }
  }, []);

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    setView("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("motostore_remembered_user");
    setUser(null);
    setView("login");
    setSelectedComponent(null);
  };

  const navigateToComponent = (comp: ComponentData) => {
    setSelectedComponent(comp);
    setView("detail");
  };

  const renderView = () => {
    if (view === "login") {
      return <LoginForm onSuccess={handleLogin} />;
    }

    if (view === "admin" && user) {
      return <AdminPanel adminUser={user} onBack={() => setView("dashboard")} onUserUpdate={(updatedUser) => setUser(updatedUser)} />;
    }

    if (view === "detail" && selectedComponent) {
      return (
        <ComponentDetail
          component={selectedComponent}
          onBack={() => setView("dashboard")}
        />
      );
    }

    if (view === "dashboard" && user) {
      return (
        <Dashboard
          user={user}
          onSelectComponent={navigateToComponent}
          onAdminClick={() => setView("admin")}
          onLogout={handleLogout}
        />
      );
    }

    return null;
  };

  return (
    <>
      {renderView()}
      <InstallPrompt />
    </>
  );
}
