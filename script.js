const projects = [
  {
    name: "Seed drying Robot",
    category: "Robotics",
    image: "assets/images/project-1.jpg",
    description:
      "A solar-powered field robot concept built for rugged movement and off-grid operation.",
  },
  {
    name: "Agrobot",
    category: "Automation",
    image: "assets/images/project-2.png",
    description:
      "Crop monitoring rover with autonomous navigation and data collection support.",
  },
  {
    name: "Automatic PH controlling system",
    category: "IoT",
    image: "assets/images/project-3.jpg",
    description:
      "Water-side automation and multi-sensor platform concept for connected monitoring.",
  },
  {
    name: "Weather Station",
    category: "Environmental tech",
    image: "assets/images/project-4.png",
    description:
      "Compact weather and sensing tower for durable outdoor measurement in practical setups.",
  },
  {
    name: "Custom Chassis for Robo",
    category: "Fabrication",
    image: "assets/images/project-5.png",
    description:
      "Custom metal chassis and mechanical prototype ready for motors, payloads, or tooling.",
  },
  {
    name: "NodeMcu ESP32",
    category: "Electronics",
    image: "assets/images/project-6.png",
    description:
      "Core embedded board setup for prototyping fast, compact, and dependable control layers.",
  },
  {
    name: "3D Printed STEM Kits",
    category: "Robotics",
    image: "assets/images/project-7.png",
    description:
      "Arm-and-workbench ecosystem for learning, testing, and assembling new automation ideas.",
  },
  {
    name: "D2C Orders Packaging",
    category: "Product design",
    image: "assets/images/project-8.jpg",
    description:
      "Direct-to-customer packaging and product presentation flow for small-batch delivery.",
  },
  {
    name: "Indoor Navigation System",
    category: "Digital tools",
    image: "assets/images/project-9.png",
    description:
      "App and interface concept for guided navigation, mapping, or on-device user support.",
  },
];

const projectsGrid = document.getElementById("projectsGrid");
const openContacts = document.getElementById("openContacts");
const openContactsSecondary = document.getElementById("openContactsSecondary");
const closeContacts = document.getElementById("closeContacts");
const contactsDrawer = document.getElementById("contactsDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const toast = document.getElementById("toast");
const inquiryForm = document.getElementById("inquiryForm");
const formStatus = document.getElementById("formStatus");
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

function wireThemeToggle() {
  const savedTheme = window.localStorage.getItem("techjiku-theme") || "light";
  applyTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem("techjiku-theme", nextTheme);
  });
}

function renderProjects() {
  projectsGrid.innerHTML = projects
    .map(
      (project) => `
        <article class="projects-card reveal">
          <div class="project-media">
            <img src="${project.image}" alt="${project.name}" />
          </div>
          <div class="project-body">
            <div class="project-kicker">${project.category}</div>
            <h3>${project.name}</h3>
            <p>${project.description}</p>
          </div>
        </article>
      `,
    )
    .join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

function openDrawer() {
  contactsDrawer.classList.add("open");
  contactsDrawer.setAttribute("aria-hidden", "false");
  drawerBackdrop.hidden = false;
}

function closeDrawer() {
  contactsDrawer.classList.remove("open");
  contactsDrawer.setAttribute("aria-hidden", "true");
  drawerBackdrop.hidden = true;
}

function observeReveals() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.15 },
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function wireContacts() {
  openContacts.addEventListener("click", openDrawer);
  openContactsSecondary.addEventListener("click", openDrawer);
  closeContacts.addEventListener("click", closeDrawer);
  drawerBackdrop.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDrawer();
    }
  });
}

async function submitForm(event) {
  event.preventDefault();

  const submitButton = inquiryForm.querySelector('button[type="submit"]');
  const originalLabel = submitButton.textContent;
  const formData = new FormData(inquiryForm);

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  formStatus.textContent = "";

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Something went wrong");
    }

    inquiryForm.reset();
    formStatus.textContent = "Message sent successfully.";
    showToast("Inquiry sent to Techjiku.");
  } catch (error) {
    formStatus.textContent = "Could not send right now. Please try again.";
    showToast("Submission failed. Check the Web3Forms access key.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalLabel;
  }
}

renderProjects();
observeReveals();
wireContacts();
wireThemeToggle();
inquiryForm.addEventListener("submit", submitForm);
