export interface ProductWithPromotion {
  id: string;
  name: string;
  price: number;
  promotional_price?: number;
  category: string;
  promotion?: {
    description: string;
    active: boolean;
  };
}

export interface MenuByCategory {
  category: string;
  products: ProductWithPromotion[];
}

export class MenuUtils {
  static groupByCategory(products: ProductWithPromotion[]): MenuByCategory[] {
    const grouped = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category]!.push(product);
      return acc;
    }, {} as Record<string, ProductWithPromotion[]>);

    return Object.entries(grouped).map(([category, products]) => ({
      category,
      products,
    }));
  }
}
