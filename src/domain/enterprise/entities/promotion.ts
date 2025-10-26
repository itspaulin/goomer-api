import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface PromotionProps {
  description: string;
  promotional_price: number;
  days: string[];
  start_time: string;
  end_time: string;
  created_at: Date;
  updated_at?: Date | null;
}

export class Promotion extends Entity<PromotionProps> {
  get description() {
    return this.props.description;
  }

  get promotional_price() {
    return this.props.promotional_price;
  }

  get days() {
    return this.props.days;
  }

  get start_time() {
    return this.props.start_time;
  }

  get end_time() {
    return this.props.end_time;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  private touch() {
    this.props.updated_at = new Date();
  }

  set description(description: string) {
    this.props.description = description;
    this.touch();
  }

  set promotional_price(promotional_price: number) {
    this.props.promotional_price = promotional_price;
    this.touch();
  }

  set days(days: string[]) {
    this.props.days = days;
    this.touch();
  }

  set start_time(start_time: string) {
    this.props.start_time = start_time;
    this.touch();
  }

  set end_time(end_time: string) {
    this.props.end_time = end_time;
    this.touch();
  }

  isActive(currentDay: string, currentTime: string): boolean {
    if (!this.days.includes(currentDay)) {
      return false;
    }

    return currentTime >= this.start_time && currentTime <= this.end_time;
  }

  static create(
    props: Optional<PromotionProps, "created_at">,
    id?: UniqueEntityId
  ) {
    const promotion = new Promotion(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
        updated_at: props.updated_at ?? new Date(),
      },
      id
    );
    return promotion;
  }
}
