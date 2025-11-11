(() => {
  const toggleButton = document.getElementById('toggleUnits');
  const specValues = document.querySelectorAll('[data-feet][data-meter]');
  const dimensionLabels = document.querySelectorAll('.dim-label[data-feet][data-meter]');
  const plan = document.getElementById('floorPlan');
  const planWrapper = document.querySelector('.plan-wrapper');
  const tooltip = document.getElementById('tooltip');
  const interactables = plan.querySelectorAll('.room, .hall, .stair');

  let showMeters = false;
  let activeRegion = null;
  const defaultHint = 'विवरण देखने के लिए क्षेत्र पर होवर या टैप करें';

  const updateUnits = () => {
    specValues.forEach((node) => {
      node.textContent = showMeters ? node.dataset.meter : node.dataset.feet;
    });

    dimensionLabels.forEach((node) => {
      node.textContent = showMeters ? node.dataset.meter : node.dataset.feet;
    });

    toggleButton.textContent = showMeters ? 'फीट में माप देखें' : 'मीटर में माप देखें';
    toggleButton.setAttribute('aria-pressed', String(showMeters));

    if (activeRegion) {
      setTooltipContent(activeRegion);
      positionTooltip(activeRegion);
    }
  };

  const setTooltipContent = (element) => {
    if (!element) return;
    const name = element.dataset.name || '';
    const value = showMeters ? element.dataset.meter : element.dataset.feet;
    tooltip.textContent = value ? `${name}: ${value}` : name;
  };

  const positionTooltip = (detail) => {
    if (!activeRegion) return;
    const wrapperRect = planWrapper.getBoundingClientRect();
    let offsetX;
    let offsetY;

    if (detail && typeof detail === 'object' && 'clientX' in detail && 'clientY' in detail) {
      offsetX = detail.clientX - wrapperRect.left;
      offsetY = detail.clientY - wrapperRect.top;
    } else if (activeRegion) {
      const targetRect = activeRegion.getBoundingClientRect();
      offsetX = targetRect.left + targetRect.width / 2 - wrapperRect.left;
      offsetY = targetRect.top + targetRect.height / 2 - wrapperRect.top;
    } else {
      offsetX = wrapperRect.width / 2;
      offsetY = wrapperRect.height / 2;
    }

    tooltip.style.left = `${offsetX}px`;
    tooltip.style.top = `${offsetY - 24}px`;
  };

  const showRegion = (element, detail) => {
    activeRegion = element;
    setTooltipContent(element);
    tooltip.style.opacity = '1';
    positionTooltip(detail);
  };

  interactables.forEach((element) => {
    element.addEventListener('pointerenter', (event) => {
      showRegion(element, event);
    });

    element.addEventListener('pointermove', positionTooltip);

    element.addEventListener('click', (event) => {
      event.stopPropagation();
      showRegion(element, event);
    });

    element.addEventListener('pointerleave', () => {
      activeRegion = null;
      tooltip.style.opacity = '0';
    });
  });

  planWrapper.addEventListener('click', (event) => {
    if (!event.target.closest('.room, .hall, .stair')) {
      activeRegion = null;
      tooltip.style.opacity = '0';
    }
  });

  toggleButton.addEventListener('click', () => {
    showMeters = !showMeters;
    updateUnits();
  });

  updateUnits();

  const showDefaultHint = () => {
    if (activeRegion) return;
    tooltip.textContent = defaultHint;
    tooltip.style.opacity = '1';
    tooltip.style.left = `${planWrapper.clientWidth / 2}px`;
    tooltip.style.top = `${planWrapper.clientHeight - 16}px`;
    window.setTimeout(() => {
      if (!activeRegion) {
        tooltip.style.opacity = '0';
      }
    }, 2600);
  };

  if (planWrapper) {
    requestAnimationFrame(showDefaultHint);
  }
})();
