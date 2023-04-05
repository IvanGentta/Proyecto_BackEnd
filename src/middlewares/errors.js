import { ERRORS } from "../mocks/messages.js";

export function handleError(error, req, res, next) {
  try {
    const { STATUS, MESSAGE } = ERRORS[error];

    return res.status(STATUS).json({ message: MESSAGE });
  } catch (error) {
    const { STATUS, MESSAGE } = ERRORS.SERVER_ERROR;
    console.log(error);
    return res.status(STATUS).json({ message: MESSAGE });
  }
}
