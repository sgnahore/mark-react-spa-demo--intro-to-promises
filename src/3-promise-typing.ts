import sleep from "./helpers/sleep";

function printWithDelay(message: string) {
  console.log("START of function body");

  const promise = sleep(2000);
  promise.then(() => console.log(message));

  console.log("END of function body");
}

function printWithDelayAndResult(message: string) {
  console.log("START of function body");

  const promise = sleep(2000);
  promise.then((res) => console.log(res, message));

  console.log("END of function body");
}

printWithDelay("hello world!");
// printWithDelayAndResult("hello world!");
