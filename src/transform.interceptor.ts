import {
    NestInterceptor,
    ExecutionContext,
    Injectable,
    CallHandler,
  } from '@nestjs/common';
  import { map } from 'rxjs/operators';
  import { instanceToPlain } from 'class-transformer';
  
  @Injectable()
  export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>) {
      return next.handle().pipe(map((data) => instanceToPlain(data)));
    }
  }