function initHodShell() {
    if (window.__hodShellInitialized) return;
    window.__hodShellInitialized = true;

    const html = document.documentElement;
    const sidebar = document.getElementById('mainSidebar');
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const profileOverlay = document.getElementById('profileOverlay');
    const headerProfileBtn = document.getElementById('headerProfileBtn');
    const closeProfileOverlayBtn = document.getElementById('closeProfileOverlay');
    const logoutBtn = document.getElementById('logoutBtn');
    const themeButtons = [
        document.getElementById('themeToggleBtn'),
        document.getElementById('headerThemeBtn')
    ].filter(Boolean);

    function fallbackApplyTheme(theme) {
        const wantsDark =
            theme === 'dark' ||
            (theme !== 'light' &&
                window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches);

        html.classList.toggle('dark', wantsDark);

        const iconSelectors = ['#themeToggleBtn i', '#headerThemeBtn i'];
        iconSelectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach((icon) => {
                icon.classList.remove('fa-moon', 'fa-sun');
                icon.classList.add(wantsDark ? 'fa-sun' : 'fa-moon');
            });
        });
    }

    function toggleThemeOnce(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (typeof window.toggleTheme === 'function') {
            window.toggleTheme();
            return;
        }

        const nextTheme = html.classList.contains('dark') ? 'light' : 'dark';
        try {
            localStorage.setItem('theme', nextTheme);
        } catch (_) {}
        fallbackApplyTheme(nextTheme);
    }

    themeButtons.forEach((btn) => {
        btn.addEventListener('click', toggleThemeOnce, true);
    });

    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            sidebar.classList.toggle('collapsed');
            const icon = sidebarToggleBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-chevron-right');
                icon.classList.toggle('fa-chevron-left');
            }
        }, true);
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
            console.error('Failed to set HOD sidebar link', err);
        }
    })();

    if (notificationBtn && notificationDropdown) {
        notificationBtn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            notificationDropdown.classList.toggle('hidden');
        }, true);

        notificationDropdown.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        document.addEventListener('click', (event) => {
            if (!notificationDropdown.contains(event.target) && !notificationBtn.contains(event.target)) {
                notificationDropdown.classList.add('hidden');
            }
        });
    }

    function openProfileOverlay(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
        if (profileOverlay) profileOverlay.classList.remove('hidden');
    }

    function closeProfileOverlay(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
        if (profileOverlay) profileOverlay.classList.add('hidden');
    }

    if (headerProfileBtn) headerProfileBtn.addEventListener('click', openProfileOverlay, true);
    if (closeProfileOverlayBtn) closeProfileOverlayBtn.addEventListener('click', closeProfileOverlay, true);
    if (profileOverlay) {
        profileOverlay.addEventListener('click', (event) => {
            if (event.target === profileOverlay) closeProfileOverlay();
        }, true);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            window.location.href = '/auth/logout';
        }, true);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHodShell);
} else {
    initHodShell();
}
