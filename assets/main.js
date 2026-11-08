/* ===== Общая логика Mugivara (стиль rpf.su, чёрная тема) ===== */
(function () {
    "use strict";

    var SERVER_IP = "play.mugivaracraft.ru";
    var MC_HOST = "mc.mugivaracraft.ru";
    var DISCORD = "https://discord.gg/W226UHyv6f";
    var TIKTOK = "https://tiktok.com/@mugiwara_craft";

    var NAV_LINKS = [
        { label: "Главная", href: "index.html", page: "index" },
        { label: "Итоги сезона", href: "wrapped.html", page: "wrapped" },
        { label: "Игроки", href: "players.html", page: "players" },
        { label: "Вики", href: "mechanics.html", page: "mechanics" }
    ];

    var SERVER_DROPDOWN = [
        { label: "Правила", href: "rules.html", page: "rules" },
        { label: "Карта", href: "mapa.html", page: "mapa" },
        { label: "Подать заявку", href: "apply.html", page: "apply" },
        { label: "О сервере", href: "about.html", page: "about" }
    ];

    function currentPage() {
        var path = window.location.pathname.split("/").pop();
        if (!path) return "index";
        return path.replace(/\.html$/, "").toLowerCase();
    }

    function navItem(link) {
        var active = link.page === currentPage();
        return '<a href="' + link.href + '" class="nav-link' + (active ? " active" : "") + '">' + link.label + "</a>";
    }

    function buildNavbar() {
        var desktopLinks = NAV_LINKS.map(navItem).join("");
        var dropdownLinks = SERVER_DROPDOWN.map(function (l) {
            var active = l.page === currentPage();
            return '<a href="' + l.href + '" class="' + (active ? "active" : "") + '">' + l.label + "</a>";
        }).join("");

        return '' +
        '<nav class="navbar">' +
            '<div class="navbar-inner">' +
                '<a href="index.html" class="navbar-brand"><img src="icon.png" alt="Mugivara" class="navbar-logo-img"><span>MUGIVARA</span></a>' +
                '<div class="nav-menu">' + desktopLinks +
                    '<div class="dropdown">' +
                        '<button class="nav-link" data-dd style="display:inline-flex;align-items:center;gap:0.4rem;">Сервер <i class="fas fa-chevron-down" style="font-size:0.65rem;"></i></button>' +
                        '<div class="dropdown-menu">' + dropdownLinks + '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="nav-actions">' +
                    '<button class="nav-ip-btn" onclick="copyIP()" title="Скопировать IP"><i class="fas fa-copy"></i><span>play.mugivaracraft.ru</span></button>' +
                    '<button class="theme-btn" id="themeToggle" aria-label="Переключить тему"><span class="moon"><i class="fas fa-moon"></i></span><span class="sun"><i class="fas fa-sun"></i></span></button>' +
                    '<button class="menu-toggle" id="menuToggle" aria-label="Меню" style="display:none;align-items:center;justify-content:center;"><span></span><span></span><span></span></button>' +
                '</div>' +
            '</div>' +
            '<div class="mobile-menu" id="mobileMenu">' +
                NAV_LINKS.map(function (l) {
                    var active = l.page === currentPage();
                    return '<a href="' + l.href + '" class="' + (active ? "active" : "") + '">' + l.label + "</a>";
                }).join("") +
                SERVER_DROPDOWN.map(function (l) {
                    var active = l.page === currentPage();
                    return '<a href="' + l.href + '" class="' + (active ? "active" : "") + '">' + l.label + "</a>";
                }).join("") +
                '<button class="ip-btn" onclick="copyIP()"><i class="fas fa-copy"></i> play.mugivaracraft.ru</button>' +
            '</div>' +
        '</nav>';
    }

    function buildFooter() {
        return '' +
        '<footer class="footer">' +
            '<div class="container">' +
                '<div class="footer-grid">' +
                    '<div>' +
                        '<div class="footer-brand"><img src="icon.png" alt="Mugivara" class="navbar-logo-img"> MUGIVARA</div>' +
                        '<p class="footer-desc">Приватный ванильный Minecraft SMP. Заходи, если ищешь своих.</p>' +
                    '</div>' +
                    '<div class="footer-col"><h4>Сообщество</h4>' +
                        '<a href="' + DISCORD + '" target="_blank">Discord</a>' +
                        '<a href="' + TIKTOK + '" target="_blank">TikTok</a>' +
                    '</div>' +
                    '<div class="footer-col"><h4>Сервер</h4>' +
                        '<a href="index.html">Главная</a>' +
                        '<a href="wrapped.html">Итоги сезона</a>' +
                        '<a href="players.html">Игроки</a>' +
                        '<a href="apply.html">Подать заявку</a>' +
                    '</div>' +
                    '<div class="footer-col"><h4>Сайт</h4>' +
                        '<a href="about.html">О сервере</a>' +
                        '<a href="mechanics.html">Вики</a>' +
                        '<a href="rules.html">Правила</a>' +
                        '<a href="mapa.html">Карта</a>' +
                    '</div>' +
                '</div>' +
                '<div class="footer-bottom">' +
                    '<span>© 2026 Mugivara • Не связан с Mojang Studios</span>' +
                    '<span>IP: <span class="ip" onclick="copyIP()">play.mugivaracraft.ru</span> • Версия 1.21.11</span>' +
                '</div>' +
            '</div>' +
        '</footer>';
    }

    /* ===== ТЕМА (светлая/тёмная, плавно) ===== */
    function applyTheme(theme) {
        var root = document.documentElement;
        if (theme === "light") root.setAttribute("data-theme", "light");
        else root.removeAttribute("data-theme");
        try { localStorage.setItem("mugivara-theme", theme); } catch (e) {}
    }

    function initTheme() {
        var saved = null;
        try { saved = localStorage.getItem("mugivara-theme"); } catch (e) {}
        if (!saved) {
            saved = (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) ? "light" : "dark";
        }
        applyTheme(saved);
        var btn = document.getElementById("themeToggle");
        if (btn) {
            btn.addEventListener("click", function () {
                var isLight = document.documentElement.getAttribute("data-theme") === "light";
                applyTheme(isLight ? "dark" : "light");
            });
        }
    }

    function initMobileMenu() {
        var toggle = document.getElementById("menuToggle");
        var menu = document.getElementById("mobileMenu");
        if (toggle && menu) {
            toggle.addEventListener("click", function () {
                menu.classList.toggle("open");
            });
        }
    }

    function initDropdown() {
        var ddBtn = document.querySelector("[data-dd]");
        var ddMenu = ddBtn ? ddBtn.closest(".dropdown").querySelector(".dropdown-menu") : null;
        if (ddBtn && ddMenu) {
            ddBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                var isOpen = ddMenu.classList.contains("open");
                if (isOpen) {
                    ddMenu.classList.remove("open");
                    setTimeout(function(){ ddMenu.style.display = "none"; }, 200);
                } else {
                    ddMenu.style.display = "block";
                    requestAnimationFrame(function(){ ddMenu.classList.add("open"); });
                }
            });
            document.addEventListener("click", function () {
                if (ddMenu.classList.contains("open")) {
                    ddMenu.classList.remove("open");
                    setTimeout(function(){ ddMenu.style.display = "none"; }, 200);
                }
            });
        }
    }

    function initFAQ() {
        document.querySelectorAll(".faq-item button").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var item = btn.parentElement;
                var isOpen = item.classList.contains("open");
                document.querySelectorAll(".faq-item").forEach(function (el) { el.classList.remove("open"); });
                if (!isOpen) item.classList.add("open");
            });
        });
    }

    /* ===== ПОЯВЛЕНИЕ БЛОКОВ (без анимации — все видны сразу) ===== */
    function initReveal() {
        // Анимация появления отключена по запросу — показываем все блоки мгновенно
        var els = document.querySelectorAll(".reveal");
        els.forEach(function (el) { el.classList.add("revealed"); });
    }

    /* ===== АНИМАЦИЯ СЧЁТЧИКОВ (от 0 до значения) ===== */
    function animateCount(el) {
        var target = parseFloat(el.getAttribute("data-count")) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        var decimals = (String(target).split(".")[1] || "").length;
        var duration = Math.min(1600, 700 + target * 1.5);
        var startTime = performance.now();
        function step(time) {
            var p = Math.min((time - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            var val = eased * target;
            el.textContent = (decimals ? val.toFixed(decimals) : Math.round(val) + "").replace(".", ",") + suffix;
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = (target.toFixed(decimals) + "").replace(".", ",") + suffix;
        }
        requestAnimationFrame(step);
    }
    function initCounters() {
        var counters = document.querySelectorAll("[data-count]");
        if (!counters.length) return;
        if (!("IntersectionObserver" in window)) {
            counters.forEach(animateCount);
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        counters.forEach(function (el) { io.observe(el); });
    }

    function initOnline() {
        var els = document.querySelectorAll("[data-online]");
        if (!els.length) return;
        function render(count, max) {
            els.forEach(function (el) {
                if (el.getAttribute("data-online") === "count") el.textContent = (count === null ? "—" : count);
                else el.textContent = (count === null ? "—" : count + "/" + max);
            });
        }
        function setPlayers(list) {
            var container = document.querySelector("[data-players]");
            if (!container) return;
            if (!list || !list.length) { container.innerHTML = ""; return; }
            container.innerHTML = list.map(function (p) {
                var n = typeof p === "string" ? p : p.name;
                var nn = encodeURIComponent(n);
                return '<div class="player-item"><img class="player-avatar" loading="lazy" alt="' + n + '" src="https://mc-heads.net/avatar/' + nn + '/46" onerror="this.src=\'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2246%22 height=%2246%22%3E%3Crect width=%2246%22 height=%2246%22 fill=%22%23222222%22/%3E%3Ctext x=%2223%22 y=%2230%22 text-anchor=%22middle%22 fill=%22%23aaa%22 font-size=%2218%22 font-family=%22sans-serif%22%3E' + n.charAt(0).toUpperCase() + '%3C/text%3E%3C/svg%3E\'"><span class="player-name">' + n + '</span></div>';
            }).join("");
        }
        function fetchOnline() {
            var ctrl = new AbortController();
            var t = setTimeout(function () { ctrl.abort(); }, 6000);
            fetch("https://api.mcstatus.io/v2/status/java/" + MC_HOST, { signal: ctrl.signal })
                .then(function (r) { if (!r.ok) throw new Error("bad"); return r.json(); })
                .then(function (d) {
                    clearTimeout(t);
                    if (d.online) { render(d.players.online, d.players.max); setPlayers(d.players.sample || []); }
                    else { render(0, 100); setPlayers([]); }
                })
                .catch(function () { clearTimeout(t); render(null, null); setPlayers([]); });
        }
        fetchOnline();
        setInterval(fetchOnline, 30000);
    }

    window.showToast = function (msg) {
        var old = document.querySelector(".toast");
        if (old) old.remove();
        var t = document.createElement("div");
        t.className = "toast";
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(function () { t.remove(); }, 2200);
    };

    window.copyIP = function () {
        var done = function () { window.showToast("IP скопирован: play.mugivaracraft.ru ✓"); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(SERVER_IP).then(done).catch(done);
        } else {
            var ta = document.createElement("textarea");
            ta.value = SERVER_IP; ta.style.position = "fixed"; ta.style.opacity = "0";
            document.body.appendChild(ta); ta.select();
            try { document.execCommand("copy"); } catch (e) {}
            document.body.removeChild(ta); done();
        }
    };

    /* ===== ФИШКИ ===== */
    function initFixtures() {
        // Свечение вокруг курсора
        var glow = document.createElement("div");
        glow.id = "cursor-glow";
        document.body.appendChild(glow);
        var raf = null;
        window.addEventListener("pointermove", function (e) {
            if (raf) return;
            raf = requestAnimationFrame(function () {
                glow.style.top = e.clientY + "px";
                glow.style.left = e.clientX + "px";
                raf = null;
            });
        }, { passive: true });

        // Кнопка "наверх"
        var toTop = document.createElement("button");
        toTop.id = "to-top";
        toTop.setAttribute("aria-label", "Наверх");
        toTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
        toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
        document.body.appendChild(toTop);
        window.addEventListener("scroll", function () {
            if (window.scrollY > 600) toTop.classList.add("show");
            else toTop.classList.remove("show");
        }, { passive: true });
    }

    /* ===== ПЕРЕХОДЫ МЕЖДУ СТРАНИЦАМИ ОТКЛЮЧЕНЫ =====
       Обычная навигация браузера: без оверлеев, затуханий и задержек,
       чтобы не было никаких подёргиваний. */
    function initPageTransitions() {
        // Намеренно пусто.
    }

    document.addEventListener("DOMContentLoaded", function () {
        var navbarHost = document.getElementById("navbar-host");
        if (navbarHost) navbarHost.innerHTML = buildNavbar();
        var footerHost = document.getElementById("footer-host");
        if (footerHost) footerHost.innerHTML = buildFooter();
        initMobileMenu();
        initDropdown();
        initTheme();
        initFAQ();
        initOnline();
        initReveal();
        initCounters();
        initFixtures();
        initPageTransitions();
    });
})();