import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { TokenModule } from '../token/token.module';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [ConfigModule.forRoot(), TokenModule, AuthModule, UsersModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
