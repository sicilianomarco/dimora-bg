/* ─────────────────────────────────────────────────────────
   DIMORA BG — Main JavaScript
   ───────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', function() {
    initPromo();
    initNavScroll();
    initNavDropdowns();
    initHamburger();
    initScrollReveal();
    initCardTilt();
    initTabs();
    initAccordion();
    initStatCounters();
    initGallery();
    initStarRating();
    initFeedbackForm();
    loadFeedbacks();
    initMap();
});

/* ─────────────────────────────────────────────────────────
   PROMO ANIMATION
   ───────────────────────────────────────────────────────── */
function initPromo() {
    var section = document.getElementById('promo');
    if (!section) return;

    var SCENES = [
        { id: 'hook',     dur: 3000 },
        { id: 'solution', dur: 5500 },
        { id: 'benefits', dur: 8000 },
        { id: 'proof',    dur: 4000 },
        { id: 'cta',      dur: 5000 }
    ];
    var TOTAL = SCENES.reduce(function(a, s) { return a + s.dur; }, 0);

    var cur = 0;
    var sceneTimer = null;
    var rafId = null;
    var loopStart = Date.now();

    var barFill  = document.getElementById('promo-bar-fill');
    var sceneLabel = document.getElementById('promo-scene-label');
    var dotEls   = document.querySelectorAll('.promo-dot-el');
    var skipBtn  = document.getElementById('promo-skip');

    /* ── helpers ── */
    function reset(el, fromTransform) {
        if (!el) return;
        el.style.transition = 'none';
        el.style.opacity = '0';
        el.style.transform = fromTransform || 'translateY(20px)';
        el.offsetHeight; // force reflow so reset is applied before next paint
    }

    function animIn(el, fromTransform, toTransform, delayMs, durS) {
        if (!el) return;
        reset(el, fromTransform);
        setTimeout(function() {
            el.style.transition = 'opacity ' + (durS || 0.7) + 's ease, transform ' + (durS || 0.7) + 's ease';
            el.style.opacity = '1';
            el.style.transform = toTransform || 'none';
        }, delayMs || 0);
    }

    /* ── per-scene animations ── */
    function animHook(el) {
        var words = el.querySelectorAll('.promo-hook-title span');
        animIn(el.querySelector('.promo-eyebrow'), 'translateY(10px)', 'none', 150);
        words.forEach(function(w, i) { animIn(w, 'translateY(28px)', 'none', 350 + i * 95); });
        animIn(el.querySelector('.promo-rule'), 'scaleX(0)', 'scaleX(1)', 1550, 0.8);
    }

    function animProblem(el) {
        animIn(el.querySelector('.promo-eyebrow'), 'translateY(10px)', 'none', 100);
        el.querySelectorAll('li').forEach(function(li, i) {
            animIn(li, 'translateX(-28px)', 'none', 280 + i * 230, 0.6);
        });
    }

    function animSolution(el) {
        animIn(el.querySelector('.promo-eyebrow'),      'translateY(10px)', 'none', 100);
        animIn(el.querySelector('.promo-solution-title'),'translateY(18px)', 'none', 280, 0.8);
        animIn(el.querySelector('.promo-solution-sub'), 'translateY(14px)', 'none', 1400, 0.7);
        animIn(el.querySelector('.promo-tags'),          'translateY(10px)', 'none', 2100, 0.6);
    }

    function animBenefits(el) {
        animIn(el.querySelector('.promo-eyebrow'),       'translateY(10px)', 'none', 100);
        animIn(el.querySelector('.promo-benefits-title'),'translateY(10px)', 'none', 280);
        el.querySelectorAll('.promo-benefit-card').forEach(function(c, i) {
            animIn(c, 'translateY(28px)', 'none', 550 + i * 190, 0.65);
        });
    }

    function animProof(el) {
        animIn(el.querySelector('.promo-eyebrow'), 'translateY(10px)', 'none', 100);
        el.querySelectorAll('.promo-stat').forEach(function(s, i) {
            animIn(s, 'translateY(22px)', 'none', 280 + i * 140, 0.6);
        });
        // Animated counters
        el.querySelectorAll('.promo-stat-num').forEach(function(num) {
            num.textContent = '0';
            var target = parseInt(num.dataset.target);
            setTimeout(function() {
                var start = Date.now();
                var dur = 1400;
                var tick = function() {
                    var t = Math.min((Date.now() - start) / dur, 1);
                    var ease = 1 - Math.pow(1 - t, 3);
                    num.textContent = Math.round(ease * target);
                    if (t < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            }, 600);
        });
    }

    function animCTA(el) {
        animIn(el.querySelector('.promo-eyebrow'),    'translateY(10px)', 'none', 100);
        animIn(el.querySelector('.promo-cta-title'),  'translateY(18px)', 'none', 280, 0.8);
        animIn(el.querySelector('.promo-cta-btn'),    'translateY(10px)', 'none', 980, 0.6);
        animIn(el.querySelector('.promo-cta-contact'),'translateY(10px)', 'none', 1400, 0.6);
    }

    var animators = { hook: animHook, problem: animProblem, solution: animSolution,
                      benefits: animBenefits, proof: animProof, cta: animCTA };

    /* ── scene switcher ── */
    function showScene(idx) {
        document.querySelectorAll('.promo-scene').forEach(function(s) { s.classList.remove('promo-active'); });

        var scene = SCENES[idx];
        var el = document.getElementById('ps-' + scene.id);
        if (!el) return;
        el.classList.add('promo-active');

        // Label + dots
        if (sceneLabel) sceneLabel.textContent = String(idx + 1).padStart(2,'0') + ' / ' + String(SCENES.length).padStart(2,'0');
        dotEls.forEach(function(d, i) { d.classList.toggle('active', i === idx); });

        // Run animation
        if (animators[scene.id]) animators[scene.id](el);

        // Auto-advance
        clearTimeout(sceneTimer);
        sceneTimer = setTimeout(function() {
            cur = (cur + 1) % SCENES.length;
            if (cur === 0) loopStart = Date.now();
            showScene(cur);
        }, scene.dur);
    }

    /* ── progress bar ── */
    function updateBar() {
        var elapsed = Date.now() - loopStart;
        var pct = Math.min((elapsed / TOTAL) * 100, 100);
        if (barFill) barFill.style.width = pct + '%';
        rafId = requestAnimationFrame(updateBar);
    }

    /* ── skip ── */
    if (skipBtn) {
        skipBtn.addEventListener('click', function() {
            clearTimeout(sceneTimer);
            cancelAnimationFrame(rafId);
            section.style.transition = 'opacity 0.4s ease';
            section.style.opacity = '0';
            setTimeout(function() {
                section.style.display = 'none';
                var hero = document.querySelector('.hero-mesh');
                if (hero) hero.scrollIntoView({ behavior: 'smooth' });
            }, 400);
        });
    }

    loopStart = Date.now();
    showScene(0);
    updateBar();
}

/* ─────────────────────────────────────────────────────────
   NAV SCROLL — add .scrolled when page scrolls
   ───────────────────────────────────────────────────────── */
function initNavScroll() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 40); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ─────────────────────────────────────────────────────────
   NAV DROPDOWNS — mobile click toggle; desktop via CSS hover
   ───────────────────────────────────────────────────────── */
function initNavDropdowns() {
    // Click-based on ALL screen sizes (no CSS hover — stays open until dismissed)
    document.querySelectorAll('.nav-links .dropdown > a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var parent = link.closest('.dropdown');
            var isOpen = !parent.classList.contains('open');
            // Close all dropdowns first
            document.querySelectorAll('.nav-links .dropdown').forEach(function(d) {
                d.classList.remove('open');
            });
            if (isOpen) parent.classList.add('open');
        });
    });

    // Close when clicking outside the nav
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-links')) {
            document.querySelectorAll('.nav-links .dropdown').forEach(function(d) {
                d.classList.remove('open');
            });
        }
    });

    // Close when a submenu item is clicked (leaf navigation)
    document.querySelectorAll('.dropdown-menu a').forEach(function(link) {
        link.addEventListener('click', function() {
            document.querySelectorAll('.nav-links .dropdown').forEach(function(d) {
                d.classList.remove('open');
            });
        });
    });
}

