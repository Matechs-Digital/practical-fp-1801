/* istanbul ignore file */
import { pipe } from "@effect-ts/core/Function";
import * as R from "@effect-ts/node/Runtime";
import {
  program,
  provideLiveConsoleService,
  provideLiveMathService,
} from "./program";

pipe(program, provideLiveConsoleService, provideLiveMathService, R.runMain);
