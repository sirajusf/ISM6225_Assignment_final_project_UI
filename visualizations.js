const riskCanvas = document.querySelector("#riskTrendChart");
const experienceCanvas = document.querySelector("#experienceChart");
const assistantCanvas = document.querySelector("#assistantImpactChart");

if (riskCanvas && experienceCanvas && assistantCanvas && window.Chart) {
  const months12 = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

  const riskDataByRange = {
    "12m": {
      labels: months12,
      scamRatePer1000: [9.8, 8.7, 9.1, 8.4, 7.9, 7.3, 6.8, 6.4, 6.1, 5.9, 5.6, 5.2],
      leaseRiskScore: [63, 62, 60, 58, 56, 54, 52, 50, 49, 47, 45, 44]
    },
    "6m": {
      labels: months12.slice(-6),
      scamRatePer1000: [6.8, 6.4, 6.1, 5.9, 5.6, 5.2],
      leaseRiskScore: [52, 50, 49, 47, 45, 44]
    }
  };

  const experienceByScope = {
    all: {
      labels: ["Tampa", "Orlando", "Miami", "Austin", "Atlanta"],
      maintenanceDelays: [42, 31, 48, 29, 35],
      hiddenFees: [27, 22, 34, 18, 24],
      communicationIssues: [21, 16, 28, 14, 19]
    },
    "fl-core": {
      labels: ["Tampa", "Orlando", "Miami"],
      maintenanceDelays: [42, 31, 48],
      hiddenFees: [27, 22, 34],
      communicationIssues: [21, 16, 28]
    },
    south: {
      labels: ["Miami", "Orlando", "Austin"],
      maintenanceDelays: [48, 31, 29],
      hiddenFees: [34, 22, 18],
      communicationIssues: [28, 16, 14]
    }
  };

  const assistantDataByMode = {
    usage: {
      label: "Searches or Sessions (%)",
      values: [34, 27, 22, 17]
    },
    impact: {
      label: "Estimated Positive Outcome (%)",
      values: [76, 82, 71, 68]
    }
  };

  const assistantLabels = [
    "Natural Language Search",
    "Renter Fit Assistant",
    "Negotiation Copilot",
    "Deposit Recovery Assistant"
  ];

  const chartState = {
    range: "6m",
    cityScope: "all",
    aiMode: "usage"
  };

  function getThemeColors() {
    const rootStyles = getComputedStyle(document.documentElement);
    const textColor = rootStyles.getPropertyValue("--text").trim() || "#16364b";
    const mutedColor = rootStyles.getPropertyValue("--muted").trim() || "#4f6f84";
    const gridColor = document.documentElement.getAttribute("data-theme") === "dark"
      ? "rgba(174, 198, 228, 0.24)"
      : "rgba(67, 109, 140, 0.15)";

    return {
      textColor,
      mutedColor,
      gridColor,
      lineScam: "#0ea5e9",
      lineLeaseRisk: "#8b5cf6",
      barMaintenance: "#6366f1",
      barHiddenFees: "#f97316",
      barCommunication: "#14b8a6",
      doughnutColors: ["#0ea5e9", "#6366f1", "#8b5cf6", "#14b8a6"]
    };
  }

  function getCommonOptions(colors) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false
      },
      plugins: {
        legend: {
          labels: {
            color: colors.textColor
          }
        },
        tooltip: {
          callbacks: {
            title(items) {
              return items[0]?.label || "";
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: colors.mutedColor
          },
          grid: {
            color: colors.gridColor
          }
        },
        y: {
          ticks: {
            color: colors.mutedColor
          },
          grid: {
            color: colors.gridColor
          }
        }
      }
    };
  }

  const themeColors = getThemeColors();

  const riskSource = riskDataByRange[chartState.range];
  const riskChart = new Chart(riskCanvas, {
    type: "line",
    data: {
      labels: riskSource.labels,
      datasets: [
        {
          label: "Scam Reports / 1,000 Listings",
          data: riskSource.scamRatePer1000,
          borderColor: themeColors.lineScam,
          backgroundColor: "rgba(14, 165, 233, 0.2)",
          yAxisID: "y",
          borderWidth: 2.4,
          tension: 0.34,
          pointRadius: 3
        },
        {
          label: "Avg Lease Risk Score",
          data: riskSource.leaseRiskScore,
          borderColor: themeColors.lineLeaseRisk,
          backgroundColor: "rgba(139, 92, 246, 0.2)",
          yAxisID: "y1",
          borderWidth: 2.4,
          tension: 0.34,
          pointRadius: 3
        }
      ]
    },
    options: {
      ...getCommonOptions(themeColors),
      scales: {
        x: {
          ticks: { color: themeColors.mutedColor },
          grid: { color: themeColors.gridColor }
        },
        y: {
          position: "left",
          title: { display: true, text: "Scam Rate", color: themeColors.mutedColor },
          ticks: { color: themeColors.mutedColor },
          grid: { color: themeColors.gridColor }
        },
        y1: {
          position: "right",
          min: 35,
          max: 70,
          title: { display: true, text: "Lease Risk Score", color: themeColors.mutedColor },
          ticks: { color: themeColors.mutedColor },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });

  const experienceSource = experienceByScope[chartState.cityScope];
  const experienceChart = new Chart(experienceCanvas, {
    type: "bar",
    data: {
      labels: experienceSource.labels,
      datasets: [
        {
          label: "Maintenance Delays",
          data: experienceSource.maintenanceDelays,
          backgroundColor: "rgba(99, 102, 241, 0.85)"
        },
        {
          label: "Hidden Fee Disputes",
          data: experienceSource.hiddenFees,
          backgroundColor: "rgba(249, 115, 22, 0.85)"
        },
        {
          label: "Communication Issues",
          data: experienceSource.communicationIssues,
          backgroundColor: "rgba(20, 184, 166, 0.85)"
        }
      ]
    },
    options: {
      ...getCommonOptions(themeColors),
      plugins: {
        ...getCommonOptions(themeColors).plugins,
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${context.raw} reports`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: { color: themeColors.mutedColor },
          grid: { color: themeColors.gridColor }
        },
        y: {
          stacked: true,
          title: { display: true, text: "Issue Volume", color: themeColors.mutedColor },
          ticks: { color: themeColors.mutedColor },
          grid: { color: themeColors.gridColor }
        }
      }
    }
  });

  const assistantSource = assistantDataByMode[chartState.aiMode];
  const assistantChart = new Chart(assistantCanvas, {
    type: "doughnut",
    data: {
      labels: assistantLabels,
      datasets: [
        {
          label: assistantSource.label,
          data: assistantSource.values,
          backgroundColor: themeColors.doughnutColors,
          borderColor: "transparent",
          hoverOffset: 12
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: themeColors.textColor
          }
        },
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.label}: ${context.raw}%`;
            }
          }
        }
      }
    }
  });

  function setActiveButton(container, selector, value, attr) {
    const buttons = container.querySelectorAll(selector);
    buttons.forEach((button) => {
      const isActive = button.getAttribute(attr) === value;
      button.classList.toggle("active", isActive);
    });
  }

  function updateRiskChart() {
    const source = riskDataByRange[chartState.range];
    riskChart.data.labels = source.labels;
    riskChart.data.datasets[0].data = source.scamRatePer1000;
    riskChart.data.datasets[1].data = source.leaseRiskScore;
    riskChart.update();
  }

  function updateExperienceChart() {
    const source = experienceByScope[chartState.cityScope];
    experienceChart.data.labels = source.labels;
    experienceChart.data.datasets[0].data = source.maintenanceDelays;
    experienceChart.data.datasets[1].data = source.hiddenFees;
    experienceChart.data.datasets[2].data = source.communicationIssues;
    experienceChart.update();
  }

  function updateAssistantChart() {
    const source = assistantDataByMode[chartState.aiMode];
    assistantChart.data.datasets[0].label = source.label;
    assistantChart.data.datasets[0].data = source.values;
    assistantChart.update();
  }

  const timeframeControls = document.querySelector("#timeframe-controls");
  const cityFilter = document.querySelector("#city-filter");
  const aiModeControls = document.querySelector("#ai-mode-controls");

  timeframeControls?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-range]");
    if (!button) return;
    chartState.range = button.getAttribute("data-range");
    setActiveButton(timeframeControls, ".segmented-btn", chartState.range, "data-range");
    updateRiskChart();
  });

  cityFilter?.addEventListener("change", () => {
    chartState.cityScope = cityFilter.value;
    updateExperienceChart();
  });

  aiModeControls?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-ai-mode]");
    if (!button) return;
    chartState.aiMode = button.getAttribute("data-ai-mode");
    setActiveButton(aiModeControls, ".segmented-btn", chartState.aiMode, "data-ai-mode");
    updateAssistantChart();
  });

  function refreshChartTheme() {
    const colors = getThemeColors();
    [riskChart, experienceChart].forEach((chart) => {
      if (chart.options.plugins?.legend?.labels) {
        chart.options.plugins.legend.labels.color = colors.textColor;
      }
      if (chart.options.scales?.x?.ticks) {
        chart.options.scales.x.ticks.color = colors.mutedColor;
      }
      if (chart.options.scales?.x?.grid) {
        chart.options.scales.x.grid.color = colors.gridColor;
      }
      if (chart.options.scales?.y?.ticks) {
        chart.options.scales.y.ticks.color = colors.mutedColor;
      }
      if (chart.options.scales?.y?.grid) {
        chart.options.scales.y.grid.color = colors.gridColor;
      }
      if (chart.options.scales?.y?.title) {
        chart.options.scales.y.title.color = colors.mutedColor;
      }
    });

    if (riskChart.options.scales?.y1?.ticks) {
      riskChart.options.scales.y1.ticks.color = colors.mutedColor;
    }
    if (riskChart.options.scales?.y1?.title) {
      riskChart.options.scales.y1.title.color = colors.mutedColor;
    }

    if (assistantChart.options.plugins?.legend?.labels) {
      assistantChart.options.plugins.legend.labels.color = colors.textColor;
    }

    riskChart.update();
    experienceChart.update();
    assistantChart.update();
  }

  const themeSwitch = document.querySelector("#theme-switch");
  themeSwitch?.addEventListener("change", () => {
    window.setTimeout(refreshChartTheme, 0);
  });
}
