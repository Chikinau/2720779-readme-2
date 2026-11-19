import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { getAppConfig } from './app.config';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/users/.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        const config = getAppConfig();
        return {
          uri: config.mongo.uri,
        };
      },
    }),
    UserModule,
    AuthenticationModule,
    RefreshTokenModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
