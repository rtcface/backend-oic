# Auth Module - Role-Based Access Control

## Overview

The Auth module implements role-based access control (RBAC) to secure endpoints based on user roles. This ensures that only authorized users can access sensitive operations like creating admin accounts.

## Components

### 1. Roles Decorator (`@Roles`)

The `@Roles` decorator is used to specify which roles are required to access a particular endpoint.

```typescript
import { Roles } from './decorators/roles.decorator';

@UseGuards(GqlAuthGuard, RolesGuard)
@Roles('admin')
@Mutation(() => UserTokenDto)
async registerAdmin(@Args('input') inputUser: UserAdminRegisterInput) {
  // Only users with 'admin' role can access this endpoint
}
```

**Usage:**

- `@Roles('admin')` - Requires admin role
- `@Roles('admin', 'contralor')` - Requires either admin or contralor role
- `@Roles()` - No roles required (but still requires authentication)

### 2. RolesGuard

The `RolesGuard` validates that the authenticated user has the required role(s) to access the endpoint.

**How it works:**

1. Extracts required roles from the `@Roles` decorator metadata
2. Gets the authenticated user from the GraphQL context
3. Compares the user's role with the required roles
4. Allows access if the user has at least one of the required roles
5. Throws `ForbiddenException` if the user lacks the required permissions

### 3. GqlAuthGuard

The `GqlAuthGuard` handles JWT authentication and ensures the user is authenticated before role validation.

## Implementation Details

### Security Flow

1. **Authentication**: `GqlAuthGuard` validates the JWT token and extracts user information
2. **Authorization**: `RolesGuard` checks if the user has the required role(s)
3. **Access Control**: If both guards pass, the endpoint is accessible

### Error Handling

- **Unauthenticated**: `ForbiddenException` with message "User not authenticated"
- **Unauthorized**: `ForbiddenException` with detailed message about required roles

### Example Error Messages

```
User with role 'user' does not have permission to access this resource. Required roles: admin
```

## Usage Examples

### Protecting Admin-Only Endpoints

```typescript
@UseGuards(GqlAuthGuard, RolesGuard)
@Roles('admin')
@Mutation(() => UserTokenDto)
async registerAdmin(@Args('input') inputUser: UserAdminRegisterInput) {
  return this.authService.AuthRegisterAdmin(inputUser);
}
```

### Protecting Multiple Role Endpoints

```typescript
@UseGuards(GqlAuthGuard, RolesGuard)
@Roles('admin', 'contralor')
@Mutation(() => UserTokenDto)
async registerContralor(@Args('input') inputUser: UserContralorRegisterInput) {
  return this.authService.AuthRegisterContralor(inputUser);
}
```

### Public Endpoints (Authentication Only)

```typescript
@UseGuards(GqlAuthGuard)
@Mutation(() => UserTokenDto)
async login(@Args('input') loginInput: LoginAuthInput) {
  return this.authService.login(loginInput);
}
```

## Testing

The module includes comprehensive tests for:

- `RolesGuard` functionality
- Role validation scenarios
- Error handling
- Integration with the resolver

### Running Tests

```bash
# Test the RolesGuard
npm test src/auth/guards/roles.guard.spec.ts

# Test the AuthResolver
npm test src/auth/auth.resolver.spec.ts

# Test the AuthService
npm test src/auth/auth.service.spec.ts
```

## Security Considerations

1. **Role Validation**: Always validate roles on the server side
2. **JWT Security**: Ensure JWT tokens are properly signed and have appropriate expiration
3. **Role Hierarchy**: Consider implementing role hierarchy if needed
4. **Audit Logging**: Log all admin operations for security auditing
5. **Rate Limiting**: Implement rate limiting on sensitive endpoints

## Best Practices

1. **Principle of Least Privilege**: Only grant the minimum permissions necessary
2. **Role Naming**: Use clear, descriptive role names
3. **Consistent Application**: Apply role guards consistently across all protected endpoints
4. **Error Messages**: Provide clear, actionable error messages without exposing sensitive information
5. **Testing**: Write comprehensive tests for all role combinations and edge cases