/* ─────────────────────────────────────────────────────────
   HAMBURGER MENU
   ───────────────────────────────────────────────────────── */
function initHamburger() {
    const btn   = document.getElementById('hamburger');
    const links = document.getElementById('nav-links');
    if (!btn || !links) return;

    btn.addEventListener('click', function() {
        const isOpen = links.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
        btn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a leaf nav link is clicked (not dropdown parents)
    links.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function() {
            // Dropdown parent toggles — don't close the navbar
            if (a.closest('li.dropdown') && !a.closest('.dropdown-menu')) return;
            links.classList.remove('open');
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        });
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!btn.contains(e.target) && !links.contains(e.target)) {
            links.classList.remove('open');
            btn.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ─────────────────────────────────────────────────────────
   SCROLL REVEAL — IntersectionObserver
   ───────────────────────────────────────────────────────── */
function initScrollReveal() {
    var selectors = '.reveal, .reveal-left, .reveal-right, .reveal-stagger';
    var els = document.querySelectorAll(selectors);
    if (!els.length || !('IntersectionObserver' in window)) {
        // Fallback: just show everything
        els.forEach(function(el) { el.classList.add('visible'); });
        return;
    }
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function(el) { observer.observe(el); });
}

/* ─────────────────────────────────────────────────────────
   3D CARD TILT — mousemove drives CSS vars --rx / --ry
   ───────────────────────────────────────────────────────── */
function initCardTilt() {
    document.querySelectorAll('.card-tilt').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var cx = rect.left + rect.width  / 2;
            var cy = rect.top  + rect.height / 2;
            var dx = (e.clientX - cx) / (rect.width  / 2);
            var dy = (e.clientY - cy) / (rect.height / 2);
            card.style.setProperty('--rx',  (dy * -8) + 'deg');
            card.style.setProperty('--ry',  (dx *  8) + 'deg');
        });
        card.addEventListener('mouseleave', function() {
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
        });
    });
}

/* ─────────────────────────────────────────────────────────
   TABS — chi-siamo.html content switcher
   ───────────────────────────────────────────────────────── */
