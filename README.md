# Emitter

> a tiny but awesome event emitter

![](https://img.shields.io/npm/types/awesome-emitter.svg) ![](https://img.shields.io/npm/v/awesome-emitter.svg) ![](https://img.shields.io/npm/dt/awesome-emitter.svg) ![](https://img.shields.io/github/license/Styx11/emitter.svg)

## Installation
Inside your project folder do:
```
npm install --save awesome-emitter
```

## Usage
Import the `Emitter` and use its instance as a global object so that you can listen or emit a event everywhere
```js
import Emitter from 'awesome-emitter';

const emitter = new Emitter();
```

Adds the `listener` function to the end of the listeners array for the event named `eventName`.
```js
emitter
  .on('event1', msg => console.log(msg))
  .once('event2', msg => console.log(msg));
```
Returns a reference to the `Emitter`, so that calls can be chained.

Then you can `emit` the listener with arguments
```js
emitter.emit('event1', 'hello, world');
```

Benefit from polymorphic `this` types, you can create your own emitter class by extends `Emitter`:
```js
class MyEmitter extends Emitter {
  foo (msg: string): this {
    console.log(msg);
    return this;
  };
}

const emitter = new MyEmitter();
emitter
  .on('event', () => console.log('emitter'))
  .foo('my emitter')
  .emit('event');
```
In your own emitter methods, return reference to `this`, so that calls can be chained.

## API
* [event: 'newListener'](#event-newListener)
* [event: 'removeListener'](#event-removeListener)
* [emitter.on(eventName, listener)](#emitteroneventname-listener)
* [emitter.listenerCount(eventName)](#emitterlistenercounteventname)
* [emitter.eventNames()](#emittereventNames)
* [emitter.once(eventName, listener)](#emitteronceeventname-listener)
* [emitter.emit(eventName[, ...args])](#emitteremiteventname-args)
* [emitter.off([eventName[, listener]])](#emitteroffeventname-listener)

### event: 'newListener'
* `eventName` { string } The name of the event being listened for
* `listener` { Function } The event handler function

The `Emitter` instance will emit its own `'newListener'` event *before* a listener is added to its internal array of listeners.

Listeners registered for the `'newListener'` event will be passed the event name and a reference to the listener being added.

The fact that the event is triggered before adding the listener has a subtle but important side effect: any additional listeners registered to the same `name` *within* the `'newListener'` callback will be inserted *before* the listener that is in the process of being added.
```js
const cbOrder: Array<string> = [];
emitter.once('newListener', (eventName: string): void => {
  if (eventName !== 'event') return;
  emitter.on('event', () => {
    cbOrder.push('B');
  });
});
emitter.on('event', () => {
  cbOrder.push('A');
});
emitter.emit('event');
assert.deepStrictEqual(cbOrder, ['B', 'A']);// ok
```
Note that listen 'newListener' itself won't call the listener.

### event: 'removeListener'
* `[eventName]` { string } The name of the event
* `[listener]` { Function } The event handler function
The `'removeListener'` event is emitted *after* the listener is removed.

Note that:
* off 'removeListener' itself won't call the listener function.
* if you use `off()` without params, `'removeListener'` event will not be emitted.
* if you use `off()` with `eventName` only, it will be provided in listener function.
* otherwise, both of them will be provided.

### emitter.on(eventName, listener)
* `eventName` { string | Array\<string\> } The name of the event
* `listener` { Function } The callback function
* Returns { Emitter }

Adds the `listener` function to the end of the listeners array for the event named `eventName`. No checks are made to see if the listener has already been added. 

```js
emitter
  .on('event1', cb)
  .on('event1', cb);
```
Multiple calls passing the same combination of `eventName` and `listener` will result in the `listener` being added, and called, multiple times.

Note that when a listener is called, the standard `this` keyword is intentionally set to reference the `Emitter` instance to which the `listener` is attached.
```js
emitter.on('event', function () {
  console.log(this === emitter && this instanceof Emitter);
});

emitter.emit('event')// Print: true
```

It is possible to use ES6 Arrow Functions as listeners, however, when doing so, the `this` keyword will no longer reference the Emitter instance:
```js
emitter.on('event', () => {
  console.log(this);
});

emitter.emit('event')// Print: {}
```

### emitter.listenerCount(eventName)
* `eventName` { string } The name of the event
* Returns { number }

Returns the number of listeners listening to the event named `eventName`.

### emitter.eventNames()
* Returns { Array\<string\> }

Returns an array listing the events for which the emitter has registered listeners. The values in the array will be strings.
```ts
let result: Array<string>;
const events: Array<string> = ['event1', 'event2', 'event3'];

result = emitter.eventNames();
assert.ok(Array.isArray(result));
assert.deepStrictEqual(result, events);
```

### emitter.once(eventName, listener)
* `eventName` { string | Array\<string\> } The name of the event
* `listener` { Function } The callback function
* Returns { Emitter }

Adds a **one-time** `listener` function for the event named `eventName`. The next time `eventName` is triggered, this `listener` is removed and then invoked.
```js
emitter
  .once('event', cb)
  .emit('event', args);

emitter.listenerCount('event');// 0
```
Returns a reference to the `Emitter`, so that calls can be chained.

Note that when a listener is called, the standard `this` keyword is intentionally set to reference the `Emitter` instance to which the `listener` is attached.
```js
emitter.once('event', function () {
  console.log(this === emitter && this instanceof Emitter);
});

emitter.emit('event');// Print: true
```

It is possible to use ES6 Arrow Functions as listeners, however, when doing so, the `this` keyword will no longer reference the Emitter instance:
```js
emitter.once('event', () => {
  console.log(this);
});

emitter.emit('event')// Print: {}
```

### emitter.emit(eventName[, ...args])
* `eventName` { string | Array\<string\> } The name of the event
* `...args` { Array\<any\> } The arguments of listener
* Returns { boolean }

Synchronously calls each of the listeners registered for the event named `eventName`, in the order they were registered, passing the supplied arguments to each.

Returns `true` if the event had listeners, `false` otherwise.

### emitter.off([eventName[, listener]])
* `[eventName]` { string | Array\<string\> } The name of the event
* `[listener]` { Function } The callback function
* Returns { Emitter }

Removes the specified `listener` from the listener array for the event named `eventName`.
```js
emitter
  .on('event', cb)
  .off('event', cb);

emitter.listenerCount('event1');// 0
```
`off()` will remove, at most, one instance of a `listener` from the listener array. If any single listener has been added multiple times to the listener array for the specified `eventName`, then `off()` must be called multiple times to remove each instance.

Note that:

* Without any params, `off()` will remove all listeners from each of the events
* If provide `eventName` only, `off()` will remove all listeners from the event name `eventName`
* If provide `eventName` and `listener` at the same time, `off()` will remove the specified `listener` from the event named `eventName`

You can see more actual cases in [test](test/unit)

## Contributing
[Pull requests](https://github.com/Styx11/emitter/pulls) are welcomed. For major changes, please open an [issue](https://github.com/Styx11/emitter/issues) first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Build
```
# install dependencies
npm install

# build for production with minification
npm run build

# build for test file
npm run build:test

# run test
npm run test
```

## License
[MIT](https://choosealicense.com/licenses/mit/)