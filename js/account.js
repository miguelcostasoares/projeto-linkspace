/* ============================================================
   LINKSPACE — account.js
   • Injeta o ícone de perfil na navbar (ao lado da bandeira)
   • Mostra estados "com sessão" / "sem sessão"
   • Liga os corações dos cartões aos imóveis guardados
   • Regista o histórico de imóveis vistos
   • Injeta o formulário de newsletter no rodapé
   Não altera o HTML do site — tudo é feito por JS.
   Depende de auth.js (window.LinkSpaceAuth).
   ============================================================ */
(function () {
    'use strict';

    var Auth = window.LinkSpaceAuth;
    if (!Auth) { console.warn('[LinkSpace] auth.js em falta — account.js não arranca.'); return; }

    var LOGIN_URL = 'login.html';
    var PROFILE_URL = 'perfil.html';

    /* ────────────────────────────────────────────────────────
       WIDGET DE PERFIL NA NAVBAR
    ──────────────────────────────────────────────────────── */
    function buildWidget() {
        var nav = document.querySelector('#nav-header');
        if (!nav || document.querySelector('.dropdown--account')) return;

        var wrap = document.createElement('div');
        wrap.className = 'dropdown dropdown--account';
        nav.appendChild(wrap);

        renderWidget(wrap);

        /* abre/fecha por clique (telemóvel, sem hover) */
        wrap.addEventListener('click', function (e) {
            var trigger = e.target.closest('.account-trigger');
            if (trigger) {
                e.preventDefault();
                e.stopPropagation();
                wrap.classList.toggle('open');
                var t = wrap.querySelector('.account-trigger');
                if (t) t.setAttribute('aria-expanded', wrap.classList.contains('open') ? 'true' : 'false');
            }
        });
        document.addEventListener('click', function (e) {
            if (!wrap.contains(e.target)) wrap.classList.remove('open');
        });
    }

    function renderWidget(wrap) {
        var user = Auth.getUser();
        wrap.classList.remove('open');

        if (user) {
            var initial = (user.name || user.email || '?').trim().charAt(0).toUpperCase();
            wrap.innerHTML =
                '<button class="links account-trigger" aria-haspopup="true" aria-expanded="false" aria-label="Conta">' +
                    '<span class="account-avatar">' + escapeHtml(initial) + '</span>' +
                    '<span class="arrow" aria-hidden="true"></span>' +
                '</button>' +
                '<div class="dropdown-menu dropdown-menu--account" role="menu">' +
                    '<div class="account-head">' +
                        '<span class="account-head-name">' + escapeHtml(user.name || '') + '</span>' +
                        '<span class="account-head-email">' + escapeHtml(user.email) + '</span>' +
                    '</div>' +
                    '<a href="' + PROFILE_URL + '?sep=guardados" role="menuitem"><i class="ti ti-heart" aria-hidden="true"></i><span>Imóveis guardados</span></a>' +
                    '<a href="' + PROFILE_URL + '?sep=historico" role="menuitem"><i class="ti ti-history" aria-hidden="true"></i><span>Histórico de imóveis vistos</span></a>' +
                    '<a href="' + PROFILE_URL + '" role="menuitem"><i class="ti ti-user-circle" aria-hidden="true"></i><span>O meu perfil</span></a>' +
                    '<button type="button" class="account-logout" role="menuitem"><i class="ti ti-logout" aria-hidden="true"></i><span>Terminar sessão</span></button>' +
                '</div>';

            var logout = wrap.querySelector('.account-logout');
            if (logout) logout.addEventListener('click', function () {
                Auth.logout();
                renderWidget(wrap);
            });
        } else {
            wrap.innerHTML =
                '<button class="links account-trigger" aria-haspopup="true" aria-expanded="false" aria-label="Conta">' +
                    '<i class="ti ti-user" aria-hidden="true"></i>' +
                    '<span class="arrow" aria-hidden="true"></span>' +
                '</button>' +
                '<div class="dropdown-menu dropdown-menu--account" role="menu">' +
                    '<a href="' + LOGIN_URL + '" role="menuitem"><i class="ti ti-login" aria-hidden="true"></i><span>Entrar</span></a>' +
                    '<a href="' + LOGIN_URL + '?modo=registar" role="menuitem"><i class="ti ti-user-plus" aria-hidden="true"></i><span>Criar conta</span></a>' +
                '</div>';
        }
    }

    /* ────────────────────────────────────────────────────────
       CARTÕES DE IMÓVEIS — guardar (coração) + registar vistos
    ──────────────────────────────────────────────────────── */
    function readProperty(card) {
        function txt(sel) { var el = card.querySelector(sel); return el ? el.textContent.trim() : ''; }
        function src(sel) { var el = card.querySelector(sel); return el ? (el.getAttribute('src') || '') : ''; }
        var ref = txt('.card-ref');
        var title = txt('.card-title');
        var id = ref || title; /* a referência é o identificador; título como reserva */
        return {
            id: id,
            title: title,
            location: txt('.card-location'),
            price: txt('.price-value'),
            image: src('.card-image'),
            url: (card.querySelector('.card-explore-btn') || {}).href || ''
        };
    }

    function wireCard(card) {
        if (card.__lsWired) return;
        card.__lsWired = true;

        var prop = readProperty(card);
        var favBtn = card.querySelector('.btn-favorito');

        if (favBtn) {
            if (Auth.isLoggedIn() && Auth.isSaved(prop.id)) markFav(favBtn, true);
            favBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (!Auth.isLoggedIn()) {
                    toast('Inicie sessão para guardar imóveis.', 'Entrar', LOGIN_URL);
                    return;
                }
                var nowSaved = Auth.toggleSaved(readProperty(card));
                markFav(favBtn, nowSaved);
            });
        }

        /* registar como "visto" ao explorar o imóvel */
        var explore = card.querySelector('.card-explore-btn');
        if (explore) {
            explore.addEventListener('click', function () {
                if (Auth.isLoggedIn()) Auth.addViewed(readProperty(card));
            });
        }
    }

    function markFav(btn, on) {
        btn.classList.toggle('is-saved', !!on);
        var icon = btn.querySelector('i');
        if (icon) icon.className = on ? 'ti ti-heart-filled' : 'ti ti-heart';
        btn.setAttribute('aria-label', on ? 'Remover dos guardados' : 'Guardar imóvel');
    }

    function wireAllCards() {
        document.querySelectorAll('.imovel-card').forEach(wireCard);
    }

    function refreshFavStates() {
        document.querySelectorAll('.imovel-card').forEach(function (card) {
            var favBtn = card.querySelector('.btn-favorito');
            if (!favBtn) return;
            var prop = readProperty(card);
            markFav(favBtn, Auth.isLoggedIn() && Auth.isSaved(prop.id));
        });
    }

    /* ────────────────────────────────────────────────────────
       NEWSLETTER (rodapé)
    ──────────────────────────────────────────────────────── */
    function buildNewsletter() {
        var brand = document.querySelector('.footer-col-brand');
        if (!brand || brand.querySelector('.footer-newsletter')) return;

        var box = document.createElement('form');
        box.className = 'footer-newsletter';
        box.setAttribute('novalidate', 'novalidate');
        box.innerHTML =
            '<h4 class="footer-news-title">Newsletter</h4>' +
            '<p class="footer-news-text">Receba os novos imóveis e novidades no seu e-mail.</p>' +
            '<div class="footer-news-row">' +
                '<input type="email" class="footer-news-input" placeholder="O seu e-mail" aria-label="O seu e-mail" required>' +
                '<button type="submit" class="footer-news-btn"><i class="ti ti-send" aria-hidden="true"></i></button>' +
            '</div>' +
            '<span class="footer-news-msg" role="status"></span>';
        brand.appendChild(box);

        var input = box.querySelector('.footer-news-input');
        var msg = box.querySelector('.footer-news-msg');
        box.addEventListener('submit', function (e) {
            e.preventDefault();
            Auth.subscribeNewsletter(input.value).then(function () {
                msg.textContent = 'Subscrição feita. Obrigado!';
                msg.className = 'footer-news-msg ok';
                input.value = '';
            }).catch(function (er) {
                msg.textContent = (er && er.message) || 'Não foi possível subscrever.';
                msg.className = 'footer-news-msg erro';
            });
        });
    }

    /* ────────────────────────────────────────────────────────
       TOAST simples
    ──────────────────────────────────────────────────────── */
    var toastTimer = null;
    function toast(message, actionLabel, actionHref) {
        var el = document.querySelector('.ls-toast');
        if (!el) {
            el = document.createElement('div');
            el.className = 'ls-toast';
            document.body.appendChild(el);
        }
        el.innerHTML = '<span>' + escapeHtml(message) + '</span>' +
            (actionLabel ? '<a href="' + actionHref + '">' + escapeHtml(actionLabel) + '</a>' : '');
        el.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { el.classList.remove('show'); }, 4200);
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    /* ────────────────────────────────────────────────────────
       ARRANQUE
    ──────────────────────────────────────────────────────── */
    function init() {
        buildWidget();
        wireAllCards();
        buildNewsletter();

        /* reage a login/logout/guardados noutras zonas da página */
        Auth.on(function (type) {
            var wrap = document.querySelector('.dropdown--account');
            if (wrap && (type === 'login' || type === 'logout' || type === 'profile')) renderWidget(wrap);
            if (type === 'login' || type === 'logout' || type === 'saved') refreshFavStates();
        });

        /* cartões adicionados dinamicamente (ex.: outras secções) */
        var mo = new MutationObserver(function (muts) {
            for (var i = 0; i < muts.length; i++) {
                for (var j = 0; j < muts[i].addedNodes.length; j++) {
                    var n = muts[i].addedNodes[j];
                    if (n.nodeType !== 1) continue;
                    if (n.classList && n.classList.contains('imovel-card')) wireCard(n);
                    if (n.querySelectorAll) n.querySelectorAll('.imovel-card').forEach(wireCard);
                }
            }
        });
        mo.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();