function initTabs() {
    var btns = document.querySelectorAll('.tab-btn[data-tab]');
    if (!btns.length) return;
    var tabMap = { storia: 'storia', missione: 'missione', statistiche: 'statistiche' };

    function activateTab(tabKey) {
        btns.forEach(function(b) { b.classList.remove('active'); });
        document.querySelectorAll('.tab-pane').forEach(function(p) { p.classList.remove('active'); });
        var matchBtn = document.querySelector('.tab-btn[data-tab="' + tabKey + '"]');
        if (matchBtn) matchBtn.classList.add('active');
        var pane = document.getElementById('tab-' + tabKey);
        if (pane) pane.classList.add('active');
        if (pane) {
            pane.querySelectorAll('.reveal, .reveal-stagger').forEach(function(el) {
                if (!el.classList.contains('visible')) el.classList.add('visible');
            });
        }
        var section = document.querySelector('.description-tabs');
        if (section) section.classList.toggle('stats-active', tabKey === 'statistiche');
    }

    btns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            activateTab(btn.dataset.tab);
        });
    });

    // On load: activate tab from hash
    function applyHash() {
        var hash = window.location.hash.replace('#', '');
        if (hash && tabMap[hash]) {
            activateTab(tabMap[hash]);
        }
    }
    applyHash();

    // On hash change (e.g. clicking nav dropdown while already on the page)
    window.addEventListener('hashchange', applyHash);
}

/* ─────────────────────────────────────────────────────────
   ACCORDION — dettagli.html
   ───────────────────────────────────────────────────────── */
function initAccordion() {
    document.querySelectorAll('.accordion-header').forEach(function(header) {
        header.addEventListener('click', function() {
            var item = header.closest('.accordion-item');
            var isOpen = item.classList.toggle('open');
            // Close siblings
            var siblings = item.parentElement.querySelectorAll('.accordion-item');
            siblings.forEach(function(s) { if (s !== item) s.classList.remove('open'); });
        });
    });

    function openAccordionByHash() {
        var hash = window.location.hash.replace('#', '');
        if (!hash) return;
        var target = document.getElementById(hash);
        if (target && target.classList.contains('accordion-item')) {
            document.querySelectorAll('.accordion-item').forEach(function(i) { i.classList.remove('open'); });
            target.classList.add('open');
            setTimeout(function() {
                var offset = (document.getElementById('navbar') ? document.getElementById('navbar').offsetHeight : 80) + 24;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }, 320);
        }
    }

    openAccordionByHash();
    window.addEventListener('hashchange', openAccordionByHash);
}

/* ─────────────────────────────────────────────────────────
   STAT COUNTERS — animated number count-up
   ───────────────────────────────────────────────────────── */
function initStatCounters() {
    var nums = document.querySelectorAll('.stat-num[data-target]');
    if (!nums.length) return;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            var target = parseInt(el.dataset.target);
            var duration = 1400;
            var start = performance.now();
            function step(now) {
                var progress = Math.min((now - start) / duration, 1);
                var ease = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(ease * target);
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = target;
            }
            requestAnimationFrame(step);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    nums.forEach(function(el) { observer.observe(el); });
}

/* ─────────────────────────────────────────────────────────
   INTERACTIVE MAP (Leaflet.js + OpenStreetMap)
   ───────────────────────────────────────────────────────── */
function initMap() {
    const mapEl = document.getElementById('map');
    if (!mapEl || typeof L === 'undefined') return;
    initMapDalmine();
}

/* ─── Helper: create a coloured circular marker ─── */
function colorMarker(color) {
    return L.divIcon({
        className: '',
        html: `<div style="
            width:14px; height:14px;
            background:${color};
            border:2px solid white;
            border-radius:50%;
            box-shadow:0 1px 4px rgba(0,0,0,0.4);
        "></div>`,
        iconSize:   [14, 14],
        iconAnchor: [7, 7],
        popupAnchor:[0, -10]
    });
}

/* ─── Home icon for the apartment ─── */
function homeMarker(color) {
    return L.divIcon({
        className: '',
        html: `<div style="
            width:22px; height:22px;
            background:${color};
            border:3px solid white;
            border-radius:6px;
            box-shadow:0 2px 8px rgba(0,0,0,0.5);
            display:flex; align-items:center; justify-content:center;
            font-size:12px; color:white; line-height:1;
        ">🏠</div>`,
        iconSize:   [22, 22],
        iconAnchor: [11, 11],
        popupAnchor:[0, -14]
    });
}

