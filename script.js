document.addEventListener('DOMContentLoaded', () => {
    // Staggered reveal for hero left column
    const leftItems = Array.from(document.querySelectorAll('.left > *'))
        .filter(el => el.tagName.toLowerCase() !== 'nav');

    leftItems.forEach((el, i) => {
        el.classList.add('reveal');
        setTimeout(() => el.classList.add('active'), 220 + i * 120);
    });

    const roleRotator = document.getElementById('role-rotator');
    const roles = ['Web Developer', 'UI/UX Design', 'Android Developer'];
    if (roleRotator) {
        let roleIndex = 0;
        setInterval(() => {
            roleIndex = (roleIndex + 1) % roles.length;
            roleRotator.textContent = roles[roleIndex];
        }, 2500);
    }

    // Observe sections/cards for scroll reveal
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('active', entry.isIntersecting);
        });
    }, {threshold: 0.15, rootMargin: '0px 0px -8% 0px'});

    document.querySelectorAll('main, .section, .card, .portfolio-section, .portfolio-card, .certificate-card, .stack-item, .contact-section, .contact-link, .contact-form-wrap').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    document.querySelectorAll('.career-column').forEach(column => {
        Array.from(column.children).forEach((el, index) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${index * 140}ms`;
            observer.observe(el);
        });
    });

    document.querySelectorAll('.portfolio-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.portfolio-tab').forEach(item => {
                const isActive = item === tab;
                item.classList.toggle('active', isActive);
                item.setAttribute('aria-selected', String(isActive));
            });
            document.querySelectorAll('.portfolio-panel').forEach(panel => {
                const isSelected = panel.id === tab.dataset.panel;
                panel.classList.remove('active-panel');
                panel.hidden = !isSelected;
                if (isSelected) {
                    void panel.offsetWidth;
                    panel.classList.add('active-panel');
                }
            });
        });
    });

    const navigationSections = [
        { id: 'home', link: 'nav a[href="#home"]' },
        { id: 'about', link: 'nav a[href="#about"]' },
        { id: 'project', link: 'nav a[href="#project"]' },
        { id: 'contact', link: 'nav a[href="#contact"]' }
    ];
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navigationSections.forEach(section => {
                const link = document.querySelector(section.link);
                if (link) link.classList.toggle('active', section.id === entry.target.id);
            });
        });
    }, { threshold: 0.2, rootMargin: '-80px 0px -45% 0px' });

    navigationSections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) sectionObserver.observe(element);
    });

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', event => {
            event.preventDefault();
            const name = contactForm.elements.name.value.trim();
            const message = contactForm.elements.message.value.trim();
            const subject = encodeURIComponent(`Portfolio message from ${name}`);
            const body = encodeURIComponent(message);
            window.location.href = `mailto:wahyuadhi35@gmail.com?subject=${subject}&body=${body}`;
        });
    }

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.querySelectorAll('.portfolio-card, .certificate-card, .stack-item').forEach(card => {
            card.addEventListener('pointermove', event => {
                const bounds = card.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                card.style.transform = `perspective(700px) rotateX(${y * -3}deg) rotateY(${x * 3}deg) translateY(-3px)`;
            });
            card.addEventListener('pointerleave', () => {
                card.style.transform = '';
            });
        });
    }

    // Subtle parallax on hero image
    const main = document.querySelector('main');
    const photo = document.querySelector('.photo');
    if (main && photo) {
        // add small float class
        photo.classList.add('floaty');

        main.addEventListener('mousemove', (e) => {
            const rect = main.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const tx = x * 12; // horizontal translate
            const ty = y * 10; // vertical translate
            photo.style.transform = `translate(${tx}px, ${ty}px) scale(1.02)`;
        });

        main.addEventListener('mouseleave', () => {
            photo.style.transform = '';
        });
    }
    // Theme toggle: persist in localStorage
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') root.classList.add('dark'), themeToggle && (themeToggle.textContent = '☀️');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = root.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggle.textContent = isDark ? '☀️' : '🌙';
        });
    }

    // Parallax-like stagger animation when clicking header links
    function animateSectionItems(container){
        if(!container) return;
        const selectors = 'h1,h2,h3,h4,h5,h6,p,.subtitle,.btn,.about-name,.about-label,.socials a';
        const items = Array.from(container.querySelectorAll(selectors));
        items.forEach((it, i) => {
            it.style.transition = 'transform .32s cubic-bezier(.2,.9,.3,1), opacity .32s';
            // quicker small upward move then settle back
            setTimeout(() => {
                it.style.transform = 'translateY(-10px)';
                it.style.opacity = '0.98';
                setTimeout(() => {
                    it.style.transform = 'translateY(0)';
                }, 180);
            }, i * 50);
        });
        // clear inline styles after animation to avoid interference
        setTimeout(() => {
            items.forEach(it => {
                it.style.transition = '';
                it.style.transform = '';
                it.style.opacity = '';
            });
        }, items.length * 50 + 400);
    }

    // attach to header nav links
    document.querySelectorAll('nav a[href^="#"]').forEach(a => {
        a.addEventListener('click', (ev) => {
            const href = a.getAttribute('href');
            const id = href && href !== '#' ? href.slice(1) : null;

            // let the browser handle scrolling; run animation on the destination
            const target = id ? document.getElementById(id) : document.querySelector('main');
            // small timeout so animation starts after browser begins scrolling
            setTimeout(() => {
                // trigger stagger items animation
                animateSectionItems(target);
                // trigger a short nav entry animation on the target container
                if(target){
                    target.classList.add('nav-animate');
                    // force reflow to ensure animation restarts if clicked again
                    void target.offsetWidth;
                    setTimeout(() => target.classList.remove('nav-animate'), 420);
                }
            }, 50);
        });
    });
});
