import { program } from "@app/01-effect/program";
import * as T from "@effect-ts/core/Effect";

describe("01-effect", () => {
  it("should print hello world", async () => {
    const spy = jest.spyOn(console, "log");
    const fn = jest.fn();

    spy.mockImplementation(fn);

    await T.runPromise(program);

    expect(fn).toHaveBeenNthCalledWith(1, "hello world");
  });
});
