document.addEventListener("DOMContentLoaded", () => {
  // --- Dynamic Hero Image Animation ---
  const heroImage = document.querySelector(".hero-image");
  let currentTransform = { x: 0, y: 0 };

  function animateHeroImage() {
    const targetX = (Math.random() - 0.5) * 40; /* Зменшуємо діапазон руху */
    const targetY = (Math.random() - 0.5) * 40; /* Зменшуємо діапазон руху */
    currentTransform = { x: targetX, y: targetY };
    heroImage.style.transform = `translate(-50%, -50%) translateX(${currentTransform.x}px) translateY(${currentTransform.y}px)`;
    setTimeout(animateHeroImage, 1500 + Math.random() * 1000);
  }

  function addTremor() {
    const tremorX = (Math.random() - 0.5) * 4;
    const tremorY = (Math.random() - 0.5) * 4;
    heroImage.style.transform = `translate(-50%, -50%) translateX(${
      currentTransform.x + tremorX
    }px) translateY(${currentTransform.y + tremorY}px)`;
    setTimeout(() => {
      heroImage.style.transform = `translate(-50%, -50%) translateX(${currentTransform.x}px) translateY(${currentTransform.y}px)`;
    }, 100);
    setTimeout(addTremor, 500 + Math.random() * 1000);
  }

  animateHeroImage();
  addTremor();
});
