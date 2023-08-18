import { error } from '@sveltejs/kit';

export class APIError extends Error {
  detail = '';
  message: ErrorMessage = 'UNKNOWN';
  constructor(errorMsg: ErrorMessage, detail?: string) {
    super(errorMsg);
    this.detail = detail || '';
    this.message = errorMsg;
  }
}
export type ErrorMessage =
  | 'UNKNOWN'
  | 'UNIQUENESS_COLLISION'
  | 'NOT_FOUND'
  | 'INVALID_PERMISSIONS'
  | 'INVALID_INPUT'
  | 'INVALID_ACTION';
export {};

// Given an APIError, throw it correctly as a svelte HttpError
export function throwAPIErrorAsHttpError(e: APIError) {
  if (e instanceof APIError) {
    let code = 401;
    if (e.message === 'INVALID_PERMISSIONS') {
      code = 403;
    }
    if (e.message === 'NOT_FOUND') {
      code = 404;
    }
    throw error(code, {
      message: e.detail,
    });
  }
}
