import React, { ReactNode, useState } from "react";
import * as auth from "auth-provider";
import { User } from "screens/project-list/search-panel";

interface AuthForm {
  username: string;
  password: string;
}

// 创建 context，并声明泛型
const AuthContext = React.createContext<
  | {
      user: User | null;
      register: (form: AuthForm) => Promise<void>;
      login: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 设置 User 的泛型为 User 类型或 null
  const [user, setUser] = useState<User | null>(null);
  // point free
  // 类似于消参，将 then 里的 user 简化掉
  // 此时 user 会报错，因为类型推断认为我们的类型是 null，所以在创建 user 时声明泛型
  // const login = (form: AuthForm) => auth.login(form).then(user => setUser(user))
  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const logout = () => auth.logout().then(() => setUser(null));

  // 此时 value 会报错，因为类型推断认为我们的类型是 undefined，所以在创建 context 时声明泛型
  return (
    <AuthContext.Provider
      children={children}
      value={{ user, login, register, logout }}
    />
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth必须在AuthProvider中使用");
  }
  return context;
};
