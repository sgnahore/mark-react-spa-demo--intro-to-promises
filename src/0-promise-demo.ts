import sleep from "./helpers/sleep";

function printWithDelay(message: string) {
  console.log("Before executing the promise");
  sleep(2000).then(() =>
    console.log("After promise has been 'resolved'", message)
  );
  console.log("After executing the promise");
}

printWithDelay("Hello world!");
