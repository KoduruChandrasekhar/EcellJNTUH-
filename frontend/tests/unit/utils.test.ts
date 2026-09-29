import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("rounded-full", "border")).toBe("rounded-full border");
  });

  it("drops falsy values so conditional classes are safe", () => {
    expect(cn("border", false && "hidden", undefined, null, "p-4")).toBe("border p-4");
  });

  it("lets the last Tailwind class win when two conflict", () => {
    // This is the behaviour every component relies on: a caller's className
    // must be able to override a component's own default.
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-ink", "text-paper")).toBe("text-paper");
  });
});
