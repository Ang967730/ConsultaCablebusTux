/* ========================================
   JAVASCRIPT OPTIMIZADO Y FLUIDO
   Sistema Cablebús - Sin Trabas
   ======================================== */

(function() {
    'use strict';

    /* ========================================
       CONFIGURACIÓN GLOBAL
       ======================================== */
    const CONFIG = {
        stats: {
            autoplayDelay: 7000,     // 7 segundos para estadísticas
            transitionDuration: 600  // Transición rápida
        }
    };

    /* ========================================
       INICIALIZACIÓN
       ======================================== */
    document.addEventListener('DOMContentLoaded', function() {
        initGallerySlider();
        initStatsSlider();
        console.log('✅ Sliders inicializados correctamente');
    });

    /* ========================================
       GALERÍA PRINCIPAL - ESTABILIZADA SIN TRABAS
       ======================================== */
    function initGallerySlider() {
        const container = document.querySelector('.gallery-slider-container');
        if (!container) return;

        const slider = container.querySelector('.gallery-slider');
        const slides = Array.from(slider.querySelectorAll('.gallery-slide'));
        const prevBtn = container.querySelector('.gallery-slider-control.prev');
        const nextBtn = container.querySelector('.gallery-slider-control.next');
        const dots = Array.from(container.querySelectorAll('.gallery-slider-dots .dot'));

        let currentIndex = 0;
        let autoplayTimer = null;
        let isAnimating = false;

        // Inicializar primera slide
        if (slides.length > 0) {
            slides[0].classList.add('active');
            if (dots[0]) dots[0].classList.add('active');
        }

        // Mostrar slide específica
        function goToSlide(newIndex, userTriggered = false) {
            if (newIndex < 0 || newIndex >= slides.length || newIndex === currentIndex) return;
            if (isAnimating) return;

            isAnimating = true;

            slides.forEach((s, i) => s.classList.toggle('active', i === newIndex));
            dots.forEach((d, i) => d.classList.toggle('active', i === newIndex));

            currentIndex = newIndex;

            if (userTriggered) restartAutoplay();

            setTimeout(() => { isAnimating = false; }, CONFIG.gallery.transitionDuration);
        }

        // Cambiar a siguiente slide
        function nextSlide() {
            goToSlide((currentIndex + 1) % slides.length);
        }

        // Cambiar a anterior
        function prevSlide() {
            goToSlide((currentIndex - 1 + slides.length) % slides.length);
        }

        // AUTOPLAY — estable, sin aceleración
        function startAutoplay() {
            stopAutoplay(); // Limpia antes
            autoplayTimer = setTimeout(function advance() {
                nextSlide();
                autoplayTimer = setTimeout(advance, CONFIG.gallery.autoplayDelay);
            }, CONFIG.gallery.autoplayDelay);
        }

        function stopAutoplay() {
            if (autoplayTimer) {
                clearTimeout(autoplayTimer);
                autoplayTimer = null;
            }
        }

        function restartAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        // EVENTOS
        if (nextBtn) nextBtn.addEventListener('click', e => { e.preventDefault(); goToSlide((currentIndex + 1) % slides.length, true); });
        if (prevBtn) prevBtn.addEventListener('click', e => { e.preventDefault(); goToSlide((currentIndex - 1 + slides.length) % slides.length, true); });
        dots.forEach((dot, index) => dot.addEventListener('click', e => { e.preventDefault(); goToSlide(index, true); }));

        // Iniciar autoplay al cargar
        startAutoplay();
    }

    /* ========================================
       ESTADÍSTICAS - OPTIMIZADO SIN TRABAS
       ======================================== */
    function initStatsSlider() {
        const container = document.querySelector('.stats-slider-container');
        if (!container) return;

        const slider = container.querySelector('.stats-slider');
        const slides = Array.from(slider.querySelectorAll('.stats-slide'));
        const prevBtn = container.querySelector('.stats-slider-control.prev');
        const nextBtn = container.querySelector('.stats-slider-control.next');
        const dots = Array.from(container.querySelectorAll('.stats-slider-dots .dot'));

        let currentIndex = 0;
        let autoplayTimer = null;
        let isAnimating = false;

        if (slides.length > 0) {
            slides[0].classList.add('active');
            if (dots[0]) dots[0].classList.add('active');
            animateCounter(slides[0]);
        }

        function goToSlide(newIndex) {
            if (newIndex < 0 || newIndex >= slides.length || newIndex === currentIndex) return;

            if (isAnimating) {
                slides.forEach(s => s.classList.remove('active'));
                dots.forEach(d => d.classList.remove('active'));
            }

            isAnimating = true;

            slides[currentIndex].classList.remove('active');
            if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

            currentIndex = newIndex;

            slides[currentIndex].classList.add('active');
            if (dots[currentIndex]) dots[currentIndex].classList.add('active');

            animateCounter(slides[currentIndex]);

            setTimeout(() => { isAnimating = false; }, CONFIG.stats.transitionDuration);
            restartAutoplay();
        }

        function nextSlide() {
            goToSlide((currentIndex + 1) % slides.length);
        }

        function prevSlide() {
            goToSlide((currentIndex - 1 + slides.length) % slides.length);
        }

        // AUTOPLAY ESTABLE
        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(nextSlide, CONFIG.stats.autoplayDelay);
        }

        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        }

        function restartAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        // EVENTOS
        if (nextBtn) nextBtn.addEventListener('click', e => { e.preventDefault(); nextSlide(); });
        if (prevBtn) prevBtn.addEventListener('click', e => { e.preventDefault(); prevSlide(); });
        dots.forEach((dot, index) => dot.addEventListener('click', e => { e.preventDefault(); goToSlide(index); }));

        container.addEventListener('mouseenter', stopAutoplay);
        container.addEventListener('mouseleave', startAutoplay);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopAutoplay();
            else startAutoplay();
        });

        setupTouchGestures(container, prevSlide, nextSlide, restartAutoplay);
        startAutoplay();
    }

    /* ========================================
       ANIMACIÓN DE CONTADORES
       ======================================== */
    function animateCounter(slide) {
        const counter = slide.querySelector('.stats-number[data-count]');
        if (!counter) return;

        const target = parseFloat(counter.getAttribute('data-count'));
        const duration = 1500;
        const startTime = performance.now();
        const isDecimal = target % 1 !== 0;
        const decimals = isDecimal ? 1 : 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = target * easeProgress;

            counter.textContent = current.toFixed(decimals);

            if (progress < 1) requestAnimationFrame(update);
            else counter.textContent = target.toFixed(decimals);
        }

        requestAnimationFrame(update);
    }

    /* ========================================
       GESTOS TÁCTILES
       ======================================== */
    function setupTouchGestures(element, onSwipeLeft, onSwipeRight, onEnd) {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        const minSwipeDistance = 50;

        element.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        element.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeX = touchStartX - touchEndX;
            const swipeY = Math.abs(touchStartY - touchEndY);
            if (swipeY < 50 && Math.abs(swipeX) > minSwipeDistance) {
                if (swipeX > 0) onSwipeRight();
                else onSwipeLeft();
                if (onEnd) onEnd();
            }
        }
    }

    /* ========================================
       MANEJO DE ERRORES
       ======================================== */
    window.addEventListener('error', e => {
        if (e.message && e.message.toLowerCase().includes('slider')) {
            console.error('Error en slider:', e.message);
        }
    });

    console.log('✅ Sistema Cablebús - Sliders estabilizados cargados');

})();
