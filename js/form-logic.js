document.addEventListener("DOMContentLoaded", () => {
  const teamSpinner = document.getElementById("team-spinner");
  const nameSpinner = document.getElementById("name-spinner");
  const form = document.getElementById("team-form");
  const nameLabel = document.querySelector('label[for="name-select"]');
  const backButton = document.getElementById("back-button");
  const formSection = document.getElementById("form-section");
  const quizSection = document.querySelector(".quiz-section");

  let selectedTeam = null;
  let selectedName = null;

  nameSpinner.classList.add("hidden");
  if (nameLabel) {
    nameLabel.classList.add("hidden");
  }

  const teamImageMap = {
    "Капітан Америка": "captain-america",
    Месники: "avengers",
    "Вартові Галактики": "guardians-of-the-galaxy",
    "Чорні пантери": "black-panthers",
    Тор: "thor",
    "Speider-man": "spiderman",
    Марвел: "marvel",
    Халк: "hulk",
  };

  const updateSpinnerStyles = (spinner, isTeamSpinner) => {
    const items = spinner.querySelectorAll(isTeamSpinner ? ".spinner-item" : ".spinner-name-item");
    if (items.length === 0) return;

    const containerCenter = spinner.scrollLeft + spinner.offsetWidth / 2;
    let closestItem = null;
    let minDistance = Infinity;

    items.forEach(item => {
      const itemRect = item.getBoundingClientRect();
      const containerRect = spinner.getBoundingClientRect();
      const itemCenter =
        itemRect.left + item.offsetWidth / 2 - containerRect.left + spinner.scrollLeft;
      const distance = Math.abs(containerCenter - itemCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestItem = item;
      }
      item.classList.remove("active-center");
      item.classList.remove("active");
    });

    if (closestItem) {
      closestItem.classList.add("active-center");
      closestItem.classList.add("active");

      if (isTeamSpinner) {
        const newTeam = closestItem.dataset.team;
        if (newTeam !== selectedTeam) {
          selectedTeam = newTeam;
          populateNameSpinner(selectedTeam);
          selectedName = null;
          nameSpinner.scrollLeft = 0;
        }
      } else {
        selectedName = closestItem.dataset.name;
      }
    }
  };

  const createBuffer = (container, itemWidth) => {
    const containerWidth = container.offsetWidth;
    const bufferWidth = containerWidth / 2 - itemWidth / 2;

    const startBuffer = document.createElement("div");
    startBuffer.classList.add("buffer-element");
    startBuffer.style.width = bufferWidth + "px";

    const endBuffer = document.createElement("div");
    endBuffer.classList.add("buffer-element");
    endBuffer.style.width = bufferWidth + "px";

    return { startBuffer, endBuffer };
  };

  const populateTeamSpinner = () => {
    teamSpinner.innerHTML = "";

    const tempItem = document.createElement("div");
    tempItem.classList.add("spinner-item");
    tempItem.innerHTML = `<img src="images/teams/avengers.jpg" alt="Avengers"><p>Месники</p>`;
    teamSpinner.appendChild(tempItem);
    const itemWidth = tempItem.offsetWidth;
    teamSpinner.innerHTML = "";

    const { startBuffer, endBuffer } = createBuffer(teamSpinner, itemWidth);
    teamSpinner.appendChild(startBuffer);

    for (const team in teamsData) {
      const teamId = teamImageMap[team] || team.replace(/\s/g, "-").toLowerCase();
      const teamItem = document.createElement("div");
      teamItem.classList.add("spinner-item");
      teamItem.dataset.team = team;
      teamItem.innerHTML = `<img src="images/teams/${teamId}.jpg" alt="${team}"><p>${team}</p>`;

      teamItem.addEventListener("click", () => {
        const itemLeft = teamItem.offsetLeft;
        const containerWidth = teamSpinner.offsetWidth;
        const itemWidth = teamItem.offsetWidth;
        const scrollTo = itemLeft - containerWidth / 2 + itemWidth / 2;

        teamSpinner.scrollTo({
          left: scrollTo,
          behavior: "smooth",
        });
      });

      teamSpinner.appendChild(teamItem);
    }

    teamSpinner.appendChild(endBuffer);
    updateSpinnerStyles(teamSpinner, true);
  };

  const populateNameSpinner = team => {
    nameSpinner.innerHTML = "";
    const names = teamsData[team].names || [];

    const tempNameItem = document.createElement("div");
    tempNameItem.classList.add("spinner-name-item");
    tempNameItem.style.visibility = "hidden";
    tempNameItem.style.position = "absolute";
    tempNameItem.textContent = names[0] || "Default Name";
    nameSpinner.appendChild(tempNameItem);

    const itemWidth = tempNameItem.offsetWidth;
    nameSpinner.removeChild(tempNameItem);

    const { startBuffer, endBuffer } = createBuffer(nameSpinner, itemWidth);
    nameSpinner.appendChild(startBuffer);

    names.forEach(name => {
      const nameItem = document.createElement("div");
      nameItem.classList.add("spinner-name-item");
      nameItem.textContent = name;
      nameItem.dataset.name = name;

      nameItem.addEventListener("click", () => {
        const itemLeft = nameItem.offsetLeft;
        const containerWidth = nameSpinner.offsetWidth;
        const itemWidth = nameItem.offsetWidth;
        const scrollTo = itemLeft - containerWidth / 2 + itemWidth / 2;

        nameSpinner.scrollTo({
          left: scrollTo,
          behavior: "smooth",
        });
      });
      nameSpinner.appendChild(nameItem);
    });

    nameSpinner.appendChild(endBuffer);
    updateSpinnerStyles(nameSpinner, false);

    nameSpinner.classList.remove("hidden");
    nameSpinner.classList.add("fade-in");
    if (nameLabel) {
      nameLabel.classList.remove("hidden");
      nameLabel.classList.add("fade-in");
    }
  };

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (selectedTeam && selectedName) {
      const teamData = teamsData[selectedTeam];
      localStorage.setItem("userTeam", selectedTeam);
      localStorage.setItem("userName", selectedName);
      localStorage.setItem("isMaleTeam", teamData.isMaleTeam ? "true" : "false");
      localStorage.setItem("leaderName", teamData.leaderName);

      formSection.classList.add("hidden");
      quizSection.classList.remove("hidden");
      backButton.classList.remove("hidden");
      updateTexts();
    } else {
      alert("Будь ласка, оберіть і команду, і ім'я!");
    }
  });

  if (backButton) {
    backButton.addEventListener("click", () => {
      formSection.classList.remove("hidden");
      quizSection.classList.add("hidden");
      backButton.classList.add("hidden");
      localStorage.removeItem("userTeam");
      localStorage.removeItem("userName");
      localStorage.removeItem("isMaleTeam");
      localStorage.removeItem("leaderName");
      updateFormTitleOnReturn();
    });
  }

  const updateTexts = () => {
    const userName = localStorage.getItem("userName");
    const userTeam = localStorage.getItem("userTeam");
    const quizTitle = document.getElementById("quiz-title");
    const wasSnapped = localStorage.getItem("thanosSnap");

    if (quizTitle) {
      if (wasSnapped) {
        quizTitle.textContent = `${userName}, спробуй ще раз! Можливо, цього разу всесвіт буде до тебе більш прихильним!`;
        localStorage.removeItem("thanosSnap");
      } else {
        quizTitle.textContent = `${userName}, твоїй команді "${userTeam}" потрібен цей рецепт. Дай вірні відповіді на 5 важливих питань табору:`;
      }
    }

    const recipeTitle = document.querySelector(".recipe-title");
    if (recipeTitle) {
      recipeTitle.textContent = `Це твій рецепт Шаурми "Месники Завершення"!`;
    }

    const visionTitle = document.querySelector(".vision-title");
    if (visionTitle) {
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

      visionTitle.textContent = `${userName}, ти ${conjugatedVerb}, як ${teamAdjective} ${userTeam}!`;
      document.querySelector(
        ".vision-text p"
      ).textContent = `Твій розум чистий, як камінь Розуму, і ти ${conjugatedWorthy} створити найсильнішу шаурму у всесвіті!`;
    }

    const finalMessage = document.querySelector(".final-message");
    if (finalMessage) {
      const isMaleTeam = localStorage.getItem("isMaleTeam") === "true";
      const conjugatedVerb = isMaleTeam ? "зміг" : "змогла";
      const conjugatedAdjective = isMaleTeam ? "готовий" : "готова";
      finalMessage.innerHTML = `Перемога над голодом! <br>Смачного! Ти — справжній Месник, адже ${conjugatedVerb} поєднати героїчну силу, мудрість та відвагу, щоб створити цю легендарну шаурму. Тепер ти ${conjugatedAdjective} до будь-яких викликів, навіть до найголодніших!`;
    }
  };

  const updateFormTitleOnReturn = () => {
    const formTitle = document.querySelector(".form-title");
    formTitle.textContent = "Приєднуйся до своєї команди!";
  };

  const handleScroll = (spinner, isTeamSpinner) => {
    clearTimeout(spinner.scrollTimeout);
    spinner.scrollTimeout = setTimeout(() => {
      updateSpinnerStyles(spinner, isTeamSpinner);
    }, 100);
  };

  teamSpinner.addEventListener("scroll", () => handleScroll(teamSpinner, true));
  nameSpinner.addEventListener("scroll", () => handleScroll(nameSpinner, false));

  populateTeamSpinner();

  const formTitle = document.querySelector(".form-title");
  const wasSnapped = localStorage.getItem("thanosSnap");

  if (wasSnapped) {
    const userName = localStorage.getItem("userName");
    if (userName) {
      formTitle.textContent = `${userName}, спробуй ще раз! Танос не прощає помилок!`;
    } else {
      formTitle.textContent = "Спробуй ще раз! Танос не прощає помилок!";
    }
  }

  if (localStorage.getItem("userTeam") && localStorage.getItem("userName")) {
    formSection.classList.add("hidden");
    quizSection.classList.remove("hidden");
    backButton.classList.remove("hidden");
    updateTexts();
  }
});
