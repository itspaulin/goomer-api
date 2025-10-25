export class ProductAlreadyExistsError extends Error {
  constructor(identifier?: string) {
    super(`Product ${identifier ? `"${identifier}"` : ""} already exists`);
    this.name = "ProductAlreadyExistsError";
  }
}
