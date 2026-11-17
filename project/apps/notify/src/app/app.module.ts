import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'node:path';
import { getNotifyConfig } from './app.config';
import { NotifyModule } from './notify/notify.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/notify/.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({ uri: getNotifyConfig().mongo.uri }),
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: getNotifyConfig().smtp.host,
          port: getNotifyConfig().smtp.port,
          auth: getNotifyConfig().smtp.user
            ? {
                user: getNotifyConfig().smtp.user,
                pass: getNotifyConfig().smtp.password,
              }
            : undefined,
        },
        defaults: { from: getNotifyConfig().smtp.from },
        template: {
          dir: join(__dirname, 'assets'),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
    NotifyModule,
  ],
})
export class AppModule {}
