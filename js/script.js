document.addEventListener("DOMContentLoaded", () => {
  // --- Dynamic Hero Image Animation ---
  const heroImage = document.querySelector(".hero-image");
  let currentTransform = { scale: 1.3, x: 0, y: 0 };

  function animateHeroImage() {
    const targetX = (Math.random() - 0.5) * 120;
    const targetY = (Math.random() - 0.5) * 120;
    const targetScale = 1.3 + (Math.random() * 0.3 - 0.15);
    currentTransform = { scale: targetScale, x: targetX, y: targetY };
    heroImage.style.transform = `scale(${currentTransform.scale}) translateX(${currentTransform.x}px) translateY(${currentTransform.y}px)`;
    setTimeout(animateHeroImage, 1500 + Math.random() * 1000);
  }

  function addTremor() {
    const tremorX = (Math.random() - 0.5) * 8;
    const tremorY = (Math.random() - 0.5) * 8;
    heroImage.style.transform = `scale(${currentTransform.scale}) translateX(${
      currentTransform.x + tremorX
    }px) translateY(${currentTransform.y + tremorY}px)`;
    setTimeout(() => {
      heroImage.style.transform = `scale(${currentTransform.scale}) translateX(${currentTransform.x}px) translateY(${currentTransform.y}px)`;
    }, 100);
    setTimeout(addTremor, 500 + Math.random() * 1000);
  }

  animateHeroImage();
  addTremor();
});
