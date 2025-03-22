import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';
import { DalModule } from 'src/dal/dal.module';
import { AuthorizationService } from './authorization.service';
import { AuthorizationStrategy } from './authorization.strategy';

/**
 * The AuthorizationModule is responsible for handling authorization-related functionality.
 *
 * @module AuthorizationModule
 *
 * @imports
 * - DalModule: Data Access Layer module for database interactions.
 * - PassportModule: Passport module configured with JWT strategy for authentication.
 * - JwtModule: JWT module for handling JSON Web Tokens.
 *
 * @providers
 * - AuthorizationStrategy: Strategy for handling authorization logic.
 *
 * @exports
 * - AuthorizationStrategy: Exported to be used in other modules.
 */
@Module({
  imports: [
    DalModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    ClientsModule.registerAsync([
      {
        name: 'pompeii',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'pompeii',
            protoPath: join(__dirname, '../proto/pompeii.proto'),
            url: configService.get<string>('POMPEII_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [AuthorizationStrategy, AuthorizationService],
  exports: [AuthorizationStrategy, AuthorizationService],
})
export class AuthorizationModule {}
