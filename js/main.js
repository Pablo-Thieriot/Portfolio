// Gestion du défilement horizontal
let scrollContainer = null;

// Paramètres du dégradé arc-en-ciel
const rainbowConfig = {
    baseHue: 110,
    hueRange: 180,
    saturation: 80,
    lightnessStart: 62,
    lightnessEnd: 72,
};

function handleWheel(event) {
    if (!scrollContainer) return;
    event.preventDefault();
    event.stopPropagation();

    const delta = event.deltaY;
    const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    scrollContainer.scrollLeft = Math.max(0, Math.min(scrollContainer.scrollLeft + delta, maxScrollLeft));
    updateRainbowBackground();
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialisation de GSAP et ScrollTrigger
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Initialisation des carousels
    initCarousel('.section.Blender .carousel');
    initCarousel('.game-carousel');

    // Fonction unique pour initialiser un carousel avec GSAP et boucle infinie
    function initCarousel(carouselSelector) {
        const carousel = document.querySelector(carouselSelector);
        if (!carousel) return;

        const carouselInner = carousel.querySelector('.carousel-inner') || carousel.querySelector('.game-carousel-inner');
        if (!carouselInner) return;

        // IMPORTANT: Supprimer la transition CSS pour éviter les conflits
        carouselInner.style.transition = 'none';

        const items = Array.from(carouselInner.querySelectorAll('.carousel-item'));
        const prevControl = carousel.querySelector('[class*="carousel-control-prev"]');
        const nextControl = carousel.querySelector('[class*="carousel-control-next"]');

        const totalItems = items.length;
        if (totalItems === 0) return;

        // Cloner les éléments pour la boucle infinie
        items.forEach(item => {
            const clone = item.cloneNode(true);
            clone.classList.add('clone');
            carouselInner.appendChild(clone);
        });

        // Aussi cloner au début pour aller en arrière
        items.slice().reverse().forEach(item => {
            const clone = item.cloneNode(true);
            clone.classList.add('clone');
            carouselInner.insertBefore(clone, carouselInner.firstChild);
        });

        let currentIndex = totalItems; // Commence au milieu (après les clones du début)
        let isAnimating = false;
        const animDuration = 0.4;

        // Position initiale (sans animation)
        gsap.set(carouselInner, { x: `${-currentIndex * 100}%` });

        function updateClasses() {
            const allItems = carouselInner.querySelectorAll('.carousel-item');
            allItems.forEach((item, i) => {
                item.classList.remove('active', 'prev', 'next');
                if (i === currentIndex) {
                    item.classList.add('active');
                } else if (i === currentIndex - 1) {
                    item.classList.add('prev');
                } else if (i === currentIndex + 1) {
                    item.classList.add('next');
                }
            });
        }

        function goTo(index) {
            if (isAnimating) return;
            isAnimating = true;

            // Kill toute animation en cours pour éviter les conflits
            gsap.killTweensOf(carouselInner);

            currentIndex = index;
            const offset = -currentIndex * 100;

            gsap.to(carouselInner, {
                x: `${offset}%`,
                duration: animDuration,
                ease: "none",
                onUpdate: updateClasses,
                onComplete: () => {
                    // Saut invisible pour boucle infinie
                    if (currentIndex >= totalItems * 2) {
                        currentIndex = totalItems;
                        gsap.set(carouselInner, { x: `${-currentIndex * 100}%` });
                    } else if (currentIndex < totalItems) {
                        currentIndex = totalItems * 2 - 1;
                        gsap.set(carouselInner, { x: `${-currentIndex * 100}%` });
                    }
                    updateClasses();

                    // Petit délai supplémentaire avant de permettre le prochain clic
                    setTimeout(() => {
                        isAnimating = false;
                    }, 50);
                }
            });
        }

        function goNext() {
            goTo(currentIndex + 1);
        }

        function goPrev() {
            goTo(currentIndex - 1);
        }

        if (prevControl) {
            prevControl.addEventListener('click', (e) => {
                e.preventDefault();
                goPrev();
            });
        }

        if (nextControl) {
            nextControl.addEventListener('click', (e) => {
                e.preventDefault();
                goNext();
            });
        }

        updateClasses();
    }

    // Gestion de la navigation fluide au clic
    const navLinks = document.querySelectorAll('.nav-bar a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Méthode standard et robuste
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            }
        });
    });

    scrollContainer = document.querySelector('.container');
    if (scrollContainer) {
        scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
        scrollContainer.addEventListener('scroll', updateRainbowBackground, { passive: true });
        updateRainbowBackground();
    }

    function updateRainbowBackground() {
        if (!scrollContainer) return;
        const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        const progress = maxScrollLeft > 0 ? scrollContainer.scrollLeft / maxScrollLeft : 0;
        const hueStart = rainbowConfig.baseHue + progress * rainbowConfig.hueRange;
        const hueEnd = hueStart + 45;

        const color1 = `hsl(${Math.round(hueStart)}, ${rainbowConfig.saturation}%, ${rainbowConfig.lightnessStart}%)`;
        const color2 = `hsl(${Math.round(hueEnd)}, ${rainbowConfig.saturation}%, ${rainbowConfig.lightnessEnd}%)`;

        document.documentElement.style.setProperty('--bg1', color1);
        document.documentElement.style.setProperty('--bg2', color2);
        document.body.style.background = `linear-gradient(to bottom, ${color1}, ${color2})`;
    }

    // Gestion du tooltip pour le numéro de téléphone
    const phoneIcon = document.querySelector('.lucide-phone');
    if (phoneIcon) {
        let tooltip;

        phoneIcon.addEventListener('mouseenter', () => {
            const phoneNumber = phoneIcon.getAttribute('data-tooltip');
            tooltip = document.createElement('div');
            tooltip.classList.add('tooltip');
            tooltip.textContent = phoneNumber;
            document.body.appendChild(tooltip);

            const rect = phoneIcon.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
        });

        phoneIcon.addEventListener('mouseleave', () => {
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
                tooltip.remove();
                tooltip = null;
            }
        });
    }
});

