document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. RASTREAMENTO DE UTM (Growth Marketing)
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const utmData = {};
    let hasUtm = false;

    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
        if (urlParams.has(param)) {
            utmData[param] = urlParams.get(param);
            hasUtm = true;
        }
    });

    if (hasUtm) {
        localStorage.setItem('uniolifrans_utm', JSON.stringify(utmData));
    }

    const storedUtm = JSON.parse(localStorage.getItem('uniolifrans_utm') || '{}');
    let utmMessageSuffix = "";
    if (storedUtm.utm_source) {
        utmMessageSuffix = `\n\n*(Vim pelo: ${storedUtm.utm_source} ${storedUtm.utm_campaign ? '- ' + storedUtm.utm_campaign : ''})*`;
    }

    // Atualiza todos os links com classe .wa-link
    document.querySelectorAll('.wa-link').forEach(link => {
        const baseUrl = "https://wa.me/5511939592955?text=";
        const defaultMsg = encodeURIComponent(`Olá! Gostaria de mais informações sobre os cursos da UniOlifrans.${utmMessageSuffix}`);
        // Se o link já tiver um texto (ex: do formulário), ele será sobrescrito dinamicamente no submit
        if (!link.id || link.id !== 'dynamic-wa-link') {
            link.href = baseUrl + defaultMsg;
        }
    });

    // ==========================================
    // 2. DARK MODE (LocalStorage)
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
    }

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // ==========================================
    // 3. HEADER GLASSMORPHISM & MOBILE MENU
    // ==========================================
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('#nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // ==========================================
    // 4. FAQ ACCORDION
    // ==========================================
    document.querySelectorAll('.accordion-header').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            const isActive = item.classList.contains('active');
            
            // Fecha todos
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
            
            // Abre o clicado se não estava ativo
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ==========================================
    // 5. FORMULÁRIO INTELIGENTE (SEM BACKEND)
    // ==========================================
    const form = document.getElementById('smart-form');
    const modal = document.getElementById('success-modal');
    const closeModal = document.querySelector('.close-modal');
    const confirmWa = document.getElementById('confirm-wa');
    let finalWaMessage = "";

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const course = document.getElementById('course').value;
        const message = document.getElementById('message').value;

        // Formata mensagem com negrito para WhatsApp (*texto*)
        finalWaMessage = `*Olá, UniOlifrans!*\n\nMeu nome é *${name}*.\nTenho interesse no curso: *${course}*.\n\n${message ? `Mensagem: ${message}` : 'Gostaria de saber mais sobre valores e matrículas.'}${utmMessageSuffix}`;
        
        const encodedMsg = encodeURIComponent(finalWaMessage);
        const waLink = document.getElementById('dynamic-wa-link') || confirmWa;
        confirmWa.dataset.waUrl = `https://wa.me/5511939592955?text=${encodedMsg}`;

        // Simula evento de conversão se cookies aceitos
        trackEvent('generate_lead', { course: course });

        // Exibe modal
        modal.style.display = 'flex';
    });

    confirmWa.addEventListener('click', () => {
        window.open(confirmWa.dataset.waUrl, '_blank');
        modal.style.display = 'none';
        form.reset();
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // ==========================================
    // 6. LGPD COOKIE BANNER & TRACKING
    // ==========================================
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');

    if (!localStorage.getItem('cookies_accepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 2000);
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookies_accepted', 'true');
        cookieBanner.classList.remove('show');
        // Dispara evento de consentimento
        trackEvent('cookie_consent', { status: 'accepted' });
    });

    // Função segura de rastreamento
    window.trackEvent = function(eventName, params = {}) {
        if (localStorage.getItem('cookies_accepted') === 'true') {
            console.log(`[Tracking] Evento: ${eventName}`, params);
            // 🚨 AQUI VOCÊ DESCOMENTA E INSERE O CÓDIGO REAL DO GA4 / META PIXEL
            // Ex: gtag('event', eventName, params);
            // Ex: fbq('trackCustom', eventName, params);
        }
    };
});