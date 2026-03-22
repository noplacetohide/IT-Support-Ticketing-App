import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    if (!dto.name || !dto.email || !dto.password) {
      throw new BadRequestException('name, email and password are required');
    }

    const data = await this.authService.register(dto.name, dto.email, dto.password);
    return {
      success: true,
      message: 'Registration successful',
      data,
    };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const userId = (user as any)._id?.toString() || (user as any).id;
    const data = await this.authService.login({ id: userId, email: user.email, name: user.name });
    return {
      success: true,
      message: 'Login successful',
      data,
    };
  }
}
