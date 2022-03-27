import { logger } from './logger';

export const messageResponses = {
  200: 'Success',
  201: 'Created',
};

export const errorResponses = {
  400: 'Bad Request',
  401: 'Please Login',
  403: 'Unauthorized',
  404: 'Not Found',
  500: 'Internal Server Error',
};

export const responseHandler = async (req, res, code, error, message) => {
  try {
    if (error) {
      res.status(code).send({ error: error.toString() });
      logger.error(
        'error',
        `${req.originalUrl} ${code}  ${JSON.stringify(error)}`,
      );
    } else if (message) {
      res.status(code).send(message);
      logger.log(
        'info',
        `${req.originalUrl} ${code}  ${JSON.stringify(message)}`,
      );
    } else if (errorResponses[code]) {
      res.status(code).send({ error: errorResponses[code] });
      logger.error(
        'error',
        `${req.originalUrl} ${code}  ${errorResponses[code]}`,
      );
    } else if (messageResponses[code]) {
      res.status(code).send({ message: messageResponses[code] });
      logger.log(
        'info',
        `${req.originalUrl} ${code}  ${messageResponses[code]}`,
      );
    } else {
      res.status(code).send();
    }
    // throw new Error();
  } catch (err) {
    console.log(err);
    logger.error(err);
  }
};
