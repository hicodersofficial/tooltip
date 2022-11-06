/*!
 * Tooltip Lib v1.0.0 by @hicoders - https://github.com/hicodersofficial
 * Licensed under MIT - https://github.com/twbs/bootstrap/blob/main/LICENSE
 * Copyright 2022 HiCoders.
 */

document.addEventListener("DOMContentLoaded", () => {
  const titles = document.querySelectorAll(
    ":not([data-ttp-off])[title], :not([data-ttp-off])[data-title]"
  );

  const Placement = {
    top: "top",
    left: "left",
    bottom: "bottom",
    right: "right",
    topLeft: "top-left",
    topRight: "top-right",
    bottomLeft: "bottom-left",
    bottomRight: "bottom-right",
    leftTop: "left-top",
    leftBottom: "left-bottom",
    rightTop: "right-top",
    rightBottom: "right-bottom",
  };

  for (let i = 0; i < titles.length; i++) {
    const element = titles[i];
    const title = element.getAttribute("title");
    if (title) {
      element.dataset.title = title;
      element.setAttribute("title", "");
    }

    element.addEventListener("mouseenter", handleTooltip);
    element.addEventListener("mouseleave", removeTooltip);
  }

  function handleTooltip(e) {
    const element = e.target;
    const title = element.dataset.title;
    const classes = element.dataset.ttpClass;
    let margin = element.dataset.ttpMargin;
    let placement = element.dataset.ttpPlacement;
    let isTriangleOff = element.dataset.ttpTriangleOff;
    let opacity = element.dataset.ttpOpacity;

    if (margin) {
      margin = parseFloat(margin);
    }
    if (isTriangleOff === "" || isTriangleOff === "true") {
      isTriangleOff = true;
    } else {
      isTriangleOff = false;
    }

    const elPosition = element.getBoundingClientRect();
    const id = "ttp" + Math.floor(Math.random() * 999999);
    element.dataset.ttpId = id;
    createTooltipEl({ title, id, classes, isTriangleOff });
    const tooltipEl = document.querySelector(getIdSelector(id));
    const ttpElPosition = tooltipEl.getBoundingClientRect();
    if (!placement) {
      placement = determinePosition({
        element,
        ttpElPosition,
        margin,
        isTriangleOff,
      });
      element.dataset.ttpAutoPlacement = placement;
    }
    const { finalX, finalY } = finalPlacement({
      placement,
      elPosition,
      ttpElPosition,
      isTriangleOff,
      margin,
    });
    const style = `
    opacity: ${opacity || 1};
    transform: translate(${finalX}px, ${finalY}px) 
    scale(1);
    `;
    tooltipEl.style.cssText = style;
    if (!isTriangleOff) {
      const ttpTriangle = tooltipEl.querySelector(".ttp-triangle");
      ttpTriangle.classList.add("ttp-triangle-" + placement);
    }
  }

  function finalPlacement({
    placement,
    elPosition,
    ttpElPosition,
    margin,
    isTriangleOff,
  }) {
    if (isTriangleOff && !margin) {
      margin = 5;
    }

    if (!margin) {
      margin = 10;
    }

    let finalX, finalY;

    const ttpWidth = ttpElPosition.width;
    const ttpHeight = ttpElPosition.height;

    const elWidth = elPosition.width;
    const elHeight = elPosition.height;
    const x = elPosition.x;
    const y = elPosition.y;

    switch (placement) {
      case Placement.top:
        finalX = x + half(elWidth) - half(ttpWidth);
        finalY = y - ttpHeight - margin;
        break;
      case Placement.left:
        finalX = x - ttpWidth - margin;
        finalY = y - half(ttpHeight) + half(elHeight);
        break;
      case Placement.right:
        finalX = x + elWidth + margin;
        finalY = y - half(ttpHeight) + half(elHeight);
        break;
      case Placement.bottom:
        finalX = x + half(elWidth) - half(ttpWidth);
        finalY = y + elHeight + margin;
        break;
      case Placement.topLeft:
        finalX = x;
        finalY = y - ttpHeight - margin;
        break;
      case Placement.topRight:
        finalX = x + elWidth - ttpWidth;
        finalY = y - ttpHeight - margin;
        break;
      case Placement.bottomLeft:
        finalX = x;
        finalY = y + elHeight + margin;
        break;
      case Placement.bottomRight:
        finalX = x + elWidth - ttpWidth;
        finalY = y + elHeight + margin;
        break;
      case Placement.leftTop:
        finalX = x - ttpWidth - margin;
        finalY = y - ttpHeight + elHeight;
        break;
      case Placement.rightTop:
        finalX = x + elWidth + margin;
        finalY = y - ttpHeight + elHeight;
        break;
      case Placement.leftBottom:
        finalX = x - ttpWidth - margin;
        finalY = y;
        break;
      case Placement.rightBottom:
        finalX = x + elWidth + margin;
        finalY = y;
        break;
    }

    return {
      finalX,
      finalY,
    };
  }

  function determinePosition({
    element,
    ttpElPosition,
    margin,
    isTriangleOff,
  }) {
    if (isTriangleOff && !margin) {
      margin = 5;
    }

    if (!margin) {
      margin = 10;
    }
    const elPosition = element.getBoundingClientRect();
    const elCenterX = elPosition.x + half(elPosition.width);
    const elY = elPosition.y;
    const elRight = elPosition.right;
    const elLeft = elPosition.left;

    const ttpElWidth = ttpElPosition.width;
    const ttpElHeight = ttpElPosition.height;
    const ttpElLeft = ttpElPosition.left;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (
      elCenterX + half(ttpElWidth) < windowWidth &&
      elCenterX - half(ttpElWidth) > 0 &&
      elY > ttpElHeight + margin
    ) {
      return Placement.top;
    }
    if (
      elCenterX + half(ttpElWidth) < windowWidth &&
      elCenterX - half(ttpElWidth) > 0
    ) {
      return Placement.bottom;
    }
    if (elRight + ttpElWidth > windowWidth && elY > ttpElHeight + margin) {
      return Placement.topRight;
    }
    if (ttpElLeft <= elLeft && elY > ttpElHeight + margin) {
      return Placement.topLeft;
    }
    if (elLeft <= ttpElWidth && windowHeight > elY + ttpElHeight + margin) {
      return Placement.bottomLeft;
    }
    if (
      windowWidth <= elRight + ttpElWidth &&
      windowHeight > elY + ttpElHeight + margin
    ) {
      return Placement.bottomRight;
    }

    return Placement.top;
  }

  function half(value) {
    return value / 2;
  }

  function removeTooltip(e) {
    const element = document.querySelector(
      getIdSelector(e.target.dataset.ttpId)
    );
    e.target.removeAttribute("data-ttp-id");
    e.target.removeAttribute("data-ttp-auto-placement");
    element.remove();
  }

  function getIdSelector(name) {
    return "#" + name;
  }

  function createTooltipEl({ title, id, classes, isTriangleOff }) {
    const div = document.createElement("div");
    const tContainer = document.createElement("div");
    tContainer.classList.add("ttp-title-container");
    tContainer.innerHTML = title;
    if (!isTriangleOff) {
      const triangle = document.createElement("div");
      div.appendChild(triangle);
      triangle.classList.add("ttp-triangle");
    }
    div.append(tContainer);
    div.classList.add("ttp");
    if (classes) {
      classes = classes.split(" ");
      div.classList.add(...classes);
    }
    div.id = id;
    document.body.appendChild(div);
  }
});
