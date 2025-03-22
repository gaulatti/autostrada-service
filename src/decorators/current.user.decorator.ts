import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserContext } from 'src/types/pompeii';

/**
 * A custom decorator to extract the current user from the request context.
 *
 * This decorator retrieves the `user` object from the HTTP request, which is
 * typically populated during the authentication process. It is used to provide
 * the currently authenticated user's information to the handler.
 *
 * @param _ - Unused parameter.
 * @param ctx - The execution context, which provides access to the HTTP request.
 * @returns The `user` object from the request, typed as `UserContext`.
 */
export const CurrentUserContext = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
