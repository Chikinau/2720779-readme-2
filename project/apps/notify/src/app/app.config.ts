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
  triggerEmail: string;
}
export function getNotifyConfig(): NotifyConfig {
  const rabbitUser = process.env.RABBITMQ_USER ?? 'admin';
  const rabbitPassword = process.env.RABBITMQ_PASSWORD ?? 'secret';
  const rabbitHost = process.env.RABBITMQ_HOST ?? 'localhost';
  const rabbitPort = process.env.RABBITMQ_PORT ?? '5672';
  const rabbitQueue = process.env.RABBITMQ_QUEUE ?? 'readme.notify.income';

  const smtpHost = process.env.SMTP_HOST ?? 'localhost';
  const smtpPort = Number(process.env.SMTP_PORT ?? 8025);
  const smtpFrom = process.env.SMTP_FROM ?? 'noreply@readme.local';

  const mongoUser = process.env.MONGO_USER ?? 'admin';
  const mongoPassword = process.env.MONGO_PASSWORD ?? 'secret';
  const mongoHost = process.env.MONGO_HOST ?? 'localhost';
  const mongoPort = process.env.MONGO_PORT ?? '27020';
  const mongoDb = process.env.MONGO_DB ?? 'readme-notify';
  const mongoAuthSource = process.env.MONGO_AUTH_SOURCE ?? 'admin';

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
    triggerEmail: process.env.TRIGGER_EMAIL ?? 'test@example.com',
  };
}
