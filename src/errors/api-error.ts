import { StatusCodes, ReasonPhrases } from 'http-status-codes';

interface ApiErrorOptions {
  details?: string;
  appCode?: number | null;
  httpReasonPhrase?: ReasonPhrases;
  httpStatusCode?: StatusCodes;
}

export { StatusCodes };

export class ApiError extends Error {
  public details?: string;
  public appCode?: number | null;
  public httpReasonPhrase?: string;
  public httpStatusCode?: number;
  public timestamp: Date;
  public isOperational: boolean;

  constructor(
    message = '',
    options: ApiErrorOptions = {
      details: '',
      appCode: null,
      httpReasonPhrase: ReasonPhrases.INTERNAL_SERVER_ERROR,
      httpStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    }
  ) {
    super(message);
    this.details = options?.details;
    this.httpStatusCode = options?.httpStatusCode;
    this.httpReasonPhrase = options?.httpReasonPhrase;
    this.appCode = options?.appCode;
    this.timestamp = new Date();
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
    (Error as any).captureStackTrace(this);
  }

  get name() {
    return 'ApiError';
  }
}

export class NotFoundException extends ApiError {
  constructor(message = 'Not Found.') {
    super(message, {
      httpStatusCode: StatusCodes.NOT_FOUND,
      httpReasonPhrase: ReasonPhrases.NOT_FOUND,
    });
  }
}

export class BadRequestException extends ApiError {
  constructor(message = 'Bad Request.') {
    super(message, {
      httpStatusCode: StatusCodes.BAD_REQUEST,
      httpReasonPhrase: ReasonPhrases.BAD_REQUEST,
    });
  }
}

export class UnauthorizedException extends ApiError {
  constructor(message = 'Unauthorized.') {
    super(message, {
      httpStatusCode: StatusCodes.UNAUTHORIZED,
      httpReasonPhrase: ReasonPhrases.UNAUTHORIZED,
    });
  }
}

export class ForbiddenException extends ApiError {
  constructor(message = 'Forbidden.') {
    super(message, {
      httpStatusCode: StatusCodes.FORBIDDEN,
      httpReasonPhrase: ReasonPhrases.FORBIDDEN,
    });
  }
}

export class TooManyRequestsException extends ApiError {
  constructor(message = 'Too many requests.') {
    super(message, {
      httpStatusCode: StatusCodes.TOO_MANY_REQUESTS,
      httpReasonPhrase: ReasonPhrases.TOO_MANY_REQUESTS,
    });
  }
}
export class EmailMissConfigException extends ApiError {
  constructor(message = 'Invalid email contents, email can not be sent.') {
    super(message, {
      httpStatusCode: StatusCodes.BAD_REQUEST,
      httpReasonPhrase: ReasonPhrases.BAD_REQUEST,
    });
  }
}

export class SessionExpiredException extends ApiError {
  constructor(message = 'Session expired.') {
    super(message, {
      httpStatusCode: StatusCodes.FORBIDDEN,
      httpReasonPhrase: ReasonPhrases.FORBIDDEN,
    });
  }
}

export class InternalServerErrorException extends ApiError {
  constructor(message = 'Internal Server Error.') {
    super(message, {
      httpStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      httpReasonPhrase: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
}

export class ServiceUnavailableException extends ApiError {
  constructor(message = 'Service Unavailable.') {
    super(message, {
      httpStatusCode: StatusCodes.SERVICE_UNAVAILABLE,
      httpReasonPhrase: ReasonPhrases.SERVICE_UNAVAILABLE,
    });
  }
}

export class BadGatewayException extends ApiError {
  constructor(message = 'Bad Gateway.') {
    super(message, {
      httpStatusCode: StatusCodes.BAD_GATEWAY,
      httpReasonPhrase: ReasonPhrases.BAD_GATEWAY,
    });
  }
}

export class ConflictException extends ApiError {
  constructor(message = 'Conflict.') {
    super(message, {
      httpStatusCode: StatusCodes.CONFLICT,
      httpReasonPhrase: ReasonPhrases.CONFLICT,
    });
  }
}

export class NotImplementedException extends ApiError {
  constructor(message = 'Not Implemented.') {
    super(message, {
      httpStatusCode: StatusCodes.NOT_IMPLEMENTED,
      httpReasonPhrase: ReasonPhrases.NOT_IMPLEMENTED,
    });
  }
}

export class ServerUnavailableException extends ApiError {
  constructor(message = 'Server Unavailable.') {
    super(message, {
      httpStatusCode: StatusCodes.SERVICE_UNAVAILABLE,
      httpReasonPhrase: ReasonPhrases.SERVICE_UNAVAILABLE,
    });
  }
}

export class UnprocessableEntityException extends ApiError {
  constructor(message = 'Unprocessable Entity.') {
    super(message, {
      httpStatusCode: StatusCodes.UNPROCESSABLE_ENTITY,
      httpReasonPhrase: ReasonPhrases.UNPROCESSABLE_ENTITY,
    });
  }
}
