import sleep from "./helpers/sleep";

function printWithDelay(message: string) {
  console.log("START of function body");

  sleep(5000).then(() => console.log(message));

  console.log("END of function body");
}

printWithDelay("Hello world!");
