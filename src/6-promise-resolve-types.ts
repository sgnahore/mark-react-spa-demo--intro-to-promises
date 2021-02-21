import sleep from "./helpers/sleep";

function printWithTransformations(n: number) {
  console.log("START of function body");

  const promiseOne = sleep(2000);

  const promiseTwo = promiseOne.then((res) => {
    console.log("first resolved result:", res);
    return n * 2;
  });

  const promiseThree = promiseTwo.then((res) => {
    console.log("second resolved result:", res);
    return "hello world!".repeat(res);
  });

  const promiseFour = promiseThree.then((res) => {
    console.log("third resolved result:", res);
    return res.split("!");
  });

  const promiseFive = promiseFour.then((res) => {
    console.log("fourth resolved result:", res);
    return res.length;
  });

  console.log("END of function body");
}

printWithTransformations(3);

// function printWithTransformationsChained(n: number) {
//   console.log("START of function body");

//   const promise = sleep(2000)
//     .then((res) => {
//       console.log("first resolved result:", res);
//       return n * 2;
//     })
//     .then((res) => {
//       console.log("second resolved result:", res);
//       return "hello world!".repeat(res);
//     })
//     .then((res) => {
//       console.log("third resolved result:", res);
//       return res.split("!");
//     })
//     .then((res) => {
//       console.log("fourth resolved result:", res);
//       return res.length
//     });

//   console.log("END of function body");
// }

// printWithTransformationsChained(3)
