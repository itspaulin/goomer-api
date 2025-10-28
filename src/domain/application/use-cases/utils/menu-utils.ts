export interface ProductWithPromotion {
  id: string;
  name: string;
  price: number;
  promotional_price?: number;
  category: string;
  order: number;
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
  private static readonly CATEGORY_ORDER: Record<string, number> = {
    Entradas: 1,
    "Pratos principais": 2,
    Sobremesas: 3,
    Bebidas: 4,
  };

  static groupByCategory(products: ProductWithPromotion[]): MenuByCategory[] {
    const grouped = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category]!.push(product);
      return acc;
    }, {} as Record<string, ProductWithPromotion[]>);

    return Object.entries(grouped)
      .map(([category, products]) => {
        const sortedProducts = products.sort((a, b) => {
          const orderDiff = (a.order ?? 999) - (b.order ?? 999);
          if (orderDiff !== 0) return orderDiff;
          return a.name.localeCompare(b.name);
        });
        return { category, products: sortedProducts };
      })
      .sort((a, b) => {
        const orderA = this.CATEGORY_ORDER[a.category] ?? 999;
        const orderB = this.CATEGORY_ORDER[b.category] ?? 999;
        return orderA - orderB;
      });
  }
}
