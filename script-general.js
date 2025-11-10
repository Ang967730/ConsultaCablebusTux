/* ========================================
   JAVASCRIPT MEJORADO
   Sistema Cablebús - Gobierno de Chiapas
   ======================================== */

(function() {
    'use strict';

    /* ========================================
       INICIALIZACIÓN
       ======================================== */
    document.addEventListener('DOMContentLoaded', function() {
        initAnimatedCounters();
        initIntersectionObserver();
        initSmoothScroll();
        initLazyLoading();
        initAccessibility();
        initNavigationEnhancements();
        initFormValidation();
    });

    /* ========================================
       CONTADOR ANIMADO PARA ESTADÍSTICAS
       ======================================== */
    function initAnimatedCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        if (counters.length === 0) return;

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));
                    animateCounter(counter, target);
                    counterObserver.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(function(counter) {
            counterObserver.observe(counter);
        });
    }

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 60; // 60 frames para la animación
        const duration = 1500; // 1.5 segundos
        const stepTime = duration / 60;

        const timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }

    /* ========================================
       INTERSECTION OBSERVER PARA ANIMACIONES
       ======================================== */
    function initIntersectionObserver() {
        const animatedElements = document.querySelectorAll(
            '.feature-card, .benefit-item, .contact-item, .cta-section'
        );

        if (animatedElements.length === 0) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const elementObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    
                    // Agregar delay escalonado a elementos hermanos
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.animationDelay = (index * 0.1) + 's';
                }
            });
        }, observerOptions);

        animatedElements.forEach(function(element) {
            elementObserver.observe(element);
        });
    }

    /* ========================================
       SMOOTH SCROLL PARA ENLACES INTERNOS
       ======================================== */
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Ignorar enlaces a modales o con href="#"
                if (href === '#' || href.startsWith('#modal')) {
                    return;
                }

                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerOffset = 80; // Altura del header sticky
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Actualizar focus para accesibilidad
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            });
        });
    }

    /* ========================================
       LAZY LOADING PARA IMÁGENES
       ======================================== */
    function initLazyLoading() {
        // Usar la API nativa de lazy loading si está disponible
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(function(img) {
                img.src = img.dataset.src || img.src;
            });
        } else {
            // Fallback para navegadores antiguos
            const images = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(function(img) {
                imageObserver.observe(img);
            });
        }
    }

    /* ========================================
       MEJORAS DE ACCESIBILIDAD
       ======================================== */
    function initAccessibility() {
        // Agregar indicadores de foco visibles
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });

        // Mejorar anuncios para lectores de pantalla
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);

        // Anunciar cambios importantes
        window.announceToScreenReader = function(message) {
            liveRegion.textContent = message;
            setTimeout(function() {
                liveRegion.textContent = '';
            }, 1000);
        };
    }

    /* ========================================
       MEJORAS DE NAVEGACIÓN
       ======================================== */
    function initNavigationEnhancements() {
        // Resaltar enlace activo en la navegación
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.secondary-nav a');

        navLinks.forEach(function(link) {
            const linkPath = new URL(link.href).pathname;
            if (currentPath === linkPath || currentPath.endsWith(linkPath)) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });

        // Sticky header con sombra al hacer scroll
        const secondaryNav = document.querySelector('.secondary-nav');
        if (secondaryNav) {
            let lastScroll = 0;
            
            window.addEventListener('scroll', function() {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 100) {
                    secondaryNav.classList.add('scrolled');
                } else {
                    secondaryNav.classList.remove('scrolled');
                }

                lastScroll = currentScroll;
            }, { passive: true });
        }
    }

    /* ========================================
       VALIDACIÓN DE FORMULARIOS
       ======================================== */
    function initFormValidation() {
        const forms = document.querySelectorAll('form[data-validate]');

        forms.forEach(function(form) {
            form.addEventListener('submit', function(e) {
                if (!validateForm(form)) {
                    e.preventDefault();
                    
                    // Enfocar el primer campo con error
                    const firstError = form.querySelector('.has-error');
                    if (firstError) {
                        firstError.querySelector('input, textarea, select').focus();
                    }
                }
            });

            // Validación en tiempo real
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(function(input) {
                input.addEventListener('blur', function() {
                    validateField(input);
                });
            });
        });
    }

    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

        inputs.forEach(function(input) {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldContainer = field.closest('.form-group') || field.parentElement;
        let isValid = true;
        let errorMessage = '';

        // Limpiar errores previos
        fieldContainer.classList.remove('has-error');
        const existingError = fieldContainer.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Validación de campo requerido
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        }

        // Validación de email
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, introduce un email válido';
            }
        }

        // Validación de teléfono
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(value.replace(/\s|-/g, ''))) {
                isValid = false;
                errorMessage = 'Por favor, introduce un teléfono válido (10 dígitos)';
            }
        }

        // Mostrar error si es inválido
        if (!isValid) {
            fieldContainer.classList.add('has-error');
            const errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;
            errorElement.setAttribute('role', 'alert');
            fieldContainer.appendChild(errorElement);
            
            // Anunciar error al lector de pantalla
            if (window.announceToScreenReader) {
                window.announceToScreenReader(errorMessage);
            }
        }

        return isValid;
    }

    /* ========================================
       UTILIDADES
       ======================================== */
    
    // Throttle function para optimizar eventos de scroll/resize
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }

    // Debounce function para optimizar búsquedas/input
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    /* ========================================
       DETECCIÓN DE SCROLL PARA ANIMACIONES
       ======================================== */
    const throttledScroll = throttle(function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(function(element) {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = 'translateY(' + yPos + 'px)';
        });
    }, 16); // ~60fps

    window.addEventListener('scroll', throttledScroll, { passive: true });

    /* ========================================
       MANEJO DE ERRORES GLOBALES
       ======================================== */
    window.addEventListener('error', function(e) {
        console.error('Error detectado:', e.message);
        // Aquí se podría enviar el error a un servicio de monitoreo
    });

  
    /* ========================================
       EXPORTAR FUNCIONES ÚTILES GLOBALMENTE
       ======================================== */
    window.CablebusUtils = {
        throttle: throttle,
        debounce: debounce,
        validateForm: validateForm,
        announceToScreenReader: window.announceToScreenReader
    };

    console.log('✅ Sistema Cablebús - JavaScript inicializado correctamente');

})();



