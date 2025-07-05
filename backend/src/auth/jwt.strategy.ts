import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    console.log('JWT Strategy - Validating payload:', payload);
    const user = await this.authService.validateUser(payload.sub);
    console.log('JWT Strategy - User found:', user ? 'Yes' : 'No');
    if (!user) {
      console.log('JWT Strategy - User validation failed for ID:', payload.sub);
      throw new UnauthorizedException('Invalid token or user not found');
    }
    console.log(
      'JWT Strategy - Validation successful for user:',
      user.username,
    );
    return user;
  }
}
