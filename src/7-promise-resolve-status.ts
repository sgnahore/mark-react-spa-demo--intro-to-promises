import sleep from "./helpers/sleep";

function runPromiseChain() {
  console.log("START of function body");

  let promiseArr: Promise<unknown>[] = [];

  const promiseOne = sleep(2000);
  const promiseTwo = promiseOne.then(() => {
    console.log("resolved first promise", promiseArr);
    return "hello world";
  });
  const promiseThree = promiseTwo.then(() => {
    console.log("resolved second promise", promiseArr);
    return 42;
  });
  const promiseFour = promiseThree.then(() =>
    console.log("resolved third promise", promiseArr)
  );

  promiseArr.push(promiseOne, promiseTwo, promiseThree, promiseFour);
  console.log(promiseArr);

  console.log("END of function body");
}

runPromiseChain();
