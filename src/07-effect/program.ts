import * as T from "@effect-ts/core/Effect";
import { pipe } from "@effect-ts/core/Function";
import { tag } from "@effect-ts/core/Has";
import { _A } from "@effect-ts/core/Utils";

export class DivisionByZero {
  readonly _tag = "DivisionByZero";

  constructor(readonly d: number) {}
}

export const makeMathService = T.effectTotal(() => {
  return {
    _tag: "MathService" as const,
    add: (x: number, y: number) => T.effectTotal(() => x + y),
    sub: (x: number, y: number) => T.effectTotal(() => x - y),
    mul: (x: number, y: number) => T.effectTotal(() => x * y),
    div: (x: number, y: number) =>
      T.if_(
        y === 0,
        () => T.fail(new DivisionByZero(x)),
        () => T.effectTotal(() => x / y)
      ),
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

export const provideLiveConsoleService = T.provideServiceM(ConsoleService)(
  makeConsoleService
);

export const program = T.gen(function* (_) {
  const { putStrLn } = yield* _(ConsoleService);
  const { add, div } = yield* _(MathService);

  const a = yield* _(add(1, 2));
  const b = yield* _(div(a, 2));

  return yield* _(putStrLn(`result: ${b}`));
});

export const main = T.gen(function* (_) {
  const { putStrLn } = yield* _(ConsoleService);

  yield* _(
    pipe(
      program,
      T.catchAll(({ d }) => putStrLn(`cannot divide ${d} by zero`))
    )
  );
});
