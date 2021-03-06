import { useEffect, useRef, useState } from "react";
// !!value 的意思是把一个值转化为 布尔值
// 一个 ! 是对这个值求反,两个 !! 求反再求反
export const isFalsy = (value: unknown) => (value === 0 ? false : !value);

export const isVoid = (value: unknown) =>
  value === undefined || value === null || value === "";

// 在一个函数里，改变传入对象本身是不好的
export const cleanObject = (object: { [key: string]: unknown }) => {
  // 这样写会改变调用了此函数的对象的属性值，污染了传入的对象
  // 如果别人没仔细看这个函数的代码就调用，很容易不知道哪里出了bug
  // object.name = 123123

  // 1. 结构赋值 object
  const result = { ...object };
  // 2. 取键名 key，遍历 key
  Object.keys(result).forEach((key) => {
    // 3. 取键值 value
    const value = result[key];
    // 4. 如果 value 为 0，我们应该保留这个 key，所以通过 isFalsy 判断
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};

// 自定义 useMount hooks，在页面刚加载时执行一个回调函数
export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

// 自定义 debounce
export const useDebounce = <V>(value: V, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 每次在 value 变化以后，设置一个定时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    // 这里是一个闭包
    // 每次在上一个 useEffect 处理完以后再运行
    // useEffect的回调相当于 componentWillUnmount，所以会在组件将要卸载时执行
    // value 改变会卸载上一个组件
    return () => clearTimeout(timeout);
    // delay 一般不会改变
  }, [value, delay]);

  return debouncedValue;
};

export const useArray = <T>(initialArray: T[]) => {
  const [value, setValue] = useState(initialArray);
  return {
    value,
    setValue,
    add: (item: T) => setValue([...value, item]),
    clear: () => setValue([]),
    removeIndex: (index: number) => {
      const copy = [...value];
      copy.splice(index, 1);
      setValue(copy);
    },
  };
};

export const useDocumentTitle = (title: string, keepOnUnmount = true) => {
  const oldTitle = useRef(document.title).current;
  // 页面加载时: 旧title
  // 加载后：新title

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        // 如果不指定依赖，读到的就是旧title
        document.title = oldTitle;
      }
    };
  }, [keepOnUnmount, oldTitle]);
};

export const resetRoute = () => (window.location.href = window.location.origin);

/**
 * 传入一个对象，和键集合，返回对应的对象中的键值对
 * @param obj
 * @param keys
 */
export const subset = <
  O extends { [key in string]: unknown },
  K extends keyof O
>(
  obj: O,
  keys: K[]
) => {
  const filteredEntries = Object.entries(obj).filter(([key]) =>
    keys.includes(key as K)
  );
  return Object.fromEntries(filteredEntries) as Pick<O, K>;
};

/**
 * 返回组件的挂载状态，如果还没挂载或者已经卸载，返回false；反之，返回true
 */
export const useMountedRef = () => {
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  });
  return mountedRef;
};
