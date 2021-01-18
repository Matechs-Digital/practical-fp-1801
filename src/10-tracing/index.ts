import * as T from "@effect-ts/core/Effect";
import * as R from "@effect-ts/node/Runtime";
import { pipe } from "@effect-ts/core/Function";

pipe(
  T.succeed(1),
  T.chain((n) => {
    return T.succeed(n + 1);
  }),
  T.chain((n) => {
    return T.succeed(n + 1);
  }),
  T.chain((n) => {
    return T.succeed(n + 1);
  }),
  T.tap((n) => {
    return T.fail(`(${n})`);
  }),
  T.catchAll((n) => T.succeed(n)),
  T.chain((n) => {
    return T.fail(`error: ${n}`);
  }),
  T.chain(() => T.succeed(0)),
  R.runMain
);
