/*!
 * Tooltip Lib v1.0.0 by @hicoders - https://github.com/hicodersofficial
 * Licensed under MIT - https://github.com/twbs/bootstrap/blob/main/LICENSE
 * Copyright 2022 HiCoders.
 */

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
  let placement = element.dataset.ttpPlacement;
  let isTriangleOff = element.dataset.ttpTriangleOff;
  let margin = element.dataset.ttpMargin;
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
  const classes = element.dataset.ttpClass;
  createTooltipEl({ title, id, classes, isTriangleOff });
  const tooltipEl = document.querySelector("#" + id);
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
  console.log(placement);
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
  const ttpWidth = ttpElPosition.width;
  const ttpHeight = ttpElPosition.height;
  const elWidth = elPosition.width;
  const elHeight = elPosition.height;
  let finalX, finalY;
  const x = elPosition.x;
  const y = elPosition.y;
  switch (placement) {
    case Placement.top:
      finalX = x + elWidth / 2 - ttpWidth / 2;
      finalY = y - ttpHeight - margin;
      break;
    case Placement.left:
      finalX = x - ttpWidth - margin;
      finalY = y - ttpHeight / 2 + elHeight / 2;
      break;
    case Placement.right:
      finalX = x + elWidth + margin;
      finalY = y - ttpHeight / 2 + elHeight / 2;
      break;
    case Placement.bottom:
      finalX = x + elWidth / 2 - ttpWidth / 2;
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

function determinePosition({ element, ttpElPosition, margin, isTriangleOff }) {
  if (isTriangleOff && !margin) {
    margin = 5;
  }

  if (!margin) {
    margin = 10;
  }
  const elPosition = element.getBoundingClientRect();
  const elCenterX = elPosition.x + elPosition.width / 2;
  console.log(elPosition, ttpElPosition);
  if (
    elCenterX + ttpElPosition.width / 2 < window.innerWidth &&
    elCenterX - ttpElPosition.width / 2 > 0 &&
    elPosition.y > ttpElPosition.height + margin
  ) {
    return Placement.top;
  }
  if (
    elCenterX + ttpElPosition.width / 2 < window.innerWidth &&
    elCenterX - ttpElPosition.width / 2 > 0
  ) {
    return Placement.bottom;
  }
  if (
    elPosition.right + ttpElPosition.width > window.innerWidth &&
    elPosition.y > ttpElPosition.height + margin
  ) {
    return Placement.topRight;
  }
  if (
    ttpElPosition.left <= elPosition.left &&
    elPosition.y > ttpElPosition.height + margin
  ) {
    return Placement.topLeft;
  }
  if (
    elPosition.left <= ttpElPosition.width &&
    window.innerHeight > elPosition.y + ttpElPosition.height + margin
  ) {
    return Placement.bottomLeft;
  }
  if (
    window.innerWidth <= elPosition.right + ttpElPosition.width &&
    window.innerHeight > elPosition.y + ttpElPosition.height + margin
  ) {
    return Placement.bottomRight;
  }

  return Placement.top;
}

function removeTooltip(e) {
  const element = document.querySelector("#" + e.target.dataset.ttpId);
  e.target.removeAttribute("data-ttp-id");
  e.target.removeAttribute("data-ttp-auto-placement");
  element.remove();
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
