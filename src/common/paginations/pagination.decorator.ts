import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { Pagination } from './pagination-class';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from './const';

export const Paginated = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return new Pagination(
      Number(request.query.offset || DEFAULT_OFFSET),
      Number(request.query.limit || DEFAULT_LIMIT),
    );
  },
);

export const OpenApiPaginationResponse = (model: any) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        properties: {
          totalItems: {
            type: 'number',
          },
          limit: {
            type: 'number',
          },
          nextOffset: {
            type: 'number',
          },
          items: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
        },
      },
    }),
  );
};
