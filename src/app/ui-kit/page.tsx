"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Palette,
  Type,
  MousePointerClick,
  BarChart3,
  Tag,
  TextCursorInput,
  Table,
  Bell,
  Search,
  Check,
  Copy,
  Menu,
  X,
  Code2,
  Boxes,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import ThemeToggle from "@/components/buttons/ThemeToggle";
import AppTypography from "@/components/typography/AppTypography";
import AppBadge from "@/components/badges/AppBadge";
import ColorsSection from "@/app/showcase-sections/ColorsSection";
import TypographySection from "@/app/showcase-sections/TypographySection";
import ButtonsSection from "@/app/showcase-sections/ButtonsSection";
import CardsSection from "@/app/showcase-sections/CardsSection";
import BadgesSection from "@/app/showcase-sections/BadgesSection";
import InputsSection from "@/app/showcase-sections/InputsSection";
import PageHeaderSection from "@/app/showcase-sections/PageHeaderSection";
import TablesSection from "@/app/showcase-sections/TablesSection";
import FeedbackSection from "@/app/showcase-sections/FeedbackSection";
import SidebarSection from "@/app/showcase-sections/SidebarSection";
import SkeletonSection from "@/app/showcase-sections/SkeletonSection";
import PaginationSection from "@/app/showcase-sections/PaginationSection";
import { LayoutDashboard, Compass, ListOrdered } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: "colors", label: "Colors (Design Tokens)", icon: <Palette size={16} /> },
  { id: "typography", label: "AppTypography.tsx", icon: <Type size={16} /> },
  { id: "buttons", label: "AppButton.tsx", icon: <MousePointerClick size={16} /> },
  { id: "cards", label: "AppStatCard.tsx & AppCard", icon: <BarChart3 size={16} /> },
  { id: "badges", label: "AppBadge.tsx", icon: <Tag size={16} /> },
  { id: "inputs", label: "AppInput.tsx & Dropdown", icon: <TextCursorInput size={16} /> },
  { id: "page-header", label: "AppPageHeader.tsx", icon: <Compass size={16} /> },
  { id: "tables", label: "AppTable.tsx", icon: <Table size={16} /> },
  { id: "pagination", label: "AppPagination.tsx", icon: <ListOrdered size={16} /> },
  { id: "feedback", label: "AppAlert.tsx & AppModal", icon: <Bell size={16} /> },
  { id: "skeleton", label: "AppSkeleton.tsx", icon: <Loader2 size={16} /> },
  { id: "sidebar", label: "AppSidebar.tsx", icon: <LayoutDashboard size={16} /> },
];

