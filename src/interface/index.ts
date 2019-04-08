// Events 为一个索引类型，用于描述索引类型（string）和返回值（Array<Function>）
export interface Events {
  [event: string]: Array<Callback>;
}

// 绑定至 event 的回调函数
export interface Callback {
  (...args: Array<any>): any;
}