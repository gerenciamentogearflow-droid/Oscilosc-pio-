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
  return users.map((u: any) => ({ username: u.username, role: u.role }));
};
