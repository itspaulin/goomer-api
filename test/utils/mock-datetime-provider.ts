import { DateTimeProvider } from "@/domain/application/providers/datetime-provider";

export class MockDateTimeProvider implements DateTimeProvider {
  getCurrentDay = vi.fn();
  getCurrentTime = vi.fn();
  formatDateTime = vi.fn();
}
