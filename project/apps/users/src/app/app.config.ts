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
}

export function getAppConfig(): AppConfig {
  const user = process.env.MONGO_USER ?? 'admin';
  const password = process.env.MONGO_PASSWORD ?? 'secret';
  const host = process.env.MONGO_HOST ?? 'localhost';
  const port = process.env.MONGO_PORT ?? '27017';
  const db = process.env.MONGO_DB ?? 'readme-users';
  const authSource = process.env.MONGO_AUTH_SOURCE ?? 'admin';

  const uri = `mongodb://${user}:${password}@${host}:${port}/${db}?authSource=${authSource}`;

  return {
    mongo: {
      user,
      password,
      host,
      port,
      db,
      authSource,
      uri,
    },
  };
}