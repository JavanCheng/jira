import React, { ReactNode } from "react";
import * as auth from "auth-provider";
import { User } from "screens/project-list/search-panel";
import { http } from "utils/http";
import { useMount } from "utils";
import { useAsync } from "utils/use-async";
import { FullPageLoading, FullPageErrorFallback } from "components/lib";

interface AuthForm {
  username: string;
  password: string;
}

// 设置初始化 User   bootstrap：初始化
const bootstrapUser = async () => {
  let user = null;
  const token = auth.getToken();
  if (token) {
    const data = await http("me", { token });
    user = data.user;
  }
  return user;
};

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
  // 初始化 user 就是 null
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    run,
    setData: setUser,
  } = useAsync<User | null>();
  // point free
  // 类似于消参，将 then 里的 user 简化掉
  // 此时 user 会报错，因为类型推断认为我们的类型是 null，所以在创建 user 时声明泛型
  // const login = (form: AuthForm) => auth.login(form).then(user => setUser(user))
  //   登录后设置了 setUser，所以不是 null
  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const logout = () => auth.logout().then(() => setUser(null));

  //   在页面初始化时调用这个初始化函数
  useMount(() => {
    run(bootstrapUser());
  });

  if (isIdle || isLoading) {
    return <FullPageLoading />;
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

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