/* ─── Apartment 1 map — Dalmine (async: Overpass POIs + OSRM routing) ─── */
async function initMapDalmine() {

    // ── Apartment data ───────────────────────────────────────────────────────
    var APTS = {
        dalmine: { name: 'Dalmine — Betelli', addr: 'Viale Natale Betelli 28', price: '€450/mese', coords: [45.6499843, 9.6025814] },
        bergamo: { name: 'Bergamo — Centro',   addr: 'Bergamo, BG',            price: '',           coords: [45.6983, 9.6773] }
    };

    // ── Category config (icon: emoji or short text) ──────────────────────────
    var CATS = {
        restaurant:  { label: 'Ristorante',   icon: '🍝', text: false, color: '#e53935' },
        pizzeria:    { label: 'Pizzeria',      icon: '🍕', text: false, color: '#ff6f00' },
        supermarket: { label: 'Supermercato', icon: '🛒', text: false, color: '#2e7d32' },
        bank:        { label: 'Banca',         icon: '🏦', text: false, color: '#1565c0' },
        bar:         { label: 'Bar',           icon: '☕',  text: false, color: '#795548' },
        pool:        { label: 'Piscina',       icon: '🏊', text: false, color: '#0097a7' },
        club:        { label: 'Locale',        icon: '🍸', text: false, color: '#ad1457' },
        transport:   { label: 'Pullman',       icon: '🚌', text: false, color: '#1b5e20' },
        train:       { label: 'Treno',         icon: '🚂', text: false, color: '#37474f' }
    };

    // Categories that support extra contact info in the panel
    var EXTRA_CATS = { restaurant: 1, pizzeria: 1, supermarket: 1, bank: 1, bar: 1, pool: 1, club: 1 };

    // ── Map init (CartoDB Voyager — Google Maps-like style) ──────────────────
    var map = L.map('map', { zoomControl: false, scrollWheelZoom: false })
               .setView(APTS.dalmine.coords, 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
        detectRetina: true
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    // ── Apartment selector control (top-left) ────────────────────────────────
    var AptControl = L.Control.extend({
        options: { position: 'topleft' },
        onAdd: function() {
            var el = L.DomUtil.create('div', 'apt-selector');
            L.DomEvent.disableClickPropagation(el);
            L.DomEvent.disableScrollPropagation(el);
            el.innerHTML =
                '<div class="apt-selector-label">Seleziona appartamento</div>' +
                '<button class="apt-btn active" data-apt="dalmine">🏠 Dalmine — Betelli</button>' +
                '<button class="apt-btn" data-apt="bergamo">🏠 Bergamo — Centro</button>';
            return el;
        }
    });
    new AptControl().addTo(map);

    // ── Distance selector control (top-left, below apartment) ────────────────
    var DistControl = L.Control.extend({
        options: { position: 'topleft' },
        onAdd: function() {
            var el = L.DomUtil.create('div', 'apt-selector');
            L.DomEvent.disableClickPropagation(el);
            L.DomEvent.disableScrollPropagation(el);
            el.innerHTML =
                '<div class="apt-selector-label">Raggio di ricerca</div>' +
                '<button class="apt-btn active" data-radius="1000">📍 1 km</button>' +
                '<button class="apt-btn" data-radius="3000">📍 3 km</button>';
            return el;
        }
    });
    new DistControl().addTo(map);

    // ── State ────────────────────────────────────────────────────────────────
    var currentApt    = 'dalmine';
    var currentRadius = 1000;
    var activeFilters = new Set(Object.keys(CATS));
    var loadedApts    = new Set();
    var routeLayer    = null;

    // ── Layer groups: allLayers[aptKey][catKey] = L.layerGroup ───────────────
    var allLayers = {};
    Object.keys(APTS).forEach(function(aptKey) {
        allLayers[aptKey] = {};
        Object.keys(CATS).forEach(function(cat) {
            allLayers[aptKey][cat] = L.layerGroup();
        });
    });

    // ── Apartment home markers & radius circles ──────────────────────────────
    var aptMarkers = {};
    var aptCircles = {};
    Object.keys(APTS).forEach(function(aptKey) {
        var apt = APTS[aptKey];
        aptMarkers[aptKey] = L.marker(apt.coords, { icon: homeMarker('#c97d4e'), zIndexOffset: 1000 })
            .bindPopup(
                '<strong style="color:#1e2d3d">🏠 DIMORA BG — ' + apt.name + '</strong><br>' +
                '<span style="color:#6b7c8d;font-size:12px">' + apt.addr + (apt.price ? ' · ' + apt.price : '') + '</span>'
            );
        aptCircles[aptKey] = L.circle(apt.coords, {
            radius: 1000, color: '#c97d4e', fillColor: '#c97d4e',
            fillOpacity: 0.04, weight: 1, dashArray: '5,5'
        });
    });

    // ── Info panel DOM refs ──────────────────────────────────────────────────
    var panel      = document.getElementById('map-info-panel');
    var infoIcon   = document.getElementById('info-icon');
    var infoCat    = document.getElementById('info-category');
    var infoName   = document.getElementById('info-name');
    var infoDist   = document.getElementById('info-distance');
    var infoWalk   = document.getElementById('info-walk');
    var infoStatus = document.getElementById('info-status');
    var loadingEl  = document.getElementById('map-loading');

    function showPanel(name, cat, extra) {
        extra = extra || {};
        infoIcon.textContent   = CATS[cat].icon;
        infoCat.textContent    = CATS[cat].label;
        infoName.textContent   = name;
        infoDist.textContent   = '…';
        infoWalk.textContent   = '…';
        infoStatus.textContent = 'Calcolo percorso…';
        infoStatus.className   = 'info-status loading';
        panel.classList.add('visible');

        // Extra contact info (only for relevant categories)
        var extraEl = document.getElementById('info-extra');
        if (!extraEl) return;
        if (!EXTRA_CATS[cat]) { extraEl.style.display = 'none'; return; }

        var phoneRow = document.getElementById('info-phone-row');
        var phoneEl  = document.getElementById('info-phone');
        if (phoneRow && phoneEl) {
            if (extra.phone) {
                phoneEl.textContent = extra.phone;
                phoneEl.href = 'tel:' + extra.phone.replace(/[\s\-\(\)]/g, '');
                phoneRow.style.display = 'flex';
            } else { phoneRow.style.display = 'none'; }
        }

        var hoursRow = document.getElementById('info-hours-row');
        var hoursEl  = document.getElementById('info-hours');
        if (hoursRow && hoursEl) {
            if (extra.hours) {
                hoursEl.textContent = extra.hours;
                hoursRow.style.display = 'flex';
            } else { hoursRow.style.display = 'none'; }
        }

        var webRow = document.getElementById('info-web-row');
        var webEl  = document.getElementById('info-web');
        if (webRow && webEl) {
            if (extra.website) {
                webEl.href = extra.website;
                webRow.style.display = 'flex';
            } else { webRow.style.display = 'none'; }
        }

        extraEl.style.display = (extra.phone || extra.hours || extra.website) ? 'block' : 'none';
    }

    function updateRoute(distKm, walkMins) {
        infoDist.textContent   = distKm + ' km';
        infoWalk.textContent   = '~' + walkMins + ' min';
        infoStatus.textContent = '';
        infoStatus.className   = 'info-status';
    }

    function hidePanel() {
        panel.classList.remove('visible');
        if (routeLayer) { map.removeLayer(routeLayer); routeLayer = null; }
    }

    document.getElementById('info-close').addEventListener('click', hidePanel);

    // ── POI marker icon ──────────────────────────────────────────────────────
    function poiIcon(cat) {
        var cfg = CATS[cat];
        if (cfg.text) {
            // Text label in coloured pill (ATM, P, ✝)
            return L.divIcon({
                className: '',
                html: '<div style="'
                    + 'min-width:34px;height:34px;padding:0 7px;'
                    + 'background:' + cfg.color + ';'
                    + 'border:2px solid white;border-radius:17px;'
                    + 'box-shadow:0 2px 7px rgba(0,0,0,0.25);'
                    + 'display:inline-flex;align-items:center;justify-content:center;'
                    + 'font-size:11px;font-weight:800;color:white;'
                    + 'letter-spacing:0.02em;cursor:pointer;white-space:nowrap;font-family:sans-serif;'
                    + '">' + cfg.icon + '</div>',
                iconSize:   [34, 34],
                iconAnchor: [17, 17]
            });
        }
        // Emoji in white circle with coloured border
        return L.divIcon({
            className: '',
            html: '<div style="'
                + 'width:36px;height:36px;'
                + 'background:white;'
                + 'border:2px solid ' + cfg.color + ';'
                + 'border-radius:50%;'
                + 'box-shadow:0 2px 7px rgba(0,0,0,0.2);'
                + 'display:flex;align-items:center;justify-content:center;'
                + 'font-size:18px;cursor:pointer;'
                + '">' + cfg.icon + '</div>',
            iconSize:   [36, 36],
            iconAnchor: [18, 18]
        });
    }

    // ── OSRM walking route ───────────────────────────────────────────────────
    function fetchRoute(fromCoords, toLat, toLng) {
        var url = 'https://router.project-osrm.org/route/v1/foot/'
            + fromCoords[1] + ',' + fromCoords[0] + ';'
            + toLng + ',' + toLat
            + '?overview=full&geometries=geojson';
        return fetch(url).then(function(r) { return r.json(); });
    }

    function drawRoute(geojson) {
        if (routeLayer) map.removeLayer(routeLayer);
        routeLayer = L.geoJSON(geojson, {
            style: { color: '#c97d4e', weight: 5, opacity: 0.85, lineCap: 'round', lineJoin: 'round' }
        }).addTo(map);
    }

    function onPoiClick(name, cat, lat, lng, extra) {
        showPanel(name, cat, extra);
        fetchRoute(APTS[currentApt].coords, lat, lng).then(function(data) {
            if (!data.routes || !data.routes.length) {
                infoStatus.textContent = 'Percorso non disponibile';
                infoStatus.className   = 'info-status';
                return;
            }
            var route = data.routes[0];
            updateRoute((route.distance / 1000).toFixed(2), Math.ceil(route.duration / 60));
            drawRoute(route.geometry);
        }).catch(function() {
            infoStatus.textContent = 'Errore nel calcolo';
            infoStatus.className   = 'info-status';
        });
    }

    // ── Overpass fetch with mirror fallback ─────────────────────────────────
    async function fetchOverpass(query) {
        var mirrors = [
            'https://overpass-api.de/api/interpreter',
            'https://overpass.kumi.systems/api/interpreter'
        ];
        for (var i = 0; i < mirrors.length; i++) {
            try {
                var res = await fetch(mirrors[i], { method: 'POST', body: query });
                if (!res.ok) continue;
                var data = await res.json();
                if (data.elements) return data;
            } catch (e) {
                console.warn('Overpass mirror failed:', mirrors[i], e.message);
            }
        }
        return { elements: [] };
    }

    // ── Overpass query ───────────────────────────────────────────────────────
    function buildQuery(lat, lng, radius) {
        var r = '(around:' + radius + ',' + lat + ',' + lng + ')';
        return '[out:json][timeout:30];('
            + 'node["amenity"="restaurant"]'                               + r + ';'
            + 'way["amenity"="restaurant"]'                                + r + ';'
            + 'node["amenity"="fast_food"]'                                + r + ';'
            + 'way["amenity"="fast_food"]'                                 + r + ';'
            + 'node["amenity"="cafe"]'                                     + r + ';'
            + 'way["amenity"="cafe"]'                                      + r + ';'
            + 'node["amenity"="bar"]'                                      + r + ';'
            + 'way["amenity"="bar"]'                                       + r + ';'
            + 'node["amenity"="pub"]'                                      + r + ';'
            + 'way["amenity"="pub"]'                                       + r + ';'
            + 'node["amenity"="supermarket"]'                              + r + ';'
            + 'way["amenity"="supermarket"]'                               + r + ';'
            + 'node["shop"="supermarket"]'                                 + r + ';'
            + 'way["shop"="supermarket"]'                                  + r + ';'
            + 'node["amenity"="bank"]'                                     + r + ';'
            + 'way["amenity"="bank"]'                                      + r + ';'
            + 'node["leisure"="swimming_pool"]'                            + r + ';'
            + 'way["leisure"="swimming_pool"]'                             + r + ';'
            + 'node["amenity"="nightclub"]'                                + r + ';'
            + 'way["amenity"="nightclub"]'                                 + r + ';'
            + 'node["highway"="bus_stop"]'                                 + r + ';'
            + 'node["public_transport"="platform"]'                        + r + ';'
            + 'node["railway"="station"]'                                  + r + ';'
            + 'node["railway"="halt"]'                                     + r + ';'
            + 'node["railway"="stop"]'                                     + r + ';'
            + 'way["railway"="station"]'                                   + r + ';'
            + ');out body center;';
    }

    function classifyNode(tags) {
        if (tags.railway === 'station' || tags.railway === 'halt' || tags.railway === 'stop') return 'train';
        if (tags.amenity === 'restaurant' || tags.amenity === 'fast_food') {
            return (tags.cuisine && /pizza/i.test(tags.cuisine)) ? 'pizzeria' : 'restaurant';
        }
        if (tags.amenity === 'cafe' || tags.amenity === 'bar' || tags.amenity === 'pub') return 'bar';
        if (tags.amenity === 'supermarket' || tags.shop === 'supermarket') return 'supermarket';
        if (tags.amenity === 'bank')  return 'bank';
        if (tags.leisure === 'swimming_pool')    return 'pool';
        if (tags.amenity === 'nightclub')        return 'club';
        if (tags.highway === 'bus_stop' || tags.public_transport === 'platform') return 'transport';
        return null;
    }

    // ── Load POIs for one apartment (lazy, cached per radius) ───────────────
    async function loadPOIs(aptKey) {
        if (loadedApts.has(aptKey)) return;
        var apt = APTS[aptKey];

        // ── Overpass remote POIs ─────────────────────────────────────────────
        var data = await fetchOverpass(buildQuery(apt.coords[0], apt.coords[1], currentRadius));
        var seen = new Set();

        (data.elements || []).forEach(function(el) {
            if (!el.tags) return;
            var lat = (el.lat !== undefined) ? el.lat : (el.center && el.center.lat);
            var lon = (el.lon !== undefined) ? el.lon : (el.center && el.center.lon);
            if (!lat || !lon) return;

            var cat = classifyNode(el.tags);
            if (!cat || seen.has(el.id)) return;
            seen.add(el.id);

            var name  = el.tags.name || CATS[cat].label;
            var extra = {
                phone:   el.tags.phone || el.tags['contact:phone'] || null,
                hours:   el.tags.opening_hours || null,
                website: el.tags.website || el.tags['contact:website'] || null
            };
            var marker = L.marker([lat, lon], { icon: poiIcon(cat) });
            marker.on('click', function() { onPoiClick(name, cat, lat, lon, extra); });
            allLayers[aptKey][cat].addLayer(marker);
        });

        // ── Local static POIs (places not yet in OpenStreetMap) ──────────────
        var localList = (typeof LOCAL_POIS !== 'undefined' && LOCAL_POIS[aptKey]) || [];
        localList.forEach(function(poi) {
            if (!poi.lat || !poi.lon || !CATS[poi.cat]) return;
            // Respect current radius filter
            var dlat = (poi.lat - apt.coords[0]) * 111320;
            var dlon = (poi.lon - apt.coords[1]) * 111320 * Math.cos(apt.coords[0] * Math.PI / 180);
            if (Math.sqrt(dlat * dlat + dlon * dlon) > currentRadius) return;

            var name   = poi.name || CATS[poi.cat].label;
            var extra  = poi.extra || {};
            var marker = L.marker([poi.lat, poi.lon], { icon: poiIcon(poi.cat) });
            marker.on('click', function() { onPoiClick(name, poi.cat, poi.lat, poi.lon, extra); });
            allLayers[aptKey][poi.cat].addLayer(marker);
        });

        loadedApts.add(aptKey);
    }

    // ── Show / hide a full apartment's layers ────────────────────────────────
    function showAptLayers(aptKey) {
        aptMarkers[aptKey].addTo(map);
        aptCircles[aptKey].addTo(map);
        Object.keys(CATS).forEach(function(cat) {
            if (activeFilters.has(cat)) allLayers[aptKey][cat].addTo(map);
        });
    }

    function hideAptLayers(aptKey) {
        map.removeLayer(aptMarkers[aptKey]);
        map.removeLayer(aptCircles[aptKey]);
        Object.keys(CATS).forEach(function(cat) {
            map.removeLayer(allLayers[aptKey][cat]);
        });
    }

    // ── Initial load ─────────────────────────────────────────────────────────
    await loadPOIs('dalmine');
    showAptLayers('dalmine');
    if (loadingEl) loadingEl.classList.add('hidden');

    // ── Apartment selector click ─────────────────────────────────────────────
    document.querySelectorAll('[data-apt]').forEach(function(btn) {
        btn.addEventListener('click', async function() {
            var aptKey = btn.dataset.apt;
            if (aptKey === currentApt) return;

            document.querySelectorAll('[data-apt]').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');

            hidePanel();
            hideAptLayers(currentApt);
            currentApt = aptKey;

            if (!loadedApts.has(aptKey) && loadingEl) loadingEl.classList.remove('hidden');
            await loadPOIs(aptKey);
            showAptLayers(aptKey);
            if (loadingEl) loadingEl.classList.add('hidden');

            map.flyTo(APTS[aptKey].coords, 15, { duration: 1.2 });
        });
    });

    // ── Distance selector click ──────────────────────────────────────────────
    document.querySelectorAll('[data-radius]').forEach(function(btn) {
        btn.addEventListener('click', async function() {
            var newRadius = parseInt(btn.dataset.radius);
            if (newRadius === currentRadius) return;

            document.querySelectorAll('[data-radius]').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');

            currentRadius = newRadius;
            hidePanel();

            // Clear all cached POIs and markers, update radius circles
            hideAptLayers(currentApt);
            loadedApts.clear();
            Object.keys(APTS).forEach(function(aptKey) {
                Object.keys(CATS).forEach(function(cat) {
                    allLayers[aptKey][cat].clearLayers();
                });
                aptCircles[aptKey].setRadius(currentRadius);
            });

            if (loadingEl) loadingEl.classList.remove('hidden');
            await loadPOIs(currentApt);
            showAptLayers(currentApt);
            if (loadingEl) loadingEl.classList.add('hidden');
        });
    });

    // ── Filter buttons (generated dynamically) ───────────────────────────────
    var filtersEl = document.getElementById('map-filters');
    if (filtersEl) {
        filtersEl.innerHTML = Object.keys(CATS).map(function(cat) {
            var cfg = CATS[cat];
            return '<button class="filter-btn active" data-category="' + cat + '">'
                + cfg.icon + ' ' + cfg.label + '</button>';
        }).join('');

        filtersEl.querySelectorAll('.filter-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var cat = btn.dataset.category;
                if (activeFilters.has(cat)) {
                    activeFilters.delete(cat);
                    map.removeLayer(allLayers[currentApt][cat]);
                    btn.classList.remove('active');
                } else {
                    activeFilters.add(cat);
                    allLayers[currentApt][cat].addTo(map);
                    btn.classList.add('active');
                }
            });
        });
    }
}


