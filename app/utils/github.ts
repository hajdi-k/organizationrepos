import type { User, UserResponse } from 'key/types/github';

function trimUserData(userData: UserResponse): User {
  return {
    name: userData.name,
    login: userData.login,
    html_url: userData.html_url,
    avatar_url: userData.avatar_url,
  };
}

const sortNumAsc = (a: number, b: number) => a - b;
const sortNumDesc = (a: number, b: number) => b - a;

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
function promiseSequence(
  inputs: any[][],
  promiseMaker: (...args: any[]) => Promise<any>
) {
  inputs = [...inputs];

  function handleNextInput(results: any[]): Promise<any[]> {
    if (inputs.length === 0) {
      return Promise.resolve(results);
    } else {
      const nextInput = inputs.shift();
      const promise = nextInput
        ? promiseMaker(...nextInput)
        : Promise.resolve(null);

      return promise
        .then((output) => {
          return results.concat([output]);
        })
        .catch(() => {
          return results.concat([null]);
        })
        .then((updatedResults) => handleNextInput(updatedResults));
    }
  }

  return Promise.resolve([]).then(handleNextInput);
}
/* eslint-enable @typescript-eslint/no-explicit-any */
/* eslint-enable @typescript-eslint/no-unsafe-return */
/* eslint-enable @typescript-eslint/no-unsafe-argument */

export { trimUserData, promiseSequence, sortNumAsc, sortNumDesc };
