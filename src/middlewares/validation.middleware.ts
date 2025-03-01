import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { BadRequestException } from '../errors/api-error';

function _validate(schema: Schema, data: any) {
  const options = { abortEarly: false };
  const { error } = schema.validate(data, options);
  if (!error) return null;

  const errors: { [key: string]: string } = {};
  for (let item of error.details) {
    errors[item.path[0]] = item.message;
  }

  return errors;
}

const validate = (validationObjectName: string) => {
  return (schema: Schema) => {
    return async (req: Request & Record<string, any>, res: Response, next: NextFunction) => {
      try {
        const errors = _validate(schema, req[validationObjectName]);
        if (!errors) return next();

        const errorMessages = Object.values(errors).join(', ');
        throw new BadRequestException(errorMessages);
      } catch (error) {
        next(error);
      }
    };
  };
};

export { validate };
