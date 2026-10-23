/*
 * Correo y WhatsApp: único lugar para cambiarlos.
 * whatsappNumber son dígitos con clave de país, sin + ni espacios.
 * Si whatsappNumber queda vacío o no es numérico, los botones de WhatsApp no se muestran.
 */
const CONTACT = {
    email: 'eduardo@abyssol.tech',
    whatsappNumber: '525545010201',
    whatsappDisplay: '55 4501 0201',
    whatsappText: 'Hola ATS, quiero información sobre sus servicios',
};

const SITE = {
    brand: document.documentElement.dataset.brand || 'Abys Technologies Solutions',
    tagline: document.documentElement.dataset.tagline || 'IA, ingeniería y software',
};

function whatsappDigits() {
    return String(CONTACT.whatsappNumber || '').replace(/\D/g, '');
}

function hasWhatsapp() {
    return /^[0-9]{10,15}$/.test(whatsappDigits());
}

function whatsappHref(text) {
    if (!hasWhatsapp()) return '';
    const message = text == null || text === '' ? CONTACT.whatsappText : text;
    return `https://wa.me/${whatsappDigits()}?text=${encodeURIComponent(message)}`;
}

function formFields(form) {
    return Object.fromEntries(new FormData(form).entries());
}

function messageBody(fields) {
    return [
        `Nombre: ${fields.nombre || ''}`,
        `Empresa: ${fields.empresa || ''}`,
        `Correo: ${fields.correo || ''}`,
        `Teléfono: ${fields.telefono || ''}`,
        `Servicio de interés: ${fields.servicio || ''}`,
        '',
        fields.mensaje || '',
    ].join('\n');
}

