import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from './jwt-autg.guard';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    return request.user!.userId;
  },
);
