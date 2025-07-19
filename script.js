document.addEventListener('DOMContentLoaded', function() {
    const envelope = document.getElementById('envelope');
    const letterModal = document.getElementById('letterModal');
    const closeBtn = document.getElementById('closeBtn');
    const envelopeFlap = document.querySelector('.envelope-flap');
    const envelopeSeal = document.querySelector('.envelope-seal');
    
    // Music controls
    const musicToggle = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');
    let isMusicPlaying = false;

    const letterBody = document.querySelector('.letter-body');
    let originalLetterHTML = letterBody.innerHTML;
    let typewriterTimeouts = [];

    // Typewriter animation for the letter
    function typeLetter(element, html, speed = 55, paragraphDelay = 550) {
        // Clear previous content and timeouts
        element.innerHTML = '';
        typewriterTimeouts.forEach(clearTimeout);
        typewriterTimeouts = [];

        // Split by paragraphs
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const paragraphs = Array.from(tempDiv.children);

        let pIndex = 0;
        let charIndex = 0;
        let currentP = null;

        function typeNextChar() {
            if (!currentP) {
                if (pIndex >= paragraphs.length) return;
                currentP = document.createElement(paragraphs[pIndex].tagName);
                // Copy class if present (for .date, .signature)
                if (paragraphs[pIndex].className) {
                    currentP.className = paragraphs[pIndex].className;
                }
                element.appendChild(currentP);
                charIndex = 0;
            }
            const text = paragraphs[pIndex].innerHTML;
            // For signature, allow <br> tags
            if (currentP.classList.contains('signature')) {
                // Type out as HTML, but reveal char by char
                let plain = text.replace(/<br\s*\/?>(?!$)/g, '\n');
                let shown = plain.slice(0, charIndex + 1).replace(/\n/g, '<br>');
                currentP.innerHTML = shown;
            } else {
                currentP.innerHTML = text.slice(0, charIndex + 1);
            }
            charIndex++;
            if (charIndex < text.length) {
                typewriterTimeouts.push(setTimeout(typeNextChar, speed));
            } else {
                pIndex++;
                currentP = null;
                typewriterTimeouts.push(setTimeout(typeNextChar, paragraphDelay));
            }
        }
        typeNextChar();
    }

    // Open letter when envelope is clicked
    envelope.addEventListener('click', function() {
        // Animate envelope opening
        envelopeFlap.style.transform = 'rotateX(180deg)';
        envelopeSeal.style.transform = 'translate(-50%, -50%) scale(0.8)';
        envelopeSeal.style.opacity = '0.5';
        
        // Show modal after a short delay
        setTimeout(() => {
            letterModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Add some sparkle effect
            createSparkles();
            // Start typewriter effect
            typeLetter(letterBody, originalLetterHTML);
        }, 500);
    });

    // Close letter modal
    closeBtn.addEventListener('click', function() {
        closeLetter();
    });

    // Close modal when clicking outside
    letterModal.addEventListener('click', function(e) {
        if (e.target === letterModal) {
            closeLetter();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && letterModal.style.display === 'flex') {
            closeLetter();
        }
    });

    function closeLetter() {
        letterModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Reset envelope animation
        setTimeout(() => {
            envelopeFlap.style.transform = 'rotateX(0deg)';
            envelopeSeal.style.transform = 'translate(-50%, -50%) scale(1)';
            envelopeSeal.style.opacity = '1';
        }, 300);
        // Restore full letter text and clear typewriter
        typewriterTimeouts.forEach(clearTimeout);
        typewriterTimeouts = [];
        letterBody.innerHTML = originalLetterHTML;
    }

    // Create sparkle effect when letter opens
    function createSparkles() {
        const sparklesContainer = document.createElement('div');
        sparklesContainer.style.position = 'fixed';
        sparklesContainer.style.top = '0';
        sparklesContainer.style.left = '0';
        sparklesContainer.style.width = '100%';
        sparklesContainer.style.height = '100%';
        sparklesContainer.style.pointerEvents = 'none';
        sparklesContainer.style.zIndex = '999';
        
        document.body.appendChild(sparklesContainer);

        // Create elegant heart sparkles
        const sparkleTypes = ['💖', '💕', '💝', '💗', '💓', '💞', '💟', '💜'];
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.innerHTML = sparkleTypes[Math.floor(Math.random() * sparkleTypes.length)];
                sparkle.style.position = 'absolute';
                sparkle.style.left = Math.random() * 100 + '%';
                sparkle.style.top = Math.random() * 100 + '%';
                sparkle.style.fontSize = Math.random() * 15 + 15 + 'px';
                sparkle.style.animation = 'sparkle 3s ease-out forwards';
                sparkle.style.filter = 'drop-shadow(0 0 10px rgba(255, 107, 157, 0.8))';
                sparklesContainer.appendChild(sparkle);
                
                setTimeout(() => {
                    sparkle.remove();
                }, 3000);
            }, i * 80);
        }

        setTimeout(() => {
            sparklesContainer.remove();
        }, 4000);
    }

    // Add sparkle animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkle {
            0% {
                transform: scale(0) rotate(0deg);
                opacity: 1;
            }
            25% {
                transform: scale(1.2) rotate(90deg);
                opacity: 1;
            }
            50% {
                transform: scale(1.5) rotate(180deg);
                opacity: 1;
            }
            75% {
                transform: scale(1.2) rotate(270deg);
                opacity: 0.8;
            }
            100% {
                transform: scale(0) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add hover effect to envelope
    envelope.addEventListener('mouseenter', function() {
        envelope.style.transform = 'scale(1.05)';
    });

    envelope.addEventListener('mouseleave', function() {
        envelope.style.transform = 'scale(1)';
    });

    // Add some interactive heart effects
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach(heart => {
        heart.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(45deg) scale(1.2)';
            this.style.background = 'rgba(255, 105, 180, 0.9)';
        });
        
        heart.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(45deg) scale(1)';
            this.style.background = 'rgba(255, 105, 180, 0.6)';
        });
    });

    // Add a subtle parallax effect to hearts
    document.addEventListener('mousemove', function(e) {
        const hearts = document.querySelectorAll('.heart');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        hearts.forEach((heart, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            heart.style.transform = `rotate(45deg) translate(${x}px, ${y}px)`;
        });
    });

    // Add floating rose petals effect
    function createRosePetals() {
        const petalsContainer = document.createElement('div');
        petalsContainer.style.position = 'fixed';
        petalsContainer.style.top = '0';
        petalsContainer.style.left = '0';
        petalsContainer.style.width = '100%';
        petalsContainer.style.height = '100%';
        petalsContainer.style.pointerEvents = 'none';
        petalsContainer.style.zIndex = '1';
        
        document.body.appendChild(petalsContainer);

        setInterval(() => {
            const petal = document.createElement('div');
            petal.innerHTML = '🌸';
            petal.style.position = 'absolute';
            petal.style.left = Math.random() * 100 + '%';
            petal.style.top = '-50px';
            petal.style.fontSize = Math.random() * 10 + 15 + 'px';
            petal.style.animation = 'fallPetal 8s linear forwards';
            petal.style.opacity = '0.7';
            
            petalsContainer.appendChild(petal);
            
            setTimeout(() => {
                petal.remove();
            }, 8000);
        }, 2000);
    }

    // Enhance pounding heart effect
    const poundingHeart = document.getElementById('poundingHeart');
    
    // Make heart beat faster when envelope is hovered
    envelope.addEventListener('mouseenter', function() {
        poundingHeart.style.animation = 'pound 0.8s ease-in-out infinite';
        poundingHeart.style.color = 'rgba(255, 107, 157, 0.5)';
    });

    envelope.addEventListener('mouseleave', function() {
        poundingHeart.style.animation = 'pound 1.5s ease-in-out infinite';
        poundingHeart.style.color = 'rgba(255, 107, 157, 0.3)';
    });

    // Make heart beat faster when letter opens
    envelope.addEventListener('click', function() {
        poundingHeart.style.animation = 'pound 0.6s ease-in-out infinite';
        poundingHeart.style.color = 'rgba(255, 107, 157, 0.6)';
        
        // Reset after letter animation
        setTimeout(() => {
            poundingHeart.style.animation = 'pound 1.5s ease-in-out infinite';
            poundingHeart.style.color = 'rgba(255, 107, 157, 0.3)';
        }, 2000);
    });

    // Start rose petals effect
    createRosePetals();

    // Add petal fall animation to CSS
    const petalStyle = document.createElement('style');
    petalStyle.textContent = `
        @keyframes fallPetal {
            0% {
                transform: translateY(-50px) rotate(0deg);
                opacity: 0.7;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 0.7;
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(petalStyle);

    // Music toggle functionality
    musicToggle.addEventListener('click', function() {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            musicToggle.textContent = '🎵';
            musicToggle.classList.remove('playing');
            isMusicPlaying = false;
        } else {
            backgroundMusic.play().then(() => {
                musicToggle.textContent = '⏸️';
                musicToggle.classList.add('playing');
                isMusicPlaying = true;
            }).catch(error => {
                console.log('Music autoplay blocked:', error);
                // Show a message to user to click to enable music
                musicToggle.textContent = '🔇';
            });
        }
    });

    // Auto-play music when letter opens (if user has interacted)
    envelope.addEventListener('click', function() {
        if (!isMusicPlaying && backgroundMusic.readyState >= 2) {
            setTimeout(() => {
                backgroundMusic.play().then(() => {
                    musicToggle.textContent = '⏸️';
                    musicToggle.classList.add('playing');
                    isMusicPlaying = true;
                }).catch(error => {
                    console.log('Music autoplay blocked:', error);
                });
            }, 1000);
        }
    });

    // Handle music ending
    backgroundMusic.addEventListener('ended', function() {
        if (backgroundMusic.loop) {
            // If looped, it should continue playing
            return;
        }
        musicToggle.textContent = '🎵';
        musicToggle.classList.remove('playing');
        isMusicPlaying = false;
    });
}); 
