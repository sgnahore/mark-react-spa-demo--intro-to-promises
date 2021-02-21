# Intro to Promises

<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a>

> This is part of Academy's [technical curriculum for **The Mark**](https://github.com/WeAreAcademy/curriculum-mark). All parts of that curriculum, including this project, are licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.

All of the JS/TS that we've written so far has been _synchronous_. Now, we'll start looking at **asynchronous** code.

Modern asynchronous code in JS/TS is normally written in one of two ways:

- **Promise** syntax
- **`async/await`** syntax

In this series of demos, we'll look at Promise syntax.

## Learning Outcomes

- Articulate the typical synchronous model of JS/TS
- Explain when a promise's `.then` callback is executed
- Explain the meaning of `T` in a `Promise<T>` type
- Explain the typing of the `.then` callback parameter
- Use a promise chain
- Identify the final resolve type and value of a promise chain
- Describe the status of a promise as pending or fulfilled

## Pre-note: Running demos

The demos are all in the `src` directory, and numbered.

Once you've cloned/forked and installed dependencies, you can run a given demo with

```bash
yarn run ts-node src/0-hanging-promise.ts
```

and you should be able to get tab auto-complete from `yarn run ts-node src/0`.

### 🤔 What's happening here? (not important)

- `ts-node` is installed as a dependency (compiles TS to JS and runs the result)
- `yarn run ts-node` executes the `ts-node` script installed under `node_modules`
- `src/0-hanging-promise.ts` is the relative path to the TS file

## Demo 0: Hanging promise

> 🎯 **Success criterion:** Articulate what it means for a Promise to be non-blocking

Take a moment to **look at `printStraightforwardly` and predict what will happen** before you run demo 0. (You can ignore `printWithSleep` for now.)

It will probably behave exactly as you expect - you likely have a well-developed mental model of the order of the lines in which each `console.log` is executed. This model - executing line-by-line - is a _synchronous_ model of code.

Note that `ts-node`'s output also tells us how long it took the execution to complete. (On my Linux 16GB RAM setup, it takes ~1.8 seconds.)

### Why does it take 1.8s for such a short file?

This time - the wait before the console output appears - is largely caused by the TypeScript compilation, which happens each time you run `ts-node`. (Remember, TypeScript must be compiled to JavaScript before it can be executed.) You can demonstrate this by separating out the compilation and the execution:

1. Compile the TypeScript to JavaScript with `yarn build` (which runs `tsc`)
2. Run the output JavaScript: `node dist/0-hanging-promise.js`

`yarn build` will compile _all_ of our TypeScript, whereas `yarn run ts-node src/0-hanging-promise.ts` compiles only the specified file, which is why this compilation step will take longer than running `ts-node`.

However, once the TS has been compiled to JS, it will be far quicker to run.

### Introducing your first Promise, `sleep`

Now, **de-comment the `printWithSleep` execution**, and comment out `printStraightforwardly` execution.

`sleep(5000)` creates and returns a _promise_ that _resolves_ after 5000 milliseconds - i.e. 5 seconds. (This language will mean more to you on repeated exposure - don't worry about it right now. Similarly, whilst the definition is available in `src/helpers`, the way it's defined is not important to focus on right now.)

Importantly, promises are _non-blocking_.

Let's see what that means by running the demo.

You should see:

1. An initial wait before the console printing (caused by TypeScript compilation)
2. The three messages printed to the console in near-instant succession
3. A (perhaps mysterious) delay...
4. `ts-node`'s output, `Done in X.XXs.`

This execution time will be approximately 5 seconds longer than it took `printStraightforwardly` to run.