/* ========================================
   JAVASCRIPT PARA SLIDER DE GALERÍA
   Sistema Cablebús - Opción 1
   ======================================== */

(function() {
    'use strict';

    /* ========================================
       INICIALIZACIÓN
       ======================================== */
    document.addEventListener('DOMContentLoaded', function() {
        initGallerySlider();
    });

    /* ========================================
       SLIDER DE GALERÍA
       ======================================== */
    function initGallerySlider() {
        const sliderContainer = document.querySelector('.gallery-slider-container');
        if (!sliderContainer) return;

        const slider = sliderContainer.querySelector('.gallery-slider');
        const slides = slider.querySelectorAll('.gallery-slide');
        const prevBtn = sliderContainer.querySelector('.gallery-slider-control.prev');
        const nextBtn = sliderContainer.querySelector('.gallery-slider-control.next');
        const dots = sliderContainer.querySelectorAll('.gallery-slider-dots .dot');

        let currentSlide = 0;
        let autoplayInterval;
        let isTransitioning = false;
        const autoplayDelay = 4500; // 4.5 segundos
        const transitionDuration = 700;

        // Mostrar primera slide
        slides[0].classList.add('active');
        dots[0].classList.add('active');

        // Función para cambiar de slide
        function goToSlide(index) {
            if (isTransitioning || index === currentSlide) return;
            
            isTransitioning = true;

            // Remover clase active de slide actual
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');

            // Actualizar índice
            currentSlide = index;

            // Agregar clase active a nueva slide
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');

            // Anunciar cambio para lectores de pantalla
            if (window.announceToScreenReader) {
                window.announceToScreenReader('Imagen ' + (currentSlide + 1) + ' de ' + slides.length);
            }

            // Liberar transición después de la animación
            setTimeout(function() {
                isTransitioning = false;
            }, transitionDuration);
        }

        // Siguiente slide
        function nextSlide() {
            const next = (currentSlide + 1) % slides.length;
            goToSlide(next);
        }

        // Slide anterior
        function prevSlide() {
            const prev = (currentSlide - 1 + slides.length) % slides.length;
            goToSlide(prev);
        }

        // Event listeners para controles
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                nextSlide();
                resetAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                prevSlide();
                resetAutoplay();
            });
        }

        // Event listeners para dots
        dots.forEach(function(dot, index) {
            dot.addEventListener('click', function() {
                goToSlide(index);
                resetAutoplay();
            });
        });

        // Navegación con teclado
        sliderContainer.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoplay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoplay();
            }
        });

        // Autoplay
        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, autoplayDelay);
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        // Pausar autoplay al pasar el mouse
        sliderContainer.addEventListener('mouseenter', stopAutoplay);
        sliderContainer.addEventListener('mouseleave', startAutoplay);

        // Pausar autoplay cuando la página no está visible
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });

        // Iniciar autoplay
        startAutoplay();

        // Soporte para gestos táctiles
        addTouchSupport(sliderContainer, prevSlide, nextSlide);
    }

    /* ========================================
       SOPORTE PARA GESTOS TÁCTILES
       ======================================== */
    function addTouchSupport(container, prevCallback, nextCallback) {
        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50;

        container.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        container.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeDistance = touchStartX - touchEndX;
            
            if (Math.abs(swipeDistance) > minSwipeDistance) {
                if (swipeDistance > 0) {
                    // Swipe izquierda - siguiente
                    nextCallback();
                } else {
                    // Swipe derecha - anterior
                    prevCallback();
                }
            }
        }
    }

    console.log('✅ Slider de Galería del Sistema Cablebús inicializado correctamente');

})();

