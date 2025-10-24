/* ========================================
   JAVASCRIPT PARA PREGUNTAS FRECUENTES
   (preguntas.html)
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const faqItems = document.querySelectorAll('.faq-item');
    const searchInput = document.getElementById('searchInput');
    const noResults = document.querySelector('.no-results');
    const categories = document.querySelectorAll('.faq-category');
    const topQuestionsContainer = document.getElementById('topQuestions');
    const searchSuggestions = document.getElementById('searchSuggestions');

    // Sistema de métricas para consultas frecuentes
    const metricsSystem = {
        searchQueries: JSON.parse(localStorage.getItem('cablebus_search_queries') || '{}'),
        questionClicks: JSON.parse(localStorage.getItem('cablebus_question_clicks') || '{}'),
        
        // Registrar búsqueda
        trackSearch(query) {
            if (query.length < 3) return;
            
            const normalizedQuery = query.toLowerCase().trim();
            this.searchQueries[normalizedQuery] = (this.searchQueries[normalizedQuery] || 0) + 1;
            this.saveData();
            this.updateTopQuestions();
        },
        
        // Registrar click en pregunta
        trackQuestionClick(questionText) {
            const normalizedQuestion = questionText.toLowerCase().trim();
            this.questionClicks[normalizedQuestion] = (this.questionClicks[normalizedQuestion] || 0) + 1;
            this.saveData();
            this.updateTopQuestions();
        },
        
        // Guardar datos
        saveData() {
            localStorage.setItem('cablebus_search_queries', JSON.stringify(this.searchQueries));
            localStorage.setItem('cablebus_question_clicks', JSON.stringify(this.questionClicks));
        },
        
        // Obtener top consultas
        getTopQueries(limit = 4) {
            const allQueries = [];
            
            // Agregar búsquedas
            Object.entries(this.searchQueries).forEach(([query, count]) => {
                allQueries.push({
                    text: query,
                    count: count,
                    type: 'búsqueda'
                });
            });
            
            // Agregar preguntas clickeadas
            Object.entries(this.questionClicks).forEach(([question, count]) => {
                allQueries.push({
                    text: question.substring(0, 50) + '...',
                    count: count,
                    type: 'pregunta'
                });
            });
            
            return allQueries
                .sort((a, b) => b.count - a.count)
                .slice(0, limit);
        },
        
        // Actualizar display de top consultas
        updateTopQuestions() {
            if (!topQuestionsContainer) return;
            
            const topQueries = this.getTopQueries(4);
            
            if (topQueries.length === 0) {
                topQuestionsContainer.innerHTML = `
                    <div class="metric-card">
                        <div class="metric-info">
                            <h4>Sistema iniciando...</h4>
                            <p>Las métricas aparecerán conforme se use el sistema</p>
                        </div>
                        <div class="metric-count">0</div>
                    </div>
                `;
                return;
            }
            
            topQuestionsContainer.innerHTML = topQueries.map(item => `
                <div class="metric-card">
                    <div class="metric-info">
                        <h4>${item.text}</h4>
                        <p>Tipo: ${item.type}</p>
                    </div>
                    <div class="metric-count">${item.count}</div>
                </div>
            `).join('');
        }
    };

    // Inicializar funcionalidades
    initFAQToggle();
    initSearchFunctionality();
    initNavigationSmoothScroll();
    initSearchSuggestions();
    
    // Inicializar métricas
    metricsSystem.updateTopQuestions();

    /**
     * Inicializa la funcionalidad de toggle para las preguntas FAQ
     */
    function initFAQToggle() {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (question && answer) {
                question.addEventListener('click', function() {
                    const questionText = question.textContent.replace('+', '').replace('×', '').trim();
                    
                    // Registrar métricas
                    metricsSystem.trackQuestionClick(questionText);
                    
                    toggleFAQItem(item, answer);
                });

                // Hacer accesible con teclado
                question.setAttribute('tabindex', '0');
                question.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        question.click();
                    }
                });
            }
        });
    }

    /**
     * Alterna la visibilidad de un elemento FAQ
     */
    function toggleFAQItem(item, answer) {
        const isActive = item.classList.contains('active');
        
        // Cerrar todos los elementos FAQ
        closeAllFAQItems();

        // Abrir el elemento clickeado si no estaba activo
        if (!isActive) {
            item.classList.add('active');
            answer.classList.add('active');
            
            // Cambiar icono
            const toggle = item.querySelector('.faq-toggle');
            if (toggle) toggle.textContent = '×';
            
            // Scroll suave hacia el elemento abierto
            setTimeout(() => {
                item.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 100);
        }
    }

    /**
     * Cierra todos los elementos FAQ
     */
    function closeAllFAQItems() {
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            const toggle = otherItem.querySelector('.faq-toggle');
            
            if (otherAnswer) {
                otherAnswer.classList.remove('active');
            }
            if (toggle) {
                toggle.textContent = '+';
            }
        });
    }

    /**
     * Inicializa la funcionalidad de búsqueda
     */
    function initSearchFunctionality() {
        if (searchInput) {
            // Búsqueda en tiempo real
            let searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    handleSearch();
                }, 300);
            });
            
            // Limpiar búsqueda con tecla Escape
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    clearSearch();
                }
            });

            // Rastrear búsquedas cuando se presiona Enter
            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    const query = this.value.trim();
                    if (query.length >= 3) {
                        metricsSystem.trackSearch(query);
                    }
                }
            });
        }
    }

    /**
     * Maneja la funcionalidad de búsqueda
     */
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleItems = 0;

        // Resetear estado si no hay término de búsqueda
        if (searchTerm === '') {
            resetSearchResults();
            hideSearchSuggestions();
            return;
        }

        // Buscar en preguntas y respuestas
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            const questionText = question ? question.textContent.toLowerCase() : '';
            const answerText = answer ? answer.textContent.toLowerCase() : '';
            
            const matchFound = questionText.includes(searchTerm) || answerText.includes(searchTerm);
            
            if (matchFound) {
                showItem(item);
                highlightSearchTerm(question, searchTerm);
                highlightSearchTerm(answer, searchTerm);
                visibleItems++;
            } else {
                hideItem(item);
            }
        });

        // Actualizar visibilidad de categorías
        updateCategoryVisibility(searchTerm);
        
        // Mostrar/ocultar mensaje de no resultados
        toggleNoResultsMessage(visibleItems, searchTerm);
        
        // Actualizar sugerencias
        updateSearchSuggestions(searchTerm);
    }

    /**
     * Inicializa sugerencias de búsqueda
     */
    function initSearchSuggestions() {
        if (!searchInput || !searchSuggestions) return;
        
        const commonSuggestions = [
            'costo del cablebús',
            'horarios de operación',
            'estaciones del cablebús',
            'seguridad',
            'accesibilidad',
            'medio ambiente',
            'construcción',
            'rutas'
        ];

        searchInput.addEventListener('focus', function() {
            if (this.value.trim() === '') {
                showSuggestions(commonSuggestions.slice(0, 4));
            }
        });

        searchInput.addEventListener('blur', function() {
            // Delay para permitir clicks en sugerencias
            setTimeout(() => {
                hideSearchSuggestions();
            }, 200);
        });
    }

    /**
     * Actualiza las sugerencias de búsqueda
     */
    function updateSearchSuggestions(searchTerm) {
        if (!searchSuggestions || searchTerm.length < 2) {
            hideSearchSuggestions();
            return;
        }

        const suggestions = [];
        
        // Buscar en preguntas FAQ para sugerencias
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                const questionText = question.textContent.toLowerCase();
                if (questionText.includes(searchTerm) && suggestions.length < 4) {
                    const shortText = question.textContent.substring(0, 60) + '...';
                    suggestions.push(shortText);
                }
            }
        });

        if (suggestions.length > 0) {
            showSuggestions(suggestions);
        } else {
            hideSearchSuggestions();
        }
    }

    /**
     * Muestra sugerencias de búsqueda
     */
    function showSuggestions(suggestions) {
        if (!searchSuggestions) return;
        
        searchSuggestions.innerHTML = suggestions.map(suggestion => 
            `<div class="suggestion-item" onclick="selectSuggestion('${suggestion.replace(/'/g, "\\'")}')">
                ${suggestion}
            </div>`
        ).join('');
        
        searchSuggestions.style.display = 'block';
    }

    /**
     * Oculta sugerencias de búsqueda
     */
    function hideSearchSuggestions() {
        if (searchSuggestions) {
            searchSuggestions.style.display = 'none';
        }
    }

    /**
     * Selecciona una sugerencia
     */
    window.selectSuggestion = function(suggestion) {
        if (searchInput) {
            searchInput.value = suggestion.replace('...', '');
            handleSearch();
            hideSearchSuggestions();
            searchInput.focus();
        }
    };

    /**
     * Resalta términos de búsqueda en el texto
     */
    function highlightSearchTerm(element, searchTerm) {
        if (!element || !searchTerm) return;
        
        // Remover highlights existentes
        element.innerHTML = element.innerHTML.replace(/<mark class="highlight">(.*?)<\/mark>/gi, '$1');
        
        // Agregar nuevos highlights
        const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
        element.innerHTML = element.innerHTML.replace(regex, '<mark class="highlight">$1</mark>');
    }

    /**
     * Escapa caracteres especiales de regex
     */
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Muestra un elemento FAQ
     */
    function showItem(item) {
        item.style.display = 'block';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }

    /**
     * Oculta un elemento FAQ
     */
    function hideItem(item) {
        item.style.display = 'none';
    }

    /**
     * Actualiza la visibilidad de las categorías
     */
    function updateCategoryVisibility(searchTerm) {
        categories.forEach(category => {
            const categoryItems = category.querySelectorAll('.faq-item');
            const visibleCategoryItems = Array.from(categoryItems).filter(item => 
                item.style.display !== 'none'
            );
            
            if (visibleCategoryItems.length > 0 || searchTerm === '') {
                category.style.display = 'block';
            } else {
                category.style.display = 'none';
            }
        });
    }

    /**
     * Alterna el mensaje de no resultados
     */
    function toggleNoResultsMessage(visibleItems, searchTerm) {
        if (noResults) {
            if (visibleItems === 0 && searchTerm !== '') {
                noResults.style.display = 'block';
            } else {
                noResults.style.display = 'none';
            }
        }
    }

    /**
     * Limpia la búsqueda
     */
    function clearSearch() {
        if (searchInput) {
            searchInput.value = '';
            handleSearch();
            searchInput.focus();
        }
    }

    /**
     * Resetea los resultados de búsqueda
     */
    function resetSearchResults() {
        // Mostrar todos los elementos
        faqItems.forEach(item => {
            showItem(item);
            // Remover highlights
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            [question, answer].forEach(element => {
                if (element) {
                    element.innerHTML = element.innerHTML.replace(/<mark class="highlight">(.*?)<\/mark>/gi, '$1');
                }
            });
        });

        // Mostrar todas las categorías
        categories.forEach(category => {
            category.style.display = 'block';
        });

        // Ocultar mensaje de no resultados
        if (noResults) {
            noResults.style.display = 'none';
        }
    }

    /**
     * Inicializa navegación suave
     */
    function initNavigationSmoothScroll() {
        // Navegación en menú secundario
        document.querySelectorAll('.secondary-nav a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Actualizar navegación activa
                    document.querySelectorAll('.secondary-nav a').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    // Scroll suave
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Scroll spy para actualizar navegación
        window.addEventListener('scroll', updateActiveNavigation);
    }

    /**
     * Actualiza navegación activa basada en scroll
     */
    function updateActiveNavigation() {
        const sections = ['inicio', 'acerca-de', 'preguntas-frecuentes'];
        const navLinks = document.querySelectorAll('.secondary-nav a');
        
        let currentSection = '';
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    currentSection = sectionId;
                }
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Sistema de analytics simplificado
     */
    function trackPageEvent(eventName, data = {}) {
        // Integración con Google Analytics si está disponible
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'FAQ_Cablebus',
                ...data
            });
        }
        
        // Log local para debugging
        console.log(`📊 Event: ${eventName}`, data);
    }

    /**
     * Inicialización de eventos de analytics
     */
    function initAnalytics() {
        // Track page load
        trackPageEvent('page_load', {
            page_title: document.title,
            page_location: window.location.href
        });

        // Track tiempo en página
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            trackPageEvent('time_on_page', { time_seconds: timeOnPage });
        });
    }

    // Inicializar analytics
    initAnalytics();

    /**
     * Función de utilidad para debugging
     */
    function debugInfo() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('🚠 FAQ Cablebús - Sistema iniciado');
            console.log(`📊 Elementos FAQ: ${faqItems.length}`);
            console.log(`📂 Categorías: ${categories.length}`);
            console.log(`🔍 Búsquedas registradas: ${Object.keys(metricsSystem.searchQueries).length}`);
            console.log(`👆 Clicks registrados: ${Object.keys(metricsSystem.questionClicks).length}`);
        }
    }

    // Debug en desarrollo
    debugInfo();

    /**
     * Funciones de utilidad para administradores
     */
    window.cablebusAdmin = {
        // Resetear métricas
        resetMetrics() {
            localStorage.removeItem('cablebus_search_queries');
            localStorage.removeItem('cablebus_question_clicks');
            metricsSystem.searchQueries = {};
            metricsSystem.questionClicks = {};
            metricsSystem.updateTopQuestions();
            console.log('✅ Métricas reseteadas');
        },
        
        // Exportar métricas
        exportMetrics() {
            const data = {
                searchQueries: metricsSystem.searchQueries,
                questionClicks: metricsSystem.questionClicks,
                exportDate: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cablebus-metrics-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        },
        
        // Mostrar estadísticas
        showStats() {
            console.log('📊 Estadísticas FAQ Cablebús:');
            console.log('🔍 Top búsquedas:', metricsSystem.getTopQueries(10));
            console.log('📋 Total búsquedas:', Object.values(metricsSystem.searchQueries).reduce((a, b) => a + b, 0));
            console.log('👆 Total clicks:', Object.values(metricsSystem.questionClicks).reduce((a, b) => a + b, 0));
        }
    };

    /**
     * Manejo de errores
     */
    window.addEventListener('error', function(e) {
        console.error('❌ Error en FAQ Cablebús:', e.error);
        trackPageEvent('javascript_error', {
            error_message: e.error?.message || 'Unknown error',
            error_file: e.filename || 'Unknown file'
        });
    });

    // Mensaje de inicialización
    console.log('🚠 Sistema FAQ Cablebús inicializado correctamente');
});