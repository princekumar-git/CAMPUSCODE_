# Admin Navbar & Header CSS Documentation

## Overview
The admin panel uses a **modern Tailwind CSS + Embedded Styles** approach for styling the navbar and header. The `shared.css` and `styles.css` files in `/public/css/` are **NOT directly used by admin pages** — they appear to be legacy files or used by other modules.

---

## How Admin Uses Navbar & Header CSS

### 1. **CSS Sources (Priority Order)**

#### **Primary: Tailwind CSS (CDN)**
```html
<script src="https://cdn.tailwindcss.com"></script>
```
- **Source:** CDN, not local files
- **Used for:** All UI components (cards, buttons, layout, spacing, colors, responsive design)
- **Config:** Custom Tailwind config in `<script>` tag with:
  - Custom color palette (primary: #1E4A7A blue theme)
  - Dark mode support (`darkMode: 'class'`)
  - Poppins font family

#### **Secondary: Embedded Styles (in `<style>` tag)**
- **Source:** Inside each HTML file's `<head>`
- **Contains:**
  - Sidebar logic and animations
  - Navigation item styling
  - Scrollbar customization
  - Modal animations
  - Dark mode variants

#### **External Libraries**
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```
- **Font Awesome 6.4.0:** For icons
- **Google Fonts - Poppins:** For typography

---

## 2. **Admin Navbar Structure**

### Location in HTML
```html
<aside id="mainSidebar" class="sidebar w-64 bg-white dark:bg-gray-800 shadow-sm...">
  <!-- Logo -->
  <div class="p-6 flex-shrink-0 flex items-center justify-between h-[88px]">
    <h1>CampusCode</h1>
    <button id="sidebarToggleBtn"><!-- Toggle button --></button>
  </div>
  
  <!-- Navigation Menu -->
  <nav class="flex-1 px-4 space-y-1 overflow-y-auto mt-2">
    <a href="/college/dashboard" class="nav-item">
      <i class="fas fa-home"></i>
      <span>Home</span>
    </a>
    <!-- More items... -->
  </nav>
  
  <!-- Bottom Menu -->
  <div class="p-4 space-y-1 border-t... bottom-menu">
    <!-- Help & Settings -->
  </div>
</aside>
```

### Key CSS Classes (Embedded Styles)

#### **Sidebar Container**
```css
.sidebar {
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}
.sidebar.collapsed { width: 5rem; }
```
- **Width:** 16rem (w-64) in normal state → 5rem when collapsed
- **Animation:** 0.3s cubic-bezier for smooth resize

#### **Navigation Items**
```css
.nav-item {
    transition: all 0.2s ease;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    margin-bottom: 0.25rem;
    color: #374151;
    border-radius: 0.5rem;
    cursor: pointer;
    white-space: nowrap;
}

.nav-item:hover { background-color: #f3f4f6; }
.nav-item.active { 
    background-color: #d0e1f5; 
    color: #1e4a7a;
}

.nav-item.active::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 60%;
    width: 4px;
    background-color: #2e5e99;
    border-radius: 0 4px 4px 0;
}
```
- **Active State:** Blue background (#d0e1f5) with left accent bar
- **Hover:** Light gray background
- **Icons:** 1.5rem width with Font Awesome

#### **Dark Mode**
```css
.dark .nav-item {
    color: #d1d5db;
}
.dark .nav-item:hover {
    background-color: #374151;
}
.dark .nav-item.active {
    background-color: #1e4a7a;
    color: #ffffff;
}
.dark .nav-item.active::before {
    background-color: #60a5fa;
}
```

---

## 3. **Admin Header Structure**

### Location in HTML
```html
<header class="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200 sticky top-0 z-40">
  <!-- Header content -->
</header>
```

### Header Features
- **Classes:** Tailwind utilities for styling
  - `bg-white` / `dark:bg-gray-800` - Background
  - `shadow-sm` - Subtle shadow
  - `sticky top-0 z-40` - Fixed position at top
  - `transition-colors duration-200` - Smooth color transitions

---

## 4. **Color Palette (Tailwind Config)**

```javascript
colors: {
    primary: { 
        50: "#E7F0FA",      // Lightest
        100: "#D0E1F5",
        200: "#7BA4D0",
        300: "#4D84C0",
        400: "#2E5E99",
        500: "#1E4A7A",     // Main color
        600: "#0D2440"      // Darkest
    },
    dark: { 
        bg: "#111827",
        card: "#1F2937",
        text: "#F9FAFB",
        border: "#374151"
    }
}
```

---

## 5. **Files That Use This Approach**

All admin pages use the same pattern:
- `views/admin/dashboard.html`
- `views/admin/profile.html`
- `views/admin/manage_user.html`
- `views/admin/contest.html`
- `views/admin/program.html`
- `views/admin/help_support.html`
- `views/admin/setting.html`
- `views/admin/report.html`
- `views/admin/forgot-password.html`

---

## 6. **What About shared.css & styles.css?**

These files in `/public/css/` are **NOT used by admin pages**. They contain:

**shared.css:**
- Generic scrollbar styles
- Sidebar animation logic (duplicated in embedded styles)

**styles.css:**
- Basic utility buttons (.btn-primary, .btn-secondary)
- Reset and base styles
- Appears to be legacy or used by other modules (faculty, HOD, HOS)

---

## 7. **Key Takeaway**

| Aspect | Details |
|--------|---------|
| **Primary CSS** | Tailwind CSS (from CDN) |
| **Navbar Style** | Embedded `<style>` tag in each HTML |
| **Header Style** | Tailwind CSS utilities + embedded styles |
| **Icons** | Font Awesome 6.4.0 |
| **Fonts** | Poppins (Google Fonts) |
| **Dark Mode** | Supported via Tailwind `darkMode: 'class'` |
| **Color Scheme** | Custom blue primary palette (#1E4A7A) |
| **Local CSS Files** | **NOT used** by admin (legacy) |

---

## 8. **Collapsed Sidebar Behavior**

```css
.sidebar.collapsed { width: 5rem; }

.sidebar.collapsed .nav-item {
    justify-content: center;
    padding-left: 0;
    padding-right: 0;
}

.sidebar.collapsed .nav-item i {
    margin-right: 0;
    font-size: 1.25rem;
}

.sidebar.collapsed .nav-item span,
.sidebar.collapsed .logo-text,
.sidebar.collapsed .bottom-menu span {
    display: none;
}
```
- Text is hidden when collapsed
- Icons are centered
- Only icons visible (~5rem width)

