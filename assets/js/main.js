(function() {
    "use strict";

    // DOM elements
    const bodyEl = document.body;
    const wrapperEl = document.getElementById('wrapper');
    const headerEl = document.getElementById('header');
    const bannerEl = document.getElementById('banner');
    const menuEl = document.getElementById('menu');

    /***************************************************************************
     * 1) Initial Animations and Page Unload/Hide
     **************************************************************************/

    // On window load, remove the 'is-preload' class after a small delay.
    window.addEventListener('load', () => {
      setTimeout(() => {
        bodyEl.classList.remove('is-preload');
      }, 100);
    });

    // Clear transitioning state on unload/hide (useful for back button navigation).
    window.addEventListener('pagehide', clearTransitioningClasses);
    window.addEventListener('unload', clearTransitioningClasses);

    function clearTransitioningClasses() {
      setTimeout(() => {
        const transitioningEls = document.querySelectorAll('.is-transitioning');
        transitioningEls.forEach(el => el.classList.remove('is-transitioning'));
      }, 250);
    }

    /***************************************************************************
     * 2) Smooth Scroll for Anchor Links (Scrolly Replacement)
     **************************************************************************/

    // Any <a> element with class="scrolly" will scroll smoothly to its target.
    const scrollyLinks = document.querySelectorAll('a.scrolly');
    scrollyLinks.forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();

        const targetId = link.getAttribute('href');
        if (!targetId || !targetId.startsWith('#') || targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        // Smoothly scroll to the target, accounting for header height.
        const headerHeight = headerEl ? headerEl.offsetHeight - 2 : 0;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });

    /***************************************************************************
     * 3) Tiles: Background Image & Link Handling
     **************************************************************************/

    const tileArticles = document.querySelectorAll('.tiles > article');
    tileArticles.forEach(articleEl => {
      const imageContainer = articleEl.querySelector('.image');
      if (!imageContainer) return;

      const imgEl = imageContainer.querySelector('img');
      if (!imgEl) return;

      // Use the image as a background
      articleEl.style.backgroundImage = `url("${imgEl.src}")`;

      // If the <img> has data-position, set that on the .image container’s background-position
      const customPosition = imgEl.getAttribute('data-position');
      if (customPosition) {
        imageContainer.style.backgroundPosition = customPosition;
      }

      // Hide the original image
      imageContainer.style.display = 'none';

      // Link logic
      const linkEl = articleEl.querySelector('.link');
      if (!linkEl) return;

      // Clone the link, turn it into an overlay "primary" button
      const linkClone = linkEl.cloneNode(true);
      linkClone.textContent = '';
      linkClone.classList.add('primary');
      articleEl.appendChild(linkClone);

      // Combined link set
      [linkEl, linkClone].forEach(item => {
        item.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();

          const href = linkEl.getAttribute('href');
          const target = linkEl.getAttribute('target');

          if (target === '_blank') {
            // Open in new tab
            window.open(href);
          } else {
            // Transition effect, then redirect
            articleEl.classList.add('is-transitioning');
            wrapperEl.classList.add('is-transitioning');
            setTimeout(() => {
              window.location.href = href;
            }, 500);
          }
        });
      });
    });

    /***************************************************************************
     * 4) Banner: "Alt" Header Behavior (Scrollex Replacement) + Parallax
     **************************************************************************/

    if (bannerEl && headerEl && headerEl.classList.contains('alt')) {
      // Intersection Observer for toggling .alt and .reveal on header
      // Logic: 
      //   - If banner is in the viewport, add .alt to header
      //   - If banner is out of the viewport, remove .alt, add .reveal to header

      const observerOptions = {
        root: null,
        rootMargin: `-${headerEl.offsetHeight + 10}px 0px 0px 0px`, 
        threshold: 0
      };

      const bannerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Banner is visible
            headerEl.classList.add('alt');
            headerEl.classList.remove('reveal');
          } else {
            // Banner is not visible
            headerEl.classList.remove('alt');
            headerEl.classList.add('reveal');
          }
        });
      }, observerOptions);

      bannerObserver.observe(bannerEl);
    }

    // Simple parallax effect for the banner background image
    // (Similar logic to the old plugin, but in vanilla JS).
    const parallaxIntensity = 0.275;
    setupParallax(bannerEl, parallaxIntensity);

    // Also set the banner's background image from its .image > img
    if (bannerEl) {
      const bannerImageContainer = bannerEl.querySelector('.image');
      if (bannerImageContainer) {
        const bannerImg = bannerImageContainer.querySelector('img');
        if (bannerImg) {
          bannerEl.style.backgroundImage = `url("${bannerImg.src}")`;
          bannerImageContainer.style.display = 'none';
        }
      }
    }

    /**
     * Vanilla parallax for a background image on a single element.
     * @param {Element} element - The banner element.
     * @param {number} intensity - Parallax intensity.
     */
    function setupParallax(element, intensity) {
      if (!element) return;

      // This function is called on every scroll event
      const onScroll = () => {
        const rect = element.getBoundingClientRect();
        // Distance from top of viewport to element's top
        const offsetTop = rect.top + window.scrollY; 
        const scrollPos = window.scrollY - offsetTop;
        // Adjust background-position with negative intensity
        element.style.backgroundPosition = `center ${scrollPos * (-1 * intensity)}px`;
      };

      // We only want parallax above "medium" breakpoint in the original code,
      // but we have no breakpoints logic now, so let's always do it for demo.
      window.addEventListener('scroll', onScroll);
      window.addEventListener('resize', onScroll);

      // Initial position
      onScroll();
    }

    /***************************************************************************
     * 5) Menu Logic
     **************************************************************************/

    if (menuEl) {
      // Wrap existing menu content in .inner
      const menuInner = document.createElement('div');
      menuInner.classList.add('inner');

      // Move children into .inner
      while (menuEl.firstChild) {
        menuInner.appendChild(menuEl.firstChild);
      }
      menuEl.appendChild(menuInner);

      let menuLocked = false;
      function lockMenu() {
        if (menuLocked) return false;
        menuLocked = true;
        setTimeout(() => { menuLocked = false; }, 350);
        return true;
      }

      function showMenu() {
        if (lockMenu()) {
          bodyEl.classList.add('is-menu-visible');
        }
      }

      function hideMenu() {
        if (lockMenu()) {
          bodyEl.classList.remove('is-menu-visible');
        }
      }

      function toggleMenu() {
        if (lockMenu()) {
          bodyEl.classList.toggle('is-menu-visible');
        }
      }

      // Stop click events inside .inner from bubbling up to menuEl
      menuInner.addEventListener('click', event => {
        event.stopPropagation();
      });

      // Handle links inside the menu
      menuInner.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();

          const href = anchor.getAttribute('href');
          hideMenu();
          setTimeout(() => {
            window.location.href = href;
          }, 250);
        });
      });

      // Make the entire menuEl close the menu if clicked
      menuEl.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        hideMenu();
      });

      // Add close link
      const closeLink = document.createElement('a');
      closeLink.classList.add('close');
      closeLink.href = '#menu';
      closeLink.textContent = 'Close';
      menuEl.appendChild(closeLink);

      // Insert the menu element at the end of body
      document.body.appendChild(menuEl);

      // Toggle menu on anchors pointing to #menu
      document.querySelectorAll('a[href="#menu"]').forEach(trigger => {
        trigger.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          toggleMenu();
        });
      });

      // Hide menu if user clicks outside
      document.addEventListener('click', () => {
        hideMenu();
      });

      // Hide menu on ESC key press
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' || event.keyCode === 27) {
          hideMenu();
        }
      });
    }

})();