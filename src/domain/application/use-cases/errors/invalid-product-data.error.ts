export class InvalidProductDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidProductDataError";
  }
}
