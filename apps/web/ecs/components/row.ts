import { createComponentSchema } from "@modularcloud/ecs";
import { z } from "zod";

const CellSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("standard"),
    payload: z.union([z.string(), z.number()]).nullish(),
  }),
  z.object({
    type: z.literal("status"),
    payload: z.coerce.boolean(),
  }),
  z.object({
    type: z.literal("badge"),
    payload: z.object({
      text: z.string(),
      extraCount: z.number().optional(),
    }),
  }),
  z.object({
    type: z.literal("icon"),

    // TODO: create a central list of all icons
    payload: z.enum(["SUCCESS", "FAILURE"]),
  }),
]);

const ColumnSchema = z.object({
  columnLabel: z.string(),
  hiddenOnMobile: z.boolean().optional(),
  hiddenOnDesktop: z.boolean().optional(),
  showOnlyIfDifferent: z.boolean().optional(),
});

const RowSchema = z
  .object({
    cell: CellSchema,
    column: ColumnSchema,
  })
  .array();

export const RowComponent = createComponentSchema(RowSchema, "row");