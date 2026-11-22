import { getRequiredEnv } from '@project/shared-types';

export interface NotifyConfig {
  rabbit: {
    uri: string;
    queue: string;
    exchange: string;
  };
  smtp: {
    host: string;
    port: number;
    user?: string;
    password?: string;
    from: string;
  };
  mongo: {
    uri: string;
  };
  usersUrl: string;
  blogUrl: string;
}
export function getNotifyConfig(): NotifyConfig {
  const rabbitUser = getRequiredEnv('RABBITMQ_USER');
  const rabbitPassword = getRequiredEnv('RABBITMQ_PASSWORD');
  const rabbitHost = getRequiredEnv('RABBITMQ_HOST');
  const rabbitPort = getRequiredEnv('RABBITMQ_PORT');
  const rabbitQueue = process.env.RABBITMQ_QUEUE ?? 'readme.notify.income';

  const smtpHost = getRequiredEnv('SMTP_HOST');
  const smtpPort = Number(getRequiredEnv('SMTP_PORT'));
  const smtpFrom = getRequiredEnv('SMTP_FROM');

  const mongoUser = getRequiredEnv('MONGO_USER');
  const mongoPassword = getRequiredEnv('MONGO_PASSWORD');
  const mongoHost = getRequiredEnv('MONGO_HOST');
  const mongoPort = getRequiredEnv('MONGO_PORT');
  const mongoDb = getRequiredEnv('MONGO_DB');
  const mongoAuthSource = getRequiredEnv('MONGO_AUTH_SOURCE');

  return {
    rabbit: {
      uri: `amqp://${rabbitUser}:${rabbitPassword}@${rabbitHost}:${rabbitPort}`,
      queue: rabbitQueue,
      exchange: 'readme.notify',
    },
    smtp: {
      host: smtpHost,
      port: smtpPort,
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
      from: smtpFrom,
    },
    mongo: {
      uri: `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDb}?authSource=${mongoAuthSource}`,
    },
    usersUrl: getRequiredEnv('USERS_SERVICE_URL'),
    blogUrl: getRequiredEnv('BLOG_SERVICE_URL'),
  };
}
