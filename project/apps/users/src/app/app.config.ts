import { getRequiredEnv } from '@project/shared-types';
import { StringValue } from 'ms';

export interface AppConfig {
  mongo: {
    user: string;
    password: string;
    host: string;
    port: string;
    db: string;
    authSource: string;
    uri: string;
  };
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpires: StringValue;
    refreshExpires: StringValue;
    refreshTokenExpiresMs: number;
  };
}

export function getAppConfig(): AppConfig {
  const user = getRequiredEnv('MONGO_USER');
  const password = getRequiredEnv('MONGO_PASSWORD');
  const host = getRequiredEnv('MONGO_HOST');
  const port = getRequiredEnv('MONGO_PORT');
  const db = getRequiredEnv('MONGO_DB');
  const authSource = getRequiredEnv('MONGO_AUTH_SOURCE');

  return {
    mongo: {
      user,
      password,
      host,
      port,
      db,
      authSource,
      uri: `mongodb://${user}:${password}@${host}:${port}/${db}?authSource=${authSource}`,
    },
    jwt: {
      accessSecret: getRequiredEnv('JWT_ACCESS_SECRET'),
      refreshSecret: getRequiredEnv('JWT_REFRESH_SECRET'),
      accessExpires: '1d',
      refreshExpires: '7d',
      refreshTokenExpiresMs: 7 * 24 * 60 * 60 * 1000,
    },
  };
}
