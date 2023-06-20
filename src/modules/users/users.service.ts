import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { userField } from 'src/common/constants';
import { AppError } from 'src/common/errors';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
	constructor(private readonly prismaService: PrismaService) {}

	private async hashPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt(10);
		return bcrypt.hash(password, salt);
	}

	public async getUser(email: string) {
		return this.prismaService.user.findUnique({ where: { email } });
	}

	public async getPublicUser(email: string) {
		return this.prismaService.user.findUnique({
			where: { email },
			select: { ...userField },
		});
	}

	public async createUser(dto: CreateUserDto) {
		const user = await this.getPublicUser(dto.email);

		if (user) throw new BadRequestException(AppError.USER_EMAIL_ALREADY);

		return this.prismaService.user.create({
			data: {
				email: dto.email,
				password: await this.hashPassword(dto.password),
				name: dto.name,
			},
			select: {
				...userField,
			},
		});
	}
}
