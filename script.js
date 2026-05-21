/**
 * JR Cobranças - Interações Premium (Ultra-Redesign)
 */

document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────────
    // 1. WhatsApp
    // ─────────────────────────────────────────────
    const WPP_NUMBER = '5544997048098';

    const redirectToWhatsApp = (text) => {
        window.open(`https://wa.me/${WPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    };

    document.querySelectorAll('.wpp-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const msg = link.getAttribute('data-msg') || 'Olá! Gostaria de falar com um especialista da JR Cobranças.';
            redirectToWhatsApp(msg);
        });
    });

    const wppForm = document.getElementById('wppForm');
    if (wppForm) {
        wppForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome').value.trim();
            const msg  = document.getElementById('mensagem').value.trim();
            if (!nome || !msg) return;
            redirectToWhatsApp(`*Contato via Site*\n\n*Cliente:* ${nome}\n*Cenário:* ${msg}`);
            wppForm.reset();
        });
    }

    // ─────────────────────────────────────────────
    // 2. Navbar ao Scroll
    // ─────────────────────────────────────────────
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ─────────────────────────────────────────────
    // 3. Flashlight Mouse (desktop apenas)
    // ─────────────────────────────────────────────
    const flashlight = document.getElementById('flashlight');
    if (flashlight && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                flashlight.style.left = e.clientX + 'px';
                flashlight.style.top  = e.clientY + 'px';
            });
        });
    }

    // ─────────────────────────────────────────────
    // 4. Staggered Reveal on Scroll
    // ─────────────────────────────────────────────
    const observer = new IntersectionObserver((entries) => {
        let delay = 0;
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const isCascade = entry.target.classList.contains('reveal-cascade');
            setTimeout(() => entry.target.classList.add('active'), isCascade ? delay * 150 : 0);
            if (isCascade) delay++;
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-cascade').forEach(el => observer.observe(el));

    // Ativa imediatamente os elementos que já estão visíveis na tela
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal-cascade').forEach((el, i) => {
            setTimeout(() => el.classList.add('active'), i * 150);
            observer.unobserve(el);
        });
    }, 100);

    // ─────────────────────────────────────────────
    // 5. Menu Mobile — criado dinamicamente via DOM
    // ─────────────────────────────────────────────
    const buildMobileMenu = () => {
        if (window.innerWidth > 768) return;
        if (document.querySelector('.mobile-menu-btn')) return;

        const navContent = document.querySelector('.nav-content');
        if (!navContent) return;

        // ── Botão Hambúrguer ──────────────────────
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.setAttribute('aria-label', 'Abrir menu');
        menuBtn.innerHTML = `
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>`;
        navContent.appendChild(menuBtn);

        // ── Overlay com os links ───────────────────
        const overlay = document.createElement('nav');
        overlay.className = 'mobile-nav-overlay';
        overlay.setAttribute('aria-hidden', 'true');

        // Links para o overlay (cópia dos links do desktop + CTA)
        const linkDefs = [
            { label: 'Metodologia', href: '#metodologia' },
            { label: 'Contato',     href: '#contato'     },
        ];

        linkDefs.forEach(({ label, href }) => {
            const a = document.createElement('a');
            a.href = href;
            a.textContent = label;
            a.addEventListener('click', closeMenu);
            overlay.appendChild(a);
        });

        // Botão CTA no menu mobile
        const cta = document.createElement('button');
        cta.className = 'btn-solid wpp-link';
        cta.setAttribute('data-msg', 'Olá! Gostaria de uma assessoria em recuperação de crédito.');
        cta.textContent = 'Assessoria Especializada';
        cta.addEventListener('click', (e) => {
            closeMenu();
            const msg = cta.getAttribute('data-msg');
            redirectToWhatsApp(msg);
        });
        overlay.appendChild(cta);

        document.body.appendChild(overlay);

        // ── Lógica abrir / fechar ──────────────────
        function openMenu() {
            menuBtn.classList.add('open');
            menuBtn.setAttribute('aria-label', 'Fechar menu');
            overlay.classList.add('open');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            menuBtn.classList.remove('open');
            menuBtn.setAttribute('aria-label', 'Abrir menu');
            overlay.classList.remove('open');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        menuBtn.addEventListener('click', () => {
            overlay.classList.contains('open') ? closeMenu() : openMenu();
        });

        // Fechar ao clicar fora do overlay (no overlay em si)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeMenu();
        });
    };

    buildMobileMenu();
    window.addEventListener('resize', buildMobileMenu);

});
