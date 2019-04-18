// Events 为一个索引类型，用于描述索引类型（string）和返回值（Array<Function>）
export interface Events {
  [event: string]: Array<Callback>;
}

// 绑定至 event 的回调函数
export interface Callback {
  (...args: Array<any>): any;
}

export interface Warn {
  (msg: string): void;
}

// 测试结果
export interface Result {
  res?: string;// 检查返回结果
  thisCheck?: boolean;// 检查 this
  listenerCount?: number;// 检查 cb 调用次数
};