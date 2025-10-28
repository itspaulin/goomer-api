import { DateTime } from "luxon";
import { DateTimeProvider } from "@/domain/application/providers/datetime-provider";

export class LuxonDateTimeProvider implements DateTimeProvider {
  private readonly dayMap: Record<number, string> = {
    1: "segunda-feira",
    2: "terça-feira",
    3: "quarta-feira",
    4: "quinta-feira",
    5: "sexta-feira",
    6: "sábado",
    7: "domingo",
  };

  getCurrentDay(timezone: string): string {
    try {
      const now = DateTime.now().setZone(timezone);
      if (!now.isValid) {
        console.warn(`Timezone inválido: ${timezone}, usando padrão`);
        return this.dayMap[DateTime.now().weekday]!;
      }
      return this.dayMap[now.weekday]!;
    } catch (error) {
      console.warn(`Erro ao obter dia para timezone ${timezone}:`, error);
      return this.dayMap[DateTime.now().weekday]!;
    }
  }

  getCurrentTime(timezone: string): string {
    try {
      const now = DateTime.now().setZone(timezone);
      if (!now.isValid) {
        console.warn(`Timezone inválido: ${timezone}, usando padrão`);
        return DateTime.now().toFormat("HH:mm");
      }
      return now.toFormat("HH:mm");
    } catch (error) {
      console.warn(`Erro ao obter hora para timezone ${timezone}:`, error);
      return DateTime.now().toFormat("HH:mm");
    }
  }

  formatDateTime(
    timezone: string,
    format: string = "dd/MM/yyyy HH:mm:ss"
  ): string {
    try {
      const now = DateTime.now().setZone(timezone);
      return now.isValid
        ? now.toFormat(format)
        : DateTime.now().toFormat(format);
    } catch (error) {
      return DateTime.now().toFormat(format);
    }
  }
}
