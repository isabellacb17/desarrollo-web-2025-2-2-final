import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type LoginDto = { email: string; password: string };

@Controller('auth')
export class AuthController {
  constructor(private readonly jwt: JwtService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    const { email, password } = body;
    // DEMO simple: credenciales fijas de README
    let roles: string[] = [];
    let userId = 'u-player';
    if (email === 'gm@u.com' && password === 'gm123') {
      roles = ['gm'];
      userId = 'u-gm';
    } else if (email === 'player@u.com' && password === 'player123') {
      roles = ['player'];
      userId = 'u-player';
    } else {
      // Para demo, aceptamos cualquier otra combinación como player
      roles = ['player'];
    }
    const token = this.jwt.sign({ sub: userId, roles });
    return { token };
  }
}


