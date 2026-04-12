function initFacultyShell() {
    if (window.__facultyShellInitialized) return;
    window.__facultyShellInitialized = true;

    const html = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    const sidebar = document.getElementById('mainSidebar');
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const profileOverlay = document.getElementById('profileOverlay');
    const headerProfileBtn = document.getElementById('headerProfileBtn');
    const closeProfileOverlayBtn = document.getElementById('closeProfileOverlay');
    const logoutBtn = document.getElementById('logoutBtn');

    function resolveTheme(theme) {
        if (theme === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return theme === 'dark' ? 'dark' : 'light';
    }

    function syncThemeIcon() {
        if (!themeIcon) return;
        themeIcon.classList.remove('fa-moon', 'fa-sun');
        themeIcon.classList.add(html.classList.contains('dark') ? 'fa-sun' : 'fa-moon');
    }

    function applyTheme(theme, persist = true) {
        if (typeof window.toggleTheme === 'function' && theme == null) {
            window.toggleTheme();
            return;
        }

        if (typeof window.applyTheme === 'function' && window.applyTheme !== applyTheme) {
            window.applyTheme(theme);
            return;
        }

        const resolvedTheme = resolveTheme(theme || 'system');
        html.classList.toggle('dark', resolvedTheme === 'dark');

        if (persist) {
            try {
                if (theme === 'system') {
                    localStorage.removeItem('theme');
                } else {
                    localStorage.setItem('theme', resolvedTheme);
                }
            } catch (_) {
                // Ignore storage failures and still apply the visual theme.
            }
        }

        syncThemeIcon();
        window.dispatchEvent(new CustomEvent('faculty:theme-change', {
            detail: { theme: resolvedTheme }
        }));
    }

    let storedTheme = 'system';
    try {
        storedTheme = localStorage.getItem('theme') || 'system';
    } catch (_) {
        storedTheme = 'system';
    }
    applyTheme(storedTheme, false);

    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            const icon = sidebarToggleBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-chevron-right');
                icon.classList.toggle('fa-chevron-left');
            }
        });
    }

    (function setActiveSidebarLink() {
        try {
            const path = window.location.pathname || '/';
            const navLinks = document.querySelectorAll('#mainSidebar nav a.nav-item, #mainSidebar .bottom-menu a.nav-item');
            if (!navLinks.length) return;

            let bestMatch = null;
            let bestLen = 0;
            navLinks.forEach((a) => {
                const linkPath = a.getAttribute('href');
                if (!linkPath) return;
                if (path === linkPath || path.startsWith(linkPath + '/') || path.startsWith(linkPath)) {
                    if (linkPath.length > bestLen) {
                        bestLen = linkPath.length;
                        bestMatch = a;
                    }
                }
            });

            navLinks.forEach((a) => a.classList.remove('active'));
            if (bestMatch) bestMatch.classList.add('active');
        } catch (err) {
            console.error('Failed to set faculty sidebar link', err);
        }
    })();

    if (notificationBtn && notificationDropdown) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown.classList.toggle('hidden');
        });

        notificationDropdown.addEventListener('click', (e) => e.stopPropagation());

        document.addEventListener('click', (e) => {
            if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
                notificationDropdown.classList.add('hidden');
            }
        });
    }

    function openProfileOverlay() {
        if (profileOverlay) profileOverlay.classList.remove('hidden');
    }

    function closeProfileOverlay() {
        if (profileOverlay) profileOverlay.classList.add('hidden');
    }

    if (headerProfileBtn) headerProfileBtn.addEventListener('click', openProfileOverlay);
    if (closeProfileOverlayBtn) closeProfileOverlayBtn.addEventListener('click', closeProfileOverlay);
    if (profileOverlay) {
        profileOverlay.addEventListener('click', (e) => {
            if (e.target === profileOverlay) closeProfileOverlay();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = '/auth/logout';
        });
    }

    window.facultyShell = {
        applyTheme
    };
    if (typeof window.applyTheme !== 'function') {
        window.applyTheme = applyTheme;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFacultyShell);
} else {
    initFacultyShell();
}
