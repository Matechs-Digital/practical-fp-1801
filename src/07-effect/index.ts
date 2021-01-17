/* istanbul ignore file */
import { pipe } from "@effect-ts/core/Function";
import * as R from "@effect-ts/node/Runtime";
import {
  main,
  provideLiveConsoleService,
  provideLiveMathService,
} from "./program";

pipe(main, provideLiveConsoleService, provideLiveMathService, R.runMain);
