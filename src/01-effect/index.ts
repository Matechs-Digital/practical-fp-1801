/* istanbul ignore file */
import { pipe } from "@effect-ts/core/Function";
import * as R from "@effect-ts/node/Runtime";
import { program } from "./program";

pipe(program, R.runMain);
