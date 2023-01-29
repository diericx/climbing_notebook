// added this interface
export interface FormEventHandler<T> {
  target: EventTarget | null;
}

export const SERVER_ERROR = "There was an error on our end. Please try again later.";
