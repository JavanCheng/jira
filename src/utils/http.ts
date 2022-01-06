import qs from "qs";
import * as auth from "auth-provider";
import { useAuth } from "context/auth-context";
import { useCallback } from "react";

const apiUrl = process.env.REACT_APP_API_URL;

// 为 data 和 token 指定类型
interface Config extends RequestInit {
  data?: object;
  token?: string;
}

// endpoint 形如 project、login 等
export const http = async (
  endpoint: string,
  { data, token, headers, ...customConfig }: Config = {}
) => {
  const config = {
    method: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": data ? "application/json" : "",
    },
    // customConfig 写在后面，所以它里面的值会覆盖前面的值
    // 这里默认请求方式为 GET，但如果传入的方式为 POST，则会覆盖前面的 method
    ...customConfig,
  };

  // 在 fetch 请求的参数，在 GET 方式时，要传到 url 里，而 POST、PATCH、DELETE 是直接放在 body 里的
  if (config.method.toUpperCase() === "GET") {
    endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {});
  }

  // axios 和 fetch 的表现不一样，axios 可以直接在返回状态不为2xx时抛出异常
  return window
    .fetch(`${apiUrl}/${endpoint}`, config)
    .then(async (response) => {
      // 401 是未登录或 token 失效的情况下，服务端返回的值
      // 是典型的 RESTful 规范，用 Http 现在的状态来标识服务端现在的状态
      if (response.status === 401) {
        // 当返回 401 时，客户端要配合服务端，退出登录
        await auth.logout();
        window.location.reload();
        return Promise.reject({ message: "请重新登录" });
      }
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        // 这里需要手动抛出异常，因为 fetch 遇到类似 401、500 的错误并不会抛出异常
        // 只有断网之类的问题，fetch 才会通过 catch 接住异常并抛出
        return Promise.reject(data);
      }
    });
};

// 将 user 的 token 自动加入 http 中
export const useHttp = () => {
  const { user } = useAuth();
  // 这里传入的参数和 http 传入的参数类型一致，所以使用 Parameters 可以不用再写一遍参数类型
  // return ([endpoint, config]: [string, Config]) => http(endpoint, {...config, token: user?.token})
  return useCallback(
    (...[endpoint, config]: Parameters<typeof http>) =>
      http(endpoint, { ...config, token: user?.token }),
    [user?.token]
  );
  // ...[endpoint, config] 可以让我们在传参时不用以元组的形式传参，可以省略中括号
};
