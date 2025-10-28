import { ProductRepository } from "@/domain/application/repositories/product-repository";
import { Product, ProductProps } from "@/domain/enterprise/entities/product";

export class InMemoryProductRepository implements ProductRepository {
  public items: Product[] = [];

  async create(product: Product): Promise<Product> {
    this.items.push(product);
    return product;
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id.toString() === id);
    return product || null;
  }

  async findByName(name: string): Promise<Product | null> {
    const product = this.items.find((item) => item.name === name);
    return product || null;
  }

  async findAll(): Promise<Product[]> {
    return this.items;
  }

  async findAllVisible(): Promise<Product[]> {
    return this.items
      .filter((item) => item.visible)
      .sort((a, b) => a.order - b.order);
  }

  async update(id: string, data: Partial<ProductProps>): Promise<Product> {
    const product = this.items.find((item) => item.id.toString() === id);

    if (!product) {
      throw new Error("Product not found");
    }

    if (data.name !== undefined) {
      product.name = data.name;
    }
    if (data.price !== undefined) {
      product.price = data.price;
    }
    if (data.category !== undefined) {
      product.category = data.category;
    }
    if (data.visible !== undefined) {
      product.visible = data.visible;
    }
    if (data.order !== undefined) {
      product.order = data.order;
    }

    product["props"].updated_at = new Date();

    return product;
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === id);

    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}
