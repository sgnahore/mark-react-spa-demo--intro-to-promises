import sleep from "./sleep";

/**
 * Wraps a value in a Promise that resolves after a specified number of milliseconds.
 */
export default function wrapInPromise<T>({
  wait,
  value,
}: {
  wait: number;
  value: T;
}): Promise<T> {
  return sleep(wait).then(() => value);
}