/* ========================================
   JAVASCRIPT PARA CARGA DINÁMICA DE VIDEO
   Sistema Cablebús - Gobierno de Chiapas
   ======================================== */

(function() {
    'use strict';

    /* ========================================
       INICIALIZACIÓN
       ======================================== */
    document.addEventListener('DOMContentLoaded', function() {
        initVideoLoader();
    });

    /* ========================================
       CARGADOR DE VIDEO DINÁMICO
       ======================================== */
    function initVideoLoader() {
        const videoContainer = document.getElementById('video-container');
        const videoPlaceholder = document.getElementById('video-placeholder');
        const videoContent = document.getElementById('video-content');
        const videoUrlInput = document.getElementById('video-url-input');
        const loadVideoBtn = document.getElementById('load-video-btn');

        if (!videoContainer || !loadVideoBtn) {
            console.warn('Video loader elements not found');
            return;
        }

        // Click en placeholder para mostrar controles
        if (videoPlaceholder) {
            videoPlaceholder.addEventListener('click', function() {
                const videoControls = document.querySelector('.video-controls');
                if (videoControls) {
                    videoControls.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    videoUrlInput.focus();
                }
            });
        }

        // Cargar video al hacer click en el botón
        loadVideoBtn.addEventListener('click', function() {
            const url = videoUrlInput.value.trim();
            if (url) {
                loadVideo(url);
            } else {
                showMessage('Por favor ingresa una URL válida', 'error');
            }
        });

        // Cargar video al presionar Enter
        videoUrlInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const url = videoUrlInput.value.trim();
                if (url) {
                    loadVideo(url);
                }
            }
        });

        // Verificar URL en parámetros
        checkURLParameters();
    }

    /* ========================================
       CARGAR VIDEO
       ======================================== */
    function loadVideo(url) {
        const videoPlaceholder = document.getElementById('video-placeholder');
        const videoContent = document.getElementById('video-content');

        if (!videoContent) return;

        // Limpiar contenido anterior
        videoContent.innerHTML = '';

        // Determinar tipo de video
        const videoType = detectVideoType(url);

        if (videoType === 'youtube') {
            loadYouTubeVideo(url, videoContent);
        } else if (videoType === 'file') {
            loadVideoFile(url, videoContent);
        } else {
            showMessage('URL no válida. Por favor ingresa una URL de YouTube o un archivo de video.', 'error');
            return;
        }

        // Ocultar placeholder y mostrar video
        if (videoPlaceholder) {
            videoPlaceholder.style.display = 'none';
        }
        videoContent.style.display = 'block';

        showMessage('Video cargado correctamente', 'success');

        // Scroll suave al video
        videoContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /* ========================================
       DETECTAR TIPO DE VIDEO
       ======================================== */
    function detectVideoType(url) {
        // YouTube URLs
        const youtubePatterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/,
            /youtube\.com\/watch\?.*v=([^&\s]+)/
        ];

        for (const pattern of youtubePatterns) {
            if (pattern.test(url)) {
                return 'youtube';
            }
        }

        // Archivos de video
        const videoExtensions = /\.(mp4|webm|ogg|mov)$/i;
        if (videoExtensions.test(url)) {
            return 'file';
        }

        return 'unknown';
    }

    /* ========================================
       CARGAR VIDEO DE YOUTUBE
       ======================================== */
    function loadYouTubeVideo(url, container) {
        // Extraer ID del video
        const videoId = extractYouTubeID(url);
        
        if (!videoId) {
            showMessage('No se pudo extraer el ID del video de YouTube', 'error');
            return;
        }

        // Crear iframe de YouTube
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.title = 'Video del Sistema Cablebús';
        iframe.className = 'youtube-video';

        container.appendChild(iframe);

        console.log('✅ Video de YouTube cargado:', videoId);
    }

    /* ========================================
       EXTRAER ID DE YOUTUBE
       ======================================== */
    function extractYouTubeID(url) {
        // Diferentes formatos de URL de YouTube
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
            /youtube\.com\/embed\/([^&\s]+)/,
            /youtube\.com\/v\/([^&\s]+)/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }

        return null;
    }

    /* ========================================
       CARGAR ARCHIVO DE VIDEO
       ======================================== */
    function loadVideoFile(url, container) {
        // Crear elemento video
        const video = document.createElement('video');
        video.controls = true;
        video.className = 'local-video';
        video.style.width = '100%';
        video.style.height = '100%';

        // Determinar tipo MIME
        const mimeType = getMimeType(url);

        // Crear source
        const source = document.createElement('source');
        source.src = url;
        source.type = mimeType;

        video.appendChild(source);

        // Mensaje de error si no se puede cargar
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Tu navegador no soporta la reproducción de este video.';
        errorMessage.style.color = 'white';
        errorMessage.style.padding = '2rem';
        errorMessage.style.textAlign = 'center';
        video.appendChild(errorMessage);

        // Event listener para errores
        video.addEventListener('error', function() {
            showMessage('Error al cargar el archivo de video. Verifica la URL o la ruta del archivo.', 'error');
        });

        // Event listener para carga exitosa
        video.addEventListener('loadeddata', function() {
            console.log('✅ Video local cargado correctamente');
        });

        container.appendChild(video);
    }

    /* ========================================
       OBTENER TIPO MIME
       ======================================== */
    function getMimeType(url) {
        const extension = url.split('.').pop().toLowerCase();
        
        const mimeTypes = {
            'mp4': 'video/mp4',
            'webm': 'video/webm',
            'ogg': 'video/ogg',
            'mov': 'video/quicktime'
        };

        return mimeTypes[extension] || 'video/mp4';
    }

    /* ========================================
       MOSTRAR MENSAJE
       ======================================== */
    function showMessage(text, type) {
        // Crear elemento de mensaje
        const message = document.createElement('div');
        message.className = `video-message video-message-${type}`;
        message.textContent = text;

        // Estilos básicos
        message.style.position = 'fixed';
        message.style.bottom = '20px';
        message.style.right = '20px';
        message.style.padding = '1rem 1.5rem';
        message.style.borderRadius = '8px';
        message.style.fontWeight = '600';
        message.style.zIndex = '10000';
        message.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
        message.style.animation = 'slideInRight 0.3s ease-out';

        if (type === 'success') {
            message.style.background = '#48bb78';
            message.style.color = 'white';
        } else if (type === 'error') {
            message.style.background = '#f56565';
            message.style.color = 'white';
        } else {
            message.style.background = '#4299e1';
            message.style.color = 'white';
        }

        // Agregar al DOM
        document.body.appendChild(message);

        // Remover después de 4 segundos
        setTimeout(function() {
            message.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(function() {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 4000);
    }

    /* ========================================
       VERIFICAR PARÁMETROS DE URL
       ======================================== */
    function checkURLParameters() {
        // Verificar si hay un parámetro "video" en la URL
        const urlParams = new URLSearchParams(window.location.search);
        const videoUrl = urlParams.get('video');

        if (videoUrl) {
            // Decodificar URL y cargar video automáticamente
            const decodedUrl = decodeURIComponent(videoUrl);
            const videoUrlInput = document.getElementById('video-url-input');
            
            if (videoUrlInput) {
                videoUrlInput.value = decodedUrl;
                
                // Cargar video después de un breve delay
                setTimeout(function() {
                    loadVideo(decodedUrl);
                }, 500);
            }
        }
    }

    /* ========================================
       ANIMACIONES CSS
       ======================================== */
    // Agregar estilos de animación si no existen
    if (!document.getElementById('video-loader-animations')) {
        const style = document.createElement('style');
        style.id = 'video-loader-animations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    console.log('✅ Video Loader inicializado correctamente');

})();

/* ========================================
   DESTACAR ENLACE ACTIVO AL HACER SCROLL
   ======================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.secondary-nav a[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(function(link) {
            link.classList.remove('scroll-active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('scroll-active');
            }
        });
    }, { passive: true });
}

// Agregar al final del DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... tus otras funciones ...
    initScrollSpy(); // Agregar esta línea
});