import { Request, Response, NextFunction, CookieOptions } from 'express';
import { getEnvVariable, parseEnvVariableInt } from './utils/env-variable';
import { RequestUserPayload } from './types/RequestExtension';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: parseEnvVariableInt(getEnvVariable('COOKIE_MAX_AGE')),
};

interface RequestObject {
  body: any;
  query: any;
  params: any;
  cookies: any;
  user: RequestUserPayload;
  file?: any;
  ip?: string;
  method: string;
  url: string;
  path: string;
  header: (name: string) => string | undefined;
  headers: object;
}

interface ResponseObject {
  statusCode: number;
  cookies?: Array<{ name: string; value: string }>;
  clearCookie?: string[];
  [key: string]: any;
}

export type ControllerParams = {
  req: RequestObject;
};

export function handleController(controller: ({ req }: ControllerParams) => Promise<ResponseObject>) {
  return (req: Request, res: Response, next: NextFunction) => {
    // prepare all the necessary request object that the controller needs
    const requestObject: RequestObject = {
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
      user: req.user,
      file: null,
      ip: req.ip,
      method: req.method,
      url: req.originalUrl,
      path: req.path,
      header: req.header,
      headers: req.headers,
    };

    // call the controller function with the prepared request object and send the response to the client also call the global error handler if any error occurs
    controller({ req: requestObject })
      .then((response) => {
        const { statusCode, cookies, clearCookie } = response;

        if (cookies && cookies.length > 0) {
          cookies.forEach((cookie) => {
            const { name, value } = cookie;
            res.cookie(name, value, cookieOptions);
          });
        }

        if (clearCookie && clearCookie.length > 0) {
          clearCookie.forEach((cookie) => {
            res.clearCookie(cookie);
          });
        }

        // Exclude cookies and clearCookie from the response object
        delete response.cookies;
        delete response.clearCookie;

        res.status(statusCode).json(response);
      })
      .catch(next);
  };
}
