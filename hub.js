(function () {
  "use strict";

  const cards = document.querySelectorAll(".direction");
  if (window.matchMedia("(pointer: fine)").matches) {
    cards.forEach((card) => {
      const preview = card.querySelector(".preview");
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
        preview.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0)`;
      });
      card.addEventListener("pointerleave", () => {
        preview.style.transform = "";
      });
    });
  }
})();
