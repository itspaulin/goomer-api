export class InvalidPromotionalPriceError extends Error {
  constructor(message: string = "Invalid promotional price") {
    super(message);
    this.name = "InvalidPromotionalPriceError";
    Object.setPrototypeOf(this, InvalidPromotionalPriceError.prototype);
  }
}
