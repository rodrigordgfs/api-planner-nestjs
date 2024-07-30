import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  CallHandler,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        const code = err.code;

        if (err.name.includes('NotFoundError')) {
          return throwError(
            () => new NotFoundException('Registro não encontrado.'),
          );
        }

        if (err.response?.message) {
          return throwError(
            () => new ConflictException(err.response.message[0]),
          );
        }

        switch (code) {
          case 'P2002':
            if (err.message.includes('name')) {
              return throwError(
                () =>
                  new ConflictException('Um registro com esse nome já existe.'),
              );
            }
            break;
          case 'P2025':
            return throwError(
              () => new NotFoundException('Registro não encontrado.'),
            );
          case 'P2003':
            if (context.getArgs()[0].method === 'DELETE') {
              return throwError(
                () => new NotFoundException('Registro em uso.'),
              );
            } else {
              return throwError(
                () => new NotFoundException('Registro externo não encontrado.'),
              );
            }
          default:
            return throwError(
              () => new BadGatewayException('Erro inesperado.'),
            );
        }
      }),
    );
  }
}
