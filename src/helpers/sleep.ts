import { promisify } from "util";

/**
 * Returns a promise that resolves after a number of specified milliseconds.
 *
 * The implementation is not important, but if you want to read a little bit more:
 * https://flaviocopes.com/javascript-sleep/
 *
 * @param ms - milliseconds to wait
 */
const sleep = promisify(setTimeout);

export default sleep;
