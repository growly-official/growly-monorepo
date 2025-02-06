import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { contextAuthorizationMiddlware } from './middlewares';
import { PingPongResolver } from './modules/ping';
import { isProduction } from './utils';

const generalConfiguration = ConfigModule.forRoot({
  envFilePath: '.env',
});

const graphQLConfiguration = GraphQLModule.forRootAsync<ApolloDriverConfig & { uploads: boolean }>({
  driver: ApolloDriver,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory() {
    return {
      playground: !isProduction(),
      uploads: false, // disable built-in upload handling
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: async connectionParams => {
            try {
              console.log('Connection params: ', connectionParams);
            } catch (error: any) {
              console.log(error.message);
            }
            return undefined;
          },
        },
      },
      sortSchema: true,
      context: contextAuthorizationMiddlware,
    };
  },
});

const resolvers = [PingPongResolver];

const services = [AppService];

@Module({
  imports: [graphQLConfiguration, generalConfiguration, ThrottlerModule.forRoot()],
  controllers: [AppController],
  providers: [...services, ...resolvers],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);
  onModuleInit() {
    this.logger.log(`MODE ${[process.env.NODE_ENV]}`);
  }
}
