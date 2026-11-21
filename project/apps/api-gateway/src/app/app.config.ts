import { getRequiredEnv } from '@project/shared-types';
export interface GatewayConfig {
  services: {
    users: string;
    blog: string;
    files: string;
    notify: string;
  };
  jwt: {
    accessSecret: string;
    refreshSecret: string;
  };
  port: number;
}

export function getGatewayConfig(): GatewayConfig {
  return {
    services: {
      users: getRequiredEnv('USERS_SERVICE_URL'),
      blog: getRequiredEnv('BLOG_SERVICE_URL'),
      files: getRequiredEnv('FILES_SERVICE_URL'),
      notify: getRequiredEnv('NOTIFY_SERVICE_URL'),
    },
    jwt: {
      accessSecret: getRequiredEnv('JWT_ACCESS_SECRET'),
      refreshSecret: getRequiredEnv('JWT_REFRESH_SECRET'),
    },
    port: Number(getRequiredEnv('PORT')),
  };
}
