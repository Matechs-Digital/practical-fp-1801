import {
  program,
  provideLiveConsoleService,
  putStrLn,
} from "@app/02-effect/program";
import { ConsoleService } from "@app/02-effect/program";
import * as T from "@effect-ts/core/Effect";
import { pipe } from "@effect-ts/core/Function";

const provideTestConsoleService = (messages: string[]) =>
  T.provide<ConsoleService>({
    Console: {
      putStrLn: (message) =>
        T.effectTotal(() => {
          messages.push(message);
        }),
    },
  });

describe("02-effect", () => {
  // integration
  it("use live console", async () => {
    const spy = jest.spyOn(console, "log");
    const fn = jest.fn();

    spy.mockImplementation(fn);

    await pipe(putStrLn("ok"), provideLiveConsoleService, T.runPromise);

    expect(fn).toHaveBeenNthCalledWith(1, "ok");
  });

  // unit
  it("should print hello world", async () => {
    const messages: string[] = [];

    await pipe(program, provideTestConsoleService(messages), T.runPromise);

    expect(messages).toEqual(["hello world"]);
  });
});
