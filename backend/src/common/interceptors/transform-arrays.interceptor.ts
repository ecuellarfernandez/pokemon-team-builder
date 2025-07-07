/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TransformArraysInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.body) {
      // Transformar habilidad_ids si existe y es string
      if (
        request.body.habilidad_ids &&
        typeof request.body.habilidad_ids === 'string'
      ) {
        try {
          request.body.habilidad_ids = JSON.parse(request.body.habilidad_ids);
        } catch (error) {
          // Si no es JSON válido, mantener como string
          console.warn('Error parsing habilidad_ids:', error);
        }
      }

      // Transformar movimiento_ids si existe y es string
      if (
        request.body.movimiento_ids &&
        typeof request.body.movimiento_ids === 'string'
      ) {
        try {
          request.body.movimiento_ids = JSON.parse(request.body.movimiento_ids);
        } catch (error) {
          // Si no es JSON válido, mantener como string
          console.warn('Error parsing movimiento_ids:', error);
        }
      }
    }

    return next.handle();
  }
}
