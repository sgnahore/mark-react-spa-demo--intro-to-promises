import sleep from "./helpers/sleep";

function printWithDelay(message: string) {
  console.log("Before creating the promise");

  sleep(2000).then(() =>
    console.log("Promise has now been 'resolved':", message)
  );

  console.log("After creating the promise");
}

printWithDelay("Hello world!");
