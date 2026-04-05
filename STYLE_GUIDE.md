# Babu Design System & Style Guide

This document outlines the visual design language, color palette, typography, and UI components for the **Babu** food ordering platform.

## **Visual Identity**

The design follows a "Progressive Native App" philosophy, blending the performance of a web application with the fluid interactions and aesthetic of a high-end mobile app.

### **Core Principles**
- **Clarity & Focus**: Minimalist layouts with high-contrast typography.
- **Fluid Interactions**: Smooth transitions and haptic-like animations.
- **Native-Like UI**: Bottom navigation for mobile, glassmorphic headers, and pill-shaped elements.
- **High-End Aesthetic**: Glassmorphism, subtle shadows, and vibrant accents.

---

## **Color Palette**

### **Primary Accents**
- **Primary (Orange)**: `#FF6B00` (Main accent, primary buttons, and active indicators)
- **Secondary (Orange Gradient)**: `bg-gradient-to-r from-[#FF6B00] to-[#FF8533]`
- **Glow/Shadow**: `rgba(255, 107, 0, 0.3)`

### **Surface Colors**
- **Background**: `#FFFFFF` (Light) / `#0F172A` (Dark)
- **Glassmorphism**: `rgba(255, 255, 255, 0.8)` with `backdrop-blur-2xl`
- **Charcoal (Hero/Dark Surfaces)**: `#1A1A1A`

### **Typography Colors**
- **Heading**: `#111827` (Light) / `#F9FAFB` (Dark)
- **Body**: `#4B5563` (Light) / `#9CA3AF` (Dark)
- **Muted**: `#9CA3AF`

---

## **Typography Hierarchy**

The system uses **Inter** (default) or **Black-weight sans-serifs** for a bold, high-end feel.

### **Headings**
- **Display**: `text-6xl font-black tracking-tighter` (Hero section)
- **Section**: `text-4xl font-black tracking-tight`
- **Sub-section**: `text-xl font-bold`

### **Navigation & Actions**
- **Primary Nav**: `text-[11px] font-black uppercase tracking-[0.25em]`
- **Buttons**: `text-[10px] font-black uppercase tracking-[0.2em]`
- **Badges**: `text-[9px] font-black uppercase tracking-widest`

---

## **Spacing & Layout**

### **Grid System**
- **Container**: Max-width `7xl` (1280px) with `px-4 sm:px-6 lg:px-8`
- **Gap (Standard)**: `gap-4` or `gap-6`
- **Gap (Large)**: `gap-10` (for navigation links)

### **Touch Targets**
- **Buttons**: Minimum height `44px` for accessibility.
- **Icons**: Minimum size `20px x 20px`.

---

## **UI Components**

### **Primary Navigation (TopNav)**
- **Behavior**: Fixed to the top across all screen sizes.
- **Style**: `bg-slate-900 dark:bg-black` for maximum visibility against varied backgrounds.
- **Interaction**: Scale-down effect on tap with active indicator dots.
- **Text/Icons**: High-contrast `text-slate-400` (inactive) and `text-primary` (active).
- **Responsive**: Centered layout with increased padding on larger screens.

### **Buttons (Pill-Style)**
- **Primary**: Pill-shaped with a vibrant gradient and subtle glow.
- **Secondary**: Pill-shaped with a subtle border and high-contrast text.

---

## **Usage Examples**

### **Primary Navigation (TopNav)**
```tsx
<nav className="fixed top-0 left-0 right-0 z-[100]">
  <div className="absolute inset-0 bg-slate-900 dark:bg-black border-b border-slate-800 shadow-lg" />
  <div className="relative max-w-7xl mx-auto flex items-center justify-around h-[72px]">
    {/* Nav Items */}
  </div>
</nav>
```

### **Primary Action Button**
```tsx
<button className="bg-gradient-to-r from-primary to-orange-500 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
  Order Now
</button>
```

---

## **Accessibility (WCAG 2.1)**
- **Contrast**: All text elements meet a minimum 4.5:1 ratio against their background.
- **ARIA**: Semantic elements (`header`, `nav`, `main`, `footer`) used throughout.
- **Keyboard**: Full focus visibility and keyboard navigation support.
- **Labels**: `aria-label` and `aria-current` used on all interactive elements.
