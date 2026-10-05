import { parseContent, partnerSchema } from "./schema";
import { z } from "zod";

/**
 * Organisations the club has actually collaborated with.
 * TODO: real logos pending approval — the marquee shows styled wordmarks until then.
 */
export const partners = parseContent(
  z.array(partnerSchema),
  [
    {
      id: "aiesec-hyderabad",
      name: "AIESEC in Hyderabad",
      url: "https://aiesec.org/",
      order: 0,
    },
    {
      id: "ecell-iit-bombay",
      name: "E-Cell IIT Bombay · NEC 2025",
      url: "https://www.ecell.in/",
      order: 1,
    },
    {
      id: "hexawatts",
      name: "Hexawatts",
      url: "https://www.instagram.com/hexawatts/",
      order: 3,
    },
    {
      id: "jntuh-alumni-affairs",
      name: "JNTUH Directorate of Alumni Affairs",
      order: 2,
    },
  ],
  "partners.ts",
);
