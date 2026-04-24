import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Extract tenantId from query, body, or params
    const requestedTenantId =
      request.query?.tenantId ||
      request.body?.tenantId ||
      request.params?.tenantId;

    // Admin can access any tenant
    if (user.role === 'admin') {
      return true;
    }

    // If a specific tenant is requested, ensure it matches the user's tenant
    if (requestedTenantId && requestedTenantId !== user.tenantId?.toString()) {
      throw new ForbiddenException('Access to this tenant is not allowed');
    }

    return true;
  }
}
