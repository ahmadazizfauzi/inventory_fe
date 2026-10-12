"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import AppTypography from "../typography/AppTypography";
import { X } from "lucide-react";

export interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  footer?: React.ReactNode;
  centered?: boolean;
}

const sizeClassMap = {
  sm: "modal-sm",
  md: "",
  lg: "modal-lg",
  xl: "modal-xl",
};

export default function AppModal({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
  footer,
  centered = true,
}: AppModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050, backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        style={{ zIndex: 1055 }}
        onClick={onClose}
      >
        <div
          className={cn(
            "modal-dialog",
            sizeClassMap[size],
            centered && "modal-dialog-centered"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="modal-content border shadow-lg rounded-3"
            style={{
              backgroundColor: "var(--app-surface)",
              borderColor: "var(--app-border)",
            }}
          >
            {title && (
              <div
                className="modal-header py-3 px-4 border-bottom d-flex align-items-center justify-content-between"
                style={{ borderColor: "var(--app-border)" }}
              >
                <AppTypography variant="h3" tone="primary" className="modal-title m-0">
                  {title}
                </AppTypography>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary border-0 p-1 rounded-circle"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="modal-body p-4">{children}</div>
            {footer && (
              <div
                className="modal-footer py-3 px-4 border-top"
                style={{ borderColor: "var(--app-border)" }}
              >
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
