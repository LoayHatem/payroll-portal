export const throwError = (message: string) => {
  const error = new Error(message);
  error.name = "CustomError";
  error.stack = undefined;
  error.message = message;
  throw error;
};
