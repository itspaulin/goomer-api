export class DateUtils {
  static getDayName(date: Date): string {
    if (!date) {
      return "";
    }

    const days = [
      "domingo",
      "segunda-feira",
      "terça-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sábado",
    ];
    return days[date.getDay()]!;
  }

  static formatTime(date: Date): string {
    if (!date) {
      return "";
    }

    return date.toTimeString().slice(0, 5);
  }
}
