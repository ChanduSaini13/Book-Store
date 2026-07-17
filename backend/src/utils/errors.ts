export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const notFoundError = (resource: string) => {
  return new ApiError(404, `${resource} not found`);
};

export const unauthorizedError = (message = 'Unauthorized') => {
  return new ApiError(401, message);
};

export const forbiddenError = (message = 'Forbidden') => {
  return new ApiError(403, message);
};

export const badRequestError = (message: string) => {
  return new ApiError(400, message);
};

export const conflictError = (message: string) => {
  return new ApiError(409, message);
};

export const internalServerError = (message = 'Internal server error') => {
  return new ApiError(500, message);
};
