document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('entrance-overlay');
    const heroText = document.querySelector('.hero h1');
    const originalText = heroText ? heroText.innerText : '';

    // Clear hero text initially for typing effect later
    if (heroText) {
        heroText.innerText = '';
    }

    // Entrance Sequence
    setTimeout(() => {
        // Trigger shatter/fade out of overlay
        overlay.classList.add('shatter');

        // Remove overlay from DOM after animation
        setTimeout(() => {
            overlay.style.display = 'none';
            startHeroTyping();
        }, 800);
    }, 3000); // Wait 3 seconds for the "System Initialized" typing

    function startHeroTyping() {
        if (!heroText) return;
        let i = 0;
        const speed = 50; // ms per char

        function typeWriter() {
            if (i < originalText.length) {
                heroText.innerHTML += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }

        // Small delay before typing starts after overlay is gone
        setTimeout(typeWriter, 500);
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // Carousel Logic
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');

    if (track && slides.length > 0) {
        const slideWidth = slides[0].getBoundingClientRect().width;

        // Arrange the slides next to one another
        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        slides.forEach(setSlidePosition);

        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        // When I click left, move slides to the left
        prevButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const prevSlide = currentSlide.previousElementSibling;

            if (prevSlide) {
                moveToSlide(track, currentSlide, prevSlide);
            }
        });

        // When I click right, move slides to the right
        nextButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const nextSlide = currentSlide.nextElementSibling;

            if (nextSlide) {
                moveToSlide(track, currentSlide, nextSlide);
            }
        });
    }
});
