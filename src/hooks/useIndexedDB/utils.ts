//Taken From https://stackoverflow.com/a/69614443/4377220

interface WaitUntilProps {
  tick?: number;
  timeout?: number;
}

//@ts-ignore
export const waitUntil = (condition, options?: WaitUntilProps) => {
  return new Promise<void>((resolve, reject) => {
    const interval = setInterval(() => {
      if (!condition()) return;

      clearInterval(interval);
      resolve();
    }, options?.tick || 100);

    setTimeout(() => {
      clearInterval(interval);
      reject('your error msg');
    }, options?.timeout || 10000);
  });
};
