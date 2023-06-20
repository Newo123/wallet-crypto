import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { LoginUserDto } from '../users/dto/loginUser.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	public async register(@Body() dto: CreateUserDto) {
		return this.authService.register(dto);
	}

	@HttpCode(200)
	@Post('login')
	public async login(@Body() dto: LoginUserDto) {
		return this.authService.login(dto);
	}
}
