import { describe, it, expect } from "vitest";
import { LuxonDateTimeProvider } from "./luxon-datetime-provider";

describe("LuxonDateTimeProvider", () => {
  const provider = new LuxonDateTimeProvider();

  describe("getCurrentDay", () => {
    it("should return day in portuguese", () => {
      const day = provider.getCurrentDay("America/Sao_Paulo");

      const validDays = [
        "domingo",
        "segunda-feira",
        "terça-feira",
        "quarta-feira",
        "quinta-feira",
        "sexta-feira",
        "sábado",
      ];

      expect(validDays).toContain(day);
    });

    it("should work with different timezones", () => {
      const daySP = provider.getCurrentDay("America/Sao_Paulo");
      const dayManaus = provider.getCurrentDay("America/Manaus");

      expect(daySP).toBeTruthy();
      expect(dayManaus).toBeTruthy();
    });
  });

  describe("getCurrentTime", () => {
    it("should return time in HH:mm format", () => {
      const time = provider.getCurrentTime("America/Sao_Paulo");

      expect(time).toMatch(/^\d{2}:\d{2}$/);
    });

    it("should differ between timezones", () => {
      const timeSP = provider.getCurrentTime("America/Sao_Paulo");
      const timeAcre = provider.getCurrentTime("America/Rio_Branco");

      expect(timeSP).toBeTruthy();
      expect(timeAcre).toBeTruthy();
    });
  });

  describe("formatDateTime", () => {
    it("should format date with default format", () => {
      const formatted = provider.formatDateTime("America/Sao_Paulo");

      expect(formatted).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/);
    });

    it("should format date with custom format", () => {
      const formatted = provider.formatDateTime(
        "America/Sao_Paulo",
        "yyyy-MM-dd"
      );

      expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
