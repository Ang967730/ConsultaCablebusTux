/* ========================================
   REPRODUCTOR DE VIDEO CON AUTO-PAUSA INTELIGENTE
   Sistema Cablebús - Gobierno de Chiapas
   ======================================== */

(function() {
    'use strict';

    /* ========================================
       CONFIGURACIÓN DE VIDEOS
       ======================================== */
    const videoPlaylist = [
        'videos/video1.mp4',
        'videos/video2.mp4',
        'videos/video3.mp4',
        'videos/video4.mp4'
    ];

    let autoPauseEnabled = true; // Control del detector automático
    let userPausedManually = false; // Saber si el usuario pausó manualmente
    let lastVideoIndex = -1; // Para evitar repetir el mismo video

    /* ========================================
       INICIALIZACIÓN
       ======================================== */
    document.addEventListener('DOMContentLoaded', function() {
        loadRandomVideo();
        initVideoPlayer();
        initVisibilityDetector();
        initVideoEndHandler(); // NUEVO: Manejar cuando termina el video
    });

    /* ========================================
       CARGAR VIDEO ALEATORIO
       ======================================== */
    function loadRandomVideo() {
        const videoPlayer = document.getElementById('main-video-player');
        const videoLoading = document.getElementById('video-loading');
        
        if (!videoPlayer) return;

        // Seleccionar video aleatorio diferente al último
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * videoPlaylist.length);
        } while (randomIndex === lastVideoIndex && videoPlaylist.length > 1);
        
        lastVideoIndex = randomIndex;
        const randomVideo = videoPlaylist[randomIndex];

        console.log('🎲 Cargando video:', randomVideo);

        // Mostrar loading
        if (videoLoading) {
            videoLoading.classList.add('active');
        }

        // Cargar video
        const source = videoPlayer.querySelector('source');
        if (source) {
            source.src = randomVideo;
        } else {
            const newSource = document.createElement('source');
            newSource.src = randomVideo;
            newSource.type = 'video/mp4';
            videoPlayer.appendChild(newSource);
        }

        videoPlayer.load();

        // Reproducir cuando esté listo
        videoPlayer.addEventListener('loadeddata', function() {
            if (videoLoading) {
                videoLoading.classList.remove('active');
            }
            
            // Solo reproducir si el usuario no ha pausado manualmente
            if (!userPausedManually) {
                const playPromise = videoPlayer.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(function() {
                        console.log('✅ Video reproduciéndose');
                        updatePlayPauseButton(false);
                        autoPauseEnabled = true;
                    }).catch(function(error) {
                        console.log('⚠️ No se pudo reproducir automáticamente');
                        updatePlayPauseButton(true);
                    });
                }
            }
        }, { once: true });
    }

    /* ========================================
       MANEJAR CUANDO TERMINA EL VIDEO
       ======================================== */
    function initVideoEndHandler() {
        const videoPlayer = document.getElementById('main-video-player');
        
        if (!videoPlayer) return;

        videoPlayer.addEventListener('ended', function() {
            console.log('🎬 Video terminado - Cargando siguiente...');
            
            // Cargar siguiente video aleatorio
            setTimeout(function() {
                loadRandomVideo();
            }, 500); // Pequeña pausa antes de cargar el siguiente
        });

        console.log('✅ Manejador de fin de video activado');
    }

    /* ========================================
       DETECTOR DE VISIBILIDAD INTELIGENTE
       ======================================== */
    function initVisibilityDetector() {
        const videoPlayer = document.getElementById('main-video-player');
        const videoContainer = document.getElementById('video-container');

        if (!videoPlayer || !videoContainer) return;

        // Usar Intersection Observer para detectar visibilidad
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.5 // 50% del video debe estar visible
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                // Solo actuar si el detector automático está habilitado
                if (!autoPauseEnabled) return;

                if (entry.isIntersecting) {
                    // Video está visible - reproducir
                    if (videoPlayer.paused && !userPausedManually) {
                        videoPlayer.play().then(function() {
                            console.log('▶️ Video visible - Reproduciendo automáticamente');
                            updatePlayPauseButton(false);
                        }).catch(function(error) {
                            console.log('Error al reproducir:', error);
                        });
                    }
                } else {
                    // Video NO está visible - pausar
                    if (!videoPlayer.paused) {
                        videoPlayer.pause();
                        console.log('⏸️ Video fuera de vista - Pausado automáticamente');
                        updatePlayPauseButton(true);
                    }
                }
            });
        }, observerOptions);

        observer.observe(videoContainer);

        console.log('✅ Detector de visibilidad activado');
    }

    /* ========================================
       CONTROLES DEL REPRODUCTOR
       ======================================== */
    function initVideoPlayer() {
        const videoPlayer = document.getElementById('main-video-player');
        const playPauseBtn = document.getElementById('play-pause');
        const muteBtn = document.getElementById('mute-unmute');

        if (!videoPlayer) return;

        // Play/Pause - Control manual
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                togglePlayPauseManual();
            });
        }

        // Mute/Unmute
        if (muteBtn) {
            muteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleMute();
            });
        }

        // Click en video para play/pause manual
        videoPlayer.addEventListener('click', function(e) {
            if (!e.target.closest('button')) {
                togglePlayPauseManual();
            }
        });

        // Atajos de teclado
        document.addEventListener('keydown', function(e) {
            if (document.activeElement.tagName === 'INPUT' || 
                document.activeElement.tagName === 'TEXTAREA') {
                return;
            }

            if (e.key === ' ' || e.key === 'k') {
                e.preventDefault();
                togglePlayPauseManual();
            } else if (e.key === 'm') {
                e.preventDefault();
                toggleMute();
            }
        });

        console.log('✅ Controles del reproductor inicializados');
    }

    /* ========================================
       TOGGLE PLAY/PAUSE MANUAL
       ======================================== */
    function togglePlayPauseManual() {
        const videoPlayer = document.getElementById('main-video-player');
        if (!videoPlayer) return;

        if (videoPlayer.paused) {
            // Usuario quiere reproducir
            videoPlayer.play();
            updatePlayPauseButton(false);
            autoPauseEnabled = true; // Reactivar detector automático
            userPausedManually = false;
            console.log('▶️ Usuario reprodujo el video - Detector activado');
        } else {
            // Usuario pausó manualmente
            videoPlayer.pause();
            updatePlayPauseButton(true);
            autoPauseEnabled = false; // Desactivar detector automático
            userPausedManually = true;
            console.log('⏸️ Usuario pausó el video - Detector desactivado');
        }
    }

    function updatePlayPauseButton(isPaused) {
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');

        if (playIcon && pauseIcon) {
            playIcon.style.display = isPaused ? 'block' : 'none';
            pauseIcon.style.display = isPaused ? 'none' : 'block';
        }
    }

    function toggleMute() {
        const videoPlayer = document.getElementById('main-video-player');
        const muteIcon = document.querySelector('.mute-icon');
        const unmuteIcon = document.querySelector('.unmute-icon');

        if (!videoPlayer) return;

        videoPlayer.muted = !videoPlayer.muted;

        if (muteIcon && unmuteIcon) {
            muteIcon.style.display = videoPlayer.muted ? 'block' : 'none';
            unmuteIcon.style.display = videoPlayer.muted ? 'none' : 'block';
        }

        console.log(videoPlayer.muted ? '🔇 Silenciado' : '🔊 Sonido activado');
    }

    console.log('✅ Sistema de video con reproducción continua inicializado');

})();