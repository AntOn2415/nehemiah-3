document.addEventListener("DOMContentLoaded", () => {
  const quizQuestions = document.getElementById("quiz-questions");
  let correctAnswersCount = 0;
  const totalQuestions = quizQuestions.children.length;
  let incorrectAnswersExist = false;

  const quizObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          quizQuestions.style.opacity = "1";
          document.querySelectorAll(".question").forEach((q, index) => {
            setTimeout(() => {
              q.classList.add("show");
            }, index * 300);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  quizObserver.observe(quizQuestions);

  quizQuestions.querySelectorAll(".option").forEach(button => {
    button.addEventListener("click", e => {
      const questionDiv = e.target.closest(".question");
      if (questionDiv.dataset.answered) {
        return;
      }

      questionDiv.dataset.answered = "true";
      const isCorrect = e.target.dataset.answer === "true";

      e.target.style.transform = "scale(1.1)";
      e.target.style.transition = "transform 0.2s ease-out";

      setTimeout(() => {
        if (isCorrect) {
          e.target.style.backgroundColor = "green";
          correctAnswersCount++;
        } else {
          e.target.style.backgroundColor = "red";
          incorrectAnswersExist = true;
          const correctButton = questionDiv.querySelector('[data-answer="true"]');
          if (correctButton) {
            correctButton.style.backgroundColor = "green";
          }
        }

        if (quizQuestions.querySelectorAll('[data-answered="true"]').length === totalQuestions) {
          if (incorrectAnswersExist) {
            setTimeout(showThanos, 1500);
          } else {
            setTimeout(showVisionSection, 1500);
          }
        }
      }, 200);
    });
  });

  // Функція для відображення секції Віжена
  function showVisionSection() {
    const mainSection = document.querySelector("main");
    const visionSection = document.createElement("section");
    visionSection.id = "vision-section";
    visionSection.classList.add("vision-section", "hidden");

    const userName = localStorage.getItem("userName");
    const userTeam = localStorage.getItem("userTeam");
    const isMaleTeam = localStorage.getItem("isMaleTeam") === "true";

    // Нова логіка для визначення прикметника команди
    const teamAdjectiveMap = {
      "Капітан Америка": "справжній",
      Месники: "справжні",
      "Вартові Галактики": "справжні",
      "Чорні пантери": "справжні",
      Тор: "справжній",
      "Speider-man": "справжній",
      Марвел: "справжній",
      Халк: "справжній",
    };
    const teamAdjective = teamAdjectiveMap[userTeam];

    // Динамічна зміна дієслів та прикметників для користувача на основі статі команди
    const conjugatedVerb = isMaleTeam ? "вистояв" : "вистояла";
    const conjugatedWorthy = isMaleTeam ? "гідний" : "гідна";

    visionSection.innerHTML = `
      <div class="vision-content">
        <img src="images/vision.png" alt="Віжен" class="vision-image">
        <div class="vision-text">
          <h2 class="vision-title">${userName}, ти ${conjugatedVerb}, як ${teamAdjective} ${userTeam}!</h2>
          <p>Твій розум чистий, як камінь Розуму, і ти ${conjugatedWorthy} створити найсильнішу шаурму у всесвіті!</p>
          <button id="show-recipe-btn" class="vision-button">Отримати рецепт</button>
        </div>
      </div>
    `;

    mainSection.insertBefore(visionSection, document.getElementById("recipe-section"));

    setTimeout(() => {
      visionSection.classList.remove("hidden");
      visionSection.classList.add("show");
      visionSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 500);

    const showRecipeBtn = document.getElementById("show-recipe-btn");
    showRecipeBtn.addEventListener("click", showRecipe);
  }

  // Функція для відображення рецепту
  function showRecipe() {
    const recipeSection = document.getElementById("recipe-section");
    const recipeStepsContainer = document.getElementById("recipe-steps");

    if (recipeStepsContainer.children.length > 0) {
      return;
    }

    recipeSection.classList.remove("hidden");
    recipeSection.style.scrollBehavior = "smooth";
    recipeSection.scrollIntoView({ behavior: "smooth", block: "start" });

    const music = document.getElementById("avengersMusic");
    music.play().catch(e => console.error("Music playback failed", e));

    const userName = localStorage.getItem("userName");
    const isMaleTeam = localStorage.getItem("isMaleTeam") === "true";
    const conjugatedFinalVerb = isMaleTeam ? "зміг" : "змогла";
    const conjugatedFinalAdjective = isMaleTeam ? "готовий" : "готова";

    const recipeTitle = document.querySelector(".recipe-title");
    recipeTitle.textContent = `${userName}, це твій рецепт Шаурми "Месники Завершення"!`;

    const recipeStepsData = [
      {
        hero: "Капітан Америка 🛡️",
        text: "<b>Лаваш (1 шт)</b> — тримає все разом, як його щит. <br><b>Капуста пекінська (20 г)</b> і <b>Салат Айзберг (20 г)</b> — зелена «свіжість і порядок». <br><b>Сіль (1,5 г)</b> — дисципліна й баланс.",
        image: "images/captain-america.png",
        imageRight: false,
      },
      {
        hero: "Халк 💚",
        text: "<b>Курка (100 г)</b> — сила та міць. <br><b>Огірок (35 г)</b> — хрумка «свіжість сили».",
        image: "images/hulk.png",
        imageRight: true,
      },
      {
        hero: "Тор ⚡",
        text: "<b>Білий соус (приблизно 45 г)</b> — густий, як грім у небі, і тримає все в купі. <br><b>Лимон (1 г соку)</b> — його блискавка освіжає смак.",
        image: "images/thor.png",
        imageRight: false,
      },
      {
        hero: "Залізна Людина 🔴",
        text: "<b>Помідор (48 г)</b> — червоний і соковитий, як його броня. <br><b>Кетчуп (15 г)</b> — технологічний вибух смаку.",
        image: "images/iron-man.png",
        imageRight: true,
      },
      {
        hero: "Людина-Павук 🕷️",
        text: "<b>Морква по-корейськи (30 г)</b> — тоненькі смужки, як його павутина. <br><b>Сир твердий (15 г)</b> — «склеює» все разом, як павутиння.",
        image: "images/spiderman.png",
        imageRight: false,
      },
      {
        hero: "Чорна Пантера 🐾",
        text: "<b>Перець солодкий (25 г)</b> — яскравий і швидкий, як його рухи. <br><b>Зелень укропу (1 г)</b> — свіжа, мов дика природа Ваканди.",
        image: "images/black-panther.png",
        imageRight: true,
      },
      {
        hero: "Скручуємо рол 💪",
        text: "Щит, міць, грім, павутина, броня та сила Ваканди тепер разом! Обережно згорни лаваш, фіксуючи начинку всередині, як справжній Капітан Америка, що утримує всесвіт разом.",
        image: "images/captain-america-roll.png",
        imageRight: false,
      },
      {
        hero: "Завершення",
        image: "images/shawarma.png",
        text: `Перемога над голодом! <br>Смачного, ${userName}! Ти — справжній Месник, адже ${conjugatedFinalVerb} поєднати героїчну силу, мудрість та відвагу, щоб створити цю легендарну шаурму. Тепер ти ${conjugatedFinalAdjective} до будь-яких викликів, навіть до найголодніших!`,
        isFinal: true,
      },
    ];

    recipeStepsData.forEach(step => {
      const stepDiv = document.createElement("div");
      stepDiv.classList.add("recipe-step");
      if (step.imageRight) {
        stepDiv.classList.add("right");
      }
      if (step.isFinal) {
        stepDiv.classList.add("final-step");
        stepDiv.innerHTML = `
          <div class="final-step-image">
            <img src="${step.image}" alt="Завершальний крок">
          </div>
          <div class="final-message">${step.text}</div>
        `;
      } else {
        stepDiv.innerHTML = `
          <div class="recipe-step-image">
            <img src="${step.image}" alt="${step.hero}">
          </div>
          <div class="recipe-step-text">
            <h3>${step.hero}</h3>
            <p>${step.text}</p>
          </div>
        `;
      }
      recipeStepsContainer.appendChild(stepDiv);
    });

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll(".recipe-step").forEach(step => {
      observer.observe(step);
    });
  }

  // Функція для відображення секції Таноса
  function showThanos() {
    const mainSection = document.querySelector("main");
    const userName = localStorage.getItem("userName");
    const leaderName = localStorage.getItem("leaderName");
    const isMaleTeam = localStorage.getItem("isMaleTeam") === "true";
    const conjugatedVerb = isMaleTeam ? "допустив" : "допустила";

    mainSection.innerHTML = `
      <section id="thanos-section" class="thanos-section">
        <h2 class="thanos-title">Занадто багато помилок...</h2>
        <div class="thanos-content">
          <img src="images/thanos-gauntlet.png" alt="Танос з рукавицею нескінченності" class="thanos-image">
          <p class="thanos-message">${userName}, ти ${conjugatedVerb} критичні помилки! Що ж подумає про тебе твій лідер, ${leaderName}?</p>
          <button id="snap-button" class="snap-button">
            <span class="button-text">Щелкнути "Рукавицею Нескінченності"</span>
          </button>
        </div>
      </section>
    `;

    const snapButton = document.getElementById("snap-button");
    snapButton.addEventListener("click", () => {
      showThanosSnapAnimation();
    });
  }

  // Функція для анімації клацання Таноса та перезавантаження
  function showThanosSnapAnimation() {
    const thanosImage = document.querySelector(".thanos-image");
    const snapButton = document.getElementById("snap-button");
    snapButton.style.display = "none";
    thanosImage.src = "images/thanos-snap.png";
    thanosImage.classList.add("snap-animation");

    setTimeout(() => {
      const flash = document.createElement("div");
      flash.classList.add("white-flash-overlay");
      document.body.appendChild(flash);

      setTimeout(() => {
        location.reload();
      }, 2000);
    }, 1500);
  }
});
