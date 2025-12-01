document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('entrance-overlay');
    const heroText = document.querySelector('.hero h1');
    const originalText = heroText.innerText;

    // Clear hero text initially for typing effect later
    heroText.innerText = '';

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
});
