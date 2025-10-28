export interface DateTimeProvider {
  getCurrentDay(timezone: string): string;

  getCurrentTime(timezone: string): string;

  formatDateTime(timezone: string, format?: string): string;
}
