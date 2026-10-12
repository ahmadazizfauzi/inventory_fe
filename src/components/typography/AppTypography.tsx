"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("antialiased", {
  variants: {
    variant: {
      // Big Stat / Hero Display
      display: "font-display fs-1 fw-bold tracking-tight lh-1",
      // Heading 1 / Main Page Title
      h1: "font-display fs-2 fw-bold tracking-tight lh-sm",
      pageTitle: "font-display fs-3 fw-bold tracking-tight lh-sm",
      // Heading 2 / Section Heading
      h2: "font-display fs-4 fw-bold tracking-tight",
      sectionTitle: "font-display fs-5 fw-semibold tracking-tight",
      // Heading 3 / Card Heading
      h3: "font-display fs-5 fw-semibold",
      cardTitle: "font-display fs-6 fw-semibold",
      // Heading 4 / Subgroup Title
      h4: "font-display fs-6 fw-semibold text-uppercase tracking-wide",
      // Page Subtitle / Descriptive lead
      pageSubtitle: "font-body fs-6 fw-normal lh-base",
      lead: "font-body fs-5 fw-normal lh-base",
      // Standard Body
      body: "font-body fs-6 fw-normal lh-base",
      // Compact Body
      bodySm: "font-body small fw-normal lh-base",
      // Caption / Microcopy
      caption: "font-body small lh-normal",
      // Table column headers
      tableHeader: "font-body text-uppercase fw-semibold tracking-wider small",
      // Stat / Metric numeric values (Monospace font for financial alignment)
      statValue: "font-mono fs-4 fw-bold tracking-tight lh-1 text-nowrap",
      // Stat label above the number
      statLabel: "font-body small text-uppercase fw-semibold tracking-wider",
      // Monospace timestamp, IDs, SKU
      meta: "font-mono small lh-normal",
      // Code or endpoint pill text
      mono: "font-mono small py-0 px-1 rounded",
      // Uppercase UI label
      label: "font-body small text-uppercase fw-semibold tracking-wider",
      // Eyebrow label
      eyebrow: "font-mono small text-uppercase fw-bold tracking-wider",
    },
    weight: {
      light: "fw-light",
      normal: "fw-normal",
      medium: "fw-medium",
      semibold: "fw-semibold",
      bold: "fw-bold",
    },
    tone: {
      primary: "text-body",
      secondary: "text-secondary",
      muted: "text-muted",
      accent: "text-primary",
      info: "text-info",
      success: "text-success",
      danger: "text-danger",
      warning: "text-warning",
    },
  },
  defaultVariants: {
    variant: "body",
    tone: "primary",
  },
});

export type TypographyVariant = NonNullable<VariantProps<typeof typographyVariants>["variant"]>;
export type TypographyTone = NonNullable<VariantProps<typeof typographyVariants>["tone"]>;
export type TypographyWeight = NonNullable<VariantProps<typeof typographyVariants>["weight"]>;

export interface AppTypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    Omit<VariantProps<typeof typographyVariants>, "weight"> {
  as?: React.ElementType;
  htmlFor?: string;
  tone?: TypographyTone;
  color?: TypographyTone;
  weight?: TypographyWeight;
}

const defaultTagMap: Record<string, React.ElementType> = {
  display: "h1",
  h1: "h1",
  pageTitle: "h1",
  h2: "h2",
  sectionTitle: "h2",
  h3: "h3",
  cardTitle: "h3",
  h4: "h4",
  pageSubtitle: "p",
  lead: "p",
  body: "p",
  bodySm: "p",
  caption: "span",
  tableHeader: "span",
  statValue: "span",
  statLabel: "span",
  meta: "span",
  mono: "code",
  label: "span",
  eyebrow: "span",
};

export default function AppTypography({
  as,
  variant = "body",
  tone,
  color,
  weight,
  className,
  children,
  ...props
}: AppTypographyProps) {
  const Tag = as ?? defaultTagMap[variant ?? "body"] ?? "p";
  const activeTone = (tone || color || "primary") as TypographyTone;

  return (
    <Tag
      className={cn(typographyVariants({ variant, tone: activeTone, weight }), className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

export { typographyVariants };
