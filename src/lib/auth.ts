import { User } from "../types";
import { db } from "./firebase";
import { doc, getDoc, getDocs, setDoc, deleteDoc, collection } from "firebase/firestore";

// Helper para obter lista de usuários do localStorage de forma segura
const getLocalUsers = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem("motostore_users") || "[]");
  } catch (e) {
    return [];
  }
};

// Helper para salvar lista de usuários no localStorage
const saveLocalUsers = (users: any[]) => {
  try {
    localStorage.setItem("motostore_users", JSON.stringify(users));
  } catch (e) {
    console.error("Erro ao salvar localmente:", e);
  }
};

export const initAuth = async (): Promise<void> => {
  // Sempre garante que o usuário Mafran existe no localStorage como fallback inicial
  const localUsers = getLocalUsers();
  if (!localUsers.some((u: any) => u.username === "Mafran")) {
    localUsers.push({ username: "Mafran", password: "Zetech.556", role: "admin" });
    saveLocalUsers(localUsers);
  }

  // Tenta sincronizar com o Firestore
  try {
    const adminDocRef = doc(db, "users", "Mafran");
    const adminDoc = await getDoc(adminDocRef);
    if (!adminDoc.exists()) {
      await setDoc(adminDocRef, {
        username: "Mafran",
        password: "Zetech.556",
        role: "admin"
      });
    }
  } catch (error) {
    console.warn("Firestore offline ou inacessível no initAuth, usando fallback local.", error);
  }
};

export const login = async (username: string, password: string): Promise<User | null> => {
  const cleanUsername = username ? username.trim() : "";
  const cleanPassword = password ? password.trim() : "";

  // 1. Tenta autenticação via Firestore
  try {
    let firestoreUser: any = null;

    // Tenta obter o documento exatamente como digitado
    let userDocRef = doc(db, "users", cleanUsername);
    let userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      firestoreUser = userDoc.data();
    } else {
      // Fallback: Busca todos os usuários do Firestore para tentar match case-insensitive
      const usersCol = collection(db, "users");
      const snapshot = await getDocs(usersCol);
      const match = snapshot.docs.find(d => {
        const data = d.data();
        return data.username && data.username.trim().toLowerCase() === cleanUsername.toLowerCase();
      });
      if (match) {
        firestoreUser = match.data();
      }
    }

    if (firestoreUser) {
      if (firestoreUser.password && firestoreUser.password.trim() === cleanPassword) {
        // Sincroniza esse usuário para o localStorage para futuras consultas offline/resilientes
        const localUsers = getLocalUsers();
        const finalUsername = firestoreUser.username || cleanUsername;
        const existingIdx = localUsers.findIndex((u: any) => u.username.trim().toLowerCase() === finalUsername.trim().toLowerCase());
        
        if (existingIdx >= 0) {
          localUsers[existingIdx] = { username: finalUsername, password: firestoreUser.password, role: firestoreUser.role };
        } else {
          localUsers.push({ username: finalUsername, password: firestoreUser.password, role: firestoreUser.role });
        }
        saveLocalUsers(localUsers);

        return { username: finalUsername, role: firestoreUser.role };
      }
    }
  } catch (error) {
    console.error("Erro no login via Firestore (tentando fallback local):", error);
  }

  // 2. Fallback local: verifica no localStorage
  const localUsers = getLocalUsers();
  const matchedLocal = localUsers.find(
    (u: any) => u.username && u.username.trim().toLowerCase() === cleanUsername.toLowerCase() && u.password && u.password.trim() === cleanPassword
  );
  if (matchedLocal) {
    console.log("Autenticação efetuada com sucesso via Fallback Local.");
    return { username: matchedLocal.username, role: matchedLocal.role };
  }

  // 3. Fallback Hardcoded Supremo (Mafran / Zetech.556)
  if (cleanUsername.toLowerCase() === "mafran" && cleanPassword === "Zetech.556") {
    console.log("Autenticação efetuada com sucesso via Hardcoded Fallback.");
    // Tenta restabelecer local e remoto em background
    if (!localUsers.some((u: any) => u.username && u.username.toLowerCase() === "mafran")) {
      localUsers.push({ username: "Mafran", password: "Zetech.556", role: "admin" });
      saveLocalUsers(localUsers);
    }
    try {
      const adminDocRef = doc(db, "users", "Mafran");
      setDoc(adminDocRef, {
        username: "Mafran",
        password: "Zetech.556",
        role: "admin"
      }).catch(() => {});
    } catch (e) {}

    return { username: "Mafran", role: "admin" };
  }

  return null;
};

