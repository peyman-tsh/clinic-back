import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { SignupUseCase } from '../../application/use-cases/signup.use-case';
import { LoginRequest } from './dto/login.request';
import { RefreshTokenRequest } from './dto/refresh-token.request';
import { SignupRequest } from './dto/signup.request';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthExceptionFilter } from './auth-exception.filter';
import { LoginOutput, AuthTokensOutput } from '../../application/dto/auth.dto';

interface AuthenticatedUserView {
  id: string;
  email: string;
  roles: string[];
}

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly signupUseCase: SignupUseCase,
  ) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered and tokens returned' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async signup(@Body() request: SignupRequest): Promise<LoginOutput> {
    return this.signupUseCase.execute(request);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiResponse({ status: 200, description: 'Tokens returned' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() request: LoginRequest): Promise<LoginOutput> {
    return this.loginUseCase.execute(request);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'New tokens returned' })
  @ApiResponse({ status: 401, description: 'Invalid/expired refresh token' })
  async refresh(@Body() request: RefreshTokenRequest): Promise<AuthTokensOutput> {
    return this.refreshTokenUseCase.execute(request);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async me(@CurrentUser() user: AuthenticatedUserView): Promise<AuthenticatedUserView> {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Log out (client discards tokens)' })
  @ApiResponse({ status: 204, description: 'Logged out' })
  async logout(): Promise<void> {}
}