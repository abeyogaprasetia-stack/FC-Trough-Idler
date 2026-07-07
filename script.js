// Fluent Conveyors - Interactive Scripting

// --- Functional Preloader ---
(function initPreloader() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (preloader && progressBar && progressText) {
        // Lock scroll while loading
        document.body.style.overflow = 'hidden';
        
        const images = document.images;
        const totalImages = images.length;
        let loadedImages = 0;

        function updateProgress() {
            loadedImages++;
            const percent = totalImages === 0 ? 100 : Math.floor((loadedImages / totalImages) * 100);
            
            progressBar.style.width = `${percent}%`;
            progressText.innerText = `${percent}%`;

            if (loadedImages >= totalImages) {
                completeLoading();
            }
        }
        
        function completeLoading() {
            progressBar.style.width = `100%`;
            progressText.innerText = `100%`;
            
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                // Unlock scroll
                document.body.style.overflow = '';
            }, 400);
        }

        if (totalImages === 0) {
            completeLoading();
        } else {
            for (let i = 0; i < totalImages; i++) {
                const img = new Image();
                img.onload = updateProgress;
                img.onerror = updateProgress; // count errors to not block loading
                img.src = images[i].src;
            }
        }
        
        // Safety fallback: force completion on window load event
        window.addEventListener('load', () => {
            if (loadedImages < totalImages) {
                loadedImages = totalImages;
                completeLoading();
            }
        });
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // --- Scroll Class Toggle for Logo Transition ---
    const header = document.querySelector('.header');
    const toggleHeaderClass = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', toggleHeaderClass);
    toggleHeaderClass(); // Run once on load
    // --- Theme Toggle Logic ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const themeToggleImg = themeToggleBtn.querySelector('.theme-toggle-img');
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            if (document.body.classList.contains('light-mode')) {
                themeToggleImg.src = 'Assets/Toggle light button.svg';
            } else {
                themeToggleImg.src = 'Assets/Toggle dark and light button.svg';
            }
        });
    }

    // --- Mobile Hamburger Menu Logic ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileOverlay = document.getElementById('mobile-overlay');
    
    if (menuToggle && mobileNav && mobileOverlay) {
        const toggleMenu = () => {
            const isActive = mobileNav.classList.toggle('active');
            mobileOverlay.classList.toggle('active', isActive);
            
            // Animate hamburger to X
            const spans = menuToggle.querySelectorAll('span');
            if (isActive) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        };

        menuToggle.addEventListener('click', toggleMenu);
        mobileOverlay.addEventListener('click', toggleMenu);
        
        // Close menu on link click
        const mobileLinks = mobileNav.querySelectorAll('.nav-item a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }

    // --- Smooth Scrolling for Scroll Down Indicator ---
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight - 30,
                behavior: 'smooth'
            });
        });
    }

    // --- Helper function for absolute offset top ---
    const getAbsoluteOffsetTop = (element) => {
        let offsetTop = 0;
        let el = element;
        while (el) {
            offsetTop += el.offsetTop;
            el = el.offsetParent;
        }
        return offsetTop;
    };

    // --- Scroll-Driven Image Sequence ---
    const sequenceContainer = document.getElementById('sequence-scroll-container');
    const canvas = document.getElementById('sequence-canvas');
    
    if (sequenceContainer && canvas) {
        const ctx = canvas.getContext('2d');
        const totalFrames = 240;
        const images = [];
        let loadedImages = 0;
        let currentFrameIndex = 0;
        
        const pad = (num, size) => {
            let s = num + "";
            while (s.length < size) s = "0" + s;
            return s;
        };
        
        const getFrameUrl = (index) => {
            return `Assets/Image sequence/Firefly Ultra realistic industrial product commercial-__Use the uploaded conveyor image as the only  (2) 2_${pad(index, 5)}.jpg`;
        };
        
        // Preload image sequence frames
        for (let i = 0; i < totalFrames; i++) {
            const img = new Image();
            img.onload = () => {
                loadedImages++;
                // Immediately render if this newly loaded frame is what the user is currently looking at
                if (i === currentFrameIndex || loadedImages === 1) {
                    drawFrame(currentFrameIndex);
                }
            };
            img.src = encodeURI(getFrameUrl(i)); // Ensure safe URL encoding
            images.push(img);
        }
        
        const drawFrame = (index) => {
            // Fallback to the closest loaded frame if the requested index is still downloading
            let bestIndex = index;
            while (bestIndex >= 0 && (!images[bestIndex] || !images[bestIndex].complete)) {
                bestIndex--;
            }
            if (bestIndex < 0) return;
            
            const img = images[bestIndex];
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Simulates CSS object-fit: cover for high-performance canvas
            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = img.width / img.height;
            
            let drawWidth, drawHeight, drawX, drawY;
            
            if (canvasRatio > imgRatio) {
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgRatio;
                drawX = 0;
                drawY = (canvas.height - drawHeight) / 2;
            } else {
                drawWidth = canvas.height * imgRatio;
                drawHeight = canvas.height;
                drawX = (canvas.width - drawWidth) / 2;
                drawY = 0;
            }
            
            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        };
        
        const handleScrollAndResize = () => {
            const featuresSection = document.getElementById('features-section');
            

            
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const scrollStart = getAbsoluteOffsetTop(sequenceContainer);
            const scrollEnd = scrollStart + sequenceContainer.offsetHeight - window.innerHeight;
            const currentScroll = window.scrollY;
            
            // Features card overlap parallax scale/translate
            if (featuresSection) {
                const featuresTop = getAbsoluteOffsetTop(featuresSection);
                if (currentScroll > featuresTop) {
                    const diff = currentScroll - featuresTop;
                    const scaleProgress = Math.min(1, diff / window.innerHeight);
                    featuresSection.style.transform = `scale(${1 - scaleProgress * 0.05}) translateY(${scaleProgress * 100}px)`;
                    featuresSection.style.opacity = `${1 - scaleProgress * 0.6}`;
                } else {
                    featuresSection.style.transform = 'none';
                    featuresSection.style.opacity = '1';
                }
            }
            
            // Throughput Text Parallax & Card Overlap Scale
            const throughputWrapper = document.getElementById('throughput-scroll-wrapper');
            const throughputSection = document.getElementById('throughput-section');
            const throughputHeader = document.querySelector('.throughput-header');
            const throughputGrid = document.querySelector('.throughput-features-grid');
            
            if (throughputWrapper && throughputSection) {
                const wrapperTop = getAbsoluteOffsetTop(throughputWrapper);
                if (currentScroll > wrapperTop) {
                    const diff = currentScroll - wrapperTop;
                    
                    // Phase 1: 0 to 100vh -> Text parallax scrolling over image sequence
                    if (diff <= window.innerHeight) {
                        const progress = diff / window.innerHeight;
                        if (throughputHeader) {
                            throughputHeader.style.transform = `translateY(${-progress * 150}px)`;
                            throughputHeader.style.opacity = `${1 - progress * 0.3}`;
                        }
                        if (throughputGrid) {
                            throughputGrid.style.transform = `translateY(${-progress * 80}px)`;
                            throughputGrid.style.opacity = `${1 - progress * 0.3}`;
                        }
                        throughputSection.style.transform = 'none';
                        throughputSection.style.opacity = '1';
                    } 
                    // Phase 2: 100vh to 200vh -> Specs section slides up, 3D scale down Throughput section
                    else {
                        const overlapDiff = diff - window.innerHeight;
                        const scaleProgress = Math.min(1, overlapDiff / window.innerHeight);
                        
                        // Keep text at final parallax positions from Phase 1
                        if (throughputHeader) {
                            throughputHeader.style.transform = `translateY(-150px)`;
                            throughputHeader.style.opacity = `0.7`;
                        }
                        if (throughputGrid) {
                            throughputGrid.style.transform = `translateY(-80px)`;
                            throughputGrid.style.opacity = `0.7`;
                        }
                        
                        // Apply 3D card stack transition
                        throughputSection.style.transform = `scale(${1 - scaleProgress * 0.05}) translateY(${scaleProgress * 100}px)`;
                        throughputSection.style.opacity = `${1 - scaleProgress}`;
                    }
                } else {
                    if (throughputHeader) {
                        throughputHeader.style.transform = 'none';
                        throughputHeader.style.opacity = '1';
                    }
                    if (throughputGrid) {
                        throughputGrid.style.transform = 'none';
                        throughputGrid.style.opacity = '1';
                    }
                    throughputSection.style.transform = 'none';
                    throughputSection.style.opacity = '1';
                }
            }
            
            // Manufacturing Process Horizontal Scroll
            const mSection = document.getElementById('manufacturing');
            const mTrack = document.getElementById('manufacturing-track');
            
            if (mSection && mTrack) {
                const mTop = getAbsoluteOffsetTop(mSection);
                const mScrollable = mSection.offsetHeight - window.innerHeight;
                
                if (currentScroll > mTop && currentScroll <= mTop + mScrollable) {
                    const mProgress = (currentScroll - mTop) / mScrollable;
                    mTrack.style.transform = `translateX(${-mProgress * 75}%)`;
                } else if (currentScroll <= mTop) {
                    mTrack.style.transform = 'translateX(0)';
                } else if (currentScroll > mTop + mScrollable) {
                    mTrack.style.transform = 'translateX(-75%)';
                }
            }
            
            // Engineered To Your Operation (Scroll Wipe)
            const eSection = document.getElementById('engineered');
            const eBg2 = document.getElementById('eng-bg-2');
            const ePanel1 = document.getElementById('eng-panel-1');
            const ePanel2 = document.getElementById('eng-panel-2');
            
            if (eSection && eBg2 && ePanel1 && ePanel2) {
                const eTop = getAbsoluteOffsetTop(eSection);
                const eScrollable = eSection.offsetHeight - window.innerHeight;
                
                if (currentScroll >= eTop && currentScroll <= eTop + eScrollable) {
                    // Progress from 0 to 1
                    const eProgress = (currentScroll - eTop) / eScrollable;
                    
                    // 1. Left-to-right wipe for the background image
                    // inset(top right bottom left) -> right goes from 100 to 0
                    const rightInset = 100 - (eProgress * 100);
                    eBg2.style.clipPath = `inset(0 ${rightInset}% 0 0)`;
                    
                    // 2. Cross-fade text panels
                    if (eProgress < 0.5) {
                        const p1Opacity = 1 - (eProgress * 2);
                        ePanel1.style.opacity = Math.max(0, p1Opacity);
                        ePanel1.style.pointerEvents = 'auto';
                        
                        ePanel2.style.opacity = 0;
                        ePanel2.style.pointerEvents = 'none';
                    } else {
                        const p2Opacity = (eProgress - 0.5) * 2;
                        ePanel2.style.opacity = Math.min(1, p2Opacity);
                        ePanel2.style.pointerEvents = 'auto';
                        
                        ePanel1.style.opacity = 0;
                        ePanel1.style.pointerEvents = 'none';
                    }
                    
                } else if (currentScroll < eTop) {
                    eBg2.style.clipPath = 'inset(0 100% 0 0)';
                    ePanel1.style.opacity = 1;
                    ePanel1.style.pointerEvents = 'auto';
                    ePanel2.style.opacity = 0;
                    ePanel2.style.pointerEvents = 'none';
                } else if (currentScroll > eTop + eScrollable) {
                    eBg2.style.clipPath = 'inset(0 0% 0 0)';
                    ePanel1.style.opacity = 0;
                    ePanel1.style.pointerEvents = 'none';
                    ePanel2.style.opacity = 1;
                    ePanel2.style.pointerEvents = 'auto';
                }
            }
            
            // Troughing Belts 3D Scroll
            const bSection = document.getElementById('belts-scroll-volume');
            const bCards = document.querySelectorAll('.b-card');
            const engineeredSection = document.querySelector('.engineered-section');
            const beltsSection = document.querySelector('.belts-section');
            
            if (engineeredSection && beltsSection) {
                const beltsTop = getAbsoluteOffsetTop(beltsSection);
                if (currentScroll > beltsTop - window.innerHeight && currentScroll < beltsTop + beltsSection.offsetHeight) {
                    const diff = currentScroll - (beltsTop - window.innerHeight);
                    const overlapProgress = Math.min(1, diff / window.innerHeight);
                    engineeredSection.style.transform = `scale(${1 - overlapProgress * 0.05}) translateY(${diff * 0.5}px)`;
                    engineeredSection.style.opacity = `${1 - overlapProgress * 0.6}`;
                    
                    // Hide sticky sections behind so they don't show through the transparency
                    const featuresSection = document.getElementById('features-section');
                    const throughputSection = document.getElementById('throughput-section');
                    if (featuresSection) featuresSection.style.visibility = 'hidden';
                    if (throughputSection) throughputSection.style.visibility = 'hidden';
                    
                } else if (currentScroll <= beltsTop - window.innerHeight) {
                    engineeredSection.style.transform = 'none';
                    engineeredSection.style.opacity = '1';
                    
                    const featuresSection = document.getElementById('features-section');
                    const throughputSection = document.getElementById('throughput-section');
                    if (featuresSection) featuresSection.style.visibility = 'visible';
                    if (throughputSection) throughputSection.style.visibility = 'visible';
                }
            }

            if (bSection && bCards.length > 0) {
                const bTop = getAbsoluteOffsetTop(bSection);
                const bScrollable = bSection.offsetHeight - window.innerHeight;
                
                let bProgress = 0;
                if (currentScroll >= bTop && currentScroll <= bTop + bScrollable) {
                    bProgress = ((currentScroll - bTop) / bScrollable) * (bCards.length - 1);
                } else if (currentScroll > bTop + bScrollable) {
                    bProgress = bCards.length - 1;
                }
                
                bCards.forEach((card, i) => {
                    const offset = bProgress - i;
                    
                    if (offset > 0) {
                        // Card is sliding away to the left (past active)
                        card.style.transform = `translateX(${-offset * 120}%) scale(${1 - offset * 0.1})`;
                        card.style.opacity = Math.max(0, 1 - offset);
                        card.style.zIndex = bCards.length - i;
                        card.classList.remove('active');
                    } else if (offset === 0) {
                        // Active card
                        card.style.transform = `translateX(0) scale(1)`;
                        card.style.opacity = 1;
                        card.style.zIndex = bCards.length - i;
                        card.classList.add('active');
                    } else {
                        // Card is waiting to the right (future)
                        const absOffset = Math.abs(offset);
                        const translateX = absOffset * 60; // Spread out to right
                        const scale = Math.max(0.6, 1 - absOffset * 0.15); // Scale down
                        
                        card.style.transform = `translateX(${translateX}%) scale(${scale})`;
                        card.style.opacity = Math.max(0, 1 - absOffset * 0.3); // Dim
                        card.style.zIndex = bCards.length - i; // strict stacking
                        card.classList.remove('active');
                    }
                });
            }
            
            let progress = 0;
            if (currentScroll < scrollStart) {
                progress = 0;
            } else if (currentScroll > scrollEnd) {
                progress = 1;
            } else {
                progress = (currentScroll - scrollStart) / (scrollEnd - scrollStart);
            }
            
            const frameIndex = Math.min(totalFrames - 1, Math.floor(progress * totalFrames));
            currentFrameIndex = frameIndex;
            drawFrame(frameIndex);
        };
        
        window.addEventListener('resize', handleScrollAndResize);
        window.addEventListener('scroll', handleScrollAndResize);
        
        // Initial setup
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // --- After Sale Product Gallery Logic ---
    const saleProducts = [
        {
            id: 0,
            title: "Pulleys",
            desc: "Drive, tail, take-up, snub, and bend pulleys with standard, self-aligning, and taper-lock hubs.",
            img: "Assets/Pulleys.png"
        },
        {
            id: 1,
            title: "Bearings",
            desc: "Standard-duty, heavy-duty, sleeve, and pillow-block.",
            img: "Assets/Bearings.png"
        },
        {
            id: 2,
            title: "Idlers",
            desc: "Troughing idlers, impact idlers, and return idlers from 1.9–5-inch diameter.",
            img: "Assets/Idlers.png"
        },
        {
            id: 3,
            title: "Shafts",
            desc: "Cold-rolled and precision-ground drive and take-up shafts.",
            img: "Assets/Shafts.png"
        },
        {
            id: 4,
            title: "Motors and drives",
            desc: "General-, severe-, and chemical-duty options.",
            img: "Assets/Motors and drives.png"
        },
        {
            id: 5,
            title: "Belt scrapers",
            desc: "Primary and secondary scrapers to control carryback.",
            img: "Assets/Belt scrapers.png"
        },
        {
            id: 6,
            title: "Impact beds",
            desc: "Load-zone support that protects the belt at transfer points.",
            img: "Assets/Impact bed.png"
        },
        {
            id: 7,
            title: "E-stops",
            desc: "Mushroom-head and pull-cord safety devices.",
            img: "Assets/E-stops.png"
        }
    ];

    const saleThumbs = document.querySelectorAll('.s-thumb');
    const saleActiveImg = document.getElementById('sale-active-img');
    const saleActiveTitle = document.getElementById('sale-active-title');
    const saleActiveDesc = document.getElementById('sale-active-desc');
    const saleInfoBox = document.getElementById('sale-info-box');

    if (saleThumbs.length > 0) {
        saleThumbs.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Remove active from all
                saleThumbs.forEach(t => t.classList.remove('active'));
                // Add active to clicked
                this.classList.add('active');

                const id = parseInt(this.getAttribute('data-id'));
                const product = saleProducts.find(p => p.id === id);

                if (product) {
                    // Fade out
                    saleActiveImg.style.opacity = 0;
                    saleInfoBox.style.opacity = 0;

                    setTimeout(() => {
                        // Update content
                        saleActiveImg.src = product.img;
                        saleActiveImg.alt = product.title;
                        saleActiveTitle.innerText = product.title;
                        saleActiveDesc.innerText = product.desc;

                        // Fade in
                        saleActiveImg.style.opacity = 1;
                        saleInfoBox.style.opacity = 1;
                    }, 300); // Matches CSS transition duration
                }
            });
        });
    }

    // --- Custom Smooth Scroll Helper ---
    function smoothScrollBy(element, distance, duration = 500) {
        const startPosition = element.scrollLeft;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // easeInOutCubic for a very smooth slide
            const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            element.scrollLeft = startPosition + distance * ease;
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }

    // --- Idler Key Features Navigation ---
    const featuresTrack = document.getElementById('features-track');
    const featuresPrev = document.getElementById('features-prev');
    const featuresNext = document.getElementById('features-next');

    if (featuresTrack && featuresPrev && featuresNext) {
        // Item width (250) + gap (40) = 290
        const featScrollAmount = 290; 

        featuresNext.addEventListener('click', () => {
            smoothScrollBy(featuresTrack, featScrollAmount);
        });

        featuresPrev.addEventListener('click', () => {
            smoothScrollBy(featuresTrack, -featScrollAmount);
        });
    }

    // --- Resources Grid Navigation ---
    const resGrid = document.querySelector('.resources-grid');
    const resPrev = document.getElementById('res-prev');
    const resNext = document.getElementById('res-next');

    if (resGrid && resPrev && resNext) {
        // Card width (380) + gap (30) = 410
        const scrollAmount = 410; 

        resNext.addEventListener('click', () => {
            smoothScrollBy(resGrid, scrollAmount);
        });

        resPrev.addEventListener('click', () => {
            smoothScrollBy(resGrid, -scrollAmount);
        });
    }

    // --- FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            // Check if already active
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => {
                i.classList.remove('active');
            });

            // Open if wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- Our Conveyors Carousel Navigation ---
    const ocTrack = document.getElementById('oc-carousel-track');
    const ocPrev = document.getElementById('oc-prev');
    const ocNext = document.getElementById('oc-next');

    if (ocTrack && ocPrev && ocNext) {
        // Card width (495) + gap (30) = 525
        const ocScrollAmount = 525; 

        ocNext.addEventListener('click', () => {
            smoothScrollBy(ocTrack, ocScrollAmount);
        });

        ocPrev.addEventListener('click', () => {
            smoothScrollBy(ocTrack, -ocScrollAmount);
        });
    }
});
