document.addEventListener('DOMContentLoaded', () => {
    
    // Sticky header on scroll
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const mainNav = document.getElementById('main-nav');
    
    if(menuBtn && mainNav) {
        menuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            // Animate hamburger to X
            const bars = menuBtn.querySelectorAll('.bar');
            if (mainNav.classList.contains('open')) {
                bars[0].style.transform = 'translateY(7px) rotate(45deg)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close menu when link is clicked
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('open')) {
                    menuBtn.click();
                }
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(targetId);
            
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });

    // Trigger immediately for hero elements that are already in view on load
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero .fade-up');
        heroElements.forEach(el => {
            el.classList.add('in-view');
        });
    }, 100);

    // Packages Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const tourCards = document.querySelectorAll('.tour-card');

    if(filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                tourCards.forEach(card => {
                    const cardDuration = card.getAttribute('data-duration');
                    if (filterValue === 'all' || cardDuration === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => { 
                            card.style.opacity = '1'; 
                            card.style.transform = 'translateY(0)'; 
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => { card.style.display = 'none'; }, 300);
                    }
                });
            });
        });
    }

    // Tour Modal Logic
    const tourModal = document.getElementById('tour-modal');
    if (tourModal) {
        const closeModal = tourModal.querySelector('.close-modal');
        
        tourCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Ignore clicks on explicit links inside the card if there are any
                if(e.target.closest('.btn-circle')) {
                    e.preventDefault();
                }
                
                // Extract data from the clicked card
                const imgSrc = card.querySelector('img').src;
                const title = card.querySelector('h3').innerText;
                const metaHtml = card.querySelector('.tour-meta').innerHTML;
                
                // Provide a default description based on the title
                const defaultDesc = `Join us for the amazing ${title}. This carefully curated package is designed to provide you with an unforgettable experience across Sri Lanka. Our expert guides and luxury transport ensure absolute comfort throughout your journey.`;
                
                // Set Modal Data
                document.getElementById('modal-img').src = imgSrc;
                document.getElementById('modal-title').innerText = title;
                document.getElementById('modal-meta').innerHTML = metaHtml;
                document.getElementById('modal-desc').innerText = defaultDesc;
                
                // Pre-fill WhatsApp message
                const msg = encodeURIComponent(`Hi VojeX Ceylon Travels, I would like to book the '${title}'. Could you please send me more details?`);
                document.getElementById('modal-book-btn').href = `https://wa.me/94777520883?text=${msg}`;
                
                // Show modal
                tourModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // prevent background scroll
            });
        });

        const hideModal = () => {
            tourModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeModal.addEventListener('click', hideModal);

        tourModal.addEventListener('click', (e) => {
            if (e.target === tourModal) {
                hideModal();
            }
        });
    }

    // Dynamic Navigation Tab Highlighting setup
    const allNavLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('section[id]');
    
    function highlightActiveTab() {
        let scrollY = window.pageYOffset;
        let currentPath = window.location.pathname.split('/').pop() || 'index.html';
        
        // Handle non-index pages (packages.html, gallery.html, etc.)
        if (currentPath !== 'index.html' && currentPath !== '') {
            allNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(currentPath)) {
                    link.classList.add('active');
                }
            });
            return;
        }

        // Handle index.html with scroll spy
        let currentSectionId = '';
        pageSections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;  // offset for fixed header
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = sectionId;
            }
        });
        
        let matchFound = false;
        
        allNavLinks.forEach(link => {
            link.classList.remove('active');
            let href = link.getAttribute('href');
            
            if (currentSectionId && currentSectionId !== 'home') {
                if (href.includes('#' + currentSectionId)) {
                    link.classList.add('active');
                    matchFound = true;
                }
            }
        });

        // Fallback to Home if we are at the top or in a section without a menu link
        if (!matchFound) {
            allNavLinks.forEach(link => {
                if (link.getAttribute('href') === 'index.html') {
                    link.classList.add('active');
                }
            });
        }
    }

    window.addEventListener('scroll', highlightActiveTab);
    highlightActiveTab(); // Run once on load

    // Language Dropdown Logic
    const langBtn = document.getElementById('lang-btn');
    const langMenu = document.getElementById('lang-menu');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLangImg = document.getElementById('current-lang-img');
    const currentLangText = document.getElementById('current-lang-text');

    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
                langMenu.classList.remove('show');
            }
        });

        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = option.getAttribute('data-lang');
                const flag = option.getAttribute('data-flag');
                
                if (currentLangText && currentLangImg) {
                    currentLangText.innerText = lang.substring(0, 2).toUpperCase();
                    currentLangImg.src = `https://flagcdn.com/w20/${flag}.png`;
                }
                
                // Trigger Google Translate
                const gtCombo = document.querySelector('.goog-te-combo');
                if (gtCombo) {
                    gtCombo.value = lang;
                    gtCombo.dispatchEvent(new Event('change'));
                } else {
                    // Fallback using cookie
                    document.cookie = `googtrans=/en/${lang}; path=/`;
                    window.location.reload();
                }

                langMenu.classList.remove('show');
            });
        });
    }

    // Reviews Auto Slider
    const reviewsTrack = document.getElementById('reviews-track');
    if (reviewsTrack) {
        // Clone children to ensure enough content for infinite scroll if few reviews exist
        if (reviewsTrack.children.length < 4) {
            const originalChildren = Array.from(reviewsTrack.children);
            originalChildren.forEach(child => {
                reviewsTrack.appendChild(child.cloneNode(true));
            });
        }
        
        let scrollPos = 0;
        let isHovered = false;
        
        function scrollMarquee() {
            if (!isHovered) {
                scrollPos += 1; // scroll speed
                const firstCard = reviewsTrack.children[0];
                const cardWidth = firstCard.offsetWidth + 30; // 30 is the gap
                
                if (scrollPos >= cardWidth) {
                    reviewsTrack.appendChild(firstCard);
                    scrollPos -= cardWidth;
                    reviewsTrack.style.transition = 'none';
                    reviewsTrack.style.transform = `translateX(-${scrollPos}px)`;
                } else {
                    reviewsTrack.style.transform = `translateX(-${scrollPos}px)`;
                }
            }
            requestAnimationFrame(scrollMarquee);
        }
        
        // Pause on hover
        reviewsTrack.addEventListener('mouseenter', () => isHovered = true);
        reviewsTrack.addEventListener('mouseleave', () => isHovered = false);
        
        // Start marquee
        requestAnimationFrame(scrollMarquee);
    }

    // Review Modal Logic
    const writeReviewBtn = document.getElementById('write-review-btn');
    const reviewModal = document.getElementById('review-modal');
    const closeReviewBtn = document.getElementById('close-review');
    const reviewForm = document.getElementById('review-form');
    const starSelect = document.getElementById('star-rating-select');
    let selectedRating = 5;

    if (writeReviewBtn && reviewModal) {
        writeReviewBtn.addEventListener('click', () => {
            reviewModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeReviewModal = () => {
            reviewModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeReviewBtn) closeReviewBtn.addEventListener('click', closeReviewModal);

        reviewModal.addEventListener('click', (e) => {
            if (e.target === reviewModal) closeReviewModal();
        });

        // Star Rating Selection
        if (starSelect) {
            const stars = starSelect.querySelectorAll('i');
            stars.forEach(star => {
                star.addEventListener('click', () => {
                    selectedRating = parseInt(star.getAttribute('data-val'));
                    stars.forEach(s => {
                        if (parseInt(s.getAttribute('data-val')) <= selectedRating) {
                            s.classList.add('active', 'fas');
                            s.classList.remove('far');
                        } else {
                            s.classList.remove('active', 'fas');
                            s.classList.add('far');
                        }
                    });
                });
            });
            // Init default
            stars.forEach(s => {
                if (parseInt(s.getAttribute('data-val')) <= 5) s.classList.add('active', 'fas');
            });
        }

        // Form Submit
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('review-name').value;
                const country = document.getElementById('review-country').value || 'Verified Traveler';
                const text = document.getElementById('review-text').value;

                // Create stars HTML
                let starsHtml = '';
                for (let i = 0; i < 5; i++) {
                    if (i < selectedRating) {
                        starsHtml += '<i class="fas fa-star text-primary"></i>';
                    } else {
                        starsHtml += '<i class="far fa-star text-primary"></i>';
                    }
                }

                const newCardHTML = `
                    <div class="review-card">
                        <i class="fas fa-quote-left quote-icon"></i>
                        <div class="review-stars">
                            ${starsHtml}
                        </div>
                        <p class="review-text">"${text}"</p>
                        <div class="reviewer">
                            <h4>${name}</h4>
                            <span>${country}</span>
                        </div>
                    </div>
                `;

                // Add to track
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newCardHTML;
                const newCard = tempDiv.firstElementChild;
                
                // Add right at the beginning
                reviewsTrack.insertBefore(newCard, reviewsTrack.children[0]);

                // Reset and close
                reviewForm.reset();
                selectedRating = 5;
                if(starSelect) {
                    starSelect.querySelectorAll('i').forEach(s => {
                        s.classList.add('active', 'fas');
                        s.classList.remove('far');
                    });
                }
                closeReviewModal();
            });
        }
    }
});
