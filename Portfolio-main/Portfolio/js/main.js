// Gestion du défilement horizontal
let scrollAmount = 0;
let isScrolling = false;

document.addEventListener('wheel', function(event) {
    // Empêche le défilement vertical par défaut
    event.preventDefault();
    
    
    // Utilise deltaY de la souris pour un défilement horizontal
    if (event.deltaY !== 0) {
        scrollAmount += event.deltaY;
        if (!isScrolling) {
            isScrolling = true;
            smoothHorizontalScroll();
        }
    }
}, { passive: false }); // Important pour permettre preventDefault

function smoothHorizontalScroll() {
    if (Math.abs(scrollAmount) > 0.5) {
        // Utiliser scrollBy avec les paramètres left pour un défilement horizontal
        window.scrollBy({
            top: 0, // Pas de défilement vertical
            left: scrollAmount / 10,
            behavior: 'auto'
        });
        scrollAmount *= 0.9; // Réduction progressive
        requestAnimationFrame(smoothHorizontalScroll);
    } else {
        scrollAmount = 0;
        isScrolling = false;
    }
}

// Tooltip pour l'icône de téléphone
document.addEventListener('DOMContentLoaded', function() {
    const phoneIcon = document.querySelector('.lucide-phone');
    if (phoneIcon) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = phoneIcon.getAttribute('data-tooltip');
        document.body.appendChild(tooltip);

        phoneIcon.addEventListener('mouseover', function(event) {
            const rect = phoneIcon.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`;
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
        });

        phoneIcon.addEventListener('mouseout', function() {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        });
    }
});



document.addEventListener('DOMContentLoaded', function() {
    typeEffect();
});

// Initialisation des carrousels
document.addEventListener('DOMContentLoaded', function() {
    // Premier carousel
    initCarousel('.carousel-inner', '.carousel-item', '.carousel-control-prev', '.carousel-control-next');
    
    // Deuxième carousel
    initCarousel('.carousel-inner2', '.carousel-item2', '.carousel-control-prev2', '.carousel-control-next2');
    
    // Applique l'effet de zoom au clic sur toutes les images du deuxième carrousel
    document.querySelectorAll('.carousel-item2 img').forEach(img => {
        img.addEventListener('click', function() {
            this.classList.toggle('zoomed');
        });
    });
});

// Fonction réutilisable pour initialiser un carrousel
function initCarousel(innerSelector, itemSelector, prevSelector, nextSelector) {
    const carouselInner = document.querySelector(innerSelector);
    if (!carouselInner) return;
    
    const carouselItems = document.querySelectorAll(itemSelector);
    const prevButton = document.querySelector(prevSelector);
    const nextButton = document.querySelector(nextSelector);
    let currentIndex = 0;
    
    // Clone les éléments du carrousel pour un défilement infini
    const originalContent = carouselInner.innerHTML;
    carouselInner.innerHTML += originalContent;
    
    function updateCarousel() {
        const offset = -currentIndex * 100;
        carouselInner.style.transition = 'transform 0.5s ease';
        carouselInner.style.transform = `translateX(${offset}%)`;
        
        // Gestion de la boucle infinie
        if (currentIndex >= carouselItems.length) {
            setTimeout(() => {
                carouselInner.style.transition = 'none';
                currentIndex = 0;
                carouselInner.style.transform = `translateX(0%)`;
                
                // Réactive la transition après avoir sauté
                setTimeout(() => {
                    carouselInner.style.transition = 'transform 0.5s ease';
                }, 50);
            }, 500);
        } else if (currentIndex < 0) {
            setTimeout(() => {
                carouselInner.style.transition = 'none';
                currentIndex = carouselItems.length - 1;
                const newOffset = -currentIndex * 100;
                carouselInner.style.transform = `translateX(${newOffset}%)`;
                
                // Réactive la transition après avoir sauté
                setTimeout(() => {
                    carouselInner.style.transition = 'transform 0.5s ease';
                }, 50);
            }, 500);
        }
        
        // Met à jour les classes des éléments
        document.querySelectorAll(itemSelector).forEach((item, index) => {
            const adjustedIndex = index % carouselItems.length;
            const isActive = adjustedIndex === currentIndex % carouselItems.length;
            const isPrev = adjustedIndex === (currentIndex - 1 + carouselItems.length) % carouselItems.length;
            const isNext = adjustedIndex === (currentIndex + 1) % carouselItems.length;
            
            item.classList.remove('active', 'prev', 'next');
            if (isActive) item.classList.add('active');
            if (isPrev) item.classList.add('prev');
            if (isNext) item.classList.add('next');
        });
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', function(event) {
            event.preventDefault();
            currentIndex--;
            updateCarousel();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function(event) {
            event.preventDefault();
            currentIndex++;
            updateCarousel();
        });
    }
    
    // Initialisation de l'état actif
    updateCarousel();
}
