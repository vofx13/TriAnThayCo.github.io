lucide.createIcons();

        // 1. Tối ưu Three.js nền: Tự động ngắt render khi không ở hero để không giật lag
        let isHeroActive = true;
        const heroEl = document.getElementById('hero-section');
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => { isHeroActive = entry.isIntersecting; });
        }, { threshold: 0.1 });
        if (heroEl) heroObserver.observe(heroEl);

        (function initOptimizedThree() {
            const canvas = document.getElementById('webgl-canvas');
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
            camera.position.z = 400;

            const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(1);

            const count = window.innerWidth < 768 ? 60 : 160;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(count * 3);

            for (let i = 0; i < count; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 1200;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 1200;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 800;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const material = new THREE.PointsMaterial({
                color: 0xFACC15,
                size: 2.2,
                transparent: true,
                opacity: 0.35,
                blending: THREE.AdditiveBlending,
            });

            const particles = new THREE.Points(geometry, material);
            scene.add(particles);

            let mouseX = 0, mouseY = 0;
            window.addEventListener('mousemove', (e) => {
                if (!isHeroActive) return;
                mouseX = (e.clientX - window.innerWidth / 2) * 0.04;
                mouseY = (e.clientY - window.innerHeight / 2) * 0.04;
            }, { passive: true });

            function animate() {
                requestAnimationFrame(animate);
                if (!isHeroActive) return;

                particles.rotation.y += 0.0003;
                camera.position.x += (mouseX - camera.position.x) * 0.02;
                camera.position.y += (-mouseY - camera.position.y) * 0.02;
                camera.lookAt(scene.position);

                renderer.render(scene, camera);
            }
            animate();

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        })();

        // 2. TỜ BÁO PHÓNG TO VỪA VẶN MÀN HÌNH KHI CUỘN ĐẾN
        const cinemaNewspaper = document.getElementById('cinema-newspaper');
        const cinemaSection = document.getElementById('newspaper-cinema-section');

        const cinematicObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (window.innerWidth < 1024) {
                    cinemaNewspaper.style.transform = "none";
                    cinemaNewspaper.style.opacity = "1";
                    cinemaNewspaper.style.boxShadow = "none";
                    return;
                }
                if (entry.isIntersecting) {
                    cinemaNewspaper.style.transform = "perspective(3200px) rotateX(0deg) translateY(0px) scale(1)";
                    cinemaNewspaper.style.opacity = "1";
                    cinemaNewspaper.style.boxShadow = "0 40px 120px -20px rgba(0, 0, 0, 0.98), 0 0 80px rgba(0, 0, 0, 0.7)";
                } else {
                    cinemaNewspaper.style.transform = "perspective(3200px) rotateX(15deg) translateY(60px) scale(0.92)";
                    cinemaNewspaper.style.opacity = "0";
                }
            });
        }, { threshold: 0.1 });

        if (cinemaSection) cinematicObserver.observe(cinemaSection);

        // 3. BẤM BÊN PHẢI ĐỂ TỰ ĐỘNG LẬT TRANG (KHÔNG CẦN NÚT)
        let isLeafFlipped = false;
        const flippingLeaf = document.getElementById('flipping-leaf-3d');

        function setLeafFlip(open) {
            if (open === isLeafFlipped) return;
            isLeafFlipped = open;

            if (flippingLeaf) {
                if (isLeafFlipped) {
                    flippingLeaf.classList.add('flipped');
                } else {
                    flippingLeaf.classList.remove('flipped');
                }
            }
        }

        // ĐIỀU HƯỚNG TRANG BÁO TRÊN ĐIỆN THOẠI & ANIMATION LẬT BÁO 3D
        let activeMobilePage = 1;
        function switchMobileNewsPage(pageNum, direction) {
            if (pageNum < 1 || pageNum > 4) return;
            const prevPage = activeMobilePage;
            activeMobilePage = pageNum;
            const dir = direction || (activeMobilePage >= prevPage ? 'forward' : 'backward');

            for (let i = 1; i <= 4; i++) {
                const pageEl = document.getElementById(`news-page-${i}`);
                if (pageEl) {
                    pageEl.classList.remove('news-page-turn-forward', 'news-page-turn-backward');
                    if (i === activeMobilePage) {
                        void pageEl.offsetWidth; // Force reflow để animation luôn chạy lại mượt mà
                        pageEl.classList.add('active-mobile-page');
                        if (dir === 'forward') {
                            pageEl.classList.add('news-page-turn-forward');
                        } else {
                            pageEl.classList.add('news-page-turn-backward');
                        }
                    } else {
                        pageEl.classList.remove('active-mobile-page');
                    }
                }
            }

            // Đồng bộ tab nút bấm
            document.querySelectorAll('.news-mobile-tab').forEach(btn => {
                const tabIndex = parseInt(btn.getAttribute('data-tab'), 10);
                if (tabIndex === activeMobilePage) {
                    btn.classList.add('bg-[#344C63]', 'text-white', 'shadow');
                    btn.classList.remove('text-[#344C63]');
                } else {
                    btn.classList.remove('bg-[#344C63]', 'text-white', 'shadow');
                    btn.classList.add('text-[#344C63]');
                }
            });

            const indicator = document.getElementById('mobile-page-indicator');
            if (indicator) indicator.textContent = `Trang ${activeMobilePage} / 4`;
            if (window.lucide) lucide.createIcons();
        }

        document.querySelectorAll('.news-mobile-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = parseInt(btn.getAttribute('data-tab'), 10);
                switchMobileNewsPage(tab);
            });
        });

        const prevBtn = document.getElementById('mobile-prev-page-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const prev = activeMobilePage > 1 ? activeMobilePage - 1 : 4;
                switchMobileNewsPage(prev, 'backward');
            });
        }

        const nextBtn = document.getElementById('mobile-next-page-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const next = activeMobilePage < 4 ? activeMobilePage + 1 : 1;
                switchMobileNewsPage(next, 'forward');
            });
        }

        // TƯƠNG TÁC LẬT BÁO THÔNG MINH CHO THẦY CÔ: ẤN BÊN PHẢI LẬT QUA, ẤN BÊN TRÁI LẬT LẠI
        if (cinemaNewspaper) {
            cinemaNewspaper.addEventListener('click', (e) => {
                // Không can thiệp nếu người dùng ấn vào link, nút bấm hoặc audio podcast
                if (e.target.closest('#radio-play-btn') || e.target.closest('a') || e.target.closest('button')) return;

                const rect = cinemaNewspaper.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const isRightHalf = clickX > rect.width / 2;

                if (window.innerWidth < 1024) {
                    // TRÊN ĐIỆN THOẠI & TABLET: Ấn bên phải lật sang trang sau, ấn bên trái lật lại trang trước
                    if (isRightHalf) {
                        const next = activeMobilePage < 4 ? activeMobilePage + 1 : 1;
                        switchMobileNewsPage(next, 'forward');
                    } else {
                        const prev = activeMobilePage > 1 ? activeMobilePage - 1 : 4;
                        switchMobileNewsPage(prev, 'backward');
                    }
                } else {
                    // TRÊN DESKTOP: Ấn bên phải lật mở sang trang đôi 3-4, ấn bên trái lật về trang 1-2
                    if (isRightHalf) {
                        setLeafFlip(true);
                    } else {
                        setLeafFlip(false);
                    }
                }
            });

            let touchStartX = 0;
            let touchStartY = 0;
            cinemaNewspaper.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].clientX;
                touchStartY = e.changedTouches[0].clientY;
            }, { passive: true });

            cinemaNewspaper.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const diffX = touchStartX - touchEndX;
                const diffY = touchStartY - touchEndY;

                // Bỏ qua nếu là vuốt dọc để cuộn trang web
                if (Math.abs(diffY) > Math.abs(diffX)) return;

                if (window.innerWidth < 1024) {
                    if (diffX > 35) {
                        switchMobileNewsPage(activeMobilePage < 4 ? activeMobilePage + 1 : 1, 'forward');
                    } else if (diffX < -35) {
                        switchMobileNewsPage(activeMobilePage > 1 ? activeMobilePage - 1 : 4, 'backward');
                    }
                } else {
                    if (diffX > 40) setLeafFlip(true);
                    else if (diffX < -40) setLeafFlip(false);
                }
            }, { passive: true });
        }

        // 4. Radio Phát Thanh Podcast
        let isRadioRunning = false;
        let radioTimer = null;
        let radioCount = 0;
        const radioIcon = document.getElementById('radio-play-icon');
        const radioTimerText = document.getElementById('radio-timer-display');

        function toggleRadioPlay(e) {
            if (e) e.stopPropagation();
            isRadioRunning = !isRadioRunning;
            if (isRadioRunning) {
                if (radioIcon) radioIcon.setAttribute('data-lucide', 'pause');
                radioTimer = setInterval(() => {
                    radioCount++;
                    const m = String(Math.floor(radioCount / 60)).padStart(2, '0');
                    const s = String(radioCount % 60).padStart(2, '0');
                    if (radioTimerText) radioTimerText.innerText = `${m}:${s}`;
                }, 1000);
            } else {
                if (radioIcon) radioIcon.setAttribute('data-lucide', 'play');
                clearInterval(radioTimer);
            }
            lucide.createIcons();
        }

        // 5. Vạch tiến trình cuộn Timeline & Hiệu ứng Đợi 2s Phóng to ngang + Đẩy trục tiến trình
        const progressLine = document.getElementById('scroll-progress-line');
        const railTrack = document.getElementById('timeline-rail-track');
        const timelineNodes = document.querySelectorAll('.timeline-node');

        let expandTimer = null;
        let currentFocusedIndex = -1;

        function updateTimelineExpansion() {
            const timelineSection = document.getElementById('timeline-section');
            if (!timelineSection) return;
            const rect = timelineSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const viewportCenter = windowHeight / 2;

            // 1. Cập nhật chiều cao vạch vàng tiến trình dọc tức thì
            if (progressLine) {
                const startOffset = windowHeight * 0.6;
                const totalScrollable = rect.height;
                const currentScrolled = Math.max(0, startOffset - rect.top);
                const progress = Math.min(1, Math.max(0, currentScrolled / totalScrollable));
                progressLine.style.height = `${progress * 100}%`;
            }

            const isMobile = window.innerWidth < 768 || (window.innerHeight < 550 && window.innerWidth < 1024);

            // TRÊN MOBILE: Giữ toàn bộ 6 mốc luôn mở (is-expanded), không bao giờ thu nhỏ hay tự đóng
            if (isMobile) {
                timelineNodes.forEach(node => {
                    if (!node.classList.contains('is-expanded')) {
                        node.classList.add('is-expanded');
                    }
                });
                if (railTrack && progressLine) {
                    railTrack.style.transform = 'translateX(0px)';
                    progressLine.style.transform = 'translateX(0px)';
                }
                return; // Kết thúc sớm trên mobile, bỏ qua logic 2s collapse
            }

            // 2. Tìm mốc thời gian đang ở vùng trung tâm màn hình
            let focusedIndex = -1;
            let minDistance = Infinity;

            timelineNodes.forEach((node, index) => {
                const nodeRect = node.getBoundingClientRect();
                const nodeCenter = nodeRect.top + nodeRect.height / 2;
                const dist = Math.abs(nodeCenter - viewportCenter);

                if (dist < windowHeight * 0.36 && dist < minDistance) {
                    minDistance = dist;
                    focusedIndex = index;
                }
            });

            // 3. Nếu vị trí focus thay đổi (người dùng đang lướt qua):
            // ĐÓNG LẠI TỨC THÌ MỌI MỐC VÀ TRẢ THANH RAY VỀ VỊ TRÍ CŨ ĐỂ XEM ĐƯỢC TIẾN TRÌNH RÕ RÀNG
            if (focusedIndex !== currentFocusedIndex) {
                if (expandTimer) {
                    clearTimeout(expandTimer);
                    expandTimer = null;
                }

                // Thu nhỏ lại ngay lập tức
                timelineNodes.forEach((node) => {
                    node.classList.remove('is-expanded');
                    const marker = node.querySelector('.milestone-marker-node');
                    if (marker) {
                        if (window.innerWidth >= 768) {
                            marker.style.transform = 'translate(-50%, -50%) translateX(0px) rotate(45deg) scale(1)';
                        } else {
                            marker.style.transform = 'translate(-50%, -50%) rotate(45deg) scale(1)';
                        }
                    }
                });

                // Trả thanh ray và tiến trình về giữa tức thì
                if (railTrack && progressLine && window.innerWidth >= 768) {
                    railTrack.style.transform = 'translateX(0px)';
                    progressLine.style.transform = 'translateX(0px)';
                }

                currentFocusedIndex = focusedIndex;

                // 4. Nếu người dùng dừng lại ở mốc này: ĐỢI ĐỦ 2 GIÂY RỒI MỚI PHÓNG TO
                if (focusedIndex !== -1) {
                    const targetNode = timelineNodes[focusedIndex];
                    expandTimer = setTimeout(() => {
                        // Sau 2 giây dừng ngắm -> Phóng to ra và dạt thanh ray sang một bên
                        targetNode.classList.add('is-expanded');
                        lucide.createIcons();

                        const isLeft = targetNode.getAttribute('data-side') === 'left';
                        const marker = targetNode.querySelector('.milestone-marker-node');
                        const railShift = isLeft ? 'min(44vw, 530px)' : 'max(-44vw, -530px)';

                        if (railTrack && progressLine && window.innerWidth >= 768) {
                            railTrack.style.transform = `translateX(${railShift})`;
                            progressLine.style.transform = `translateX(${railShift})`;
                        }

                        if (marker) {
                            if (window.innerWidth >= 768) {
                                marker.style.transform = `translate(-50%, -50%) translateX(${railShift}) rotate(45deg) scale(1.35)`;
                            } else {
                                marker.style.transform = 'translate(-50%, -50%) rotate(45deg) scale(1.15)';
                            }
                        }
                    }, 2000); // ĐÚNG 2 GIÂY CHỜ THEO YÊU CẦU
                }
            }
        }

        let isTimelineTicking = false;
        window.addEventListener('scroll', () => {
            if (!isTimelineTicking) {
                requestAnimationFrame(() => {
                    updateTimelineExpansion();
                    isTimelineTicking = false;
                });
                isTimelineTicking = true;
            }
        }, { passive: true });

        window.addEventListener('resize', () => {
            currentFocusedIndex = -999;
            updateTimelineExpansion();
        });
        setTimeout(updateTimelineExpansion, 100);

        // ================= 6. ĐIỂM NHẤN 3D: PHÒNG TRIỂN LÃM ẢO 3D "THANH XUÂN CÓ THẦY CÔ" =================
        (function initVirtualGallery3D() {
            const container = document.getElementById('gallery-canvas-container');
            if (!container) return;

            const scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0xEAF5F5, 0.0012);

            const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 1, 2000);
            const radius = 175;

            function updateCamera() {
                if (!container) return;
                const width = container.clientWidth || window.innerWidth || 390;
                const height = container.clientHeight || (window.innerHeight < 500 ? 380 : 650);
                if (width === 0 || height === 0) return;

                const aspect = width / height;
                camera.aspect = aspect;

                // Bounding dimensions with generous safety margins:
                // halfWidth 75 accounts for 108-wide frame + 111 border + margin
                // halfHeight 82 accounts for 92-tall frame + plaque at y=-34 + tilt margin
                const halfWidth = 75;
                const halfHeight = 82;
                const tanHalfFov = Math.tan((camera.fov * Math.PI) / 360);

                const distH = halfHeight / tanHalfFov;
                const distW = halfWidth / (tanHalfFov * aspect);
                const camZ = radius + Math.max(distW, distH);

                // Camera Y centered with artwork assembly (look at y=2 with camera at y=8):
                // Centers plaque comfortably with >=15% buffer at top and bottom
                camera.position.set(0, 8, camZ);
                camera.lookAt(0, 2, 0);
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.shadowMap.enabled = true;
            container.appendChild(renderer.domElement);
            updateCamera();

            // Hiệu ứng gợi ý kéo chuột: Hiện 1 giây rồi mờ dần và ẩn đi
            const dragHint = document.getElementById('gallery-drag-hint');
            if (dragHint) {
                let hintFaded = false;
                const fadeOutHint = () => {
                    if (hintFaded) return;
                    hintFaded = true;
                    dragHint.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
                    dragHint.style.opacity = '0';
                    dragHint.style.transform = 'translateY(12px)';
                    setTimeout(() => {
                        dragHint.style.display = 'none';
                    }, 1000);
                };

                const startHintTimer = () => {
                    setTimeout(fadeOutHint, 1000); // Hiện 1 giây rồi mờ dần
                };

                const gallerySection = document.getElementById('virtual-gallery-3d-section');
                if ('IntersectionObserver' in window && gallerySection) {
                    const hintObs = new IntersectionObserver((entries) => {
                        if (entries[0].isIntersecting) {
                            startHintTimer();
                            hintObs.disconnect();
                        }
                    }, { threshold: 0.15 });
                    hintObs.observe(gallerySection);
                } else {
                    startHintTimer();
                }

                // Nếu người dùng bắt đầu tương tác trước khi hết 1s, lập tức kích hoạt fade out
                container.addEventListener('pointerdown', fadeOutHint, { once: true });
            }

            // Ánh sáng bảo tàng số
            const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
            scene.add(ambientLight);

            const pointLight = new THREE.PointLight(0x82749B, 2.2, 700);
            pointLight.position.set(0, 110, 120);
            scene.add(pointLight);

            const blueLight = new THREE.PointLight(0xC6E2E5, 1.8, 550);
            blueLight.position.set(-160, -60, -60);
            scene.add(blueLight);

            // Group xoay tương tác 360 độ
            const galleryGroup = new THREE.Group();
            scene.add(galleryGroup);

            // 1. Quả cầu Tri Thức Hologram 3D ở trung tâm
            const sphereGeo = new THREE.IcosahedronGeometry(36, 2);
            const sphereMat = new THREE.MeshStandardMaterial({
                color: 0x82749B,
                metalness: 0.85,
                roughness: 0.2,
                wireframe: true,
                emissive: 0x82749B,
                emissiveIntensity: 0.2,
            });
            const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
            galleryGroup.add(coreSphere);

            // Lõi phát sáng bên trong quả cầu
            const innerGeo = new THREE.SphereGeometry(18, 32, 32);
            const innerMat = new THREE.MeshBasicMaterial({ color: 0xC58F79 });
            const innerCore = new THREE.Mesh(innerGeo, innerMat);
            galleryGroup.add(innerCore);

            // 2. Vòng quỹ đạo ánh sáng vàng quay xung quanh
            const ringGeo = new THREE.TorusGeometry(62, 1.2, 16, 100);
            const ringMat = new THREE.MeshStandardMaterial({ color: 0xC58F79, metalness: 0.85, roughness: 0.15 });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.rotation.x = Math.PI / 3;
            galleryGroup.add(ringMesh);

            const ringGeo2 = new THREE.TorusGeometry(78, 1, 16, 100);
            const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat);
            ringMesh2.rotation.y = Math.PI / 4;
            galleryGroup.add(ringMesh2);

            // 3. 5 Khung Tranh Kỷ Niệm 3D lơ lửng mang ảnh thật của Thầy Cô
            const defaultPhotos = [
                {
                    file: '2aOboRCoBzxrKnV8hTuhv3EF9DPmNdobVKsJmDce.jpg',
                    src: '2aOboRCoBzxrKnV8hTuhv3EF9DPmNdobVKsJmDce.jpg',
                    title: 'Tiết Dạy Ấm Áp Của Cô',
                    caption: 'Tận tụy giảng từng bài học cho đàn em 10I'
                },
                {
                    file: '2aOboRCo4tUkGRs66sV4hON4eQqRdkwyFaC0W6zY.jpg',
                    src: '2aOboRCo4tUkGRs66sV4hON4eQqRdkwyFaC0W6zY.jpg',
                    title: 'Ngát Hương Hoa Tri Ân 20/11',
                    caption: 'Tình cảm mộc mạc học trò kính dâng Thầy Cô'
                },
                {
                    file: '2aOboRCoBzGXjhyd0ExnyvxNtrb7wdcyXXzonROC.jpg',
                    src: '2aOboRCoBzGXjhyd0ExnyvxNtrb7wdcyXXzonROC.jpg',
                    title: 'Tự Hào Người Gieo Hạt',
                    caption: 'Vinh danh những cống hiến thầm lặng của Thầy Cô'
                },
                {
                    file: '2aOboRCoBzmg2d96FIoGKzLKbaVnVpwNVaY3GukC.jpg',
                    src: '2aOboRCoBzmg2d96FIoGKzLKbaVnVpwNVaY3GukC.jpg',
                    title: 'Kỷ Niệm 20/11 Trường Chuyên',
                    caption: 'Nối dài truyền thống hiếu học Chuyên Quang Trung'
                },
                {
                    file: '2aOboRCo2l0Q4zoyRKUG6DFCGVAyvUUM1DGi0V4C.jpg',
                    src: '2aOboRCo2l0Q4zoyRKUG6DFCGVAyvUUM1DGi0V4C.jpg',
                    title: 'Mái Nhà Chuyên Quang Trung',
                    caption: 'Tập thể Thầy Cô kính yêu của chúng em'
                }
            ];

            const galleryPhotos = (window.GALLERY_PHOTOS && window.GALLERY_PHOTOS.length > 0)
                ? window.GALLERY_PHOTOS
                : defaultPhotos;

            const frameCount = galleryPhotos.length;
            const memoryFrames = [];
            const texLoader = new THREE.TextureLoader();

            galleryPhotos.forEach((item, i) => {
                const angle = (i / frameCount) * Math.PI * 2;

                // Thân khung tranh 3D nguyên khối bằng đồng đen (Kích thước lớn 108x92x3.8)
                const frameGeo = new THREE.BoxGeometry(108, 92, 3.8);
                const frameMat = new THREE.MeshStandardMaterial({
                    color: 0x344C63,
                    metalness: 0.8,
                    roughness: 0.25,
                });
                const frame = new THREE.Mesh(frameGeo, frameMat);

                // Viền mạ vàng hoàng gia bao bọc bên ngoài khung tranh (111x95x3.4)
                const borderGeo = new THREE.BoxGeometry(111, 95, 3.4);
                const borderMat = new THREE.MeshStandardMaterial({
                    color: 0x82749B,
                    metalness: 0.9,
                    roughness: 0.15
                });
                const borderMesh = new THREE.Mesh(borderGeo, borderMat);
                frame.add(borderMesh);

                // Thanh nẹp kim loại vàng ngăn cách tinh tế giữa khu vực ảnh và bảng tên
                const dividerGeo = new THREE.BoxGeometry(82, 1.2, 4.2);
                const dividerMat = new THREE.MeshStandardMaterial({ color: 0xC58F79, metalness: 0.9, roughness: 0.15 });
                const dividerMesh = new THREE.Mesh(dividerGeo, dividerMat);
                dividerMesh.position.set(0, -23.5, 0);
                frame.add(dividerMesh);

                // Hàm gắn ảnh Thầy Cô lên cả 2 mặt (Mặt trước hướng tâm & Mặt sau hướng ngoại)
                // Kích thước ảnh phóng to lên 100x64 (rõ nét tuyệt đối, chiêm ngưỡng trọn vẹn)
                // Ảnh được đưa ra z = 2.05 (mặt trước) và z = -2.05 (mặt sau), cách mặt khung (z = 1.90) một khoảng +0.15 đơn vị
                // Kết hợp polygonOffset và depthTest: true triệt tiêu hoàn toàn 100% hiện tượng z-fighting hay vết cắt chéo!
                const applyTextureToFrame = (tex) => {
                    if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
                    const pictureGeo = new THREE.PlaneGeometry(100, 64);
                    const pictureMat = new THREE.MeshBasicMaterial({
                        map: tex,
                        depthTest: true,
                        polygonOffset: true,
                        polygonOffsetFactor: -1,
                        polygonOffsetUnits: -1
                    });

                    // Mặt trước
                    const picFront = new THREE.Mesh(pictureGeo, pictureMat);
                    picFront.position.set(0, 10, 2.05);
                    frame.add(picFront);

                    // Mặt sau (Xoay 180 độ để quan sát từ mọi góc 360 độ)
                    const picBack = new THREE.Mesh(pictureGeo, pictureMat);
                    picBack.position.set(0, 10, -2.05);
                    picBack.rotation.y = Math.PI;
                    frame.add(picBack);
                };

                const photoSrc = item.src || item.file;
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    const tex = new THREE.Texture(img);
                    tex.needsUpdate = true;
                    applyTextureToFrame(tex);
                };
                img.onerror = () => {
                    texLoader.load(item.file || item.src, (loadedTexture) => {
                        applyTextureToFrame(loadedTexture);
                    });
                };
                img.src = photoSrc;

                // Bảng tên mạ vàng độ nét cực cao (800x200), gắn trực tiếp lên phần chân đế của khung tranh
                const tagCanvas = document.createElement('canvas');
                tagCanvas.width = 800;
                tagCanvas.height = 200;
                const tctx = tagCanvas.getContext('2d');
                tctx.fillStyle = '#FFFFFF';
                tctx.fillRect(0, 0, 800, 200);
                tctx.strokeStyle = '#82749B';
                tctx.lineWidth = 5;
                tctx.strokeRect(10, 10, 780, 180);
                tctx.fillStyle = '#C58F79';
                tctx.font = 'bold 36px "Cinzel", "Playfair Display", serif';
                tctx.textAlign = 'center';
                tctx.fillText(item.title, 400, 76);
                tctx.fillStyle = '#344C63';
                tctx.font = '26px sans-serif';
                tctx.fillText(item.caption, 400, 138);

                const tagTex = new THREE.CanvasTexture(tagCanvas);
                const tagGeo = new THREE.PlaneGeometry(78, 18);
                const tagMat = new THREE.MeshBasicMaterial({
                    map: tagTex,
                    depthTest: true,
                    polygonOffset: true,
                    polygonOffsetFactor: -1,
                    polygonOffsetUnits: -1
                });

                // Bảng tên mặt trước (gắn chắc chắn trên thân khung tại y = -34, z = 2.05)
                const tagMeshFront = new THREE.Mesh(tagGeo, tagMat);
                tagMeshFront.position.set(0, -34, 2.05);
                frame.add(tagMeshFront);

                // Bảng tên mặt sau
                const tagMeshBack = new THREE.Mesh(tagGeo, tagMat);
                tagMeshBack.position.set(0, -34, -2.05);
                tagMeshBack.rotation.y = Math.PI;
                frame.add(tagMeshBack);

                frame.position.x = Math.sin(angle) * radius;
                frame.position.z = Math.cos(angle) * radius;
                frame.position.y = (i % 2 === 0 ? 14 : 4);
                frame.userData.baseY = frame.position.y;
                frame.lookAt(0, 0, 0); // Luôn hướng tâm về quả cầu tri thức

                galleryGroup.add(frame);
                memoryFrames.push(frame);
            });

            // Tương tác Kéo Chuột / Vuốt Chạm xoay 360 độ mượt mà (Orbit Drag & Touch Gestures)
            let isDragging = false;
            let previousMouseX = 0;
            let previousMouseY = 0;
            let targetRotationY = 0;
            let targetRotationX = 0;

            container.addEventListener('pointerdown', (e) => {
                isDragging = true;
                previousMouseX = e.clientX;
                previousMouseY = e.clientY;
                try {
                    container.setPointerCapture(e.pointerId);
                } catch (_) {}
            });

            const handlePointerUp = (e) => {
                isDragging = false;
                try {
                    container.releasePointerCapture(e.pointerId);
                } catch (_) {}
            };
            container.addEventListener('pointerup', handlePointerUp);
            container.addEventListener('pointercancel', handlePointerUp);

            container.addEventListener('pointermove', (e) => {
                if (isDragging) {
                    const deltaX = e.clientX - previousMouseX;
                    const deltaY = e.clientY - previousMouseY;
                    targetRotationY += deltaX * 0.007;
                    targetRotationX = Math.max(-0.10, Math.min(0.10, targetRotationX + deltaY * 0.0025));
                    previousMouseX = e.clientX;
                    previousMouseY = e.clientY;
                }
            });

            // Tạm dừng render khi gallery nằm ngoài tầm nhìn để tiết kiệm GPU/pin trên mobile
            let isGalleryVisible = true;
            const gallerySection = document.getElementById('virtual-gallery-3d-section');
            if ('IntersectionObserver' in window && gallerySection) {
                const galleryObs = new IntersectionObserver((entries) => {
                    isGalleryVisible = entries[0].isIntersecting;
                }, { threshold: 0.05 });
                galleryObs.observe(gallerySection);
            }

            // Tự động xoay chậm nhẹ nhàng khi không kéo & phản hồi chuyển động
            function animateGallery() {
                requestAnimationFrame(animateGallery);
                if (!isGalleryVisible) return;

                if (!isDragging) {
                    targetRotationY += 0.003;
                }

                galleryGroup.rotation.y += (targetRotationY - galleryGroup.rotation.y) * 0.08;
                galleryGroup.rotation.x += (targetRotationX - galleryGroup.rotation.x) * 0.08;
                
                // Hiệu ứng bồng bềnh
                coreSphere.rotation.x += 0.005;
                coreSphere.rotation.y += 0.008;
                ringMesh.rotation.z += 0.006;
                ringMesh2.rotation.x += 0.004;

                const time = Date.now() * 0.0015;
                memoryFrames.forEach((frame, idx) => {
                    frame.position.y = frame.userData.baseY + Math.sin(time + idx) * 2.2;
                });

                camera.lookAt(0, 2, 0);
                renderer.render(scene, camera);
            }
            animateGallery();

            if ('ResizeObserver' in window) {
                const ro = new ResizeObserver(() => updateCamera());
                ro.observe(container);
            }
            window.addEventListener('resize', updateCamera);
            window.addEventListener('orientationchange', () => {
                setTimeout(updateCamera, 150);
                setTimeout(updateCamera, 400);
            });

            renderer.domElement.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                console.warn('3D Gallery WebGL context lost. Pausing rendering...');
            }, false);

            renderer.domElement.addEventListener('webglcontextrestored', () => {
                console.log('3D Gallery WebGL context restored. Rebuilding camera...');
                updateCamera();
            }, false);
        })();


