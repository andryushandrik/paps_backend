import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { log } from 'handlebars';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const userRoles = JSON.parse(user.roles)
        console.log(userRoles);
        
        const hasRole = () =>
            !!userRoles.find((role) => !!roles.find((item) => item.toLowerCase() === role.toLowerCase()));

        return userRoles && user.roles && hasRole();
    }
}
