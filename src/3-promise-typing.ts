import sleep from "./helpers/sleep";

function printWithDelay(message: string) {
  console.log("START of function body");

  const promise = sleep(2000);
  promise.then(() => console.log(message));

  console.log("END of function body");
}

function printWithDelayAndResolvedValue(message: string) {
  console.log("START of function body");

  const promise = sleep(2000);
  promise.then((resolvedValue) => console.log(resolvedValue, message));

  console.log("END of function body");
}

function printWithDelayAndTypedCallback(message: string) {
  console.log("START of function body");

  const callbackVoidParam = (singleParam: void) =>
    console.log(singleParam, message);
  const callbackStringParam = (singleParam: string) =>
    console.log(singleParam, message);

  const promise = sleep(2000);
  promise.then(callbackVoidParam);
  // promise.then(callbackStringParam);

  console.log("END of function body");
}

printWithDelay("hello world!");
// printWithDelayAndResult("hello world!");
// printWithDelayAndTypedCallback("hello world!");
