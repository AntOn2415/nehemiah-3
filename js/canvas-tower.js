document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("cycleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const startFinishLabel = document.getElementById("startFinishLabel");
  const towerTooltip = document.getElementById("tower-tooltip");
  const towerOverlay = document.getElementById("tower-overlay");

  let animationFrameId;
  let currentSegment = 0;
  const totalSegments = 16;
  const segmentDuration = 200;
  let lastTimestamp = 0;
  let animationStarted = false;
  const maxTowerHeight = 50;
  const towerWidth = 25;
  const blockHeight = 7;
  let towerBounds = { x: 0, y: 0, width: 0, height: 0 };
  let currentProgress = 0;

  function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    drawCircle(currentProgress);
  }

  function drawCircle(progress) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const outerRadius = 150;
    const innerRadius = outerRadius - 8;
    const currentLabelHeight = startFinishLabel.offsetHeight;
    const currentLabelWidth = startFinishLabel.offsetWidth;
    const spaceAboveCircle = maxTowerHeight + blockHeight + currentLabelHeight / 2 + 10;
    let centerY_adjusted = 20 + spaceAboveCircle + outerRadius;
    const bottomMargin = 20;
    if (centerY_adjusted + outerRadius > canvas.height - bottomMargin) {
      centerY_adjusted = canvas.height - bottomMargin - outerRadius;
    }
    // Draw base circle
    ctx.beginPath();
    ctx.arc(centerX, centerY_adjusted, outerRadius, 0, 2 * Math.PI);
    ctx.arc(centerX, centerY_adjusted, innerRadius, 2 * Math.PI, 0, true);
    ctx.strokeStyle = "#A5D6A7";
    ctx.lineWidth = 1;
    ctx.stroke();
    // Draw filled arc (smooth)
    if (progress > 0) {
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY_adjusted,
        outerRadius,
        -Math.PI / 2,
        -Math.PI / 2 + 2 * Math.PI * progress
      );
      ctx.arc(
        centerX,
        centerY_adjusted,
        innerRadius,
        -Math.PI / 2 + 2 * Math.PI * progress,
        -Math.PI / 2,
        true
      );
      ctx.closePath();
      ctx.fillStyle = "#8FBC8F";
      ctx.fill();
    }
    const labelRenderedTopY = centerY_adjusted - outerRadius - currentLabelHeight / 2;
    const labelRenderedLeftX = centerX - currentLabelWidth / 2;
    startFinishLabel.style.top = `${labelRenderedTopY}px`;
    startFinishLabel.style.left = `${labelRenderedLeftX}px`;
    startFinishLabel.style.transform = `none`;
    const towerBaseY = labelRenderedTopY + currentLabelHeight;
    const towerLeftX = labelRenderedLeftX - towerWidth - 2;
    const currentTowerBodyHeight = progress * maxTowerHeight;
    const currentTowerTopY = towerBaseY - currentTowerBodyHeight;
    const isFullProgress = progress >= 1;
    const currentTotalTowerHeight = currentTowerBodyHeight + (isFullProgress ? blockHeight : 0);
    towerBounds = {
      x: towerLeftX,
      y: currentTowerTopY,
      width: towerWidth,
      height: currentTotalTowerHeight,
    };
    ctx.fillStyle = "#6B7280";
    ctx.fillRect(towerLeftX, currentTowerTopY, towerWidth, currentTowerBodyHeight);
    if (isFullProgress) {
      const numBlocks = 3;
      const blockSpacing = 2;
      const blockWidth = (towerWidth - (numBlocks - 1) * blockSpacing) / numBlocks;
      const finalTowerBodyTopY = towerBaseY - maxTowerHeight;
      ctx.fillStyle = "#6B7280";
      for (let i = 0; i < numBlocks; i++) {
        const x = towerLeftX + i * (blockWidth + blockSpacing);
        const y = finalTowerBodyTopY - blockHeight;
        ctx.fillRect(x, y, blockWidth, blockHeight);
      }
      towerOverlay.style.left = `${towerBounds.x}px`;
      towerOverlay.style.top = `${towerBounds.y}px`;
      towerOverlay.style.width = `${towerBounds.width}px`;
      towerOverlay.style.height = `${towerBounds.height}px`;
    }
  }

  function animateCycle(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const elapsed = timestamp - lastTimestamp;
    const duration = totalSegments * segmentDuration;
    let progress = Math.min(elapsed / duration, 1);
    currentProgress = progress;
    drawCircle(progress);
    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animateCycle);
    } else {
      cancelAnimationFrame(animationFrameId);
      startFinishLabel.textContent = "ФІНІШ";
      startFinishLabel.innerHTML += " &#127881;";
      startFinishLabel.style.backgroundColor = "#E2725B";
      startFinishLabel.style.color = "#FFFFFF";
      window.removeEventListener("resize", resizeCanvas);
      drawCircle(1);
      return;
    }
  }

  const processSection = document.getElementById("process");
  const processObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animationStarted) {
          animationStarted = true;
          startFinishLabel.style.backgroundColor = "#8FBC8F";
          startFinishLabel.style.color = "#FFFFFF";
          resizeCanvas();
          window.addEventListener("resize", resizeCanvas);
          setTimeout(() => {
            animationFrameId = requestAnimationFrame(animateCycle);
          }, 2000);
          processObserver.unobserve(processSection);
        }
      });
    },
    { threshold: 0.5 }
  );
  processObserver.observe(processSection);
  towerOverlay.addEventListener("mousemove", function (e) {
    const parentRect = towerOverlay.parentElement.getBoundingClientRect();
    const tooltipX = e.clientX - parentRect.left + 10;
    const tooltipY = e.clientY - parentRect.top + 10;
    towerTooltip.classList.add("visible");
    towerTooltip.style.left = `${tooltipX}px`;
    towerTooltip.style.top = `${tooltipY}px`;
  });
  towerOverlay.addEventListener("mouseout", function () {
    towerTooltip.classList.remove("visible");
  });
});