**Try changing the number passed to `sleep`** (maybe `3000`? `7000`? If you're patient, `20000`?) and see how the length of time reported by `ts-node` changes.

Then, re-compile our changed TypeScript down to JavaScript and run it. The first wait (i.e. step #1) will disappear, but you'll still see the delay (of #3) before the terminal is ready to take input again.

### So what's this non-blocking stuff?

Our 'execution thread' is not finishing until the promise (created by executing `sleep`) _resolves_ - which depends on the number passed in.

But it's non-blocking:

```ts
sleep(5000);
console.log(message);
```

where the `console.log(message)` is able to run even before the 5 second wait is up.

This sort of behaviour is useful because it lets us get on with other stuff whilst we're waiting for a Promise to resolve. (It happens to be the case here that `sleep` isn't doing anything interesting - it's an artificial wait that we've created to demonstrate Promises - but we'll use them in future to e.g. connect to a database or fetch data from an API.)

## Demo 1: The `.then` callback

> 🎯 **Success criterion:** Explain when a Promise's `.then` callback is executed

`sleep` is a function with one parameter, a number, that returns a Promise. You can see this by hovering over it in VS Code and inspecting its type signature:

```ts
sleep(ms: number): Promise<void>
```

(Don't worry about the `<void>` part right now. We'll come to that in a later demo.)

All Promises have a `.then` method that accepts a callback function (just like an array's `.map` method or a JSX element `onClick` prop).

### Running demo 1

**Run demo 1** (`yarn run ts-node src/1-then-callback.ts`).

You will see something similar to:

```
START of function body
END of function body
Hello world!
Done in 6.73s.
```

with some important observation points being:

1. There is a `Hello world!` appears _after_ the end of the function body `console.log`
2. There is also _a delay of a few seconds_ between `END of function body` and `Hello world!` appearing

### Understanding the output

These may be challenging things to see - they don't fit with the typical _synchronous_ model of understanding code.

`console.log(message)` is written on a line _before_ the end of the function body, and yet it seems to be executed _after_ the end of the function body.

Why is this?

Firstly: `console.log(message)` occurs _inside a callback function_. As we know, a function's body isn't run when the function is defined - it's run _when the function is executed_.

So, the key question here is: _**when** is a promise's .`then` callback function executed_?

When we give a Promise a `.then` callback, we control _what_ it runs, but the Promise controls the _when_.

This is similar to passing a function to an `onClick` prop of a JSX button. We tell the button _what_ to do, but we let it decide _when_. (In the case of `onClick`, our button executes the function when it is clicked.)

A JS/TS Promise will execute its `.then` callback _when it resolves_.

Our `sleep(5000)` returns a Promise that _resolves_ after 5 seconds - and, so, there is a ~5 second delay between `sleep(5000)` being executed and `console.log(message)` being executed.

But our Promise is non-blocking, and so - in the meantime - our JavaScript has continued running through the function body and reached the end.

### Check your understanding

The difference between demo 0 and demo 1 is:

```ts
// demo 0
sleep(5000);
console.log(message);
console.log("END of function body");

// demo 1
sleep(5000).then(() => console.log(message));
console.log("END of function body");
```

Can you explain what the difference is between the timing of `console.log`s of these two, and why?

## Demo 2: Comparing promise resolving

> 🎯 **Success criterion:** You can explain the output of demo 2

Promises have independent `.then` callbacks. A promise is responsible for calling its own callback.

Predict what will happen when you run demo 2.

<details>
  <summary>SPOILER: results - run for yourself</summary>
  <div>
    <ol>
      <li>There is less than 11 seconds delay between the end of the function body log and the subsequent two logs</li>
      <li>The <code>console.log(secondMessage)</code> is executed <i>before</i> the <code>console.log(firstMessage)</code></li>
      <li>There is a significant delay between the end of function body log and the first subsequent log</li>
      <li>There is a smaller delay between the end of function body log and the first subsequent log</li>
    </ol>
  </div>
</details>

See if you can explain this using the concepts from demos 0 and 1.

## Demo 3: Promise typing

> 🎯 **Success criterion:** You can articulate the relationship between `Promise<void>` and the typing of the `.then` callback parameter

In demo 3, we're storing the result of `sleep(5000)` in a variable, `promise`. You should be able to hover over it in VS Code and see that it is typed as `Promise<void>` - which is, indeed, the return type of `sleep(5000)`.

In `printWithDelay`, we pass the `.then` method a callback with zero parameters.

In `printWithDelayAndResolvedValue`, we pass the `.then` method a callback with a single parameter. Here, we're calling it `resolvedValue`, although it is more common to see `res` ('result') in the wild.

If you hover over `resolvedValue` in VS Code, you'll see that TypeScript has inferred that its type is `void`. This is directly related to `Promise<void>` which `promise` has - a type which means "this is a Promise that has a `void` (absent) resolve value".

(We'll see shortly that you can also have, e.g., `Promise<string>` - a promise which has a resolve value of `string` type.)

In `printWithDelayAndTypedCallback`, we:

1. Define two functions, one with a `singleParam: void` and one with a `singleParam: string`
2. Pass one of them as a callback function to the `promise`'s `.then`

TypeScript lets us pass `callbackVoidParam` to our `promise.then`, but it stops us from passing `callbackStringParam` - because a `Promise<void>` is incompatible with a `.then` callback which is typed for a `string`.

## Demo 4: Promise typing

> 🎯 **Success criterion:** You can explain the difference between the `Promise<string>` and `Promise<number>` types

`wrapInPromise` is a function that wraps a value in a Promise that resolves after a given number of milliseconds. (The implementation is not important.)

If you hover over the variable `promise`:

```ts
const promise = wrapInPromise({ wait: ms, value: "hello world!" });
```

You'll see that `promise` is typed as `Promise<string>` - it's a promise that resolves to a string value, which you can see by hovering over `resolveValue` in the promise's `.then` callback.

Comment out the declaration of `promise` and de-comment one of the other two. You'll see that the type of value - let's call it `T` - feeds through into `Promise<T>` and the type of `resolvedValue`.

## Demo 5: Promise chaining

> 🎯 **Success criterion:** You can explain what promise chaining looks like

### The return type of `.then`

The return value of a Promise's `.then` is itself another Promise.

You can see this in `printWithDelay` by hovering over in VS Code variables of `promiseOne`, `promiseTwo` and `promiseThree`.

Run the demo and inspect the output.

We can take advantage of how `.then` returns another promise if, for example, we have a series of asynchronous operations that _must_ be run in a certain order (e.g. because a later one relies on the results of a former).

(`printWithRepeatedDelay` adds in a simulated delay between the chained `console.log`s.)

### Promise chaining

It is uncommon to assign the return value of consecutive `.then`s to separate variables (`promiseOne`, `promiseTwo`...).

De-comment the second implementation of `printWithDelay` and comment out the first implementation.

This pattern of `promise.then(() => doSomething()).then(() => doSomethingElse())` is known as _promise chaining_.
