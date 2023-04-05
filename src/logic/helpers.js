import { ERRORS } from "../mocks/messages.js";

export function sanitise(x) {
  const num = parseInt(Number(x));
  if (isNaN(num)) throw new Error(ERRORS.QUERY_NOT_NUMBER.ERROR_CODE);
  if (num === 0) return num + 1;
  return num;
}

export function limitProducts(arr, queryLimit = 5, queryPage = 1) {
  const limit = sanitise(queryLimit);
  const page = sanitise(queryPage);

  let sliceArr = [];
  if (page === 1) sliceArr = arr.splice(0, limit);
  if (page !== 1) sliceArr = arr.splice(limit * (page - 1), limit);
  return {
    limit,
    page,
    products: sliceArr,
  };
}

export function getMax(arr) {
  if (Array.isArray(arr)) {
    if (arr.length === 0) return 0;
    const nums = arr.map((item) => item.ref);
    return Math.max(...nums);
  }
}
