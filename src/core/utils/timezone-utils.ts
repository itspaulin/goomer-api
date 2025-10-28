export class TimezoneUtils {
  static readonly VALID_TIMEZONES = [
    "America/Sao_Paulo",
    "America/Manaus",
    "America/Rio_Branco",
    "America/Noronha",
  ] as const;

  static readonly DEFAULT_TIMEZONE = "America/Sao_Paulo";

  static isValidTimezone(timezone: string): boolean {
    return this.VALID_TIMEZONES.includes(
      timezone as (typeof this.VALID_TIMEZONES)[number]
    );
  }

  static isTimeInRange(
    currentTime: string,
    startTime: string,
    endTime: string
  ): boolean {
    const current = this.timeToMinutes(currentTime);
    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);

    if (start <= end) {
      return current >= start && current <= end;
    }

    return current >= start || current <= end;
  }

  static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours! * 60 + minutes!;
  }

  static isValidTimeFormat(time: string): boolean {
    const regex = /^([0-1][0-9]|2[0-3]):(00|15|30|45)$/;
    return regex.test(time);
  }

  static isValidTimeRange(startTime: string, endTime: string): boolean {
    if (
      !this.isValidTimeFormat(startTime) ||
      !this.isValidTimeFormat(endTime)
    ) {
      return false;
    }
    return true;
  }

  static normalizeTimezone(timezone?: string): string {
    if (!timezone) {
      return this.DEFAULT_TIMEZONE;
    }

    const isValid = this.isValidTimezone(timezone);

    if (isValid) {
      return timezone;
    }

    return this.DEFAULT_TIMEZONE;
  }
}
