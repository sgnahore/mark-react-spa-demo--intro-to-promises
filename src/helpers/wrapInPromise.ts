import sleep from "./sleep";

export default function wrapInPromise<T>({
  wait,
  value,
}: {
  wait: number;
  value: T;
}): Promise<T> {
  return sleep(wait).then(() => value);
}
