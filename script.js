(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const createDots = (container, count, className, label) => Array.from({ length: count }, (_, index) => {
    const dot = document.createElement('button');
    dot.className = className;
    dot.type = 'button';
    dot.setAttribute('aria-label', `${label} ${index + 1} anzeigen`);
    container.append(dot);
    return dot;
  });

  const addSwipe = (element, previous, next) => {
    let startX;

    element.addEventListener('pointerdown', (event) => {
      startX = event.clientX;
    });

    element.addEventListener('pointerup', (event) => {
      if (startX === undefined) {
        return;
      }

      const distance = event.clientX - startX;
      startX = undefined;

      if (Math.abs(distance) < 45) {
        return;
      }

      if (distance > 0) {
        previous();
      } else {
        next();
      }
    });

    element.addEventListener('pointercancel', () => {
      startX = undefined;
    });
  };

  const initCarousel = ({
    viewportSelector,
    trackSelector,
    previousSelector,
    nextSelector,
    dotsSelector,
    dotClass,
    dotLabel,
    autoplayDelay,
    cloneAttribute,
    isEnabled = () => true,
  }) => {
    const viewport = document.querySelector(viewportSelector);
    const track = document.querySelector(trackSelector);
    const previousButton = document.querySelector(previousSelector);
    const nextButton = document.querySelector(nextSelector);
    const dotsContainer = document.querySelector(dotsSelector);

    if (!viewport || !track || !previousButton || !nextButton || !dotsContainer) {
      return;
    }

    const originalItems = Array.from(track.children);
    const itemCount = originalItems.length;
    const dots = createDots(dotsContainer, itemCount, dotClass, dotLabel);
    let position = 0;
    let timer;

    originalItems.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');

      if (cloneAttribute) {
        clone.setAttribute(cloneAttribute, '');
      }

      track.append(clone);
    });

    const getStep = () => {
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
      return originalItems[0].getBoundingClientRect().width + gap;
    };

    const updateDots = () => {
      const activeIndex = position % itemCount;

      dots.forEach((dot, index) => {
        const isActive = index === activeIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    };

    const setPosition = (animate = true) => {
      if (!isEnabled()) {
        track.style.removeProperty('transform');
        return;
      }

      if (!animate) {
        track.style.transition = 'none';
      }

      track.style.transform = `translate3d(${-position * getStep()}px, 0, 0)`;

      if (!animate) {
        track.getBoundingClientRect();
        track.style.removeProperty('transition');
      }
    };

    const stop = () => window.clearInterval(timer);
    const start = () => {
      stop();

      if (isEnabled() && !reducedMotion.matches && !document.hidden) {
        timer = window.setInterval(next, autoplayDelay);
      }
    };

    const select = (index) => {
      if (!isEnabled()) {
        return;
      }

      position = index;
      setPosition();
      updateDots();
    };

    function next() {
      select(position + 1);
    }

    function previous() {
      if (!isEnabled()) {
        return;
      }

      if (position === 0) {
        position = itemCount;
        setPosition(false);
      }

      select(position - 1);
    }

    track.addEventListener('transitionend', (event) => {
      if (event.target === track && event.propertyName === 'transform' && position >= itemCount) {
        position = 0;
        setPosition(false);
      }
    });
    previousButton.addEventListener('click', () => {
      previous();
      start();
    });
    nextButton.addEventListener('click', () => {
      next();
      start();
    });
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        select(index);
        start();
      });
    });
    viewport.addEventListener('mouseenter', stop);
    viewport.addEventListener('mouseleave', start);
    viewport.addEventListener('focusin', stop);
    viewport.addEventListener('focusout', start);
    window.addEventListener('resize', () => {
      setPosition(false);
      start();
    });
    document.addEventListener('visibilitychange', start);
    reducedMotion.addEventListener('change', start);
    addSwipe(viewport, () => {
      previous();
      start();
    }, () => {
      next();
      start();
    });

    updateDots();
    start();
  };

  initCarousel({
    viewportSelector: '[data-review-carousel]',
    trackSelector: '[data-review-track]',
    previousSelector: '[data-review-prev]',
    nextSelector: '[data-review-next]',
    dotsSelector: '[data-review-dots]',
    dotClass: 'carousel-dot',
    dotLabel: 'Bewertung',
    autoplayDelay: 4500,
  });

  initCarousel({
    viewportSelector: '[data-process-carousel]',
    trackSelector: '[data-process-track]',
    previousSelector: '[data-process-prev]',
    nextSelector: '[data-process-next]',
    dotsSelector: '[data-process-dots]',
    dotClass: 'process-dot',
    dotLabel: 'Schritt',
    autoplayDelay: 5000,
    cloneAttribute: 'data-process-clone',
    isEnabled: () => window.innerWidth <= 900,
  });
})();
