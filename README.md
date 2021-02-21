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

## Exercise 1: Understanding the extra TypeScript parts

> 🎯 **Success criterion:** you can explain all the additional TypeScript syntax in `fizzbuzz.ts` (relative to its JavaScript equivalent)

Have a look at the code in `src/fizzbuzz.ts`. You'll see it looks _pretty similar_ to code that you've seen before in our JavaScript fizzbuzz solution, just with some extra parts.

We'll try to understand this by looking at a few examples (not from this codebase).

### Annotating function parameters

Consider the below function:

```js
function findLowestCommonMultiple(numOne, numTwo) {
  // details omitted - unimportant
  ...
  return lowestCommonMultiple // assume we declared and found this above
}
```

It looks like this function is intended to find and return the [lowest common multiple](https://www.bbc.co.uk/bitesize/guides/z9hb97h/revision/5) of two numbers, for example:

```js
// some cases we might test
findLowestCommonMultiple(3, 5); // => 15
findLowestCommonMultiple(3, 6); // => 6
findLowestCommonMultiple(6, 15); // => 30
```

but what should our function return in the following cases?

```js
// some, uh, weird cases
findLowestCommonMultiple(true, 12); // => ???
findLowestCommonMultiple("me", "you", "blue"); // => ???
findLowestCommonMultiple({ firstName: "Richard", lastName: "Ng" }); // => ???
```

These would all be _really silly things_ to run. It simply doesn't make sense to ask for the lowest common multiple of `"me"`, `"you"` and `"blue"`.

But... JavaScript will let you run this.

There's an example you can check out in `src/examples/lcm.js`, and run with `yarn start:lcm:js` (check out `package.json` scripts for details).

If you run it, you'll actually get trapped in an infinite `while` loop - exit out of this with `Ctrl + C` in your terminal where it's running.

On the other hand, consider the below TypeScript type annotations:

```ts
function findLowestCommonMultiple(numOne: number, numTwo: number) {
  // details omitted - unimportant
  ...
  return lowestCommonMultiple // assume we declared and found this above
}
```

This adds in some type restrictions: both `numOne` and `numTwo` need to be numbers - and TypeScript won't let us compile it (and therefore blocks us from running it) if we pass in different types.

```ts
findLowestCommonMultiple(true, 12); // Argument of type 'boolean' is not assignable to parameter of type 'number'.
```

You can check out this example at `src/examples/lcm.ts`, and run it with `yarn start:lcm:ts` (again, see `package.json` for details).

**Try un-commenting the silly examples** - you'll see (in VS Code) that TypeScript errors get underlined, and that we're blocked from running `yarn start:lcm:ts` (which is saving us from silly output).

We suggest you play around with the code and try to test the TypeScript compiler / error checker. (You'll notice that a single line can have multiple problems with it - both the number of arguments, as well as their types - which all need fixing before the line is permissible.)

### Annotating return types

Consider the below function:

```js
function getRandomBoolean() {
  // details omitted - unimportant
  ...
  return randomBoolean // assume we declared and found this above
}
```

It seems pretty clear that this function should return a (random) boolean value - either `true` or `false`.

However, JavaScript lets us do something silly like the following:

```js
function randomBoolean() {
  const randomNumber = Math.random();
  if (randomNumber < 0.5) {
    return false;
  } else {
    return "true";
  }
}
```

which returns the boolean `false` 50% of the time... and the _string_ `"true"` the rest of the time.

There's another example you can play around with using `yarn start:bool:js` - run it a few times to see both return values.

Returning the string `"true"` instead of the boolean `true` is the sort of careless mistake we would like to be able to avoid (remember the TypeScript design goal: ["Statically identify constructs that are likely to be errors."](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Design-Goals)).

So, in TypeScript, we can annotate the intended return type of a function:

```ts
function randomBoolean(): boolean {
  const randomNumber = Math.random();
  if (randomNumber < 0.5) {
    return false;
  } else {
    return "true"; // <-- TS now catches this error!
  }
}
```

There's another demo to inspect at `src/examples/bool.ts`, which you can run with `yarn start:bool:ts`.

### Combining the two

Consider the following example:

```ts
function findLongestString(arrOfStrings: string[]): string {
  // details omitted as usual
  ...
  return longestString;
}
```

This says:

- This function receives one argument that must be an array of strings
- This function must return a string

So TypeScript will stop you from doing the following careless mistakes:

- accidentally passing in a single string rather than an array of strings
- accidentally returning the longest string's length (i.e. a number) instead of the string itself

There's an example (`src/examples/longest-string` in `.js` and `.ts`) for you to play around with and experiment with as usual.

### What types can you use?

We've seen a few different types in the above examples: `number`, `boolean`, `string`, `string[]` (array of strings).

The TypeScript handbook has a good section on [Basic Types](https://www.typescriptlang.org/docs/handbook/basic-types.html), which you should review.

The important ones are: Boolean, Number, String, Array, Tuple, Any, Void, Null and Undefined.

These can additionally be joined with [Union types](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html), for example:

- `boolean | string`: either `boolean` or `string`
- `string | string[]`: either `string` or `string[]`
- `(number | boolean)[]` an array which contains elements that are all either `number` or `boolean`

There is much more that you can do with types - but that's enough for now...!

### Interpreting TypeScript FizzBuzz

If you understand all of the above, you should be able to understand the code in `src/fizzbuzz.ts`.

We strongly suggest that you spend some significant time doing the following:

- **plan** a change to the code
- **predict** would happen if you made that change
- **change** the code
- **observe** the result
- **update** your mental model based on the result

The immediate feedback you get from TypeScript through this process will make this a relatively quick way of building up your understanding of (basic) TypeScript.

> 🧠 **Make your brain work.** The _predict_ step is very important. It's how you surface and test your mental model.

Here are some example things you could investigate:

- What happens if you change `toFizzbuzz`'s return type to `string` without changing the function body?
- What happens if you try pushing a random boolean value into `sequence` array in `fizzbuzz`?
- What happens if you remove the `return` statement from `isFizzbuzz`?
