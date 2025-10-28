import { describe, it, expect } from "vitest";
import { TimezoneUtils } from "./timezone-utils";

describe("TimezoneUtils", () => {
  describe("isValidTimezone", () => {
    it("should validate Brazilian timezones", () => {
      expect(TimezoneUtils.isValidTimezone("America/Sao_Paulo")).toBe(true);
      expect(TimezoneUtils.isValidTimezone("America/Manaus")).toBe(true);
      expect(TimezoneUtils.isValidTimezone("America/Rio_Branco")).toBe(true);
      expect(TimezoneUtils.isValidTimezone("America/Noronha")).toBe(true);
    });

    it("should reject invalid timezones", () => {
      expect(TimezoneUtils.isValidTimezone("Invalid/Timezone")).toBe(false);
      expect(TimezoneUtils.isValidTimezone("")).toBe(false);
      expect(TimezoneUtils.isValidTimezone("Not/A/Timezone")).toBe(false);
    });
  });

  describe("isValidTimeFormat", () => {
    it("should accept valid times with 15min intervals", () => {
      expect(TimezoneUtils.isValidTimeFormat("00:00")).toBe(true);
      expect(TimezoneUtils.isValidTimeFormat("00:15")).toBe(true);
      expect(TimezoneUtils.isValidTimeFormat("00:30")).toBe(true);
      expect(TimezoneUtils.isValidTimeFormat("00:45")).toBe(true);
      expect(TimezoneUtils.isValidTimeFormat("12:00")).toBe(true);
      expect(TimezoneUtils.isValidTimeFormat("23:45")).toBe(true);
    });

    it("should reject invalid time formats", () => {
      expect(TimezoneUtils.isValidTimeFormat("00:10")).toBe(false);
      expect(TimezoneUtils.isValidTimeFormat("00:05")).toBe(false);
      expect(TimezoneUtils.isValidTimeFormat("24:00")).toBe(false);
      expect(TimezoneUtils.isValidTimeFormat("12:60")).toBe(false);
      expect(TimezoneUtils.isValidTimeFormat("1:00")).toBe(false);
      expect(TimezoneUtils.isValidTimeFormat("12:0")).toBe(false);
    });
  });

  describe("isTimeInRange", () => {
    it("should validate normal time ranges", () => {
      expect(TimezoneUtils.isTimeInRange("12:00", "10:00", "14:00")).toBe(true);
      expect(TimezoneUtils.isTimeInRange("10:00", "10:00", "14:00")).toBe(true);
      expect(TimezoneUtils.isTimeInRange("14:00", "10:00", "14:00")).toBe(true);
      expect(TimezoneUtils.isTimeInRange("09:59", "10:00", "14:00")).toBe(
        false
      );
      expect(TimezoneUtils.isTimeInRange("14:01", "10:00", "14:00")).toBe(
        false
      );
    });

    it("should handle ranges crossing midnight", () => {
      expect(TimezoneUtils.isTimeInRange("23:30", "23:00", "02:00")).toBe(true);
      expect(TimezoneUtils.isTimeInRange("00:00", "23:00", "02:00")).toBe(true);
      expect(TimezoneUtils.isTimeInRange("01:30", "23:00", "02:00")).toBe(true);
      expect(TimezoneUtils.isTimeInRange("02:00", "23:00", "02:00")).toBe(true);
      expect(TimezoneUtils.isTimeInRange("02:01", "23:00", "02:00")).toBe(
        false
      );
      expect(TimezoneUtils.isTimeInRange("22:59", "23:00", "02:00")).toBe(
        false
      );
    });
  });

  describe("isValidTimeRange", () => {
    it("should validate time ranges", () => {
      expect(TimezoneUtils.isValidTimeRange("10:00", "14:00")).toBe(true);
      expect(TimezoneUtils.isValidTimeRange("23:00", "02:00")).toBe(true);
      expect(TimezoneUtils.isValidTimeRange("00:00", "23:45")).toBe(true);
    });

    it("should reject invalid formats", () => {
      expect(TimezoneUtils.isValidTimeRange("10:05", "14:00")).toBe(false);
      expect(TimezoneUtils.isValidTimeRange("10:00", "14:05")).toBe(false);
      expect(TimezoneUtils.isValidTimeRange("25:00", "14:00")).toBe(false);
    });
  });

  describe("normalizeTimezone", () => {
    it("should return default if no timezone provided", () => {
      expect(TimezoneUtils.normalizeTimezone()).toBe("America/Sao_Paulo");
      expect(TimezoneUtils.normalizeTimezone(undefined)).toBe(
        "America/Sao_Paulo"
      );
    });

    it("should return valid timezone", () => {
      expect(TimezoneUtils.normalizeTimezone("America/Manaus")).toBe(
        "America/Manaus"
      );
    });

    it("should fallback to default for invalid timezones", () => {
      expect(TimezoneUtils.normalizeTimezone("Invalid/Timezone")).toBe(
        "America/Sao_Paulo"
      );
    });
  });

  describe("timeToMinutes", () => {
    it("should convert time to minutes", () => {
      expect(TimezoneUtils.timeToMinutes("00:00")).toBe(0);
      expect(TimezoneUtils.timeToMinutes("01:00")).toBe(60);
      expect(TimezoneUtils.timeToMinutes("12:30")).toBe(750);
      expect(TimezoneUtils.timeToMinutes("23:45")).toBe(1425);
    });
  });
});
