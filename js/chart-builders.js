document.addEventListener("DOMContentLoaded", function () {
  const chartEl = document.getElementById("buildersChart");
  if (!chartEl) return;
  const buildersData = {
    labels: [
      "Священники ⛪",
      "Золотарі 💰",
      "Торговці 🛍️",
      "Виробники парфумів 👃",
      "Начальники округів 👑",
      "Левіти 🎶",
      "Мешканці інших міст 🏘️",
      "Доньки Шалума (Жінки) 👩‍🔧",
    ],
    datasets: [
      {
        label: "Групи будівельників",
        data: [12, 10, 10, 8, 12, 10, 15, 8],
        backgroundColor: [
          "#60A5FA",
          "#FBBF24",
          "#34D399",
          "#F87171",
          "#A78BFA",
          "#FB923C",
          "#22D3EE",
          "#F472B6",
        ],
        hoverOffset: 4,
      },
    ],
  };
  const config = {
    type: "doughnut",
    data: buildersData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            font: {
              size: 12,
              family: "Inter",
            },
          },
        },
        title: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.label || "";
              label = label
                .replace(
                  /([\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}])/gu,
                  ""
                )
                .trim();
              return label + ": Умовна частка";
            },
          },
        },
      },
    },
  };
  new Chart(chartEl, config);
});
