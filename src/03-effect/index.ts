/* istanbul ignore file */
import { pipe } from "@effect-ts/core/Function";
import * as R from "@effect-ts/node/Runtime";
import { program, provideLiveConsoleService } from "./program";

pipe(program, provideLiveConsoleService, R.runMain);
