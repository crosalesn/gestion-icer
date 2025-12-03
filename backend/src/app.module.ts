import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './core/users/users.module';
import { AuthModule } from './core/auth/auth.module';
import { CollaboratorsModule } from './core/collaborators/collaborators.module';
import { EvaluationsModule } from './core/evaluations/evaluations.module';
import { ActionPlansModule } from './core/action-plans/action-plans.module';
import { ReportsModule } from './core/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        entities: [__dirname + '/**/*.orm-entity{.ts,.js}'],
        synchronize: true, // Set to false in production
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
    UsersModule,
    AuthModule,
    CollaboratorsModule,
    EvaluationsModule,
    ActionPlansModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
