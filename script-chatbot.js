/* ========================================
   JAVASCRIPT PARA CHATBOT INTELIGENTE V2.0
   Sistema Cablebús - Gobierno de Chiapas
   ======================================== */

(function() {
    'use strict';

    /* ========================================
       VARIABLES GLOBALES
       ======================================== */
    let chatbotWindow;
    let chatbotToggle;
    let chatbotMessages;
    let chatbotInput;
    let chatbotSend;
    let quickActions;
    let isOpen = false;
    let conversationHistory = [];
    let lastTopic = null;
    let userName = null;

    /* ========================================
       BASE DE CONOCIMIENTOS EXTENDIDA
       ======================================== */
    const knowledgeBase = {
        horarios: {
            pregunta: '¿Cuáles son los horarios de operación?',
            respuesta: 'El Sistema Cablebús operará de <strong>5:00 AM a 11:00 PM</strong> todos los días de la semana, incluyendo fines de semana y días festivos. Durante estos horarios, las cabinas circulan continuamente con intervalos de apenas 12 segundos.',
            respuestaCorta: 'Operamos de 5 AM a 11 PM todos los días.',
            variaciones: ['horario', 'hora', 'abre', 'cierra', 'cuando opera', 'schedule', 'funcionamiento', 'servicio'],
            relacionados: ['tarifas', 'estaciones', 'tiempo'],
            opciones: ['Ver tarifas', 'Ver estaciones', 'Ver tiempo de viaje']
        },
        tarifas: {
            pregunta: '¿Cuánto cuesta el servicio?',
            respuesta: 'La tarifa del Cablebús será de <strong>$12 MXN</strong> por viaje sencillo. Contamos con descuentos especiales:<br>• <strong>Estudiantes:</strong> 50% de descuento con credencial vigente<br>• <strong>Adultos mayores:</strong> Viajes gratuitos<br>• <strong>Personas con discapacidad:</strong> Viajes gratuitos<br><br>El pago estará integrado con el sistema de transporte público de Tuxtla.',
            respuestaCorta: '$12 MXN por viaje, con descuentos para estudiantes y gratuito para adultos mayores.',
            variaciones: ['precio', 'costo', 'tarifa', 'cuanto cuesta', 'pagar', 'cobrar', 'vale', 'dinero'],
            relacionados: ['pago', 'horarios', 'estaciones'],
            opciones: ['Ver formas de pago', 'Ver descuentos', 'Ver horarios']
        },
        estaciones: {
            pregunta: '¿Cuántas estaciones tiene el Cablebús?',
            respuesta: 'El sistema cuenta con <strong>7 estaciones estratégicamente ubicadas</strong> que conectan la Zona Norte con el Centro de Tuxtla Gutiérrez:<br><br>1. <strong>Estación Norte</strong> - Terminal principal<br>2. <strong>Estación Parque</strong><br>3. <strong>Estación Centro Comercial</strong><br>4. <strong>Estación Hospital</strong><br>5. <strong>Estación Universitaria</strong><br>6. <strong>Estación Cultural</strong><br>7. <strong>Estación Centro</strong> - Terminal principal<br><br>Todas las estaciones cuentan con accesibilidad universal, elevadores, rampas y personal de asistencia.',
            respuestaCorta: '7 estaciones conectando Zona Norte con Centro.',
            variaciones: ['estacion', 'parada', 'ruta', 'recorrido', 'mapa', 'donde', 'ubicacion', 'paradero'],
            relacionados: ['tiempo', 'accesibilidad', 'horarios'],
            opciones: ['Ver tiempo de viaje', 'Ver accesibilidad', 'Ver mapa']
        },
        seguridad: {
            pregunta: '¿Qué medidas de seguridad tiene?',
            respuesta: 'El Cablebús cuenta con los más altos estándares de seguridad internacionales:<br><br><strong>🛡️ Sistemas de Seguridad:</strong><br>• Frenado de emergencia automático<br>• Respaldo de energía (generadores)<br>• Sistema redundante de cables<br>• Monitoreo 24/7 con IA<br><br><strong>📹 Vigilancia:</strong><br>• Cámaras en todas las cabinas<br>• Comunicación directa con centro de control<br>• Botón de emergencia<br><br><strong>👮 Personal:</strong><br>• Guardias de seguridad en cada estación<br>• Personal capacitado en primeros auxilios<br>• Protocolos de evacuación<br><br><strong>✅ Certificaciones:</strong><br>• Certificación ISO 9001<br>• Aprobación de ingeniería internacional<br>• Inspecciones mensuales obligatorias',
            respuestaCorta: 'Sistema certificado internacionalmente con monitoreo 24/7 y personal capacitado.',
            variaciones: ['seguro', 'seguridad', 'proteccion', 'emergencia', 'riesgo', 'peligro', 'confiable'],
            relacionados: ['capacidad', 'tiempo', 'inauguracion'],
            opciones: ['Ver más características', 'Ver certificaciones', 'Ver preguntas frecuentes']
        },
        capacidad: {
            pregunta: '¿Cuántas personas caben en cada cabina?',
            respuesta: 'Cada cabina del Cablebús tiene capacidad para <strong>10 personas</strong> cómodamente sentadas y de pie.<br><br><strong>Características de las cabinas:</strong><br>• Espacio para <strong>2 sillas de ruedas</strong><br>• Asientos ergonómicos y cómodos<br>• Aire acondicionado<br>• Ventanas panorámicas<br>• Iluminación LED eficiente<br>• Puerto USB para cargar dispositivos<br>• Sistema de audio para anuncios<br><br>Las cabinas están diseñadas para ser <strong>100% accesibles</strong> cumpliendo con normativas internacionales.',
            respuestaCorta: '10 personas por cabina, con espacio para sillas de ruedas.',
            variaciones: ['capacidad', 'cuantas personas', 'gente', 'caben', 'ocupantes', 'pasajeros', 'cupo'],
            relacionados: ['accesibilidad', 'seguridad', 'tiempo'],
            opciones: ['Ver accesibilidad', 'Ver características', 'Ver seguridad']
        },
        tiempo: {
            pregunta: '¿Cuánto tiempo tarda el recorrido completo?',
            respuesta: 'El recorrido completo de extremo a extremo tarda aproximadamente <strong>25 minutos</strong>, lo que representa una <strong>reducción de hasta 50% en tiempo de traslado</strong> comparado con el transporte terrestre actual.<br><br><strong>⏱️ Tiempos aproximados entre estaciones:</strong><br>• Estación a estación: 3-4 minutos<br>• Tiempo de abordaje: menos de 30 segundos<br>• Frecuencia de paso: cada 12 segundos<br><br><strong>💨 Comparativa de tiempos:</strong><br>• Transporte actual: ~50 minutos<br>• Con Cablebús: ~25 minutos<br>• <strong>Ahorro: 25 minutos por viaje</strong>',
            respuestaCorta: '25 minutos de extremo a extremo, 50% más rápido que el transporte actual.',
            variaciones: ['tiempo', 'duracion', 'tarda', 'cuanto demora', 'rapidez', 'rapido', 'velocidad'],
            relacionados: ['estaciones', 'horarios', 'beneficios'],
            opciones: ['Ver estaciones', 'Ver beneficios', 'Ver horarios']
        },
        ambiente: {
            pregunta: '¿Es un sistema sustentable?',
            respuesta: 'Sí, el Cablebús es <strong>100% eléctrico y sustentable</strong>. Es una de las opciones de transporte más ecológicas disponibles:<br><br><strong>🌱 Impacto Ambiental Positivo:</strong><br>• Cero emisiones de CO₂ durante operación<br>• Reducción estimada de <strong>5,000 toneladas de CO₂ al año</strong><br>• Energía renovable cuando sea posible<br>• Equivalente a plantar 250,000 árboles<br><br><strong>♻️ Sustentabilidad:</strong><br>• Materiales reciclables en construcción<br>• Bajo consumo energético<br>• No contamina el aire de la ciudad<br>• Reduce el tráfico vehicular<br>• Contribuye a los objetivos de desarrollo sostenible<br><br><strong>🏆 Certificación Ambiental:</strong><br>• ISO 14001 en gestión ambiental<br>• Reconocimiento internacional por sustentabilidad',
            respuestaCorta: '100% eléctrico, cero emisiones, reduce 5,000 toneladas de CO₂ al año.',
            variaciones: ['ambiente', 'ecologico', 'sustentable', 'verde', 'contaminacion', 'co2', 'emisiones', 'limpio'],
            relacionados: ['beneficios', 'caracteristicas', 'inauguracion'],
            opciones: ['Ver más beneficios', 'Ver características', 'Volver al inicio']
        },
        pago: {
            pregunta: '¿Cómo puedo pagar?',
            respuesta: 'El Cablebús ofrece múltiples opciones de pago para tu comodidad:<br><br><strong>💳 Métodos de Pago Aceptados:</strong><br><br>1. <strong>Tarjeta Integrada de Transporte</strong><br>   • Compatible con sistema de transporte público<br>   • Recarga en estaciones y tiendas autorizadas<br>   • Descuentos por recarga<br><br>2. <strong>Pago Contactless</strong><br>   • Tarjetas bancarias sin contacto<br>   • Apple Pay / Google Pay<br>   • Pago rápido y seguro<br><br>3. <strong>Efectivo en Taquillas</strong><br>   • Disponible en todas las estaciones<br>   • Atención personalizada<br><br>4. <strong>App Móvil (Próximamente)</strong><br>   • Compra de boletos digitales<br>   • Historial de viajes<br>   • Recarga automática<br><br><strong>🎫 Tips de Pago:</strong><br>• Compra tu tarjeta integrada para mayor rapidez<br>• Recarga con anticipación para evitar filas<br>• Guarda tu comprobante',
            respuestaCorta: 'Tarjeta integrada, contactless, efectivo y app móvil próximamente.',
            variaciones: ['pago', 'forma de pago', 'como pagar', 'tarjeta', 'efectivo', 'metodo', 'abonar'],
            relacionados: ['tarifas', 'horarios', 'estaciones'],
            opciones: ['Ver tarifas', 'Ver descuentos', 'Volver al inicio']
        },
        inauguracion: {
            pregunta: '¿Cuándo se inaugura?',
            respuesta: 'La inauguración del Sistema Cablebús está programada para <strong>finales de 2025</strong>.<br><br><strong>📅 Cronograma del Proyecto:</strong><br><br><strong>Fase Actual (Oct 2024):</strong><br>✅ Construcción de estaciones: 85% completado<br>✅ Instalación de cables: 90% completado<br>✅ Cabinas en producción<br><br><strong>Próximos Pasos:</strong><br>🔄 Nov-Dic 2024: Instalación de cabinas<br>🔄 Ene-Mar 2025: Pruebas técnicas<br>🔄 Abr-Jun 2025: Certificaciones de seguridad<br>🔄 Jul-Sep 2025: Pruebas operacionales<br>🎉 Oct-Dic 2025: <strong>Inauguración oficial</strong><br><br><strong>🚀 Antes de la Inauguración:</strong><br>• Viajes de prueba para autoridades<br>• Jornadas de puertas abiertas<br>• Capacitación del personal<br>• Inspecciones finales internacionales<br><br>Mantente informado en nuestras redes sociales para actualizaciones.',
            respuestaCorta: 'Finales de 2025, actualmente en construcción avanzada (85% completado).',
            variaciones: ['inauguracion', 'cuando abre', 'fecha', 'apertura', 'inicio', 'cuando funciona', 'listo'],
            relacionados: ['avances', 'estaciones', 'horarios'],
            opciones: ['Ver más información', 'Ver avances', 'Volver al inicio']
        },
        accesibilidad: {
            pregunta: '¿Es accesible para personas con discapacidad?',
            respuesta: '<strong>Absolutamente.</strong> El Cablebús está diseñado con <strong>accesibilidad universal</strong> en mente:<br><br><strong>♿ En las Estaciones:</strong><br>• Elevadores en todas las estaciones<br>• Rampas con pendiente adecuada<br>• Señalización táctil y en braille<br>• Pisos con texturas guía<br>• Personal capacitado en lenguaje de señas<br>• Baños accesibles<br>• Áreas de espera con asientos<br><br><strong>🚡 En las Cabinas:</strong><br>• Espacio designado para sillas de ruedas<br>• Entrada a nivel (sin escalones)<br>• Barras de sujeción ergonómicas<br>• Asientos prioritarios señalizados<br>• Anuncios visuales y auditivos<br>• Sistema de comunicación de emergencia<br><br><strong>👥 Servicios Especiales:</strong><br>• Asistencia personalizada disponible<br>• Perros guía permitidos<br>• Prioridad en abordaje<br>• Sistema de inducción magnética para aparatos auditivos<br><br><strong>🏆 Certificaciones:</strong><br>• Cumple NOM-034-SSA3 (accesibilidad)<br>• Diseño universal ISO/IEC 17007',
            respuestaCorta: 'Totalmente accesible: elevadores, rampas, braille, personal capacitado.',
            variaciones: ['accesibilidad', 'discapacidad', 'silla de ruedas', 'rampa', 'elevador', 'inclusion', 'universal'],
            relacionados: ['capacidad', 'estaciones', 'seguridad'],
            opciones: ['Ver más características', 'Ver estaciones', 'Volver al inicio']
        },
        beneficios: {
            pregunta: '¿Cuáles son los beneficios del Cablebús?',
            respuesta: 'El Cablebús traerá múltiples beneficios para Tuxtla Gutiérrez:<br><br><strong>⏱️ Para los Ciudadanos:</strong><br>• 50% menos tiempo en traslados<br>• Transporte económico ($12 MXN)<br>• Comodidad y aire acondicionado<br>• Viaje sin tráfico<br>• Vistas panorámicas de la ciudad<br><br><strong>🌍 Para la Ciudad:</strong><br>• Reducción de contaminación<br>• Menor congestión vial<br>• Mejor conectividad urbana<br>• Desarrollo económico de zonas<br>• Imagen moderna y tecnológica<br><br><strong>💼 Generación de Empleos:</strong><br>• +200 empleos directos<br>• +500 empleos indirectos<br>• Capacitación técnica local<br><br><strong>🎯 Impacto Social:</strong><br>• 150,000 beneficiarios estimados<br>• Acceso a educación y empleo<br>• Inclusión de todos los sectores<br>• Mejora calidad de vida',
            respuestaCorta: 'Ahorro de tiempo, económico, sustentable, genera empleos y mejora calidad de vida.',
            variaciones: ['beneficios', 'ventajas', 'porque', 'para que', 'importancia', 'utilidad'],
            relacionados: ['ambiente', 'tiempo', 'tarifas'],
            opciones: ['Ver características', 'Ver sustentabilidad', 'Ver tarifas']
        }
    };

    /* ========================================
       PALABRAS CLAVE MEJORADAS CON SINÓNIMOS
       ======================================== */
    const keywords = {
        horarios: ['horario', 'hora', 'abre', 'cierra', 'cuando opera', 'schedule', 'funcionamiento', 'servicio', 'trabaja', 'disponible'],
        tarifas: ['precio', 'costo', 'tarifa', 'cuanto cuesta', 'pagar', 'cobrar', 'vale', 'dinero', 'barato', 'economico'],
        estaciones: ['estacion', 'parada', 'ruta', 'recorrido', 'mapa', 'donde', 'ubicacion', 'paradero', 'terminal'],
        seguridad: ['seguro', 'seguridad', 'proteccion', 'emergencia', 'riesgo', 'peligro', 'confiable', 'accidente'],
        capacidad: ['capacidad', 'cuantas personas', 'gente', 'caben', 'ocupantes', 'pasajeros', 'cupo', 'lleno'],
        tiempo: ['tiempo', 'duracion', 'tarda', 'cuanto demora', 'rapidez', 'rapido', 'velocidad', 'pronto'],
        ambiente: ['ambiente', 'ecologico', 'sustentable', 'verde', 'contaminacion', 'co2', 'emisiones', 'limpio', 'naturaleza'],
        pago: ['pago', 'forma de pago', 'como pagar', 'tarjeta', 'efectivo', 'metodo', 'abonar', 'comprar'],
        inauguracion: ['inauguracion', 'cuando abre', 'fecha', 'apertura', 'inicio', 'cuando funciona', 'listo', 'termina'],
        accesibilidad: ['accesibilidad', 'discapacidad', 'silla de ruedas', 'rampa', 'elevador', 'inclusion', 'universal'],
        beneficios: ['beneficios', 'ventajas', 'porque', 'para que', 'importancia', 'utilidad', 'sirve']
    };

    /* ========================================
       RESPUESTAS CONTEXTUALES
       ======================================== */
    const contextualResponses = {
        saludo: {
            patterns: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'saludos', 'hey', 'que tal'],
            responses: [
                '¡Hola! 👋 Soy tu asistente del Cablebús. ¿En qué puedo ayudarte hoy?',
                '¡Hola! Bienvenido al Sistema Cablebús. ¿Qué información necesitas?',
                '¡Hola! 😊 Estoy aquí para resolver todas tus dudas sobre el Cablebús. ¿Qué te gustaría saber?',
                '¡Buen día! ¿En qué puedo asistirte con el Sistema Cablebús?'
            ]
        },
        despedida: {
            patterns: ['adios', 'bye', 'hasta luego', 'nos vemos', 'chao', 'gracias', 'thanks'],
            responses: [
                '¡Hasta pronto! Espero haberte ayudado. ¡Nos vemos en el Cablebús! 🚡',
                '¡Adiós! Si tienes más preguntas, aquí estaré. ¡Buen viaje! 👋',
                '¡Gracias por preguntar! Estoy aquí cuando me necesites. ¡Hasta luego! 😊',
                '¡Nos vemos! No olvides seguirnos en redes sociales para más información. 🚡'
            ]
        },
        agradecimiento: {
            patterns: ['gracias', 'thanks', 'te lo agradezco', 'muchas gracias', 'mil gracias'],
            responses: [
                '¡De nada! Es un placer ayudarte. ¿Hay algo más que quieras saber? 😊',
                '¡Con gusto! Estoy aquí para ayudarte. ¿Necesitas más información?',
                '¡No hay de qué! ¿Te gustaría saber algo más sobre el Cablebús?',
                '¡Para eso estoy! Si tienes más preguntas, no dudes en hacerlas.'
            ]
        },
        positivo: {
            patterns: ['excelente', 'genial', 'perfecto', 'bien', 'super', 'me gusta', 'que bien', 'increible'],
            responses: [
                '¡Qué bueno que te guste! El Cablebús será un gran avance para Tuxtla. ¿Algo más?',
                '¡Exacto! Será un proyecto transformador. ¿Tienes alguna otra pregunta?',
                '¡Me alegra tu entusiasmo! ¿Hay algo más que quieras saber del proyecto?',
                '¡Sí! Estamos muy emocionados también. ¿Qué más te gustaría conocer?'
            ]
        },
        confusion: {
            patterns: ['no entiendo', 'que', 'eh', 'como', 'explica', 'no se', 'dudas'],
            responses: [
                'Déjame explicártelo mejor. ¿Qué tema te gustaría que aclare?',
                'Perdón si no fui claro. ¿Sobre qué específicamente tienes dudas?',
                'Con gusto te lo explico de otra manera. ¿Qué quieres que te aclare?',
                'Entiendo. Intentaré ser más específico. ¿De qué tema hablamos?'
            ]
        }
    };

    /* ========================================
       RESPUESTAS INTELIGENTES COMBINADAS
       ======================================== */
    const smartResponses = {
        'horarios y tarifas': 'El Cablebús operará de <strong>5:00 AM a 11:00 PM</strong> todos los días, con una tarifa de <strong>$12 MXN</strong> por viaje. Hay descuentos para estudiantes (50%) y viajes gratuitos para adultos mayores y personas con discapacidad.',
        'estaciones y tiempo': 'El sistema tiene <strong>7 estaciones</strong> conectando la Zona Norte con el Centro. El recorrido completo tarda <strong>25 minutos</strong>, reduciendo hasta 50% el tiempo de traslado actual.',
        'seguridad y certificacion': 'El Cablebús cuenta con certificación internacional ISO 9001, sistemas de frenado de emergencia, monitoreo 24/7, y personal capacitado en cada estación. Es uno de los sistemas más seguros del mundo.',
        'pago y tarifas': 'Puedes pagar con tarjeta integrada de transporte, tarjetas bancarias sin contacto, efectivo en taquillas, o mediante la app móvil (próximamente). La tarifa es de $12 MXN con descuentos disponibles.'
    };

    /* ========================================
       INICIALIZACIÓN
       ======================================== */
    document.addEventListener('DOMContentLoaded', function() {
        initChatbot();
    });

    function initChatbot() {
        // Obtener elementos del DOM
        chatbotWindow = document.getElementById('chatbot-window');
        chatbotToggle = document.getElementById('chatbot-toggle');
        chatbotMessages = document.getElementById('chatbot-messages');
        chatbotInput = document.getElementById('chatbot-input');
        chatbotSend = document.getElementById('chatbot-send');
        quickActions = document.querySelectorAll('.quick-action');

        if (!chatbotToggle || !chatbotWindow) {
            console.warn('Chatbot elements not found');
            return;
        }

        // Event Listeners
        chatbotToggle.addEventListener('click', toggleChatbot);
        
        if (chatbotSend) {
            chatbotSend.addEventListener('click', handleSendMessage);
        }
        
        if (chatbotInput) {
            chatbotInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleSendMessage();
                }
            });

            // Sugerencias mientras escribe
            chatbotInput.addEventListener('input', handleTypingSuggestions);
        }

        // Quick Actions
        quickActions.forEach(function(action) {
            action.addEventListener('click', function() {
                const actionType = this.getAttribute('data-action');
                handleQuickAction(actionType);
            });
        });

        // Minimize button
        const minimizeBtn = document.querySelector('.chatbot-minimize');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', toggleChatbot);
        }

        // Mostrar mensaje de bienvenida después de 3 segundos
        setTimeout(showWelcomeBadge, 3000);

        console.log('✅ Chatbot Inteligente V2.0 inicializado correctamente');
    }

    /* ========================================
       SUGERENCIAS MIENTRAS ESCRIBE
       ======================================== */
    function handleTypingSuggestions() {
        const input = chatbotInput.value.toLowerCase().trim();
        
        if (input.length >= 3) {
            // Aquí podrías mostrar sugerencias en tiempo real
            // Por ahora solo detectamos temas
            for (const [topic, words] of Object.entries(keywords)) {
                for (const word of words) {
                    if (input.includes(word)) {
                        // Tema detectado
                        return;
                    }
                }
            }
        }
    }

    /* ========================================
       TOGGLE CHATBOT
       ======================================== */
    function toggleChatbot() {
        isOpen = !isOpen;
        
        if (isOpen) {
            chatbotWindow.classList.add('active');
            chatbotToggle.classList.add('active');
            chatbotInput.focus();
            
            // Ocultar badge al abrir
            const badge = chatbotToggle.querySelector('.chatbot-badge');
            if (badge) {
                badge.style.display = 'none';
            }
        } else {
            chatbotWindow.classList.remove('active');
            chatbotToggle.classList.remove('active');
        }
    }

    /* ========================================
       ENVIAR MENSAJE
       ======================================== */
    function handleSendMessage() {
        const message = chatbotInput.value.trim();
        
        if (message === '') return;

        // Agregar a historial
        conversationHistory.push({
            type: 'user',
            message: message,
            timestamp: new Date()
        });

        // Agregar mensaje del usuario
        addMessage(message, 'user');
        
        // Limpiar input
        chatbotInput.value = '';
        
        // Mostrar indicador de escritura
        showTypingIndicator();
        
        // Procesar mensaje y responder
        setTimeout(function() {
            hideTypingIndicator();
            processIntelligentMessage(message);
        }, 800 + Math.random() * 800); // 0.8-1.6 segundos
    }

    /* ========================================
       PROCESAMIENTO INTELIGENTE DE MENSAJES
       ======================================== */
    function processIntelligentMessage(message) {
        const messageLower = message.toLowerCase().trim();
        let responseFound = false;
        let response = '';
        let options = [];

        // 1. Detectar nombre del usuario
        if (!userName && (messageLower.includes('me llamo') || messageLower.includes('soy'))) {
            const nameMatch = message.match(/(?:me llamo|soy)\s+(\w+)/i);
            if (nameMatch) {
                userName = nameMatch[1];
                response = `¡Mucho gusto, ${userName}! 😊 Es un placer ayudarte. ¿Qué te gustaría saber sobre el Cablebús?`;
                options = ['Ver horarios', 'Ver tarifas', 'Ver estaciones'];
                addMessage(response, 'bot', options);
                return;
            }
        }

        // 2. Respuestas contextuales (saludos, despedidas, etc.)
        for (const [context, data] of Object.entries(contextualResponses)) {
            for (const pattern of data.patterns) {
                if (messageLower.includes(pattern)) {
                    const randomResponse = data.responses[Math.floor(Math.random() * data.responses.length)];
                    response = userName ? randomResponse.replace('Hola', `Hola ${userName}`) : randomResponse;
                    
                    if (context === 'despedida' || context === 'agradecimiento') {
                        addMessage(response, 'bot');
                    } else {
                        options = ['Ver horarios', 'Ver tarifas', 'Ver estaciones', 'Ver seguridad'];
                        addMessage(response, 'bot', options);
                    }
                    responseFound = true;
                    break;
                }
            }
            if (responseFound) break;
        }

        if (responseFound) return;

        // 3. Detectar preguntas complejas (múltiples temas)
        const detectedTopics = [];
        for (const [topic, words] of Object.entries(keywords)) {
            for (const word of words) {
                if (messageLower.includes(word)) {
                    detectedTopics.push(topic);
                    break;
                }
            }
        }

        // 4. Respuesta para múltiples temas
        if (detectedTopics.length > 1) {
            const combinedKey = detectedTopics.sort().join(' y ');
            if (smartResponses[combinedKey]) {
                response = smartResponses[combinedKey];
                options = ['Ver más detalles', 'Otra pregunta', 'Volver al inicio'];
                addMessage(response, 'bot', options);
                lastTopic = detectedTopics[0];
                return;
            }
            
            // Si no hay respuesta combinada, responder sobre cada tema
            response = '¡Gran pregunta! Te cuento sobre cada tema:<br><br>';
            detectedTopics.forEach(function(topic, index) {
                response += `<strong>${index + 1}. ${knowledgeBase[topic].pregunta}</strong><br>`;
                response += knowledgeBase[topic].respuestaCorta + '<br><br>';
            });
            response += '¿Sobre cuál te gustaría saber más?';
            options = detectedTopics.map(t => knowledgeBase[t].pregunta);
            addMessage(response, 'bot', options);
            return;
        }

        // 5. Respuesta para un solo tema
        if (detectedTopics.length === 1) {
            const topic = detectedTopics[0];
            response = knowledgeBase[topic].respuesta;
            options = knowledgeBase[topic].opciones;
            addMessage(response, 'bot', options);
            lastTopic = topic;
            
            // Sugerir temas relacionados
            setTimeout(function() {
                const related = knowledgeBase[topic].relacionados;
                if (related && related.length > 0) {
                    const suggestions = related.map(r => knowledgeBase[r].pregunta.replace('¿', '').replace('?', ''));
                    addMessage(`💡 También te puede interesar: <strong>${suggestions.join('</strong>, <strong>')}</strong>`, 'bot');
                }
            }, 1500);
            return;
        }

        // 6. Contexto de conversación anterior
        if (lastTopic && messageLower.match(/^(si|ok|dale|claro|si por favor|me interesa|quiero saber)/)) {
            response = knowledgeBase[lastTopic].respuesta;
            options = knowledgeBase[lastTopic].opciones;
            addMessage(response, 'bot', options);
            return;
        }

        // 7. Respuesta para preguntas no reconocidas (más inteligente)
        const suggestions = analyzeSentiment(messageLower);
        response = suggestions.response;
        options = suggestions.options;
        addMessage(response, 'bot', options);
    }

    /* ========================================
       ANÁLISIS DE SENTIMIENTO Y CONTEXTO
       ======================================== */
    function analyzeSentiment(message) {
        // Detectar frustración o confusión
        if (message.match(/no entiendo|confuso|complicado|dificil/)) {
            return {
                response: 'Entiendo que puede ser confuso. Déjame ayudarte de forma más simple. ¿Qué es lo principal que te gustaría saber del Cablebús?',
                options: ['Cuánto cuesta', 'Cuándo abre', 'Dónde están las estaciones', 'Hablar con alguien']
            };
        }

        // Detectar urgencia
        if (message.match(/urgente|rapido|necesito|ahora/)) {
            return {
                response: 'Entiendo que necesitas información rápida. Estos son los datos esenciales:<br><br>📍 <strong>7 estaciones</strong><br>💰 <strong>$12 MXN</strong><br>⏰ <strong>5 AM - 11 PM</strong><br>⚡ <strong>25 minutos</strong> de viaje<br><br>¿Qué más necesitas saber?',
                options: ['Ver mapa', 'Formas de pago', 'Contacto directo']
            };
        }

        // Detectar interés en trabajo/empleo
        if (message.match(/trabajo|empleo|vacante|contratar/)) {
            return {
                response: 'El proyecto Cablebús está generando <strong>más de 200 empleos directos</strong> y 500 indirectos. Para oportunidades laborales, te recomiendo:<br><br>📧 Enviar CV a: <strong>sdm.smyt@gmail.com</strong><br>📱 Seguir nuestras redes sociales<br>🌐 Visitar: chiapas.gob.mx<br><br>¿Te gustaría saber más sobre el proyecto?',
                options: ['Ver más información', 'Ver requisitos', 'Volver al inicio']
            };
        }

        // Respuesta por defecto mejorada
        return {
            response: 'Hmm, no estoy seguro de haber entendido bien tu pregunta. 🤔<br><br>Puedo ayudarte con información sobre:<br>• Horarios y tarifas<br>• Estaciones y rutas<br>• Seguridad<br>• Formas de pago<br>• Y mucho más<br><br>¿Sobre qué te gustaría saber?',
            options: ['Ver horarios', 'Ver tarifas', 'Ver estaciones', 'Ver preguntas frecuentes']
        };
    }

    /* ========================================
       QUICK ACTIONS
       ======================================== */
    function handleQuickAction(action) {
        if (knowledgeBase[action]) {
            addMessage(knowledgeBase[action].pregunta, 'user');
            
            showTypingIndicator();
            setTimeout(function() {
                hideTypingIndicator();
                addMessage(knowledgeBase[action].respuesta, 'bot', knowledgeBase[action].opciones);
                lastTopic = action;
            }, 800);
        }
    }

    /* ========================================
       AGREGAR MENSAJE
       ======================================== */
    function addMessage(text, sender, options) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message ' + sender;
        
        let avatarHTML = '';
        if (sender === 'bot') {
            avatarHTML = `
                <div class="message-avatar">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="15" cy="15" r="14" fill="#00A19A"/>
                        <circle cx="15" cy="15" r="9" fill="white"/>
                        <circle cx="12" cy="13" r="1.5" fill="#00A19A"/>
                        <circle cx="18" cy="13" r="1.5" fill="#00A19A"/>
                        <path d="M11 18c0 2.21 1.79 4 4 4s4-1.79 4-4" stroke="#00A19A" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </div>
            `;
        } else {
            avatarHTML = `
                <div class="message-avatar">${userName ? userName.charAt(0).toUpperCase() : 'TÚ'}</div>
            `;
        }
        
        let optionsHTML = '';
        if (options && options.length > 0) {
            optionsHTML = '<div class="message-options">';
            options.forEach(function(option) {
                optionsHTML += `<button class="option-button" onclick="handleOptionClick('${option}')">${option}</button>`;
            });
            optionsHTML += '</div>';
        }
        
        messageDiv.innerHTML = `
            ${avatarHTML}
            <div class="message-content">
                <p>${text}</p>
                ${optionsHTML}
            </div>
        `;
        
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();

        // Agregar al historial
        if (sender === 'bot') {
            conversationHistory.push({
                type: 'bot',
                message: text,
                timestamp: new Date()
            });
        }
    }

    /* ========================================
       INDICADOR DE ESCRITURA
       ======================================== */
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot typing-indicator-message';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15" cy="15" r="14" fill="#00A19A"/>
                    <circle cx="15" cy="15" r="9" fill="white"/>
                    <circle cx="12" cy="13" r="1.5" fill="#00A19A"/>
                    <circle cx="18" cy="13" r="1.5" fill="#00A19A"/>
                    <path d="M11 18c0 2.21 1.79 4 4 4s4-1.79 4-4" stroke="#00A19A" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        chatbotMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    /* ========================================
       SCROLL AUTOMÁTICO
       ======================================== */
    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    /* ========================================
       WELCOME BADGE
       ======================================== */
    function showWelcomeBadge() {
        if (!isOpen) {
            const badge = chatbotToggle.querySelector('.chatbot-badge');
            if (badge) {
                badge.style.display = 'block';
            }
        }
    }

    /* ========================================
       MANEJAR OPCIONES (Global)
       ======================================== */
    window.handleOptionClick = function(option) {
        const optionLower = option.toLowerCase();
        
        // Agregar mensaje del usuario
        addMessage(option, 'user');
        
        // Mostrar indicador
        showTypingIndicator();
        
        setTimeout(function() {
            hideTypingIndicator();
            
            // Buscar respuesta en la base de conocimientos
            for (const [topic, data] of Object.entries(knowledgeBase)) {
                if (optionLower.includes(topic) || data.pregunta.toLowerCase().includes(optionLower)) {
                    addMessage(data.respuesta, 'bot', data.opciones);
                    lastTopic = topic;
                    return;
                }
            }

            // Opciones especiales
            if (optionLower.includes('beneficios')) {
                addMessage(knowledgeBase.beneficios.respuesta, 'bot', knowledgeBase.beneficios.opciones);
            } else if (optionLower.includes('características')) {
                addMessage('El Cablebús cuenta con:<br>• 7 estaciones modernas<br>• Cabinas para 10 personas<br>• Sistema 100% eléctrico<br>• Operación de 5 AM a 11 PM<br>• Accesibilidad universal<br>• Tecnología de última generación', 'bot', ['Ver horarios', 'Ver tarifas', 'Volver al inicio']);
            } else if (optionLower.includes('contacto') || optionLower.includes('hablar')) {
                addMessage('Puedes contactarnos por:<br><br>📧 <strong>Email:</strong> sdm.smyt@gmail.com<br>⏰ <strong>Horario:</strong> Lun-Vie 8:00-17:00<br>📱 <strong>Facebook:</strong> @SMyTChiapas<br>📱 <strong>Instagram:</strong> @smyt_chiapas<br><br>También visita nuestra sección de <a href="preguntas.html" style="color: #00A19A; font-weight: 600;">Preguntas Frecuentes</a>', 'bot', ['Ver horarios', 'Volver al inicio']);
            } else if (optionLower.includes('preguntas frecuentes')) {
                addMessage('Puedes encontrar más información en nuestra sección de <a href="preguntas.html" style="color: #00A19A; font-weight: 600;">Preguntas Frecuentes</a>, donde respondemos todas tus dudas sobre el Sistema Cablebús.', 'bot', ['Ver horarios', 'Ver tarifas', 'Ver estaciones']);
            } else if (optionLower.includes('inicio') || optionLower.includes('volver')) {
                addMessage('¿En qué más puedo ayudarte? Selecciona una opción o escribe tu pregunta.', 'bot', ['Ver horarios', 'Ver tarifas', 'Ver estaciones', 'Ver seguridad']);
            } else {
                addMessage('¿En qué más puedo ayudarte?', 'bot', ['Ver horarios', 'Ver tarifas', 'Ver estaciones']);
            }
        }, 800);
    };

    console.log('✅ Chatbot Inteligente del Sistema Cablebús listo (V2.0)');

})();