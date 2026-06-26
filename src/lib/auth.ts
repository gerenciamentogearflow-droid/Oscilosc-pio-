import { User } from "../types";

export const initAuth = () => {
  const existingUsers = localStorage.getItem("motostore_users");
  if (!existingUsers) {
    // Cadastro do usuário master inicial exigido
    const initialUsers = [
      { username: "Mafran", password: "Zetech.556", role: "admin" },
    ];
    localStorage.setItem("motostore_users", JSON.stringify(initialUsers));
  }
};

export const login = (username: string, password: string): User | null => {
  const users = JSON.parse(localStorage.getItem("motostore_users") || "[]");
  const user = users.find(
    (u: any) => u.username === username && u.password === password,
  );

  if (user) {
    return { username: user.username, role: user.role };
  }
  return null;
};

export const registerUser = (
  adminUser: User,
  newUsername: string,
  newPassword: string,
): boolean => {
  if (adminUser.role !== "admin") return false;

  const users = JSON.parse(localStorage.getItem("motostore_users") || "[]");

  // Verifica se já existe
  if (users.find((u: any) => u.username === newUsername)) {
    return false;
  }

  users.push({
    username: newUsername,
    password: newPassword,
    role: "mechanic",
  });

  localStorage.setItem("motostore_users", JSON.stringify(users));
  return true;
};

export const getAllUsers = (adminUser: User) => {
  if (adminUser.role !== "admin") return [];
  const users = JSON.parse(localStorage.getItem("motostore_users") || "[]");
  return users.map((u: any) => ({ username: u.username, role: u.role, password: u.password }));
};

export const deleteUser = (adminUser: User, usernameToDelete: string): boolean => {
  if (adminUser.role !== "admin") return false;
  // Impedir que o admin se exclua
  if (adminUser.username === usernameToDelete) return false;

  const users = JSON.parse(localStorage.getItem("motostore_users") || "[]");
  const filteredUsers = users.filter((u: any) => u.username !== usernameToDelete);
  
  if (filteredUsers.length === users.length) return false;
  
  localStorage.setItem("motostore_users", JSON.stringify(filteredUsers));
  return true;
};

export const adminUpdateUser = (
  adminUser: User,
  targetUsername: string,
  newUsername: string,
  newPassword?: string,
  newRole?: "admin" | "mechanic"
): boolean => {
  if (adminUser.role !== "admin") return false;

  const users = JSON.parse(localStorage.getItem("motostore_users") || "[]");
  const userIndex = users.findIndex((u: any) => u.username === targetUsername);
  if (userIndex === -1) return false;

  // Se estiver mudando o nome, verifica se o novo já existe
  if (targetUsername !== newUsername) {
    if (users.find((u: any) => u.username === newUsername)) {
      return false;
    }
  }

  users[userIndex].username = newUsername;
  if (newPassword && newPassword.trim() !== "") {
    users[userIndex].password = newPassword;
  }
  if (newRole) {
    users[userIndex].role = newRole;
  }

  localStorage.setItem("motostore_users", JSON.stringify(users));
  return true;
};

export const updateUserCredentials = (
  currentUser: User,
  newUsername: string,
  newPassword: string,
): User | null => {
  const users = JSON.parse(localStorage.getItem("motostore_users") || "[]");
  
  const userIndex = users.findIndex((u: any) => u.username === currentUser.username);
  
  if (userIndex === -1) return null;

  // Se for mudar o nome, precisa verificar se o novo nome já existe
  if (currentUser.username !== newUsername) {
    if (users.find((u: any) => u.username === newUsername)) {
       return null; // Usuário já existe
    }
  }

  users[userIndex].username = newUsername;
  
  // Se informou nova senha, altera
  if (newPassword.trim() !== "") {
    users[userIndex].password = newPassword;
  }

  localStorage.setItem("motostore_users", JSON.stringify(users));
  
  return { username: newUsername, role: users[userIndex].role };
};

