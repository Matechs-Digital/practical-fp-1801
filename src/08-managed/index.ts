/* istanbul ignore file */
import { pipe } from "@effect-ts/core/Function";
import * as R from "@effect-ts/node/Runtime";
import {
  program,
  provideLiveConsoleService,
  provideLivePgConnection,
  provideLivePgPool,
  provideLivePgPoolConfig,
} from "./program";

const main = pipe(
  program,
  provideLiveConsoleService,
  provideLivePgConnection,
  provideLivePgPool,
  provideLivePgPoolConfig
);

R.runMain(main);
