import { Body, Controller, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import controllers from '../const/controllers';
import { JoiValidationPipe } from '../common/validation.pipe';
import { SessionsService } from './sessions.service';
import { LoginDto, loginSchema } from './dto/login-dto';
import { registerSchema } from './dto/register.dto';
import { UserCreateDto } from '../users/dto/user.create';

@ApiTags(controllers.sessions)
@Controller(controllers.sessions)
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @ApiResponse({ status: HttpStatus.OK })
  @Post('login')
  @UsePipes(new JoiValidationPipe(loginSchema))
  login(@Body() loginDto: LoginDto) {
    return this.sessionsService.login(loginDto);
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Post('register')
  @UsePipes(new JoiValidationPipe(registerSchema))
  register(@Body() createUserDto: UserCreateDto) {
    return this.sessionsService.register(createUserDto);
  }
}
