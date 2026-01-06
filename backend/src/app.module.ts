import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './core/users/users.module';
import { AuthModule } from './core/auth/auth.module';
import { CollaboratorsModule } from './core/collaborators/collaborators.module';
import { ClientsModule } from './core/clients/clients.module';
import { EvaluationsModule } from './core/evaluations/evaluations.module';
import { ActionPlansModule } from './core/action-plans/action-plans.module';
import { ReportsModule } from './core/reports/reports.module';
import { FollowUpModule } from './core/follow-up/follow-up.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mssql',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT', '1433'), 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        options: {
          encrypt: configService.get<string>('DB_ENCRYPT', 'true') === 'true', // Para Azure SQL
          trustServerCertificate: configService.get<string>('DB_TRUST_CERT', 'false') === 'true',
        },
        entities: [__dirname + '/**/*.orm-entity{.ts,.js}'],
        synchronize: configService.get<string>('DB_SYNCHRONIZE', 'true') === 'true', // Set to false in production
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
    UsersModule,
    AuthModule,
    CollaboratorsModule,
    ClientsModule,
    EvaluationsModule,
    ActionPlansModule,
    ReportsModule,
    FollowUpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
