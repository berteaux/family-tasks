import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { InvalidEmailException } from '@domain/exceptions/invalid-email.exception';
import { WeakPasswordException } from '@domain/exceptions/weak-password.exception';
import { EmailAlreadyExistsException } from '@domain/exceptions/email-already-exists.exception';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const exceptionMap = new Map([
      [InvalidEmailException.name, HttpStatus.BAD_REQUEST],
      [WeakPasswordException.name, HttpStatus.BAD_REQUEST],
      [EmailAlreadyExistsException.name, HttpStatus.CONFLICT],
    ]);

    const status =
      exceptionMap.get(exception.name) || HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    });
  }
}
