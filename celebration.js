// ================= CELEBRATION 20/11 JAVASCRIPT =================
(function() {
    const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');
    const countdownArea = document.getElementById('countdown-area');
    const messageArea = document.getElementById('message-area');
    const envelopeContainer = document.getElementById('envelope-container');
    const envelope = document.getElementById('envelope');
    const musicControl = document.getElementById('music-control');
    const celebrationMusic = document.getElementById('celebration-music');
    const loadingText = document.getElementById('loading-text');
    const deviceCheck = document.getElementById('device-check');
    const container = document.getElementById('container');

    // Canvas Matrix Background
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters: Chúc mừng Ngày Nhà giáo Việt Nam 20/11
    const chars = "HAPPY TEACHERS DAY 20/11 TRI AN THAY CO 10I CHUYEN QUANG TRUNG";
    const charArray = chars.split('');
    const fontSize = Math.max(13, Math.floor(window.innerWidth / 35));
    let columns = Math.floor(canvas.width / fontSize);
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops.push(Math.floor(Math.random() * canvas.height / fontSize));
    }

    // Matrix animation: Điều chỉnh tốc độ rơi chậm rãi, nhẹ nhàng và hoài niệm
    let lastMatrixTime = 0;
    const matrixFrameInterval = 50; // Giảm tốc độ khung hình của ma trận xuống ~20fps giúp hạt chữ rơi êm đềm

    function animateMatrix(currentTime) {
        requestAnimationFrame(animateMatrix);

        if (!currentTime) currentTime = performance.now();
        const delta = currentTime - lastMatrixTime;
        if (delta < matrixFrameInterval) return;
        lastMatrixTime = currentTime - (delta % matrixFrameInterval);

        ctx.fillStyle = 'rgba(11, 15, 20, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#C58F79';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    // Number patterns 3, 2, 1
    const numberPatterns = {
        3: [
            [0,0,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,0],
            [1,1,0,0,0,0,1,1],
            [0,0,0,0,0,0,1,1],
            [0,0,0,0,0,1,1,0],
            [0,0,0,0,0,0,1,1],
            [1,1,0,0,0,0,1,1],
            [0,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,0,0]
        ],
        2: [
            [0,0,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,0],
            [1,1,0,0,0,0,1,1],
            [0,0,0,0,0,0,1,1],
            [0,0,0,0,0,1,1,0],
            [0,0,0,0,1,1,0,0],
            [0,0,0,1,1,0,0,0],
            [0,0,1,1,0,0,0,0],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1]
        ],
        1: [
            [0,0,0,1,1,0,0,0],
            [0,0,1,1,1,0,0,0],
            [0,1,1,1,1,0,0,0],
            [1,1,0,1,1,0,0,0],
            [0,0,0,1,1,0,0,0],
            [0,0,0,1,1,0,0,0],
            [0,0,0,1,1,0,0,0],
            [0,0,0,1,1,0,0,0],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1]
        ]
    };

    // Letter patterns for "HAPPY TEACHER DAY" and "20/11"
    const letterPatterns = {
        'H': [
            [1,1,0,0,0,0,1,1],
            [1,1,0,0,0,0,1,1],
            [1,1,0,0,0,0,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,0,0,0,0,1,1],
            [1,1,0,0,0,0,1,1],
            [1,1,0,0,0,0,1,1]
        ],
        'A': [
            [0,0,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,0],
            [1,1,0,0,0,0,1,1],
            [1,1,0,0,0,0,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,0,0,0,0,1,1],
            [1,1,0,0,0,0,1,1]
        ],
        'P': [
            [1,1,1,1,1,1,0,0],
            [1,1,1,1,1,1,1,0],
            [1,1,0,0,0,0,1,1],
            [1,1,0,0,0,0,1,1],
            [1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,0,0],
            [1,1,0,0,0,0,0,0],
            [1,1,0,0,0,0,0,0]
        ],
        'Y': [
            [1,1,0,0,0,0,1,1],
            [1,1,0,0,0,0,1,1],
            [0,1,1,0,0,1,1,0],
            [0,0,1,1,1,1,0,0],
            [0,0,0,1,1,0,0,0],
            [0,0,0,1,1,0,0,0],
            [0,0,0,1,1,0,0,0],
            [0,0,0,1,1,0,0,0]
        ],
        'T': [
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [0,0,0,1,1,0,0,0],
            [0,0,0,1,1,0,0,0],
            [0,0,0,1,1,0,0,0],
            [0,0,0,1,1,0,0,0],
            [0,0,0,1,1,0,0,0],
            [0,0,0,1,1,0,0,0]
        ],
        'E': [
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,0,0,0,0,0,0],
            [1,1,1,1,1,1,0,0],
            [1,1,1,1,1,1,0,0],
            [1,1,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1]
        ],
        'C': [
            [0,0,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,0],
            [1,1,0,0,0,0,1,1],
            [1,1,0,0,0,0,0,0],
            [1,1,0,0,0,0,0,0],
            [1,1,0,0,0,0,1,1],
            [0,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,0,0]
        ],
        'R': [
            [1,1,1,1,1,1,0,0],
            [1,1,1,1,1,1,1,0],
            [1,1,0,0,0,0,1,1],
            [1,1,0,0,0,0,1,1],
            [1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,0,0],
            [1,1,0,0,1,1,0,0],
            [1,1,0,0,0,1,1,1]
        ],
        'D': [
            [1,1,1,1,1,1,0,0],
            [1,1,1,1,1,1,1,0],
            [1,1,0,0,0,0,1,1],
            [1,1,0,0,0,0,1,1],
            [1,1,0,0,0,0,1,1],
            [1,1,0,0,0,0,1,1],
            [1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,0,0]
        ],
        '2': [
            [0,0,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,0],
            [1,1,0,0,0,0,1,1],
            [0,0,0,0,0,0,1,1],
            [0,0,0,0,0,1,1,0],
            [0,0,0,0,1,1,0,0],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1]
        ],
        '0': [
            [0,0,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,0],
            [1,1,0,0,0,0,1,1],
            [1,1,0,0,0,0,1,1],
            [1,1,0,0,0,0,1,1],
            [1,1,0,0,0,0,1,1],
            [0,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,0,0]
        ],
        '/': [
            [0,0,0,0,0,1,1,0],
            [0,0,0,0,1,1,0,0],
            [0,0,0,1,1,0,0,0],
            [0,0,1,1,0,0,0,0],
            [0,1,1,0,0,0,0,0],
            [1,1,0,0,0,0,0,0],
            [1,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0]
        ],
        '1': [
            [0,0,0,1,1,0,0,0],
            [0,0,1,1,1,0,0,0],
            [0,1,1,1,1,0,0,0],
            [1,1,0,1,1,0,0,0],
            [0,0,0,1,1,0,0,0],
            [0,0,0,1,1,0,0,0],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1]
        ]
    };

    let currentBlocks = [];
    let countdownValue = 3;
    let isMusicPlaying = false;
    let isEnvelopeOpen = false;

    // Music control & Tiếp nối thời gian bài hát từ trang chủ (không phát lại từ đầu)
    function tryStartMusic() {
        if (!celebrationMusic) return;

        // Đọc thời gian phát nhạc từ trang index.html
        const savedMusicTime = parseFloat(sessionStorage.getItem('bgMusicCurrentTime'));
        if (!isNaN(savedMusicTime) && savedMusicTime > 0) {
            try {
                celebrationMusic.currentTime = savedMusicTime;
            } catch (e) {
                console.log('Chưa tua kịp thời gian phát:', e);
            }
        }

        const startPlayback = () => {
            celebrationMusic.play().then(() => {
                isMusicPlaying = true;
                if (musicControl) {
                    musicControl.classList.add('playing');
                    musicControl.classList.remove('muted');
                }
            }).catch(() => {});
        };

        startPlayback();

        // Kích hoạt khi có bất kỳ tương tác hoặc cuộn trang
        ['scroll', 'wheel', 'touchmove', 'touchstart', 'click', 'keydown'].forEach(evt => {
            window.addEventListener(evt, startPlayback, { passive: true });
        });

        celebrationMusic.addEventListener('timeupdate', () => {
            if (!celebrationMusic.paused && celebrationMusic.currentTime > 0) {
                sessionStorage.setItem('bgMusicCurrentTime', celebrationMusic.currentTime);
            }
        });
    }

    // Tạo số đếm ngược 3-2-1 chậm rãi, hoài niệm
    function createNumber(number, isFirst = false) {
        const pattern = numberPatterns[number];
        if (!pattern) return;

        const blockSize = window.innerWidth < 640 ? 7 : 10;
        const gap = 2;
        const rows = pattern.length;
        const cols = pattern[0].length;
        const totalWidth = cols * (blockSize + gap) - gap;
        const totalHeight = rows * (blockSize + gap) - gap;

        const startX = (countdownArea.offsetWidth - totalWidth) / 2;
        const startY = (countdownArea.offsetHeight - totalHeight) / 2;

        currentBlocks.forEach(block => {
            if (block.parentNode === countdownArea) countdownArea.removeChild(block);
        });
        currentBlocks = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (pattern[row][col] === 1) {
                    const block = document.createElement('div');
                    block.className = 'block';
                    block.style.width = `${blockSize}px`;
                    block.style.height = `${blockSize}px`;

                    const finalX = startX + col * (blockSize + gap);
                    const finalY = startY + row * (blockSize + gap);

                    let startPosX = isFirst ? Math.random() * countdownArea.offsetWidth : finalX;
                    let startPosY = isFirst ? Math.random() * countdownArea.offsetHeight : finalY;

                    block.style.left = `${startPosX}px`;
                    block.style.top = `${startPosY}px`;

                    countdownArea.appendChild(block);
                    currentBlocks.push(block);

                    // Ghép hạt chậm rãi, bồng bềnh hoài niệm (500ms - 800ms)
                    const duration = 500 + Math.random() * 300;
                    const startTime = Date.now();
                    function anim() {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const ease = 1 - Math.pow(1 - progress, 3);
                        block.style.left = `${startPosX + (finalX - startPosX) * ease}px`;
                        block.style.top = `${startPosY + (finalY - startPosY) * ease}px`;
                        block.style.opacity = progress.toString();
                        if (progress < 1) requestAnimationFrame(anim);
                    }
                    setTimeout(() => requestAnimationFrame(anim), Math.random() * 80);
                }
            }
        }
    }

    // Nổ các hạt khối số
    function explodeCountdownBlocks(callback) {
        currentBlocks.forEach((block, index) => {
            const startX = parseFloat(block.style.left);
            const startY = parseFloat(block.style.top);
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 80;
            const targetX = startX + Math.cos(angle) * distance;
            const targetY = startY + Math.sin(angle) * distance;

            const startTime = Date.now();
            const duration = 150 + Math.random() * 100;

            function animExp() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                block.style.left = `${startX + (targetX - startX) * progress}px`;
                block.style.top = `${startY + (targetY - startY) * progress}px`;
                block.style.transform = `rotate(${progress * 360}deg)`;
                block.style.opacity = (1 - progress).toString();

                if (progress < 1) {
                    requestAnimationFrame(animExp);
                } else if (block.parentNode === countdownArea) {
                    countdownArea.removeChild(block);
                }
            }
            setTimeout(() => requestAnimationFrame(animExp), index * 2);
        });
        currentBlocks = [];
        if (callback) setTimeout(callback, 260);
    }

    // Hiển thị thông điệp ghép từ hạt: "HAPPY TEACHER DAY" và "20/11"
    function displayParticleMessage(text, onComplete) {
        messageArea.style.opacity = '1';
        messageArea.innerHTML = '';
        currentBlocks = [];

        const isMobile = window.innerWidth < 768;
        const blockSize = isMobile ? (text.length > 8 ? 3.5 : 5.5) : (text.length > 8 ? 5.5 : 8);
        const gap = 1;
        const letterSpacing = isMobile ? 4 : 8;

        let totalWidth = 0;
        for (let i = 0; i < text.length; i++) {
            const letter = text[i];
            if (letter === ' ') {
                totalWidth += isMobile ? 10 : 16;
            } else if (letterPatterns[letter]) {
                totalWidth += letterPatterns[letter][0].length * (blockSize + gap) - gap;
                if (i < text.length - 1) totalWidth += letterSpacing;
            }
        }

        const startX = Math.max(10, (messageArea.offsetWidth - totalWidth) / 2);
        const startY = (messageArea.offsetHeight - 8 * (blockSize + gap)) / 2;
        let currentX = startX;

        for (let i = 0; i < text.length; i++) {
            const letter = text[i];
            if (letter === ' ') {
                currentX += isMobile ? 10 : 16;
                continue;
            }
            const pattern = letterPatterns[letter];
            if (!pattern) continue;

            const rows = pattern.length;
            const cols = pattern[0].length;
            const letterW = cols * (blockSize + gap) - gap;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (pattern[r][c] === 1) {
                        const block = document.createElement('div');
                        block.className = 'block';
                        block.style.width = `${blockSize}px`;
                        block.style.height = `${blockSize}px`;

                        const finalX = currentX + c * (blockSize + gap);
                        const finalY = startY + r * (blockSize + gap);

                        const startRandX = Math.random() * messageArea.offsetWidth;
                        const startRandY = Math.random() * messageArea.offsetHeight;

                        block.style.left = `${startRandX}px`;
                        block.style.top = `${startRandY}px`;
                        block.style.opacity = '0';

                        messageArea.appendChild(block);
                        currentBlocks.push(block);

                        const startTime = Date.now();
                        // Chuyển động ghép hạt chậm rãi, mượt mà và hoài niệm
                        const duration = 550 + Math.random() * 300;
                        function animLetter() {
                            const elapsed = Date.now() - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            const ease = 1 - Math.pow(1 - progress, 3);
                            block.style.left = `${startRandX + (finalX - startRandX) * ease}px`;
                            block.style.top = `${startRandY + (finalY - startRandY) * ease}px`;
                            block.style.opacity = progress.toString();
                            if (progress < 1) requestAnimationFrame(animLetter);
                        }
                        setTimeout(() => requestAnimationFrame(animLetter), Math.random() * 120 + c * 10);
                    }
                }
            }
            currentX += letterW + letterSpacing;
        }

        // Sau khi hiện chữ, giữ lâu hơn (4s cho HAPPY TEACHER DAY, 3.2s cho 20/11) để hoài niệm
        const waitTime = text.length > 8 ? 4000 : 3200;
        setTimeout(() => {
            explodeMessageBlocks(() => {
                if (onComplete) onComplete();
            });
        }, waitTime);
    }

    // Nổ thông điệp và biến mất
    function explodeMessageBlocks(callback) {
        createConfettiBurst(25);
        currentBlocks.forEach((block, idx) => {
            const startX = parseFloat(block.style.left);
            const startY = parseFloat(block.style.top);
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 90;
            const targetX = startX + Math.cos(angle) * distance;
            const targetY = startY + Math.sin(angle) * distance;

            const startTime = Date.now();
            const duration = 240 + Math.random() * 140;

            function animExp() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                block.style.left = `${startX + (targetX - startX) * progress}px`;
                block.style.top = `${startY + (targetY - startY) * progress}px`;
                block.style.transform = `rotate(${progress * 360}deg)`;
                block.style.opacity = (1 - progress).toString();

                if (progress < 1) {
                    requestAnimationFrame(animExp);
                } else if (block.parentNode === messageArea) {
                    messageArea.removeChild(block);
                }
            }
            setTimeout(() => requestAnimationFrame(animExp), idx * 1.5);
        });
        currentBlocks = [];
        setTimeout(() => {
            messageArea.innerHTML = '';
            if (callback) callback();
        }, 350);
    }

    // Pháo giấy confetti bay lấp lánh
    function createConfettiBurst(count = 30) {
        const colors = ['#e6d2aa', '#C58F79', '#82749B', '#C6E2E5', '#ffffff'];
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = '-20px';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

            container.appendChild(confetti);

            const duration = 1200 + Math.random() * 1000;
            const startTime = Date.now();
            const startLeft = parseFloat(confetti.style.left);

            function animConfetti() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentY = -20 + (window.innerHeight + 40) * progress;
                const currentX = startLeft + Math.sin(progress * 8) * 30;

                confetti.style.top = `${currentY}px`;
                confetti.style.left = `${currentX}vw`;
                confetti.style.opacity = progress < 0.1 ? progress * 10 : (1 - progress);

                if (progress < 1) {
                    requestAnimationFrame(animConfetti);
                } else if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }
            setTimeout(() => requestAnimationFrame(animConfetti), Math.random() * 200);
        }
    }

    // Hiện phong bì thư tri ân
    function showFinalEnvelope() {
        messageArea.style.display = 'none';
        countdownArea.style.display = 'none';

        envelopeContainer.style.opacity = '1';
        createConfettiBurst(50);

        // Tự động mở nhẹ hoặc cho phép người dùng click
        envelope.addEventListener('click', () => {
            if (!isEnvelopeOpen) {
                envelope.classList.add('open');
                isEnvelopeOpen = true;
                const instruction = document.getElementById('instruction');
                if (instruction) instruction.style.opacity = '0';
                createConfettiBurst(60);
            }
        });

        // Tự động mở phong bì sau 2 giây để Thầy Cô chiêm ngưỡng rồi đọc trọn vẹn lời chúc
        setTimeout(() => {
            if (!isEnvelopeOpen) {
                envelope.classList.add('open');
                isEnvelopeOpen = true;
                const instruction = document.getElementById('instruction');
                if (instruction) instruction.style.opacity = '0';
                createConfettiBurst(50);
            }
        }, 2000);
    }

    // Bắt đầu quy trình đếm ngược 3-2-1 chậm rãi, hoài niệm
    function startCelebrationFlow() {
        createNumber(3, true);

        setTimeout(() => {
            explodeCountdownBlocks(() => {
                createNumber(2);
                setTimeout(() => {
                    explodeCountdownBlocks(() => {
                        createNumber(1);
                        setTimeout(() => {
                            explodeCountdownBlocks(() => {
                                // 1. Hiện "HAPPY TEACHER DAY" -> Sau đó nổ & biến mất
                                displayParticleMessage("HAPPY TEACHER DAY", () => {
                                    // 2. Tiếp theo hiện "20/11" -> Sau đó nổ & biến mất
                                    displayParticleMessage("20/11", () => {
                                        // 3. Cuối cùng hiện Phong bì & Bức tâm thư tri ân Thầy Cô
                                        showFinalEnvelope();
                                    });
                                });
                            });
                        }, 1200);
                    });
                }, 1200);
            });
        }, 1200);
    }

    // Khởi tạo trang khi tải xong
    window.addEventListener('load', () => {
        animateMatrix();
        tryStartMusic();

        setTimeout(() => {
            deviceCheck.style.opacity = '0';
            loadingText.style.opacity = '0';
            setTimeout(() => {
                deviceCheck.style.display = 'none';
                loadingText.style.display = 'none';
                container.style.opacity = '1';
                startCelebrationFlow();
            }, 600);
        }, 800);
    });
})();
