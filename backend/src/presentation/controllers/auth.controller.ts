import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Signin, SigninInput } from '@application/usecases/auth/signin';
import { SigninDto } from '@presentation/dtos/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private signin: Signin) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signinDto: SigninDto): Promise<boolean> {
    const input = new SigninInput(signinDto.email, signinDto.password);
    return this.signin.execute(input);
  }
}
