import type { User, UserResponse } from 'key/types/github';

function trimUserData(userData: UserResponse): User {
  return {
    name: userData.name,
    login: userData.login,
    html_url: userData.html_url,
    avatar_url: userData.avatar_url,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
function promiseSequence(
  inputs: any[][],
  promiseMaker: (...args: any[]) => Promise<any>
) {
  inputs = [...inputs];

  function handleNextInput(outputs: {
    results: any[];
    promises: Promise<any>[];
  }): Promise<{ results: any[]; promises: Promise<any>[] }> {
    if (inputs.length === 0) {
      return Promise.resolve(outputs);
    } else {
      const nextInput = inputs.shift();
      const promise = nextInput
        ? promiseMaker(...nextInput)
        : Promise.resolve(null);
      outputs.promises.push(promise);
      return promise
        .then((output) => {
          return outputs.results.concat([output]);
        })
        .catch(() => {
          return outputs.results.concat([null]);
        })
        .then((results) =>
          handleNextInput({ results, promises: outputs.promises })
        );
    }
  }

  return Promise.resolve({ results: [], promises: [] }).then(handleNextInput);
}
/* eslint-enable @typescript-eslint/no-explicit-any */
/* eslint-enable @typescript-eslint/no-unsafe-return */
/* eslint-enable @typescript-eslint/no-unsafe-argument */

export { trimUserData, promiseSequence };
