import * as T from "@effect-ts/core/Effect";

export const program = T.effectTotal(() => {
  console.log("hello world");
});
