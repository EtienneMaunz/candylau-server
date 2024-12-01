import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { DataSource } from 'typeorm';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';
import { FilesController } from './files/files.controller';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      autoLoadEntities: true,
      logging: 'all',
    }),
    UserModule,
    FilesModule,
  ],
  controllers: [AppController, AuthController, FilesController],
  providers: [AppService, AuthService, UserService, JwtService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
