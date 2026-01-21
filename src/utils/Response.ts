import { SUCCESS_RESPONSE, BAD_CODE, BAD_RESPONSE_MODAL, SUCCESS_RESPONSE_CODE } from '@constants/StatusCodes';

export const isCorrectResponse = (code = BAD_CODE): boolean => SUCCESS_RESPONSE.includes(code);
export const isErrorResponse = (code = SUCCESS_RESPONSE_CODE): boolean => BAD_RESPONSE_MODAL.includes(code);
