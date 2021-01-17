import * as T from "@effect-ts/core/Effect";
import { pipe } from "@effect-ts/core/Function";
import { tag } from "@effect-ts/core/Has";
import { _A } from "@effect-ts/core/Utils";

export const makeMathService = T.effectTotal(() => {
  return {
    _tag: "MathService" as const,
    add: (x: number, y: number) => T.effectTotal(() => x + y),
    sub: (x: number, y: number) => T.effectTotal(() => x - y),
    mul: (x: number, y: number) => T.effectTotal(() => x * y),
    div: (x: number, y: number) => T.effectTotal(() => x / y),
  };
});

export interface MathService extends _A<typeof makeMathService> {}
export const MathService = tag<MathService>();

export const { add, div, mul, sub } = T.deriveLifted(MathService)(
  ["add", "div", "mul", "sub"],
  [],
  []
);

export const provideLiveMathService = T.provideServiceM(MathService)(
  makeMathService
);

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

export const { putStrLn } = T.deriveLifted(ConsoleService)(
  ["putStrLn"],
  [],
  []
);

export const provideLiveConsoleService = T.provideServiceM(ConsoleService)(
  makeConsoleService
);

export const program = pipe(
  T.do,
  T.bind("a", () => add(1, 2)),
  T.bind("b", ({ a }) => div(a, 2)),
  T.chain(({ b }) => putStrLn(`result: ${b}`))
);
