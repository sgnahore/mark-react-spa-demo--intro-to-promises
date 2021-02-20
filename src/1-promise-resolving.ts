import sleep from "./helpers/sleep";

function printWithCompetingDelays(firstMessage: string, secondMessage: string) {
  console.log("Before creating promise one");
  sleep(2000).then(() =>
    console.log("After FIRST promise has been 'resolved':", firstMessage)
  );
  console.log("Before creating promise two (but after creating promise two)");
  sleep(1000).then(() =>
    console.log("After SECOND promise has been 'resolved':", secondMessage)
  );
  console.log("After creating both promises");
}

printWithCompetingDelays("hello", "world");
