import { ConsoleService, PgPoolConfig } from "@app/09-layer/program";
import * as T from "@effect-ts/core/Effect";
import * as L from "@effect-ts/core/Effect/Layer";
import * as M from "@effect-ts/core/Effect/Managed";
import { pipe } from "@effect-ts/core/Function";
import * as TC from "testcontainers";

export const TestPgPoolConfig = L.fromManaged(PgPoolConfig)(
  M.gen(function* (_) {
    const user = "testusername";
    const password = "testpassord";
    const database = "testdatabase";

    const container = yield* _(
      T.effectTotal(() =>
        new TC.GenericContainer("postgres", "9.6.19-alpine")
          .withExposedPorts(5432)
          .withEnv("POSTGRES_DB", database)
          .withEnv("POSTGRES_USER", user)
          .withEnv("POSTGRES_PASSWORD", password)
      )
    );

    const started = yield* _(
      pipe(
        T.fromPromiseDie(() => container.start()),
        M.makeExit((started) => T.fromPromiseDie(() => started.stop()))
      )
    );

    const port = started.getMappedPort(5432);

    return {
      _tag: "PgPoolConfig",
      config: {
        host: "0.0.0.0",
        port,
        user,
        password,
        database,
      },
    };
  })
);

export const provideTestConsoleService = (messages: string[]) =>
  T.provideServiceM(ConsoleService)(
    T.effectTotal(() => ({
      _tag: "ConsoleService",
      putStrLn: (message) =>
        T.effectTotal(() => {
          messages.push(message);
        }),
    }))
  );
