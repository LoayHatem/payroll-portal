import { throwError } from "@/exceptions/throwError";
import _ from "lodash";

export const signUpDto = (body: Record<string, any>) => {
  if (_.isEmpty(body)) {
    return throwError("Body is empty");
  }
  if (!body?.email || !body?.password) {
    return throwError("Email and password are required");
  }
  const { email, password, name } = body;

  return { email, password, name };
};
