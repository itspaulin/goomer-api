import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface ProductProps {
  name: string;
  price: number;
  category: "Entradas" | "Pratos principais" | "Sobremesas" | "Bebidas";
  visible: boolean;
  order: number;
  created_at: Date;
  updated_at: Date;
}

export class Product extends Entity<ProductProps> {
  get name() {
    return this.props.name;
  }

  get price() {
    return this.props.price;
  }

  get category() {
    return this.props.category;
  }

  get visible() {
    return this.props.visible;
  }

  get order() {
    return this.props.order;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  set name(value: string) {
    this.props.name = value;
    this.props.updated_at = new Date();
  }

  set price(value: number) {
    this.props.price = value;
    this.props.updated_at = new Date();
  }

  set category(
    value: "Entradas" | "Pratos principais" | "Sobremesas" | "Bebidas"
  ) {
    this.props.category = value;
    this.props.updated_at = new Date();
  }

  set visible(value: boolean) {
    this.props.visible = value;
    this.props.updated_at = new Date();
  }

  set order(value: number) {
    this.props.order = value;
    this.props.updated_at = new Date();
  }

  static create(props: ProductProps, id?: UniqueEntityId) {
    const product = new Product(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
        updated_at: props.updated_at ?? new Date(),
      },
      id
    );
    return product;
  }
}
