export class Time {
  private constructor(private readonly value: string) {}

  static create(time: string): Time | null {
    if (!/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
      return null;
    }

    const [hours, minutes] = time.split(":").map(Number);
    if (minutes === undefined || minutes % 15 !== 0) {
      return null;
    }

    return new Time(time);
  }

  toString(): string {
    return this.value;
  }

  isAfter(other: Time): boolean {
    return this.value > other.value;
  }

  isBefore(other: Time): boolean {
    return this.value < other.value;
  }

  equals(other: Time): boolean {
    return this.value === other.value;
  }
}
