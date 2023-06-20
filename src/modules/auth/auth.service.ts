import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AppError } from 'src/common/errors';
import { TokenService } from '../token/token.service';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { LoginUserDto } from '../users/dto/loginUser.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly tokenService: TokenService,
	) {}

	public async getToken(
		payload: CreateUserDto | LoginUserDto,
	): Promise<string> {
		const token = await this.tokenService.getToken(payload.email);
		return token;
	}

	public async register(dto: CreateUserDto) {
		const newUser = await this.userService.createUser(dto);

		const token = await this.getToken(dto);

		return { ...newUser, token };
	}

	public async login(dto: LoginUserDto) {
		const user = await this.userService.getUser(dto.email);

		if (!user) {
			throw new HttpException(
				AppError.USER_EMAIL_NOT_FOUND,
				HttpStatus.NOT_FOUND,
			);
		}

		const checkPassword = await bcrypt.compare(dto.password, user.password);

		if (!checkPassword) {
			throw new BadRequestException(AppError.USER_PASSWORD_INVALID);
		}

		const token = await this.getToken(dto);
		const newUser = await this.userService.getPublicUser(dto.email);

		return { ...newUser, token };
	}
}
