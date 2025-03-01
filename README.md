# @hsa-technologies-00/hsa-common

The `@hsa-technologies-00/hsa-common` package is a utility library designed to simplify common tasks in Node.js applications, such as error handling, logging, response formatting, and middleware integration. This package is particularly useful for Express.js applications but can be adapted for other frameworks.

---

## Table of Contents

1. [Installation](#installation)
2. [Building the Package](#building-the-package)
3. [Usage](#usage)
   - [Error Handling](#error-handling)
   - [Logging](#logging)
   - [Response Formatting](#response-formatting)
   - [Middleware](#middleware)
   - [Utils](#utils)
   - [Controller Handler](#controller-handler)
4. [Examples](#examples)
5. [Contributing](#contributing)
6. [Conclusion](#conclusion)
7. [License](#license)

---

## Installation

To install the package, using npm:

```bash
npm install @hsa-technologies-00/hsa-common
```

using yarn:

```bash
yarn add @hsa-technologies-00/hsa-common
```

---

## Usage

### Error Handling

The package provides a set of predefined error classes and a global error handler for Express.js applications.

#### Example: Using Custom Errors

```typescript
import { NotFoundException, globalErrorHandler } from '@hsa-technologies-00/hsa-common';

app.get('/not-found', (req, res, next) => {
  next(new NotFoundException('Resource not found.'));
});

app.use(globalErrorHandler);
```

### Logging

The package includes a logger with development and production configurations.

#### Example: Using the Logger

```typescript
import { logger } from '@hsa-technologies-00/hsa-common';

logger.info('This is an info message.');
logger.error('This is an error message.');
```

### Response Formatting

The `ApiResponse` class helps format API responses consistently.

#### Example: Using ApiResponse

```typescript
import { ApiResponse } from '@hsa-technologies-00/hsa-common';

app.get('/success', (req, res) => {
  const response = new ApiResponse({
    message: 'Request successful',
    statusCode: 200,
    data: { key: 'value' },
    fieldName: 'name',
  });

  res.status(200).json(response);
});
```

### Middleware

The package includes several middleware utilities, such as rate limiting, validation, and authentication.

#### Example: Using Middleware

##### Custom Query Parser

Trims and sanitizes query parameters to ensure they are in the correct format.

```typescript
import { customQueryParser } from '@hsa-technologies-00/hsa-common';
import express from 'express';

const app = express();
app.use(customQueryParser);
```

##### Rate Limiter

Limits the number of requests a user can make to prevent abuse.

```typescript
import { globalRateLimiter } from '@hsa-technologies-00/hsa-common';
import express from 'express';

const app = express();
app.use(globalRateLimiter);
```

##### Validation

Validates request data using Joi schemas and throws a BadRequestException if validation fails.

```typescript
import { validate } from '@hsa-technologies-00/hsa-common';
import express from 'express';
import Joi from 'joi';

const schema = Joi.object({
  name: Joi.string().required(),
});

const app = express();
app.post('/data', validate('body')(schema), (req, res) => {
  res.send('Data is valid.');
});
```

##### Authentication

Provides middlewares for checking, requiring, and restricting access based on user roles.

```typescript
import { checkAuth, requireAuth, restrictTo } from '@hsa-technologies-00/hsa-common';
import express from 'express';

const app = express();
app.use(checkAuth);
app.use('/admin', requireAuth, restrictTo('admin'), (req, res) => {
  res.send('Admin access granted.');
});
```

---

### Utils

The package provides utility functions for environment variable handling and query parsing.

#### Example: Using Utils

```typescript
import { getEnvVariable, trimQuery } from '@hsa-technologies-00/hsa-common';

const dbUrl = getEnvVariable('DATABASE_URL');

app.use((req, res, next) => {
  req.query = trimQuery(req.query);
  next();
});
```

### Controller Handler

The package provides utility functions for environment variable handling and query parsing.

#### Example: Using Controller Handler

```typescript
import { ApiResponse, handleController } from '@hsa-technologies-00/hsa-common';
import express from 'express';

const app = express();

const controller = async ({ req }) => {
  return new ApiResponse({
    message: 'Data retrieved successfully.',
    statusCode: 200,
    data: { key: 'value' },
    fieldName: 'name
  });
};

app.get('/data', handleController(controller));
```

---

## Examples

### Full Example: Express.js Application

```typescript
import express from 'express';
import {
  NotFoundException,
  globalErrorHandler,
  logger,
  ApiResponse,
  globalRateLimiter,
  handleController,
  validate,
  checkAuth,
  customQueryParser,
  trimQuery,
} from '@hsa-technologies-00/hsa-common';
import Joi from 'joi';

const app = express();
const validateBody = validate('body');

// Middleware
app.use(express.json());
app.use(globalRateLimiter);

// Custom query parser
app.use(customQueryParser);

// Trim query parameters
app.use((req, res, next) => {
  req.query = trimQuery(req.query);
  next();
});

// Routes
app.get('/not-found', (req, res, next) => {
  next(new NotFoundException('Resource not found.'));
});

const validationSchema = Joi.object({
  name: Joi.string().required(),
});

const controller = async ({ req }) => {
  return new ApiResponse({
    message: 'Validation passed',
    statusCode: 200,
    data: req.body,
    fieldName: 'data',
  });
};

app.post('/validate', validateBody(validationSchema), handleController(controller));

app.get('/protected', checkAuth, (req, res) => {
  res.send('You are authenticated.');
});

// Global error handler
app.all('*', (req, res, next) => {
  next(new NotFoundException(`Can't find ${req.method} ${req.originalUrl} on this server.`));
});

app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request.

---

## Conclusion

The @hsa-technologies-00/hsa-common package provides a robust set of tools to streamline the development of Node.js and Express applications. By following the best practices and utilizing the provided components, you can build scalable and maintainable applications.

---

## License

This project is licensed under the MIT License.

---

For more information, visit the [GitHub repository](https://github.com/hsa-technologies-00/hsa-common).
