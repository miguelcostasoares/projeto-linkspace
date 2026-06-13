/* ============================================================
   LINKSPACE — auth.js
   Núcleo de contas: sessão, registo, login, perfil,
   imóveis guardados, histórico e newsletter.
   ------------------------------------------------------------
   ⚠ IMPORTANTE — LER ANTES DE IR PARA PRODUÇÃO
   Esta versão guarda os dados no NAVEGADOR (localStorage).
   Serve para DEMONSTRAÇÃO/PROTÓTIPO: permite testar todo o
   fluxo sem servidor. NÃO é seguro para dados reais de
   clientes (qualquer pessoa com acesso ao navegador vê os
   dados; a palavra-passe é apenas "hasheada" no cliente).

   Para produção, substitua APENAS o objeto STORE abaixo por
   chamadas a um backend real (ex.: Supabase). Todo o resto do
   site continua a funcionar sem alterações, porque só fala
   com a API pública window.LinkSpaceAuth.
   ============================================================ */
(function () {
    'use strict';

    var KEYS = {
        users: 'ls_auth_users',
        session: 'ls_auth_session',
        savedPrefix: 'ls_auth_saved__',
        viewedPrefix: 'ls_auth_viewed__',
        newsletter: 'ls_auth_newsletter'
    };

    var MAX_HISTORY = 40;

    /* ────────────────────────────────────────────────────────
       STORE  —  camada de dados (a ÚNICA coisa a trocar por um
       backend real). Tudo é síncrono e local nesta versão.
    ──────────────────────────────────────────────────────── */
    var STORE = {
        read: function (key, fallback) {
            try {
                var raw = localStorage.getItem(key);
                return raw ? JSON.parse(raw) : fallback;
            } catch (e) { return fallback; }
        },
        write: function (key, value) {
            try { localStorage.setItem(key, JSON.stringify(value)); return true; }
            catch (e) { return false; }
        },
        remove: function (key) {
            try { localStorage.removeItem(key); } catch (e) {}
        }
    };

    /* ────────────────────────────────────────────────────────
       UTILITÁRIOS
    ──────────────────────────────────────────────────────── */
    function norm(email) { return (email || '').trim().toLowerCase(); }

    function validEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
    }

    /* "hash" de palavra-passe via SHA-256 (apenas para não
       guardar texto puro — NÃO substitui hashing no servidor). */
    function hash(text) {
        try {
            if (window.crypto && window.crypto.subtle) {
                var data = new TextEncoder().encode(text);
                return window.crypto.subtle.digest('SHA-256', data).then(function (buf) {
                    var bytes = new Uint8Array(buf), out = '';
                    for (var i = 0; i < bytes.length; i++) {
                        out += bytes[i].toString(16).padStart(2, '0');
                    }
                    return out;
                });
            }
        } catch (e) {}
        /* fallback fraco se SubtleCrypto não existir (http sem https) */
        var h = 0;
        for (var j = 0; j < (text || '').length; j++) {
            h = ((h << 5) - h + text.charCodeAt(j)) | 0;
        }
        return Promise.resolve('w' + (h >>> 0).toString(16));
    }

    function getUsers() { return STORE.read(KEYS.users, {}); }
    function saveUsers(u) { return STORE.write(KEYS.users, u); }

    /* ────────────────────────────────────────────────────────
       EVENTOS (pub/sub) — o resto do site reage a mudanças
    ──────────────────────────────────────────────────────── */
    var listeners = [];
    function emit(type) {
        for (var i = 0; i < listeners.length; i++) {
            try { listeners[i](type, publicUser()); } catch (e) {}
        }
    }

    /* ────────────────────────────────────────────────────────
       SESSÃO
    ──────────────────────────────────────────────────────── */
    function currentEmail() { return STORE.read(KEYS.session, null); }

    function publicUser() {
        var email = currentEmail();
        if (!email) return null;
        var u = getUsers()[email];
        if (!u) return null;
        return { name: u.name, email: u.email, phone: u.phone || '', createdAt: u.createdAt };
    }

    function isLoggedIn() { return !!publicUser(); }

    /* ────────────────────────────────────────────────────────
       REGISTO / LOGIN / LOGOUT
    ──────────────────────────────────────────────────────── */
    function register(data) {
        data = data || {};
        var email = norm(data.email);
        var name = (data.name || '').trim();
        var phone = (data.phone || '').trim();

        if (!name) return Promise.reject(err('name', 'Indique o seu nome.'));
        if (!validEmail(email)) return Promise.reject(err('email', 'Indique um e-mail válido.'));
        if (!data.password || data.password.length < 6) {
            return Promise.reject(err('password', 'A palavra-passe precisa de pelo menos 6 caracteres.'));
        }
        var users = getUsers();
        if (users[email]) return Promise.reject(err('email', 'Já existe uma conta com este e-mail.'));

        return hash(data.password).then(function (passHash) {
            users[email] = {
                name: name, email: email, phone: phone,
                passHash: passHash, createdAt: Date.now()
            };
            saveUsers(users);
            if (data.newsletter) subscribeNewsletter(email);
            STORE.write(KEYS.session, email);
            emit('login');
            return publicUser();
        });
    }

    function login(data) {
        data = data || {};
        var email = norm(data.email);
        var users = getUsers();
        var u = users[email];
        if (!u) return Promise.reject(err('email', 'Não encontrámos nenhuma conta com este e-mail.'));
        return hash(data.password || '').then(function (passHash) {
            if (passHash !== u.passHash) {
                return Promise.reject(err('password', 'Palavra-passe incorreta.'));
            }
            STORE.write(KEYS.session, email);
            emit('login');
            return publicUser();
        });
    }

    function logout() {
        STORE.remove(KEYS.session);
        emit('logout');
    }

    /* ────────────────────────────────────────────────────────
       PERFIL
    ──────────────────────────────────────────────────────── */
    function updateProfile(data) {
        var email = currentEmail();
        if (!email) return Promise.reject(err('session', 'Sessão terminada. Inicie sessão novamente.'));
        var users = getUsers();
        var u = users[email];
        if (!u) return Promise.reject(err('session', 'Conta não encontrada.'));
        if (data.name != null) {
            var n = (data.name || '').trim();
            if (!n) return Promise.reject(err('name', 'O nome não pode ficar vazio.'));
            u.name = n;
        }
        if (data.phone != null) u.phone = (data.phone || '').trim();
        saveUsers(users);
        emit('profile');
        return Promise.resolve(publicUser());
    }

    function changePassword(data) {
        var email = currentEmail();
        if (!email) return Promise.reject(err('session', 'Sessão terminada.'));
        var users = getUsers();
        var u = users[email];
        if (!u) return Promise.reject(err('session', 'Conta não encontrada.'));
        if (!data.next || data.next.length < 6) {
            return Promise.reject(err('next', 'A nova palavra-passe precisa de pelo menos 6 caracteres.'));
        }
        return hash(data.current || '').then(function (curHash) {
            if (curHash !== u.passHash) {
                return Promise.reject(err('current', 'A palavra-passe atual está incorreta.'));
            }
            return hash(data.next).then(function (nextHash) {
                u.passHash = nextHash;
                saveUsers(users);
                emit('profile');
                return true;
            });
        });
    }

    /* Recuperação: em produção envia um link por e-mail.
       Nesta versão de demonstração define logo uma nova
       palavra-passe se a conta existir. */
    function resetPassword(data) {
        var email = norm(data.email);
        var users = getUsers();
        var u = users[email];
        if (!u) return Promise.reject(err('email', 'Não existe nenhuma conta com este e-mail.'));
        if (!data.next || data.next.length < 6) {
            return Promise.reject(err('next', 'A nova palavra-passe precisa de pelo menos 6 caracteres.'));
        }
        return hash(data.next).then(function (nextHash) {
            u.passHash = nextHash;
            saveUsers(users);
            return true;
        });
    }

    function accountExists(email) { return !!getUsers()[norm(email)]; }

    /* ────────────────────────────────────────────────────────
       IMÓVEIS GUARDADOS  +  HISTÓRICO DE VISTOS
    ──────────────────────────────────────────────────────── */
    function savedKey() { var e = currentEmail(); return e ? KEYS.savedPrefix + e : null; }
    function viewedKey() { var e = currentEmail(); return e ? KEYS.viewedPrefix + e : null; }

    function getSaved() {
        var k = savedKey(); return k ? STORE.read(k, []) : [];
    }
    function isSaved(id) {
        return getSaved().some(function (p) { return p.id === id; });
    }
    function toggleSaved(property) {
        var k = savedKey();
        if (!k || !property || !property.id) return null; /* precisa de sessão */
        var list = STORE.read(k, []);
        var idx = -1;
        for (var i = 0; i < list.length; i++) { if (list[i].id === property.id) { idx = i; break; } }
        var nowSaved;
        if (idx >= 0) { list.splice(idx, 1); nowSaved = false; }
        else { list.unshift(cleanProp(property)); nowSaved = true; }
        STORE.write(k, list);
        emit('saved');
        return nowSaved;
    }
    function removeSaved(id) {
        var k = savedKey(); if (!k) return;
        var list = STORE.read(k, []).filter(function (p) { return p.id !== id; });
        STORE.write(k, list); emit('saved');
    }

    function getViewed() {
        var k = viewedKey(); return k ? STORE.read(k, []) : [];
    }
    function addViewed(property) {
        var k = viewedKey();
        if (!k || !property || !property.id) return;
        var list = STORE.read(k, []).filter(function (p) { return p.id !== property.id; });
        var item = cleanProp(property);
        item.ts = Date.now();
        list.unshift(item);
        if (list.length > MAX_HISTORY) list = list.slice(0, MAX_HISTORY);
        STORE.write(k, list);
        emit('viewed');
    }
    function clearViewed() {
        var k = viewedKey(); if (!k) return;
        STORE.write(k, []); emit('viewed');
    }

    function cleanProp(p) {
        return {
            id: String(p.id),
            title: p.title || '',
            location: p.location || '',
            price: p.price || '',
            image: p.image || '',
            url: p.url || ''
        };
    }

    /* ────────────────────────────────────────────────────────
       NEWSLETTER
    ──────────────────────────────────────────────────────── */
    function subscribeNewsletter(email) {
        email = norm(email);
        if (!validEmail(email)) return Promise.reject(err('email', 'Indique um e-mail válido.'));
        var list = STORE.read(KEYS.newsletter, []);
        if (list.indexOf(email) === -1) { list.push(email); STORE.write(KEYS.newsletter, list); }
        return Promise.resolve(true);
    }
    function isSubscribed(email) {
        return STORE.read(KEYS.newsletter, []).indexOf(norm(email)) !== -1;
    }

    /* ────────────────────────────────────────────────────────
       ERROS uniformes
    ──────────────────────────────────────────────────────── */
    function err(field, message) { return { field: field, message: message }; }

    /* ────────────────────────────────────────────────────────
       API PÚBLICA
    ──────────────────────────────────────────────────────── */
    window.LinkSpaceAuth = {
        register: register,
        login: login,
        logout: logout,
        getUser: publicUser,
        isLoggedIn: isLoggedIn,
        updateProfile: updateProfile,
        changePassword: changePassword,
        resetPassword: resetPassword,
        accountExists: accountExists,
        getSaved: getSaved,
        isSaved: isSaved,
        toggleSaved: toggleSaved,
        removeSaved: removeSaved,
        getViewed: getViewed,
        addViewed: addViewed,
        clearViewed: clearViewed,
        subscribeNewsletter: subscribeNewsletter,
        isSubscribed: isSubscribed,
        on: function (cb) { if (typeof cb === 'function') listeners.push(cb); }
    };
})();