import { Body, Controller, HttpCode, Post, Header } from '@nestjs/common';
import { Signin, SigninInput } from '@application/usecases/auth/signin';
import { SigninDto } from '@presentation/dtos/signin.dto';
import { AuthOutput } from '@application/dtos/auth.output';

@Controller('auth')
export class AuthController {
  constructor(private signin: Signin) {}

  @Post('login')
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  @Header('Pragma', 'no-cache')
  signIn(@Body() signinDto: SigninDto): Promise<AuthOutput> {
    const input = new SigninInput(signinDto.email, signinDto.password);
    return this.signin.execute(input);
  }
}