function mailtoHref(fields) {
    const subject = `Consulta ATS: ${fields.servicio || 'proyecto'}`;
    return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(messageBody(fields))}`;
}

function visitContactUrl(url) {
    window.location.href = url;
}

function openExternal(url) {
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) window.visitContactUrl(url);
}

document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const overlay = document.getElementById('entrance-overlay');

    const brandEl = document.querySelector('.company-name');
    const taglineEl = document.querySelector('.tagline');
    const footerBrand = document.querySelector('.footer-brand');
    if (brandEl) brandEl.textContent = SITE.brand;
    if (taglineEl) taglineEl.textContent = SITE.tagline;
    if (footerBrand) footerBrand.textContent = SITE.brand;

    const yearEl = document.getElementById('copyright-year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    applyContactLinks();

    if (reduceMotion) {
        if (overlay) overlay.remove();
    } else if (overlay) {
        window.setTimeout(() => {
            overlay.classList.add('shatter');
            window.setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }, 700);
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const id = anchor.getAttribute('href');
            const target = id ? document.querySelector(id) : null;
            if (!target) return;
            event.preventDefault();
            if (anchor.dataset.service) {
                const select = document.getElementById('servicio');
                if (select) select.value = anchor.dataset.service;
            }
            target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
            closeMenu();
        });
    });

    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');

    function setMenu(open) {
        if (!mobileBtn || !nav) return;
        mobileBtn.classList.toggle('active', open);
        nav.classList.toggle('active', open);
        mobileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        mobileBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        const mobile = window.matchMedia('(max-width: 768px)').matches;
        nav.inert = mobile ? !open : false;
    }

    function closeMenu() {
        setMenu(false);
    }

    if (mobileBtn && nav) {
        setMenu(false);
        mobileBtn.addEventListener('click', () => {
            setMenu(!nav.classList.contains('active'));
        });
        window.matchMedia('(max-width: 768px)').addEventListener('change', () => setMenu(false));
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });

    setupCarousel();
    setupCards();
    setupForm();
    watchContactOverlap();
});

function applyContactLinks() {
    const emailLink = document.getElementById('contact-email-link');
    if (emailLink && CONTACT.email) {
        emailLink.href = `mailto:${CONTACT.email}`;
        emailLink.textContent = CONTACT.email;
    }

    const href = whatsappHref();
    const inline = document.getElementById('contact-whatsapp-inline');
    const floating = document.getElementById('whatsapp-float');
    const formButton = document.getElementById('send-whatsapp');
    const label = `WhatsApp ${CONTACT.whatsappDisplay}`.trim();

    [inline, floating, formButton].forEach((element) => {
        if (!element) return;
        if (!href) {
            element.hidden = true;
            return;
        }
        element.hidden = false;
        if (element.tagName === 'A') {
            element.href = href;
            element.target = '_blank';
            element.rel = 'noopener noreferrer';
        }
    });

    if (inline && href) inline.textContent = label;
    if (floating && href) floating.setAttribute('aria-label', label);
}

function setupCards() {
    document.querySelectorAll('.card-media img').forEach((img) => {
        const mark = () => img.closest('.card')?.classList.add('card--no-image');
        img.addEventListener('error', mark);
        if (img.complete && img.naturalWidth === 0) mark();
    });
}

function setupForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const whatsappButton = document.getElementById('send-whatsapp');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const fields = formFields(form);
        window.visitContactUrl(mailtoHref(fields));
        if (status) {
            status.textContent = `Se abrió tu aplicación de correo con el mensaje para ${CONTACT.email}. Si no aparece el borrador, escríbenos por WhatsApp.`;
        }
    });

    if (whatsappButton) {
        whatsappButton.addEventListener('click', () => {
            if (!hasWhatsapp() || !form.reportValidity()) return;
            const fields = formFields(form);
            const text = `${CONTACT.whatsappText}\n\n${messageBody(fields)}`;
            const url = whatsappHref(text);
            if (!url) return;
            openExternal(url);
            if (status) status.textContent = 'Se abrió WhatsApp con tu mensaje listo para enviar.';
        });
    }
}

function setupCarousel() {
    const carousel = document.getElementById('services-carousel');
    const viewport = carousel ? carousel.querySelector('.carousel-viewport') : null;
    const track = document.getElementById('service-track');
    const prevButton = carousel ? carousel.querySelector('.carousel-btn.prev') : null;
    const nextButton = carousel ? carousel.querySelector('.carousel-btn.next') : null;
    const status = document.getElementById('carousel-status');
    if (!carousel || !viewport || !track || !prevButton || !nextButton) return;

    const slides = Array.from(track.children);
    let index = 0;

    const stackedQuery = window.matchMedia('(max-width: 768px)');

    function visibleCount() {
        if (stackedQuery.matches) return slides.length;
        return viewport.clientWidth < 900 ? 2 : 3;
    }

    function layout() {
        const stacked = stackedQuery.matches;
        const visible = visibleCount();
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const maxIndex = stacked ? 0 : Math.max(0, slides.length - visible);
        index = Math.min(index, maxIndex);

        if (stacked) {
            track.style.transform = 'none';
            slides.forEach((slide) => {
                slide.style.flexBasis = 'auto';
            });
        } else {
            const slideWidth = (viewport.clientWidth - gap * (visible - 1)) / visible;
            slides.forEach((slide) => {
                slide.style.flexBasis = `${slideWidth}px`;
            });
            track.style.transform = `translateX(-${index * (slideWidth + gap)}px)`;
        }

        const canSlide = !stacked && slides.length > visible;
        prevButton.hidden = !canSlide;
        nextButton.hidden = !canSlide;
        prevButton.disabled = index <= 0;
        nextButton.disabled = index >= maxIndex;

        if (status) {
            if (stacked || !canSlide) {
                status.textContent = `${slides.length} servicios`;
            } else {
                const end = Math.min(slides.length, index + visible);
                status.textContent = `Mostrando servicios ${index + 1} a ${end} de ${slides.length}`;
            }
        }
    }

    function move(direction) {
        if (stackedQuery.matches) return;
        const maxIndex = Math.max(0, slides.length - visibleCount());
        index = Math.min(maxIndex, Math.max(0, index + direction));
        layout();
    }

    carousel.classList.add('is-ready');
    prevButton.addEventListener('click', () => move(-1));
    nextButton.addEventListener('click', () => move(1));

    let startX = null;
    viewport.addEventListener('pointerdown', (event) => {
        if (event.target.closest('a, button')) return;
        startX = event.clientX;
    });
    viewport.addEventListener('pointerup', (event) => {
        if (startX == null) return;
        const delta = event.clientX - startX;
        startX = null;
        if (stackedQuery.matches || Math.abs(delta) < 48) return;
        move(delta < 0 ? 1 : -1);
    });

    let frame = 0;
    window.addEventListener('resize', () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(layout);
    });
    stackedQuery.addEventListener('change', layout);
    layout();
    window.addEventListener('load', layout);
}

function watchContactOverlap() {
    const floating = document.getElementById('whatsapp-float');
    const contact = document.getElementById('contact');
    if (!floating || !contact || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        const covering = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio > 0.45);
        floating.classList.toggle('is-overlapping', covering);
    }, { threshold: [0.45] });
    observer.observe(contact);
}
