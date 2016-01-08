export class RenderError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RenderError';
    Error.captureStackTrace(this, RenderError);
  }
}
