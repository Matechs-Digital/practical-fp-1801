import * as M from "@effect-ts/core/Effect/Managed";
import { literal, pipe } from "@effect-ts/core/Function";
import * as T from "@effect-ts/core/Effect";

import * as PG from "pg";
import { _A } from "@effect-ts/core/Utils";
import { Has, tag } from "@effect-ts/core/Has";

export const makeConsoleService = T.effectTotal(() => {
  return {
    _tag: literal("ConsoleService"),
    putStrLn: (message: string) =>
      T.effectTotal(() => {
        console.log(message);
      }),
  };
});

export interface ConsoleService extends _A<typeof makeConsoleService> {}
export const ConsoleService = tag<ConsoleService>();

export const provideLiveConsoleService = T.provideServiceM(ConsoleService)(
  makeConsoleService
);

export class MissingEnvVar {
  readonly _tag = "MissingEnvVar";
  constructor(readonly key: string) {}
}

export function readEnv(key: string): T.UIO<string> {
  return T.suspend(() => {
    const value = process.env[key];

    if (!value) {
      return T.die(new MissingEnvVar(key));
    }

    return T.succeed(value);
  });
}

export const makePgPoolConfig = T.gen(function* (_) {
  const connectionString = yield* _(readEnv("PG_CONNECTION_STRING"));

  return {
    _tag: literal("PgPoolConfig"),
    config: <PG.PoolConfig>{
      connectionString,
    },
  };
});

export interface PgPoolConfig extends _A<typeof makePgPoolConfig> {}
export const PgPoolConfig = tag<PgPoolConfig>();

export const provideLivePgPoolConfig = T.provideServiceM(PgPoolConfig)(
  makePgPoolConfig
);

export const makePgPool = pipe(
  T.accessService(PgPoolConfig)((_) => _.config),
  T.chain((config) =>
    T.effectTotal(() => ({
      _tag: literal("PgPool"),
      pool: new PG.Pool(config),
    }))
  ),
  M.makeExit(({ pool }) => T.fromPromiseDie(() => pool.end()))
);

export interface PgPool extends _A<typeof makePgPool> {}
export const PgPool = tag<PgPool>();

export function provideLivePgPool<R, E, A>(
  self: T.Effect<R & Has<PgPool>, E, A>
) {
  return pipe(
    makePgPool,
    M.use((pool) => T.provideService(PgPool)(pool)(self))
  );
}

export const makePgConnection = M.gen(function* (_) {
  const { pool } = yield* _(PgPool);

  const connection = yield* _(
    pipe(
      T.fromPromiseDie(() => pool.connect()),
      M.makeExit((client) => T.effectTotal(() => client.release()))
    )
  );

  return {
    _tag: literal("PgConnection"),
    connection,
  };
});

export interface PgConnection extends _A<typeof makePgConnection> {}
export const PgConnection = tag<PgConnection>();

export function provideLivePgConnection<R, E, A>(
  self: T.Effect<R & Has<PgConnection>, E, A>
) {
  return pipe(
    makePgConnection,
    M.use((connection) => T.provideService(PgConnection)(connection)(self))
  );
}

export const getName = T.gen(function* (_) {
  const { connection } = yield* _(PgConnection);

  const result = yield* _(
    T.fromPromiseDie(() =>
      connection.query("SELECT $1::text as name", ["Michael"])
    )
  );

  return result.rows[0].name as string;
});

export const program = T.gen(function* (_) {
  const { putStrLn } = yield* _(ConsoleService);
  const name = yield* _(getName);

  yield* _(putStrLn(`Name: ${name}`));
});