// ================= 7. XỬ LÝ NHẠC NỀN TỰ PHÁT & LẶP LẠI (Nhac.mp3) =================
const bgMusic = document.getElementById('bg-music');

function playAudioSafely() {
    if (!bgMusic) return;
    bgMusic.play().catch(err => {
        console.log('Chờ cuộn trang hoặc tương tác để phát nhạc:', err);
    });
}

// Kiểm tra khi người dùng bắt đầu cuộn trang thì tự động phát nhạc ngay lập tức
const startMusicOnScrollOrInteraction = () => {
    if (bgMusic && bgMusic.paused) {
        bgMusic.play().then(() => {
            console.log('Nhạc nền đã bắt đầu phát khi cuộn trang');
        }).catch(() => {});
    }
};

['scroll', 'wheel', 'touchmove', 'touchstart', 'click', 'keydown'].forEach(evt => {
    window.addEventListener(evt, startMusicOnScrollOrInteraction, { passive: true });
});

if (bgMusic) {
    playAudioSafely();
    window.addEventListener('load', playAudioSafely);
    document.addEventListener('DOMContentLoaded', playAudioSafely);

    // Ghi nhớ vị trí phát nhạc liên tục để chuyển tiếp mượt mà sang celebration.html
    bgMusic.addEventListener('timeupdate', () => {
        if (!bgMusic.paused && bgMusic.currentTime > 0) {
            sessionStorage.setItem('bgMusicCurrentTime', bgMusic.currentTime);
        }
    });
}

// ================= 8. KHI LƯỚT TỚI FOOTER: ĐỢI 1 GIÂY RỒI CHUYỂN QUA TRANG TRI ÂN ĐẶC BIỆT =================
const footerEl = document.querySelector('footer');
let isTransitioningToCelebration = false;

if (footerEl) {
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isTransitioningToCelebration) {
                isTransitioningToCelebration = true;
                const indicatorText = document.getElementById('footer-transition-text');
                if (indicatorText) {
                    indicatorText.innerHTML = '<span class="text-[#C58F79] font-bold animate-pulse">✨ Đang chuyển sang Không gian Tri Ân đặc biệt sau 1 giây...</span>';
                }

                // Lưu lại thời gian phát nhạc chính xác trước khi chuyển trang
                if (bgMusic) {
                    sessionStorage.setItem('bgMusicCurrentTime', bgMusic.currentTime);
                }
                
                setTimeout(() => {
                    document.body.style.transition = 'opacity 0.6s ease';
                    document.body.style.opacity = '0';
                    setTimeout(() => {
                        window.location.href = 'celebration.html';
                    }, 600);
                }, 1000);
            }
        });
    }, { threshold: 0.25 });
    footerObserver.observe(footerEl);
}
