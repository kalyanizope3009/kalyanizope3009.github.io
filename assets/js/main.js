/*
    Forty by HTML5 UP
    Modernized version without jQuery
    Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(() => {
    const windowElement = window;
    const bodyElement = document.body;
    const wrapperElement = document.getElementById('wrapper');
    const headerElement = document.getElementById('header');
    const bannerElement = document.getElementById('banner');

    // Utility: Add breakpoints
    const breakpoints = {
        xlarge: [1281, 1680],
        large: [981, 1280],
        medium: [737, 980],
        small: [481, 736],
        xsmall: [361, 480],
        xxsmall: [0, 360],
        isMatch: function (key) {
            const [min, max] = this[key];
            const width = window.innerWidth;
            return (!min || width >= min) && (!max || width <= max);
        },
    };

    // Parallax scrolling
    const applyParallax = (element, intensity = 0.25) => {
        if (!element) return;
        const onScroll = () => {
            const offset = window.scrollY - element.offsetTop;
            element.style.backgroundPosition = `center ${offset * -intensity}px`;
        };
        window.addEventListener('scroll', onScroll);
        onScroll();
    };

    // Play initial animations on page load
    windowElement.addEventListener('load', () => {
        setTimeout(() => {
            bodyElement.classList.remove('is-preload');
        }, 100);
    });

    // Clear transitioning state on unload/hide
    windowElement.addEventListener('unload', () => {
        setTimeout(() => {
            document.querySelectorAll('.is-transitioning').forEach(el => {
                el.classList.remove('is-transitioning');
            });
        }, 250);
    });

    // IE-specific tweaks
    if (/Trident|Edge/.test(navigator.userAgent)) {
        bodyElement.classList.add('is-ie');
    }

    // Smooth scrolling for links with the "scrolly" class
    document.querySelectorAll('.scrolly').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - (headerElement.offsetHeight - 2),
                    behavior: 'smooth',
                });
            }
        });
    });

    // Tiles functionality
    document.querySelectorAll('.tiles > article').forEach(tile => {
        const imageElement = tile.querySelector('.image img');
        if (imageElement) {
            tile.style.backgroundImage = `url(${imageElement.src})`;
            const position = imageElement.dataset.position;
            if (position) {
                tile.style.backgroundPosition = position;
            }
            imageElement.style.display = 'none';
        }

        const linkElement = tile.querySelector('.link');
        if (linkElement) {
            const clonedLink = linkElement.cloneNode();
            clonedLink.textContent = '';
            clonedLink.classList.add('primary');
            tile.appendChild(clonedLink);

            [linkElement, clonedLink].forEach(link => {
                link.addEventListener('click', event => {
                    event.preventDefault();
                    event.stopPropagation();
                    const href = linkElement.getAttribute('href');
                    if (linkElement.target === '_blank') {
                        window.open(href);
                    } else {
                        tile.classList.add('is-transitioning');
                        wrapperElement.classList.add('is-transitioning');
                        setTimeout(() => {
                            window.location.href = href;
                        }, 500);
                    }
                });
            });
        }
    });

    // Banner functionality
    if (bannerElement && headerElement.classList.contains('alt')) {
        const onScroll = () => {
            if (window.scrollY > bannerElement.offsetHeight - headerElement.offsetHeight) {
                headerElement.classList.remove('alt');
                headerElement.classList.add('reveal');
            } else {
                headerElement.classList.add('alt');
                headerElement.classList.remove('reveal');
            }
        };
        window.addEventListener('scroll', onScroll);
        onScroll();
    }

    // Apply parallax to banners
    if (bannerElement) {
        applyParallax(bannerElement, 0.275);
    }

    // Menu functionality
    const menuElement = document.getElementById('menu');
    if (menuElement) {
        const menuInner = document.createElement('div');
        menuInner.classList.add('inner');
        while (menuElement.firstChild) {
            menuInner.appendChild(menuElement.firstChild);
        }
        menuElement.appendChild(menuInner);

        let isMenuLocked = false;
        const lockMenu = () => {
            if (isMenuLocked) return false;
            isMenuLocked = true;
            setTimeout(() => {
                isMenuLocked = false;
            }, 350);
            return true;
        };

        const showMenu = () => {
            if (lockMenu()) bodyElement.classList.add('is-menu-visible');
        };

        const hideMenu = () => {
            if (lockMenu()) bodyElement.classList.remove('is-menu-visible');
        };

        const toggleMenu = () => {
            if (lockMenu()) bodyElement.classList.toggle('is-menu-visible');
        };

        menuInner.addEventListener('click', event => event.stopPropagation());
        menuInner.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                hideMenu();
                setTimeout(() => {
                    window.location.href = link.getAttribute('href');
                }, 250);
            });
        });

        menuElement.addEventListener('click', event => {
            event.stopPropagation();
            event.preventDefault();
            hideMenu();
        });

        menuElement.insertAdjacentHTML('beforeend', '<a class="close" href="#menu">Close</a>');

        bodyElement.addEventListener('click', hideMenu);
        bodyElement.addEventListener('keydown', event => {
            if (event.key === 'Escape') hideMenu();
        });

        document.querySelector('a[href="#menu"]').addEventListener('click', event => {
            event.preventDefault();
            toggleMenu();
        });
    }
})();