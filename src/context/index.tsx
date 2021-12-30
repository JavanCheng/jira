import { ReactNode } from "react";
import { AuthProvider } from "./auth-context";
import { QueryClientProvider, QueryClient } from "react-query";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  // 与下面的写法等同
  // children 会报错，其实在因为 AuthProvider 没有指定要传入的 children 的类型
  // return <AuthProvider children={children} />
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};
