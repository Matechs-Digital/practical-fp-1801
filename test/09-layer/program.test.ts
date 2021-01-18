import { testRuntime } from "@effect-ts/jest/Runtime";
import { LivePgPool, program } from "@app/09-layer/program";
import {
  provideTestConsoleService,
  TestPgPoolConfig,
} from "./TestPgPoolConfig";
import * as T from "@effect-ts/core/Effect";

describe("Integration Suite", () => {
  const { it } = testRuntime(TestPgPoolConfig[">+>"](LivePgPool));

  it("main program should work", () =>
    T.gen(function* (_) {
      const messages: string[] = [];

      yield* _(provideTestConsoleService(messages)(program));

      yield* _(
        T.effectTotal(() => {
          expect(messages).toEqual(["Name: Michael"]);
        })
      );
    }));
});
