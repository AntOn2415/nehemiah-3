document.addEventListener("DOMContentLoaded", () => {
  const quizQuestions = document.getElementById("quiz-questions");
  let correctAnswersCount = 0;
  const totalQuestions = quizQuestions.children.length;
  let incorrectAnswersExist = false;

  const userName = localStorage.getItem("userName");
  const isMaleTeam = localStorage.getItem("isMaleTeam") === "true";

  const conjugatedVerbMap = {
    male: {
      показав: "показав",
      зміг: "зміг",
      маєш: "маєш",
      потрапив: "потрапив",
      зрозумів: "зрозумів",
      готовий: "готовий",
      допустив: "допустив",
    },
    female: {
      показав: "показала",
      зміг: "змогла",
      маєш: "маєш",
      потрапив: "потрапила",
      зрозумів: "зрозуміла",
      готовий: "готова",
      допустив: "допустила",
    },
  };

  const gender = isMaleTeam ? "male" : "female";
  const c = key => conjugatedVerbMap[gender][key];

  // Функція для перемішування масиву (алгоритм Фішера-Єйтса)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Перемішуємо відповіді для кожного питання
  document.querySelectorAll(".question").forEach(question => {
    const optionsContainer = question.querySelector(".options");
    const options = Array.from(optionsContainer.children);

    options.forEach(option => optionsContainer.removeChild(option));

    shuffleArray(options);

    options.forEach(option => optionsContainer.appendChild(option));
  });

  // Об'єкт, що містить біблійні істини та пояснення для кожного питання
  const bibleTruths = {
    1: {
      truth: `Твоя юність і невмілість не обмежує Бога. Він шукає серце, готове довіряти та діяти.`,
      incorrect: `На жаль, це невірний вибір. Божа сила не залежить від фізичних здібностей чи костюма, а від серця, що довіряє Йому.`,
      correct: `Саме так! Ти ${c(
        "показав"
      )}, що для Бога найважливіше — серце, що довіряє, а не зовнішні дані. Ти ${c("готовий")}!`,
    },
    2: {
      truth: `Ісус не був далеким “супер-Богом”, а пройшов усе як людина — з реальними емоціями, але не згрішив. Він — наша надія, коли ми не можемо себе стримати або контролювати почуття.`,
      incorrect: `На жаль, це не зовсім вірно. Ісус показав, що емоціями можна керувати, підкоряючи їх волі Отця. Це і є Його приклад для нас.`,
      correct: `Так, абсолютно вірно! Ісус показав нам, що навіть у найскладніші моменти ми можемо підкорити свої емоції Богові. Ти ${c(
        "маєш"
      )} мудрість Халка, але з контролем!`,
    },
    3: {
      truth: `Бог прагне глибоких стосунків із нами, а не просто зовнішньої слухняності. Правила — важливі, але не головне. Головне — серце, що шукає Отця.`,
      incorrect: `Це не те, що нам показав блудний син. Зовнішня слухняність без серця не приносить радості Богу. Подумай, що було головним для батька?`,
      correct: `Вірно! Серце, що прагне Отця, завжди буде головним. Ти ${c(
        "маєш"
      )} вірність, як у Капітана Америки, але з глибиною серця.`,
    },
    4: {
      truth: `Справжня цінність полягає не в матеріальному багатстві чи 'крутості', а в готовності віддати все заради стосунків з Ісусом.`,
      incorrect: `Не зовсім. Справжня цінність не в багатстві, а в готовності відмовитись від усього, що віддаляє від Бога, заради стосунків із Ним. Подумай про Закхея.`,
      correct: `Саме так! Ти, як і Залізна Людина, ${c(
        "зрозумів"
      )}, що справжня сила не в матеріальних речах, а у стосунках. Ти – справжній геній, мільярдер, філантроп!`,
    },
    5: {
      truth: `Справжня сила — в слухняності Богу.`,
      incorrect: `Ні, це хибна думка. Сила Самсона була не в його волоссі чи м'язах, а в його слухняності Богу. Запам'ятай це!`,
      correct: `Абсолютно вірно! Як і Тор, ти ${c(
        "зрозумів"
      )}, що справжня сила виходить з вищого джерела. Твоя слухняність — це твій Мйольнір!`,
    },
  };

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
      const questionId = questionDiv.dataset.questionId;
      const questionData = bibleTruths[questionId];

      // Видаляємо попередні повідомлення, якщо такі були
      const oldMessage = questionDiv.querySelector(".feedback-message");
      if (oldMessage) {
        oldMessage.remove();
      }

      const messageDiv = document.createElement("div");
      messageDiv.classList.add("feedback-message");

      if (isCorrect) {
        e.target.style.backgroundColor = "green";
        messageDiv.innerHTML = `<p style="color: lightgreen; font-weight: bold;">${questionData.correct}</p>`;
        correctAnswersCount++;
      } else {
        e.target.style.backgroundColor = "red";
        incorrectAnswersExist = true;

        const correctButton = questionDiv.querySelector('[data-answer="true"]');
        if (correctButton) {
          correctButton.style.backgroundColor = "green";
        }

        messageDiv.innerHTML = `
          <p style="color: red; font-weight: bold;">${questionData.incorrect}</p>
          <p style="margin-top: 15px; font-weight: bold;">Біблійна Істина:</p>
          <p>${questionData.truth}</p>
        `;
      }

      questionDiv.appendChild(messageDiv);
      questionDiv.querySelectorAll(".option").forEach(btn => (btn.disabled = true));

      if (quizQuestions.querySelectorAll('[data-answered="true"]').length === totalQuestions) {
        if (incorrectAnswersExist) {
          setTimeout(showThanos, 1500);
        } else {
          setTimeout(showVisionSection, 1500);
        }
      }
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

    const teamAdjectiveMap = {
      "Капітан Америка": "справжній",
      Месники: "справжні",
      "Вартові Галактики": "справжні",
      "Чорні пантери": "справжні",
      Тор: "справжній",
      "Speider-man": "справжній",
      "Капітан Марвел": "справжній",
      Халк: "справжній",
    };
    const teamAdjective = teamAdjectiveMap[userTeam];
    const conjugatedVerb = isMaleTeam ? "вистояв" : "вистояла";
    const conjugatedWorthy = isMaleTeam ? "гідний" : "гідна";

    visionSection.innerHTML = `
      <div class="vision-content">
        <img src="images/vision.jpg" alt="Віжен" class="vision-image">
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

    let recipeTitle = document.querySelector(".recipe-title");
    if (!recipeTitle) {
      recipeTitle = document.createElement("h2");
      recipeTitle.classList.add("recipe-title");
      recipeSection.appendChild(recipeTitle);
    }
    recipeTitle.textContent = `Це твій рецепт Шаурми "Месники Завершення"!`;

    const recipeStepsData = [
      {
        hero: "Капітан Америка 🛡️",
        text: "<b>Лаваш (1 шт)</b> — тримає все разом, як його щит. <br><b>Капуста пекінська (40 г)</b> — зелена «свіжість і порядок». <br><b>Сіль (1,5 г)</b> — дисципліна й баланс.",
        image: "images/captain-america.jpg",
        imageRight: false,
      },
      {
        hero: "Халк 💚",
        text: "<b>Курка (100 г)</b> — сила та міць. <br><b>Огірок (35 г)</b> — хрумка «свіжість сили».",
        image: "images/hulk.jpg",
        imageRight: true,
      },
      {
        hero: "Тор ⚡",
        text: "<b>Білий соус (приблизно 50 г)</b> — густий, як грім у небі, і тримає все в купі. <br><b>Лимон (1 г соку)</b> — його блискавка освіжає смак.",
        image: "images/thor.jpg",
        imageRight: false,
      },
      {
        hero: "Залізна Людина 🔴",
        text: "<b>Помідор (48 г)</b> — червоний і соковитий, як його броня. <br><b>Кетчуп (15 г)</b> — технологічний вибух смаку.",
        image: "images/iron-man.jpg",
        imageRight: true,
      },
      {
        hero: "Людина-Павук 🕷️",
        text: "<b>Морква по-корейськи (30 г)</b> — тоненькі смужки, як його павутина. <br><b>Сир твердий (15 г)</b> — «склеює» все разом, як павутиння.",
        image: "images/spiderman.jpg",
        imageRight: false,
      },
      {
        hero: "Чорна Пантера 🐾",
        text: "<b>Перець солодкий (25 г)</b> — яскравий і швидкий, як його рухи. <br><b>Зелень укропу (1 г)</b> — свіжа, мов дика природа Ваканди.",
        image: "images/black-panther.jpg",
        imageRight: true,
      },
      {
        hero: "Скручуємо рол 💪",
        text: "Щит, міць, грім, павутина, броня та сила Ваканди тепер разом! Обережно згорни лаваш, фіксуючи начинку всередині, як справжній Капітан Америка, що утримує всесвіт разом.",
        image: "images/captain-america-roll.jpg",
        imageRight: false,
      },
      {
        hero: "Завершення",
        image: "images/shawarma.jpg",
        text: `Перемога над голодом! <br>Смачного! Ти — справжній Месник, адже ${conjugatedFinalVerb} поєднати героїчну силу, мудрість та відвагу, щоб створити цю легендарну шаурму. Тепер ти ${conjugatedFinalAdjective} до будь-яких викликів, навіть до найголодніших!`,
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

    const avengersMusic = document.getElementById("avengersMusic");
    const thanosMusic = document.getElementById("thanosMusic");

    if (avengersMusic) {
      avengersMusic.pause();
      avengersMusic.currentTime = 0;
    }

    if (thanosMusic) {
      thanosMusic.play().catch(e => console.error("Thanos music playback failed:", e));
    }

    mainSection.innerHTML = `
      <section id="thanos-section" class="thanos-section">
        <h2 class="thanos-title">Занадто багато помилок...</h2>
        <div class="thanos-content">
          <img src="images/thanos-gauntlet.jpg" alt="Танос з рукавицею нескінченності" class="thanos-image">
          <p class="thanos-message">${userName}, ти ${c(
      "допустив"
    )} критичні помилки! Що ж подумає про тебе твій лідер, ${leaderName}?</p>
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
    const thanosMusic = document.getElementById("thanosMusic");
    const snapSound = document.getElementById("snapSound");

    if (thanosMusic) {
      thanosMusic.pause();
      thanosMusic.currentTime = 0;
    }

    thanosImage.src = "images/thanos-snap.jpg";
    thanosImage.classList.add("snap-animation");
    snapButton.style.display = "none";

    setTimeout(() => {
      if (snapSound) {
        snapSound.play().catch(e => console.error("Snap sound playback failed:", e));
      }
    }, 500);

    setTimeout(() => {
      const flash = document.createElement("div");
      flash.classList.add("white-flash-overlay");
      document.body.appendChild(flash);

      localStorage.setItem("thanosSnap", "true");

      setTimeout(() => {
        location.reload();
      }, 2000);
    }, 2500);
  }
});