/* ─────────────────────────────────────────────────────────
   GALLERY & LIGHTBOX
   ───────────────────────────────────────────────────────── */
function initGallery() {
    const galleryItems  = document.querySelectorAll('.gallery-item');
    const lightbox      = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const closeBtn      = document.querySelector('.lightbox .close');

    if (!galleryItems.length) return;

    galleryItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const url = this.querySelector('img').dataset.fullsize;
            if (url) {
                lightboxImage.src = url;
                lightbox.classList.add('active');
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            lightbox.classList.remove('active');
        });
    }

    lightbox.addEventListener('click', function(e) {
        if (e.target === this) this.classList.remove('active');
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
    });
}

/* ─────────────────────────────────────────────────────────
   STAR RATING
   ───────────────────────────────────────────────────────── */
function initStarRating() {
    const stars       = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating');
    if (!stars.length) return;

    stars.forEach(function(star) {
        star.addEventListener('click', function() {
            const val = parseInt(this.dataset.value);
            ratingInput.value = val;
            stars.forEach(function(s, i) {
                s.classList.toggle('active', i < val);
            });
        });

        star.addEventListener('mouseover', function() {
            const val = parseInt(this.dataset.value);
            stars.forEach(function(s, i) {
                s.style.color = i < val ? '#c97d4e' : '';
            });
        });
    });

    document.addEventListener('mouseover', function(e) {
        if (!e.target.classList.contains('star')) {
            const val = parseInt(ratingInput.value) || 0;
            stars.forEach(function(s, i) {
                s.style.color = '';
                s.classList.toggle('active', i < val);
            });
        }
    });
}