export const registerUser = async (
  adminUser: User,
  newUsername: string,
  newPassword: string,
): Promise<boolean> => {
  if (adminUser.role !== "admin") return false;

  const cleanUser = newUsername ? newUsername.trim() : "";
  const cleanPass = newPassword ? newPassword.trim() : "";
  if (!cleanUser || !cleanPass) return false;

  // Atualiza local primeiro para feedback instantâneo e robustez offline
  const localUsers = getLocalUsers();
  if (localUsers.some((u: any) => u.username && u.username.trim().toLowerCase() === cleanUser.toLowerCase())) {
    return false;
  }

  localUsers.push({
    username: cleanUser,
    password: cleanPass,
    role: "mechanic"
  });
  saveLocalUsers(localUsers);

  // Tenta salvar no Firestore
  try {
    const userDocRef = doc(db, "users", cleanUser);
    await setDoc(userDocRef, {
      username: cleanUser,
      password: cleanPass,
      role: "mechanic",
    });
  } catch (error) {
    console.warn("Firestore inacessível no cadastro, registrado localmente para sincronização futura.", error);
  }

  return true;
};

export const getAllUsers = async (adminUser: User): Promise<any[]> => {
  if (adminUser.role !== "admin") return [];

  // Tenta puxar do Firestore
  try {
    const usersCol = collection(db, "users");
    const snapshot = await getDocs(usersCol);
    if (!snapshot.empty) {
      const firestoreUsers = snapshot.docs.map((doc) => ({
        username: doc.id,
        ...doc.data()
      }));

      // Sincroniza todos os usuários do Firestore para o localStorage
      saveLocalUsers(firestoreUsers);
      return firestoreUsers;
    }
  } catch (error) {
    console.error("Erro ao buscar do Firestore, usando dados locais:", error);
  }

  // Fallback para o localStorage
  return getLocalUsers();
};

export const deleteUser = async (adminUser: User, usernameToDelete: string): Promise<boolean> => {
  if (adminUser.role !== "admin") return false;
  if (adminUser.username === usernameToDelete) return false;

  // Deleta localmente
  const localUsers = getLocalUsers();
  const filtered = localUsers.filter((u: any) => u.username !== usernameToDelete);
  saveLocalUsers(filtered);

  // Tenta deletar do Firestore
  try {
    const userDocRef = doc(db, "users", usernameToDelete);
    await deleteDoc(userDocRef);
  } catch (error) {
    console.error("Erro ao excluir do Firestore:", error);
  }

  return true;
};

export const adminUpdateUser = async (
  adminUser: User,
  targetUsername: string,
  newUsername: string,
  newPassword?: string,
  newRole?: "admin" | "mechanic"
): Promise<boolean> => {
  if (adminUser.role !== "admin") return false;

  const localUsers = getLocalUsers();
  const localIndex = localUsers.findIndex((u: any) => u.username === targetUsername);
  if (localIndex === -1) return false;

  if (targetUsername !== newUsername) {
    if (localUsers.some((u: any) => u.username === newUsername)) {
      return false; // Novo nome já existe localmente
    }
  }

  // Atualiza localmente
  const oldPassword = localUsers[localIndex].password;
  const oldRole = localUsers[localIndex].role;
  
  const updatedData: any = {
    username: newUsername,
    role: newRole || oldRole,
    password: newPassword && newPassword.trim() !== "" ? newPassword : oldPassword
  };

  if (targetUsername !== newUsername) {
    localUsers.splice(localIndex, 1);
    localUsers.push(updatedData);
  } else {
    localUsers[localIndex] = updatedData;
  }
  saveLocalUsers(localUsers);

  // Tenta atualizar no Firestore
  try {
    const targetDocRef = doc(db, "users", targetUsername);
    if (targetUsername !== newUsername) {
      const newDocRef = doc(db, "users", newUsername);
      await setDoc(newDocRef, updatedData);
      await deleteDoc(targetDocRef);
    } else {
      await setDoc(targetDocRef, updatedData);
    }
  } catch (error) {
    console.error("Erro ao atualizar no Firestore pelo admin:", error);
  }

  return true;
};

export const updateUserCredentials = async (
  currentUser: User,
  newUsername: string,
  newPassword: string,
): Promise<User | null> => {
  const localUsers = getLocalUsers();
  const localIndex = localUsers.findIndex((u: any) => u.username === currentUser.username);
  if (localIndex === -1) return null;

  if (currentUser.username !== newUsername) {
    if (localUsers.some((u: any) => u.username === newUsername)) {
      return null; // Novo nome já existe localmente
    }
  }

  // Atualiza localmente
  const oldPassword = localUsers[localIndex].password;
  const oldRole = localUsers[localIndex].role;

  const updatedData: any = {
    username: newUsername,
    role: oldRole,
    password: newPassword.trim() !== "" ? newPassword : oldPassword
  };

  if (currentUser.username !== newUsername) {
    localUsers.splice(localIndex, 1);
    localUsers.push(updatedData);
  } else {
    localUsers[localIndex] = updatedData;
  }
  saveLocalUsers(localUsers);

  // Tenta atualizar no Firestore
  try {
    const currentDocRef = doc(db, "users", currentUser.username);
    if (currentUser.username !== newUsername) {
      const newDocRef = doc(db, "users", newUsername);
      await setDoc(newDocRef, updatedData);
      await deleteDoc(currentDocRef);
    } else {
      await setDoc(currentDocRef, updatedData);
    }
  } catch (error) {
    console.error("Erro ao atualizar credenciais próprias no Firestore:", error);
  }

  return { username: newUsername, role: oldRole };
};

