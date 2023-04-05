import { ERRORS, SUCCESS } from "../mocks/messages.js";

function validateObject(fields, strict) {
  if (fields === null || fields === undefined || typeof fields !== "object") {
    if (!strict) {
      throw new Error(ERRORS.UPDATE_MORE_FIELDS.ERROR_CODE);
    }
    throw new Error(ERRORS.REQUIRED_FIELDS.ERROR_CODE);
  }
  return SUCCESS.OBJECT_RECEIVED.STATUS;
}

function estrictInputs(fields) {
  const { title, description, price, thumbnail, stock, status, code } = fields;

  if (description === undefined || description === null) {
    throw new Error(ERRORS.EMPTY_DESCRIPTION.ERROR_CODE);
  }
  if (typeof description !== "string") {
    throw new Error(ERRORS.FIELD_DESCRIPTION.ERROR_CODE);
  }

  if (thumbnail === undefined || thumbnail === null) {
    throw new Error(ERRORS.EMPTY_THUMBNAIL.ERROR_CODE);
  }
  if (typeof thumbnail !== "string") {
    throw new Error(ERRORS.FIELD_THUMBNAIL.ERROR_CODE);
  }

  if (title === undefined || title === null) {
    throw new Error(ERRORS.EMPTY_TITLE.ERROR_CODE);
  }
  if (typeof title !== "string") {
    throw new Error(ERRORS.FIELD_TITLE.ERROR_CODE);
  }

  if (price === undefined || price === null) {
    throw new Error(ERRORS.EMPTY_PRICE.ERROR_CODE);
  }
  if (typeof price !== "number") {
    throw new Error(ERRORS.FIELD_PRICE.ERROR_CODE);
  }

  if (stock !== undefined && stock !== null) {
    if (typeof stock !== "number") {
      throw new Error(ERRORS.FIELD_STOCK.ERROR_CODE);
    }
  }

  if (status !== undefined && status !== null) {
    if (typeof status !== "boolean") {
      throw new Error(ERRORS.FIELD_STATUS.ERROR_CODE);
    }
  }

  if (code !== undefined && code !== null) {
    if (typeof code !== "string") {
      throw new Error(ERRORS.FIELD_CODE_EXIST.ERROR_CODE);
    }
  }
}

function looseInputs(fields) {
  if (fields.description !== undefined && fields.description !== null) {
    if (typeof fields.description !== "string") {
      throw new Error(ERRORS.FIELD_DESCRIPTION.ERROR_CODE);
    }
  }

  if (fields.thumbnail !== undefined && fields.thumbnail !== null) {
    if (typeof fields.thumbnail !== "string") {
      throw new Error(ERRORS.FIELD_THUMBNAIL.ERROR_CODE);
    }
  }

  if (fields.title !== undefined && fields.title !== null) {
    if (typeof fields.title !== "string") {
      throw new Error(ERRORS.FIELD_TITLE.ERROR_CODE);
    }
  }

  if (fields.price !== undefined && fields.price !== null) {
    if (typeof fields.price !== "number") {
      throw new Error(ERRORS.FIELD_PRICE.ERROR_CODE);
    }
  }

  if (fields.stock !== undefined && fields.stock !== null) {
    if (typeof fields.stock !== "number") {
      throw new Error(ERRORS.FIELD_STOCK.ERROR_CODE);
    }
  }

  if (fields.status !== undefined && fields.status !== null) {
    if (typeof fields.status !== "boolean") {
      throw new Error(ERRORS.FIELD_STATUS.ERROR_CODE);
    }
  }
}

export async function validateInputs(fields, options) {
  try {
    validateObject(fields, options.strict);

    if (options.strict) estrictInputs(fields);
    if (!options.strict) looseInputs(fields);
  } catch (err) {
    return {
      status_code: err.message,
      error: true,
    };
  }

  return {
    status_code: SUCCESS.FIELDS.STATUS,
    error: false,
  };
}

export function searchMatch(evalCode, arr) {
  try {
    const matchCode = arr.some((el) => el.code === evalCode);
    if (matchCode) throw new Error(ERRORS.FIELD_EXIST.ERROR_CODE);
  } catch (err) {
    return { status_code: err.message, error: true };
  }

  return {
    status_code: SUCCESS.FIELD.STATUS,
    error: false,
  };
}
