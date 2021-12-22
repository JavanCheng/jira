// !!value 的意思是把一个值转化为 布尔值
// 一个 ! 是对这个值求反,两个 !! 求反再求反
export const isFalsy = (value) => (value === 0 ? false : !value);

// 在一个函数里，改变传入对象本身是不好的
export const cleanObject = (object) => {
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
    if (isFalsy(value)) {
      delete result[key];
    }
  });
  return result;
};
