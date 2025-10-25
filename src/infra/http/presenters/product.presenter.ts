import { Product } from "@/domain/enterprise/entities/product";

export class ProductPresenter {
  static toHTTP(product: Product) {
    return {
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      category: product.category,
      visible: product.visible,
      order: product.order,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  }

  static toHTTPList(products: Product[]) {
    return products.map(this.toHTTP);
  }
}
