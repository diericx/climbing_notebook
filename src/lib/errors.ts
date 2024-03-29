export class APIError extends Error {
  detail = '';
  message: ErrorMessage = 'UNKNOWN';
  constructor(errorMsg: ErrorMessage, detail?: string) {
    super(errorMsg);
    if (detail == undefined) {
      if (errorMsg == 'INVALID_ACTION') {
        this.detail = 'Unrecognized action';
      } else if (errorMsg == 'INVALID_INPUT') {
        this.detail = 'Something was not entered correctly';
      } else if (errorMsg == 'INVALID_PERMISSIONS') {
        this.detail = 'You do not have permission to perform this action';
      } else if (errorMsg == 'NOT_FOUND') {
        this.detail = 'That object was not found';
      } else if (errorMsg == 'UNIQUENESS_COLLISION') {
        this.detail = 'An object already exists with these unique attributes';
      } else if (errorMsg == 'UNKNOWN') {
        this.detail = 'An unknown error occured';
      }
    } else {
      this.detail = detail;
    }
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