export default function UIKitPage() {
  const [activeSection, setActiveSection] = useState("colors");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedImport, setCopiedImport] = useState(false);

  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic Scrollspy: Update activeSection on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      let current = navItems[0]?.id || "";

      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            current = item.id;
          }
        }
      }
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const copyImportSnippet = () => {
    navigator.clipboard.writeText(
      'import { AppTypography, AppButton, AppStatCard, AppCard, AppBadge, AppInput, AppDropdown, AppSelect, AppTextarea, AppTable, AppPagination, AppAlert, AppModal, AppSidebar, AppBreadcrumb, AppSkeleton } from "@/components";'
    );
    setCopiedImport(true);
    setTimeout(() => setCopiedImport(false), 2000);
  };

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100 font-body">
      {/* Mobile Top Header */}
      <div
        className="d-flex d-md-none align-items-center justify-content-between p-3 border-bottom position-sticky top-0 bg-body"
        style={{ zIndex: 1040, borderColor: "var(--app-border)" }}
      >
        <div className="d-flex align-items-center gap-2">
          <Link
            href="/dashboard"
            className="btn btn-outline-secondary btn-sm p-1.5 d-inline-flex align-items-center text-decoration-none rounded-2 me-1"
            style={{ borderColor: "var(--app-border)" }}
            title="Kembali ke Dashboard Backoffice"
          >
            <ArrowLeft size={16} />
          </Link>
          <AppTypography variant="h3" tone="primary" className="m-0">
            UI Kit
          </AppTypography>
        </div>
        <div className="d-flex align-items-center gap-2">
          <ThemeToggle size="sm" />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-outline-secondary btn-sm p-1.5 d-flex align-items-center rounded-2"
            style={{ borderColor: "var(--app-border)" }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-md-none"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(3px)",
            zIndex: 1042,
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`position-fixed top-0 bottom-0 start-0 border-end d-flex flex-column transition-transform bg-body ${
          mobileMenuOpen ? "d-flex" : "d-none d-md-flex"
        }`}
        style={{
          width: 280,
          zIndex: 1045,
          borderColor: "var(--app-border)",
        }}
      >
        {/* Brand Title */}
        <div
          className="d-flex align-items-center justify-content-between px-3 border-bottom flex-shrink-0"
          style={{ borderColor: "var(--app-border)", height: 56 }}
        >
          <div className="d-flex align-items-center gap-2">
            <span
              className="rounded-circle"
              style={{
                width: 8,
                height: 8,
                backgroundColor: "var(--app-primary)",
                boxShadow: "0 0 8px var(--app-primary)",
              }}
            />
            <span className="fw-bold" style={{ fontSize: "0.95rem", color: "var(--app-text-primary)" }}>
              UI Kit Showcase
            </span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <span
              className="badge rounded-pill fw-medium me-1"
              style={{
                fontSize: "0.6875rem",
                backgroundColor: "rgba(99, 102, 241, 0.12)",
                color: "var(--app-primary)",
              }}
            >
              v1.0
            </span>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary p-1 rounded-circle d-md-none"
              style={{ borderColor: "var(--app-border)", width: 26, height: 26 }}
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Tutup menu"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="p-3 border-bottom flex-shrink-0" style={{ borderColor: "var(--app-border)" }}>
          <div className="position-relative">
            <Search
              size={13}
              className="position-absolute top-50 start-0 translate-middle-y ms-2.5 pointer-events-none text-muted"
            />
            <input
              type="text"
              placeholder="Cari komponen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control form-control-sm ps-4 rounded-2 border"
              style={{
                fontSize: "0.8125rem",
                backgroundColor: "var(--app-surface)",
                borderColor: "var(--app-border)",
                color: "var(--app-text-primary)",
              }}
            />
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-grow-1 overflow-y-auto p-2 d-flex flex-column gap-1">
          {filteredNavItems.length > 0 ? (
            filteredNavItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  type="button"
                  className="btn d-flex align-items-center w-100 text-start py-2.5 px-3 transition-all border-0 rounded-2"
                  style={{
                    fontSize: "0.8125rem",
                    letterSpacing: "-0.01em",
                    borderRadius: "6px",
                    backgroundColor: isActive ? "rgba(99, 102, 241, 0.12)" : "transparent",
                    color: isActive ? "var(--app-primary)" : "var(--app-text-secondary)",
                    borderLeft: isActive ? "3px solid var(--app-primary)" : "3px solid transparent",
                    fontWeight: isActive ? 600 : 400,
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "var(--app-surface-subtle)";
                      e.currentTarget.style.color = "var(--app-text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--app-text-secondary)";
                    }
                  }}
                >
                  <span
                    className="d-flex align-items-center justify-content-center flex-shrink-0 me-3"
                    style={{
                      width: 20,
                      height: 20,
                      color: isActive ? "var(--app-primary)" : "var(--app-text-muted)",
                      transition: "color 0.15s ease",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className="text-truncate">{item.label}</span>
                </button>
              );
            })
          ) : (
            <div className="p-3 text-center small text-muted font-mono">
              Tidak ada komponen ditemukan
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow-1 min-vh-100 d-flex flex-column ui-kit-main">

        {/* Desktop Sticky Header */}
        <header
          className="d-none d-md-flex align-items-center justify-content-between px-4 border-bottom position-sticky top-0 bg-body"
          style={{
            zIndex: 1030,
            height: 65,
            borderColor: "var(--app-border)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="d-flex align-items-center gap-3 font-mono small text-secondary">
            <Link
              href="/dashboard"
              className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1.5 font-mono rounded-2 text-decoration-none me-2"
              style={{ borderColor: "var(--app-border)", color: "var(--app-text-primary)" }}
              title="Kembali ke Dashboard Backoffice"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Panel</span>
            </Link>
            <div className="d-flex align-items-center gap-2">
              <Code2 size={16} className="text-primary" />
              <span className="text-body fw-semibold">Enterprise Design System</span>
              <span>/</span>
              <span className="text-primary fw-bold font-mono">{activeSection}</span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              onClick={copyImportSnippet}
              className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1 font-mono rounded-2"
              style={{ borderColor: "var(--app-border)" }}
              title="Salin statement import"
            >
              {copiedImport ? <Check size={14} className="text-success" /> : <Copy size={14} />}
              <span>{copiedImport ? "Tersalin!" : "Copy Imports"}</span>
            </button>
            <ThemeToggle size="sm" />
          </div>
        </header>

        {/* Canvas Body */}
        <div className="flex-grow-1 p-3 p-md-5" style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
          <ColorsSection />
          <TypographySection />
          <ButtonsSection />
          <CardsSection />
          <BadgesSection />
          <InputsSection />
          <PageHeaderSection />
          <TablesSection />
          <PaginationSection />
          <FeedbackSection />
          <SkeletonSection />
          <SidebarSection />
        </div>
      </main>
    </div>
  );
}
