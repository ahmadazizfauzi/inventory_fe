"use client";

import React, { useState, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

const alertVariants = cva(
  "alert d-flex align-items-start gap-2 py-3 px-3 rounded-3 border shadow-sm transition-all position-relative overflow-hidden",
  {
    variants: {
      variant: {
        primary: "alert-primary",
        success: "alert-success",
        danger: "alert-danger",
        warning: "alert-warning",
        info: "alert-info",
        secondary: "alert-secondary",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>["variant"]>;

export interface AppAlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  autoClose?: boolean;
  duration?: number;
}

const defaultIcons: Record<string, React.ReactNode> = {
  primary: <Info className="flex-shrink-0" size={18} />,
  info: <Info className="flex-shrink-0" size={18} />,
  success: <CheckCircle2 className="flex-shrink-0" size={18} />,
  warning: <AlertTriangle className="flex-shrink-0" size={18} />,
  danger: <AlertCircle className="flex-shrink-0" size={18} />,
  secondary: <Info className="flex-shrink-0" size={18} />,
};

export default function AppAlert({
  className,
  variant = "info",
  title,
  dismissible = false,
  onDismiss,
  icon,
  autoClose = false,
  duration = 5000,
  children,
  ...props
}: AppAlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!autoClose || !duration) return;
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [autoClose, duration, onDismiss]);

  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
    onDismiss?.();
  };

  const renderedIcon = icon ?? defaultIcons[variant ?? "info"];

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {renderedIcon}
      <div className="flex-grow-1 pe-2">
        {title && <h6 className="alert-heading fw-bold mb-1 fs-6">{title}</h6>}
        <div className="small lh-base">{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={handleClose}
          className="btn-close p-1 ms-auto"
          aria-label="Close"
        />
      )}

      {/* 5-second countdown progress bar */}
      {autoClose && duration > 0 && (
        <div
          className="position-absolute bottom-0 start-0"
          style={{
            height: 3,
            backgroundColor: "currentColor",
            opacity: 0.5,
            animation: `alertCountdown ${duration}ms linear forwards`,
          }}
        />
      )}
    </div>
  );
}

export { alertVariants };
