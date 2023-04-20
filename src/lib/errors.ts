export class APIError extends Error {
  detail = '';
  message: ErrorMessage = 'UNKNOWN';
  constructor(errorMsg: ErrorMessage, detail?: string) {
    super(errorMsg);
    this.detail = detail || '';
    this.message = errorMsg;
  };
}
export type ErrorMessage = 'UNKNOWN' | 'UNIQUENESS_COLLISION' | 'NOT_FOUND' | 'INVALID_PERMISSIONS';
export { };
