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
        var hb = document.getElementById("hotbarTheme");
        if (hb) {
            var moon = hb.querySelector(".hotbar-moon");
            var sun = hb.querySelector(".hotbar-sun");
            if (moon && sun) {
                moon.style.display = theme === "light" ? "none" : "";
                sun.style.display = theme === "light" ? "" : "none";
            }
        }
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

    /* ===== ХОТБАР В СТИЛЕ MINECRAFT ===== */
    var HOTBAR_ITEMS = [
        { key: "1", label: "Главная", icon: "fa-house", href: "index.html", page: "index" },
        { key: "2", label: "Итоги сезона", icon: "fa-trophy", href: "wrapped.html", page: "wrapped" },
        { key: "3", label: "Игроки", icon: "fa-users", href: "players.html", page: "players" },
        { key: "4", label: "Вики", icon: "fa-book", href: "mechanics.html", page: "mechanics" },
        { key: "5", label: "Правила", icon: "fa-scroll", href: "rules.html", page: "rules" },
        { key: "6", label: "Карта", icon: "fa-map", href: "mapa.html", page: "mapa" },
        { key: "7", label: "Заявка", icon: "fa-paper-plane", href: "apply.html", page: "apply" },
        { key: "8", label: "О сервере", icon: "fa-circle-info", href: "about.html", page: "about" }
    ];

    function buildHotbar() {
        var page = currentPage();
        var slots = HOTBAR_ITEMS.map(function (item) {
            var active = item.page === page ? " active" : "";
            return '<a class="hotbar-slot' + active + '" href="' + item.href + '" data-key="' + item.key + '" aria-label="' + item.label + '">' +
                '<i class="fas ' + item.icon + '" aria-hidden="true"></i>' +
                '<span class="hotbar-num">' + item.key + '</span>' +
                '<span class="hotbar-tip">' + item.label + '</span>' +
            '</a>';
        }).join("");

        var light = document.documentElement.getAttribute("data-theme") === "light";
        slots += '<button class="hotbar-slot hotbar-theme" id="hotbarTheme" data-key="9" aria-label="Переключить тему">' +
            '<i class="fas fa-moon hotbar-moon" aria-hidden="true"' + (light ? ' style="display:none"' : "") + '></i>' +
            '<i class="fas fa-sun hotbar-sun" aria-hidden="true"' + (light ? "" : ' style="display:none"') + '></i>' +
            '<span class="hotbar-num">9</span>' +
            '<span class="hotbar-tip">Сменить тему</span>' +
        '</button>';

        return '<nav class="hotbar" id="hotbar" aria-label="Быстрая навигация по серверу">' +
            '<div class="hotbar-inner">' + slots + '</div>' +
        '</nav>';
    }

    function initHotbar() {
        document.body.insertAdjacentHTML("beforeend", buildHotbar());
        var themeBtn = document.getElementById("hotbarTheme");
        if (themeBtn) {
            themeBtn.addEventListener("click", function () {
                var isLight = document.documentElement.getAttribute("data-theme") === "light";
                applyTheme(isLight ? "dark" : "light");
            });
        }
        document.addEventListener("keydown", function (e) {
            if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
            var t = e.target;
            if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
            var n = parseInt(e.key, 10);
            if (!n || n < 1 || n > 9) return;
            var slot = document.querySelector('.hotbar-slot[data-key="' + n + '"]');
            if (!slot) return;
            e.preventDefault();
            slot.click();
        });
    }

    /* ===== ДОСТИЖЕНИЯ В СТИЛЕ MINECRAFT =====
       Показываются только при первом заходе на сайт: дальше флаг
       остаётся в localStorage и тосты больше не появляются. */
    var ACHV_FIRST_VISIT = null;
    var ACHV_SEEN = [];
    var ACHV_QUEUE = [];
    var ACHV_BUSY = false;

    function isFirstVisit() {
        if (ACHV_FIRST_VISIT !== null) return ACHV_FIRST_VISIT;
        var marked = null;
        try { marked = localStorage.getItem("mugivara-visited"); } catch (e) {}
        ACHV_FIRST_VISIT = !marked;
        if (!marked) {
            try { localStorage.setItem("mugivara-visited", String(Date.now())); } catch (e) {}
        }
        return ACHV_FIRST_VISIT;
    }

    function grantAchievement(id, name, desc, icon) {
        if (!isFirstVisit()) return;
        if (ACHV_SEEN.indexOf(id) !== -1) return;
        ACHV_SEEN.push(id);
        ACHV_QUEUE.push({ name: name, desc: desc || "", icon: icon || "fa-medal" });
        pumpAchievements();
    }

    function pumpAchievements() {
        if (ACHV_BUSY || !ACHV_QUEUE.length) return;
        ACHV_BUSY = true;
        var a = ACHV_QUEUE.shift();
        var stack = document.getElementById("achvStack");
        if (!stack) {
            stack = document.createElement("div");
            stack.id = "achvStack";
            stack.className = "achv-stack";
            stack.setAttribute("aria-live", "polite");
            document.body.appendChild(stack);
        }
        var el = document.createElement("div");
        el.className = "achv";
        el.innerHTML =
            '<div class="achv-icon"><i class="fas ' + a.icon + '" aria-hidden="true"></i></div>' +
            '<div class="achv-text">' +
                '<div class="achv-title">Достижение получено!</div>' +
                '<div class="achv-name">' + a.name + '</div>' +
                (a.desc ? '<div class="achv-desc">' + a.desc + '</div>' : "") +
            '</div>';
        stack.appendChild(el);
        var stay = 4200 + (a.desc ? 400 : 0);
        setTimeout(function () {
            el.classList.add("out");
            setTimeout(function () {
                el.remove();
                ACHV_BUSY = false;
                pumpAchievements();
            }, 380);
        }, stay);
    }

    function initAchievements() {
        if (!isFirstVisit()) return;

        setTimeout(function () {
            grantAchievement("welcome", "Добро пожаловать", "Ты на сервере Mugivara", "fa-door-open");
        }, 900);

        var pageAchv = {
            wrapped: ["page-wrapped", "Итоги подведены", "Сезон прожит не зря", "fa-trophy"],
            players: ["page-players", "Свои люди", "Заглянул в список игроков", "fa-users"],
            mechanics: ["page-wiki", "Книжный червь", "Открыл вики сервера", "fa-book"],
            rules: ["page-rules", "Законопослушный", "Прочитал правила", "fa-scroll"],
            mapa: ["page-mapa", "Картограф", "Изучил карту мира", "fa-map"],
            apply: ["page-apply", "Смельчак", "Открыл заявку на сервер", "fa-paper-plane"],
            about: ["page-about", "Историк", "Узнал о сервере больше", "fa-circle-info"]
        };
        setTimeout(function () {
            var a = pageAchv[currentPage()];
            if (a) grantAchievement(a[0], a[1], a[2], a[3]);
        }, 2400);

        [
            ["#about", "achv-about", "Любопытный", "Дочитал, что это за сервер", "fa-magnifying-glass"],
            ["#join", "achv-join", "На низком старте", "Узнал, как попасть в игру", "fa-rocket"],
            ["#faq", "achv-faq", "Знаток", "Прочитал все вопросы", "fa-comments"]
        ].forEach(function (cfg) {
            var el = document.querySelector(cfg[0]);
            if (!el || !("IntersectionObserver" in window)) return;
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    grantAchievement(cfg[1], cfg[2], cfg[3], cfg[4]);
                    io.disconnect();
                });
            }, { threshold: 0.35 });
            io.observe(el);
        });
    }

    /* ===== ЧАСТИЦЫ ПРИ КЛИКЕ ===== */
    function initParticles() {
        var canvas = document.createElement("canvas");
        canvas.id = "fx-particles";
        canvas.setAttribute("aria-hidden", "true");
        document.body.appendChild(canvas);
        var ctx = canvas.getContext("2d");
        if (!ctx) return;

        var parts = [];
        var raf = null;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var colors = ["#00A2FF", "#66d2ff", "#f4f5f7", "#3a3a42"];

        function resize() {
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
        }
        resize();
        window.addEventListener("resize", resize, { passive: true });

        function loop(now) {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            for (var i = parts.length - 1; i >= 0; i--) {
                var p = parts[i];
                var age = now - p.born;
                if (age > p.life) { parts.splice(i, 1); continue; }
                p.vy += 0.22;
                p.x += p.vx;
                p.y += p.vy;
                ctx.globalAlpha = 1 - Math.pow(age / p.life, 2);
                ctx.fillStyle = p.color;
                ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
            }
            ctx.globalAlpha = 1;
            if (parts.length) {
                raf = requestAnimationFrame(loop);
            } else {
                raf = null;
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            }
        }

        window.addEventListener("pointerdown", function (e) {
            for (var i = 0; i < 16; i++) {
                var ang = Math.random() * Math.PI * 2;
                var spd = 1.1 + Math.random() * 3.6;
                parts.push({
                    x: e.clientX,
                    y: e.clientY,
                    vx: Math.cos(ang) * spd,
                    vy: Math.sin(ang) * spd - 1.4,
                    size: 2 + Math.floor(Math.random() * 4),
                    life: 420 + Math.random() * 460,
                    born: performance.now(),
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }
            if (!raf) raf = requestAnimationFrame(loop);
        }, { passive: true });
    }

    /* ===== ПАРАЛЛАКС БЛОКОВ В HERO ===== */
    function initHeroParallax() {
        var hero = document.querySelector(".hero");
        if (!hero) return;
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        var wrap = document.createElement("div");
        wrap.className = "hero-blocks";
        wrap.setAttribute("aria-hidden", "true");

        var specs = [
            { l: 5, t: 16, s: 76, d: 26 },
            { l: 14, t: 74, s: 44, d: 15 },
            { l: 83, t: 10, s: 58, d: 22 },
            { l: 91, t: 66, s: 88, d: 33 },
            { l: 63, t: 86, s: 38, d: 12 },
            { l: 36, t: 6, s: 30, d: 9 },
            { l: 47, t: 90, s: 52, d: 18 }
        ];

        specs.forEach(function (sp, i) {
            var b = document.createElement("div");
            b.className = "hero-block";
            b.style.left = sp.l + "%";
            b.style.top = sp.t + "%";
            b.style.width = sp.s + "px";
            b.style.height = sp.s + "px";
            b.style.opacity = (0.34 + (i % 3) * 0.12).toFixed(2);
            b.setAttribute("data-depth", sp.d);
            wrap.appendChild(b);
        });
        hero.insertBefore(wrap, hero.firstChild);

        var grid = hero.querySelector(".hero-grid");
        var raf = null;
        var dx = 0;
        var dy = 0;

        function apply() {
            raf = null;
            var blocks = wrap.children;
            for (var i = 0; i < blocks.length; i++) {
                var d = parseFloat(blocks[i].getAttribute("data-depth")) || 10;
                blocks[i].style.transform = "translate3d(" + (dx * d).toFixed(2) + "px," + (dy * d).toFixed(2) + "px,0)";
            }
            if (grid) grid.style.transform = "translate3d(" + (dx * 9).toFixed(2) + "px," + (dy * 9).toFixed(2) + "px,0)";
        }

        window.addEventListener("pointermove", function (e) {
            dx = (e.clientX / window.innerWidth - 0.5) * 2;
            dy = (e.clientY / window.innerHeight - 0.5) * 2;
            if (!raf) raf = requestAnimationFrame(apply);
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
        initHotbar();
        initAchievements();
        initParticles();
        initHeroParallax();
        initPageTransitions();
    });
})();