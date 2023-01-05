import { CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        if (!request.session.userId) throw new HttpException("Un Authorized", 401)
        return request.session.userId
    }
}