/* ─────────────────────────────────────────────────────────
   FEEDBACK FORM
   ───────────────────────────────────────────────────────── */
function initFeedbackForm() {
    const form = document.getElementById('feedback-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name      = document.getElementById('name').value.trim();
        const email     = document.getElementById('email').value.trim();
        const apartment = document.getElementById('apartment').value;
        const rating    = document.getElementById('rating').value;
        const comment   = document.getElementById('comment').value.trim();

        if (!name || !email || !apartment || !rating || rating === '0' || !comment) {
            alert('Per favore, compila tutti i campi e seleziona una valutazione.');
            return;
        }

        saveFeedback({ name, email, apartment, rating: parseInt(rating), comment, timestamp: new Date().toISOString() });
        alert('Grazie! La tua recensione è stata inviata.\nVerrà pubblicata dopo approvazione.');
        form.reset();
        document.getElementById('rating').value = 0;
        document.querySelectorAll('.star').forEach(function(s) { s.classList.remove('active'); });
    });
}

/* ─────────────────────────────────────────────────────────
   FEEDBACK STORAGE & DISPLAY
   ───────────────────────────────────────────────────────── */
function saveFeedback(feedback) {
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    feedback.id       = Date.now();
    feedback.approved = false;
    feedbacks.push(feedback);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
}

