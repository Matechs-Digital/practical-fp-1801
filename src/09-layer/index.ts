/* istanbul ignore file */
import * as T from "@effect-ts/core/Effect";
import { pipe } from "@effect-ts/core/Function";
import * as R from "@effect-ts/node/Runtime";
import { LiveConsoleService, LivePg, program } from "./program";

const AppLayer = LivePg["+++"](LiveConsoleService);

pipe(program, T.provideSomeLayer(AppLayer), R.runMain);
