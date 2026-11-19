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
      users: process.env.USERS_SERVICE_URL ?? 'http://localhost:3000/api',
      blog: process.env.BLOG_SERVICE_URL ?? 'http://localhost:3001/api',
      files: process.env.FILES_SERVICE_URL ?? 'http://localhost:3002/api',
      notify: process.env.NOTIFY_SERVICE_URL ?? 'http://localhost:3003/api',
    },
    jwt: {
      accessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret-change-me',
      refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret-change-me',
    },
    port: Number(process.env.PORT ?? 3004),
  };
}