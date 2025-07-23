document.addEventListener("DOMContentLoaded", function () {
  const correctAnswers = {
    q1: "b",
    q2: "c",
    q3: "в",
    q4: "б",
    q5: "4",
    q6: "в",
    q7: "б",
    q8: "в",
    q9: "б",
    q10: "б",
    q11: "б",
    q12: "б",
    q13: "б",
  };
  const explanations = {
    q1: "Головне завдання 3-го розділу Неемії — це детальний опис відбудови стін Єрусалиму, що є центральною подією книги.",
    q2: "Розділ яскраво демонструє, як різні групи людей працювали разом, виявляючи жертовність та організованість для досягнення спільної мети.",
    q3: 'Слово "будували/відбудовували" найчастіше зустрічається в тексті, підкреслюючи основний фокус розділу на відновленні стіни.',
    q4: "Овеча брама була особливо важливою, оскільки через неї проводили жертовних овець до храму, і її освячення мало глибоке релігійне та символічне значення, вказуючи на Ісуса Христа.",
    q5: "На відбудову муру були залучені дуже різноманітні люди: від первосвященників та священників до золотарів, торговців, мешканців інших міст і навіть жінок, що свідчить про загальну участь.",
    q6: "Народ був мотивований вірою в те, що це справа, яку веде сам Бог, і що Його рука над цим проектом.",
    q7: "Неемія дозволив багатьом працювати біля своїх домівок, що значно підвищило їхню особисту зацікавленість та ефективність праці.",
    q8: "Вороги, такі як Санваллат, реагували на будівництво гнівом та насмішками, намагаючись демотивувати будівельників.",
    q9: 'Вельможі з Такої відмовилися працювати, можливо, через гордість або лінь, не бажаючи "схилити свою шию" для Господа.',
    q10: "Це означає, що Бог цінує щирість та старанність у служінні, незалежно від масштабу чи видимості праці.",
    q11: "Подібно до того, як різні люди об'єднувалися для відбудови Єрусалиму, сьогодні Церква будується через спільну працю віруючих, об'єднаних Христом.",
    q12: "Бог використовує різних людей, тому що Він може діяти через будь-кого, хто відданий Йому, незалежно від їхніх професійних навичок чи соціального статусу.",
    q13: "Відбудований Єрусалим потребував стін та замків для захисту, тоді як Новий Єрусалим, описаний в Об'явленні, не матиме потреби в захисті, бо там не буде зла.",
  };
  let score = 0;
  let questionsAnswered = 0;
  const totalQuestions = Object.keys(correctAnswers).length;
  document.querySelectorAll(".question-toggle").forEach(toggle => {
    toggle.addEventListener("click", function () {
      const answersContainer = this.nextElementSibling;
      const arrowIcon = this.querySelector(".arrow-icon");
      answersContainer.classList.toggle("expanded");
      arrowIcon.classList.toggle("rotated");
    });
  });
  document.querySelectorAll(".check-answer-btn").forEach(button => {
    button.addEventListener("click", function () {
      const answersContainer = this.closest(".answers-container");
      const questionName = this.previousElementSibling.querySelector('input[type="radio"]').name;
      const selectedOption = answersContainer.querySelector(
        `input[name="${questionName}"]:checked`
      );
      const feedbackMessage = answersContainer.querySelector(".feedback-message");
      const explanationText = answersContainer.querySelector(".explanation-text");
      const allRadioButtons = answersContainer.querySelectorAll(`input[name="${questionName}"]`);
      const allLabels = answersContainer.querySelectorAll("label");
      if (!selectedOption) {
        feedbackMessage.textContent = "Будь ласка, оберіть варіант відповіді.";
        feedbackMessage.style.color = "#E2725B";
        return;
      }
      if (this.dataset.answered === "true") {
        return;
      }
      this.dataset.answered = "true";
      questionsAnswered++;
      const isCorrect = selectedOption.value === correctAnswers[questionName];
      allLabels.forEach(label => {
        label.classList.remove("correct-answer-highlight");
      });
      if (isCorrect) {
        feedbackMessage.textContent = "Правильно!";
        feedbackMessage.style.color = "#8FBC8F";
        selectedOption.closest("label").classList.add("correct-answer-highlight");
        explanationText.classList.add("hidden");
        score++;
      } else {
        feedbackMessage.textContent = "Неправильно.";
        feedbackMessage.style.color = "#E2725B";
        allRadioButtons.forEach((radio, index) => {
          if (radio.value === correctAnswers[questionName]) {
            allLabels[index].classList.add("correct-answer-highlight");
          }
        });
        explanationText.textContent = explanations[questionName];
        explanationText.classList.remove("hidden");
      }
      allRadioButtons.forEach(radio => {
        radio.disabled = true;
      });
      this.disabled = true;
      if (questionsAnswered === totalQuestions) {
        document.getElementById("show-results-btn").classList.remove("hidden");
      }
    });
  });
  document.getElementById("show-results-btn").addEventListener("click", function () {
    const resultsSummary = document.getElementById("results-summary");
    const scoreDisplay = document.getElementById("score-display");
    const aiFeedback = document.getElementById("ai-feedback");
    const loadingSpinner = document.getElementById("loading-spinner");
    resultsSummary.classList.remove("hidden");
    scoreDisplay.textContent = `Ви набрали ${score} з ${totalQuestions} балів.`;
    loadingSpinner.classList.add("hidden");
    let feedback =
      "Ви добре впоралися з вікториною! Ваші знання про Неемію 3 надихають. Продовжуйте вивчати Біблію, щоб ще глибше розуміти Божий план. Якщо деякі відповіді були складними — це чудова нагода для духовного зростання. Дякуємо за участь!";
    if (score === totalQuestions) {
      feedback = "Відмінно! Ви відповіли правильно на всі питання. Ваші знання чудові!";
    } else if (score >= totalQuestions * 0.7) {
      feedback = "Дуже добре! Ви знаєте основні моменти, залишилось лише трохи підтягнути деталі.";
    } else if (score <= totalQuestions * 0.3) {
      feedback = "Не засмучуйтесь! Кожна спроба — це крок до кращого розуміння Божого Слова.";
    }
    aiFeedback.textContent = feedback;
    aiFeedback.style.color = "#465362";
  });
  document.getElementById("show-results-btn").classList.add("hidden");
});
