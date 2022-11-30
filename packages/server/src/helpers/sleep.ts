import { Logger } from '@nestjs/common';
export const sleep = (secondsToSleep: number) => {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(1);
    }, 1000 * secondsToSleep);
  });
};

// @next -- this should be accomplished app wipe as a interceptor?
export async function sleepAndTryAgain(callback: () => any, secondsToSleep) {
  try {
    const res = await callback();
    return res;
  } catch (e) {
    Logger.error(e);
    Logger.error(`error caught, sleeping and trying again`);
    await sleep(secondsToSleep);
    return callback();
  }
}
