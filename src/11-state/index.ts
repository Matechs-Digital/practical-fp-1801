import * as T from "@effect-ts/core/Effect";
import * as Ref from "@effect-ts/core/Effect/Ref";
import * as L from "@effect-ts/core/Effect/Layer";
import * as R from "@effect-ts/node/Runtime";
import { literal, pipe } from "@effect-ts/core/Function";
import { tag } from "@effect-ts/core/Has";
import { _A } from "@effect-ts/core/Utils";

const makeCounterState = T.gen(function* (_) {
  const ref = yield* _(Ref.makeRef(0));

  return {
    _tag: literal("CounterState"),
    increment: pipe(
      ref,
      Ref.update((n) => n + 1)
    ),
    decrement: pipe(
      ref,
      Ref.update((n) => n - 1)
    ),
    get: ref.get,
  };
});

interface CounterState extends _A<typeof makeCounterState> {}
const CounterState = tag<CounterState>();
const LiveCounterState = L.fromEffect(CounterState)(makeCounterState);

const { decrement, increment, get } = T.deriveLifted(CounterState)(
  [],
  ["increment", "decrement", "get"],
  []
);

const program = pipe(
  increment,
  T.andThen(increment),
  T.andThen(decrement),
  T.andThen(increment),
  T.andThen(get),
  T.chain((n) =>
    T.effectTotal(() => {
      console.log(`result: ${n}`);
    })
  )
);

pipe(program, T.provideSomeLayer(LiveCounterState), R.runMain);
