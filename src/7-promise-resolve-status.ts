import sleep from "./helpers/sleep";
import wrapInPromise from "./helpers/wrapInPromise";

function runPromiseChain() {
  console.log("START of function body");

  const promiseOne = wrapInPromise({ wait: 4000, value: true });
  const promiseTwo = wrapInPromise({ wait: 1000, value: "hello world" });
  const promiseThree = wrapInPromise({ wait: 3000, value: 42 });
  const promiseFour = wrapInPromise({ wait: 2000, value: ["a", "b", "c"] });

  const promiseArr: Promise<unknown>[] = [
    promiseOne,
    promiseTwo,
    promiseThree,
    promiseFour,
  ];
  for (let [index, promise] of promiseArr.entries()) {
    // log the status of all promises after each has resolved
    promise.then(() =>
      console.log(`resolved promise ${index + 1}`, promiseArr)
    );
  }

  console.log("END of function body");
}

runPromiseChain();
