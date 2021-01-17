import * as T from "@effect-ts/core/Effect";
import { pipe } from "@effect-ts/core/Function";
import { tag } from "@effect-ts/core/Has";
import { _A } from "@effect-ts/core/Utils";

export const makeConsoleService = T.effectTotal(() => {
  return {
    _tag: "ConsoleService" as const,
    putStrLn: (message: string) =>
      T.effectTotal(() => {
        console.log(message);
      }),
  };
});

export interface ConsoleService extends _A<typeof makeConsoleService> {}
export const ConsoleService = tag<ConsoleService>();

export function putStrLn(message: string) {
  return T.accessServiceM(ConsoleService)((_) => _.putStrLn(message));
}

export const provideLiveConsoleService = T.provideServiceM(ConsoleService)(
  makeConsoleService
);

export const program = pipe(
  T.succeed("a"),
  T.chain(putStrLn),
  T.andThen(putStrLn("b")),
  T.andThen(putStrLn("c"))
);
