export class APIError extends Error {
  detail: string = "";
  message: ErrorMessage = "UNKNOWN";
  constructor(errorMsg: ErrorMessage, detail?: string) {
    super(errorMsg);
    this.detail = detail || "";
    this.message = errorMsg || "UNKNOWN";
  };
}
export type ErrorMessage = "UNKNOWN" | "UNIQUENESS_COLLISION" | "NOT_FOUND" | "INVALID_PERMISSIONS";
export { };
