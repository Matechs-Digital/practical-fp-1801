import * as T from "@effect-ts/core/Effect";

export interface ConsoleService {
  Console: {
    putStrLn: (message: string) => T.UIO<void>;
  };
}

export function putStrLn(message: string) {
  return T.accessM((_: ConsoleService) => _.Console.putStrLn(message));
}

export const provideLiveConsoleService = T.provide<ConsoleService>({
  Console: {
    putStrLn: (message) =>
      T.effectTotal(() => {
        console.log(message);
      }),
  },
});

export const program = putStrLn("hello world");