var SEED_REVIEWS = [
    {
        id: -1, approved: true,
        name: 'Marco R.', age: 24, apartment: 'dalmine', rating: 5,
        comment: 'Vivo a Dalmine da 8 mesi e non potrei essere più soddisfatto. L\'appartamento è pulito, moderno e la gestione risponde sempre in pochi minuti. I coinquilini sono ottimi — si crea davvero un bel ambiente.'
    },
    {
        id: -2, approved: true,
        name: 'Sofia T.', age: 27, apartment: 'bergamo', rating: 5,
        comment: 'Ho trovato la mia stanza a Bergamo Centro prima ancora di trasferirmi, solo tramite foto e una videochiamata. Tutto era esattamente come descritto. Gestione impeccabile, prezzi trasparenti.'
    },
    {
        id: -3, approved: true,
        name: 'Alessandro M.', age: 22, apartment: 'dalmine', rating: 5,
        comment: 'Appartamento fantastico per studiare — silenzioso, spazioso, cucina eccellente. Il terrazzo è un plus enorme. Consigliato a chiunque cerchi qualcosa di bello vicino all\'università senza spendere una fortuna.'
    }
];

function loadFeedbacks() {
    const list = document.getElementById('feedback-list');
    if (!list) return;

    const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    const userApproved = feedbacks.filter(function(f) { return f.approved; });
    const approved = SEED_REVIEWS.concat(userApproved);

    const aptLabel = { dalmine: 'Dalmine — Betelli', bergamo: 'Bergamo — Centro' };

    function initials(name) {
        return name.split(' ').map(function(w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
    }
    function authorLine(f) {
        return f.name + (f.age ? ', ' + f.age + ' anni' : '');
    }
    function stars(r) {
        return '★'.repeat(r) + '☆'.repeat(5 - r);
    }

    var top3 = approved.slice(0, 3);
    var rest  = approved.slice(3);

    var gridHtml = '<div class="review-grid reveal-stagger">' +
        top3.map(function(f) {
            return `<div class="review-card">
                <div class="review-quote">"</div>
                <div class="review-stars">${stars(f.rating)}</div>
                <p class="review-text">"${f.comment}"</p>
                <div class="review-author">
                    <div class="review-avatar">${initials(f.name)}</div>
                    <div class="review-author-info">
                        <div class="author-name">${authorLine(f)}</div>
                        <div class="author-apt">${aptLabel[f.apartment] || f.apartment}</div>
                    </div>
                </div>
            </div>`;
        }).join('') +
    '</div>';

    var listHtml = rest.length ? '<div class="review-list">' +
        rest.map(function(f) {
            return `<div class="review-list-card">
                <div class="review-avatar review-avatar-lg">${initials(f.name)}</div>
                <div class="review-list-content">
                    <div class="review-list-header">
                        <div>
                            <div class="author-name">${authorLine(f)}</div>
                            <div class="author-apt">${aptLabel[f.apartment] || f.apartment}</div>
                        </div>
                        <div class="review-stars">${stars(f.rating)}</div>
                    </div>
                    <p class="review-list-text collapsed">"${f.comment}"</p>
                    <button class="review-expand-btn" aria-expanded="false">Leggi di più ↓</button>
                </div>
            </div>`;
        }).join('') +
    '</div>' : '';

    list.innerHTML = gridHtml + listHtml;

    // reveal-stagger elements injected after initScrollReveal() won't be observed — force visible
    var grid = list.querySelector('.review-grid');
    if (grid) grid.classList.add('visible');

    list.querySelectorAll('.review-expand-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var text = btn.previousElementSibling;
            text.classList.toggle('collapsed');
            var collapsed = text.classList.contains('collapsed');
            btn.textContent = collapsed ? 'Leggi di più ↓' : 'Mostra meno ↑';
            btn.setAttribute('aria-expanded', String(!collapsed));
        });
    });
}

/* ─────────────────────────────────────────────────────────
   ADMIN PANEL
   Open browser console and run: showAdminPanel()
   ───────────────────────────────────────────────────────── */
window.showAdminPanel = function() {
    const pwd = prompt('Password admin:');
    if (pwd !== 'admin123') { alert('Password errata'); return; }

    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    const pending = feedbacks.filter(function(f) { return !f.approved; });

    if (!pending.length) { alert('Nessuna recensione in attesa.'); return; }

    pending.forEach(function(f, i) {
        const ok = confirm(`Recensione #${i + 1}\n"${f.comment}"\n— ${f.name}\n★ ${f.rating}/5\n\nApprovare?`);
        if (ok) {
            f.approved = true;
        } else {
            feedbacks = feedbacks.filter(function(x) { return x.id !== f.id; });
        }
    });

    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    loadFeedbacks();
    alert('Recensioni aggiornate!');
};

window.clearAllFeedbacks = function() {
    if (confirm('Cancellare TUTTE le recensioni?')) {
        localStorage.removeItem('feedbacks');
        location.reload();
    }
};

console.log('✓ DIMORA BG loaded · Type showAdminPanel() to manage reviews');
