import sleep from "./helpers/sleep";

function printWithCompetingDelays(firstMessage: string, secondMessage: string) {
  console.log("START of function body");

  sleep(6000).then(() => console.log(firstMessage));

  console.log("MIDDLE of function body");

  sleep(5000).then(() => console.log(secondMessage));

  console.log("END of function body");
}

printWithCompetingDelays("hello", "world");
