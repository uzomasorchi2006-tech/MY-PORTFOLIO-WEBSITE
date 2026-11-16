const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

const projectList = document.getElementById("project-list");
const projectFilters = document.getElementById("project-filters");
const projectPreview = document.getElementById("project-preview");
const previewImage = document.getElementById("preview-image");
const previewTitle = document.getElementById("preview-title");
const previewDescription = document.getElementById("preview-description");
const previewClose = document.querySelector(".preview-close");
const reviewsTrack = document.getElementById("reviews-track");
const reviewsEmpty = document.getElementById("reviews-empty");
const faqItems = document.querySelectorAll(".faq-item");
const contactForm = document.getElementById("contact-form");
const contactName = document.getElementById("contact-name");
const contactEmail = document.getElementById("contact-email");
const contactSubject = document.getElementById("contact-subject");
const contactMessage = document.getElementById("contact-message");
const sendEmailBtn = document.getElementById("send-email-btn");
const serviceLinks = document.querySelectorAll(".service-link");
const comparisonSliders = document.querySelectorAll("[data-comparison]");
const statCounters = document.querySelectorAll("[data-count]");

function displayCounterValue(counter, value) {
  counter.textContent = `${value}${counter.dataset.suffix || ""}`;
}

function animateCounter(counter) {
  const target = Number(counter.dataset.count);
  const duration = 1400;
  const startedAt = performance.now();

  function updateCounter(now) {
    const progress = Math.min((now - startedAt) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    displayCounterValue(counter, Math.floor(target * easedProgress));

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      displayCounterValue(counter, target);
    }
  }

  requestAnimationFrame(updateCounter);
}

if (statCounters.length) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    statCounters.forEach((counter) =>
      displayCounterValue(counter, Number(counter.dataset.count)),
    );
  } else {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.45 },
    );

    statCounters.forEach((counter) => {
      displayCounterValue(counter, 0);
      counterObserver.observe(counter);
    });
  }
}

let activeProjectCategory = "All";

const defaultProjects = [
  {
    id: 1,
    title: "Worship With Us Banner",
    category: "Church Flyer Design",
    description:
      "A warm, faith-centered event flyer created for a revival campaign with strong typography and meaningful color balance.",
    imageData: "ASSETS/SUMAS-BANNER.png",
  },
  {
    id: 2,
    title: "Ruth Charles Birthday Tribute",
    category: "Birthday Flyer",
    description:
      "A joyful birthday tribute flyer combining layered portraits, oversized typography, and a warm gold-and-green palette for Ruth Charles.",
    imageData: "ASSETS/20260702_005127-01.jpeg",
  },
  {
    id: 3,
    title: "Launch Event Branding",
    category: "Event Branding",
    description:
      "A polished event identity designed to unify print materials, signage, and promotional content for a brand launch.",
    imageData: "ASSETS/launch-event-branding.jpg",
  },
];

const projects = defaultProjects;

const defaultClientReviews = [
  {
    id: 1,
    name: "Grace M.",
    role: "Church Event Organizer",
    rating: 5,
    quote:
      "The team understood exactly what we wanted. Our church event flyer looked premium and got people talking even before the event began.",
  },
  {
    id: 2,
    name: "Daniel K.",
    role: "Birthday Party Host",
    rating: 5,
    quote:
      "The birthday flyer was energetic, elegant, and super easy to share. It helped create excitement around the celebration from day one.",
  },
  {
    id: 3,
    name: "Amara T.",
    role: "Event Brand Manager",
    rating: 5,
    quote:
      "Every visual felt intentional. The branding matched our event perfectly and gave our audience a strong first impression.",
  },
];
const clientReviews = defaultClientReviews;

function createReviewCard(review) {
  const card = document.createElement("article");
  card.className = "review-card";

  const stars = document.createElement("div");
  stars.className = "stars";
  stars.textContent = "\u2605".repeat(review.rating);
  stars.setAttribute("role", "img");
  stars.setAttribute("aria-label", `${review.rating} out of 5 stars`);

  const quote = document.createElement("p");
  quote.textContent = `"${review.quote}"`;

  const author = document.createElement("div");
  author.className = "review-author";

  const name = document.createElement("strong");
  name.textContent = review.name;

  const role = document.createElement("span");
  role.textContent = review.role;

  author.append(name, role);
  card.append(stars, quote, author);
  return card;
}

function renderReviews() {
  if (!reviewsTrack || !reviewsEmpty) return;

  reviewsTrack.replaceChildren();
  reviewsEmpty.classList.toggle("hidden", clientReviews.length > 0);
  reviewsTrack.classList.toggle("hidden", clientReviews.length === 0);
  if (clientReviews.length === 0) return;

  const primaryGroup = document.createElement("div");
  primaryGroup.className = "reviews-group";
  clientReviews.forEach((review) =>
    primaryGroup.append(createReviewCard(review)),
  );

  const duplicateGroup = primaryGroup.cloneNode(true);
  duplicateGroup.setAttribute("aria-hidden", "true");
  reviewsTrack.append(primaryGroup, duplicateGroup);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return replacements[character];
  });
}

function renderProjects() {
  if (!projectList) return;

  renderProjectFilters();

  if (projects.length === 0) {
    projectList.innerHTML =
      '<div class="empty-state">No projects yet. Add your first portfolio project.</div>';
    return;
  }

  const visibleProjects =
    activeProjectCategory === "All"
      ? projects
      : projects.filter(
          (project) => project.category === activeProjectCategory,
        );

  projectList.innerHTML = visibleProjects
    .map(
      (project) => `
        <article class="project-card">
            <button type="button" class="project-preview-trigger" data-action="preview" data-id="${project.id}" aria-label="View ${escapeHtml(project.title)} larger">
                <img src="${escapeHtml(project.imageData || "ASSETS/SUMAS-BANNER.png")}" alt="${escapeHtml(project.title)}" loading="lazy" decoding="async">
            </button>
            <div class="project-content">
                <span class="project-category">${escapeHtml(project.category || "Design Project")}</span>
                <h3>${escapeHtml(project.title)}</h3>
                <p>${escapeHtml(project.description)}</p>
            </div>
        </article>
    `,
    )
    .join("");

  if (visibleProjects.length === 0) {
    projectList.innerHTML =
      '<div class="empty-state">No projects in this category yet.</div>';
  }

  document.querySelectorAll('[data-action="preview"]').forEach((button) => {
    button.addEventListener("click", () => {
      const project = projects.find(
        (item) => item.id === Number(button.dataset.id),
      );
      if (!project || !projectPreview) return;

      previewImage.src = project.imageData || "ASSETS/SUMAS-BANNER.png";
      previewImage.alt = project.title;
      previewTitle.textContent = project.title;
      previewDescription.textContent = project.description;
      projectPreview.showModal();
    });
  });

}

function renderProjectFilters() {
  if (!projectFilters) return;

  const categories = [
    "All",
    ...new Set(projects.map((project) => project.category).filter(Boolean)),
  ];
  if (!categories.includes(activeProjectCategory))
    activeProjectCategory = "All";

  projectFilters.replaceChildren();
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className =
      category === activeProjectCategory
        ? "project-filter active"
        : "project-filter";
    button.textContent = category;
    button.setAttribute(
      "aria-pressed",
      String(category === activeProjectCategory),
    );
    button.addEventListener("click", () => {
      activeProjectCategory = category;
      renderProjects();
    });
    projectFilters.append(button);
  });
}

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  if (!button) return;

  button.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});

if (previewClose && projectPreview) {
  previewClose.addEventListener("click", () => projectPreview.close());
  projectPreview.addEventListener("click", (event) => {
    if (event.target === projectPreview) projectPreview.close();
  });
}

serviceLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (contactSubject) contactSubject.value = link.dataset.service || "";
  });
});

comparisonSliders.forEach((comparison) => {
  const slider = comparison.querySelector(".comparison-range");
  if (!slider) return;

  const updateComparison = () => {
    comparison.style.setProperty("--comparison-position", `${slider.value}%`);
  };

  slider.addEventListener("input", updateComparison);
  updateComparison();
});

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = contactName.value.trim();
    const email = contactEmail.value.trim();
    const subject = contactSubject.value.trim();
    const message = contactMessage.value.trim();

    if (!name || !email || !subject || !message) {
      alert("Please complete all fields before sending your message.");
      return;
    }

    const whatsappText = `Hello, my name is ${name}. Email: ${email}. Project type: ${subject}. Message: ${message}`;
    const whatsappUrl = `https://wa.me/EmmanuelVictorious?text=${encodeURIComponent(whatsappText)}`;
    window.open(whatsappUrl, "_blank");
  });
}

if (sendEmailBtn) {
  sendEmailBtn.addEventListener("click", () => {
    const name = contactName.value.trim();
    const email = contactEmail.value.trim();
    const subject = contactSubject.value.trim();
    const message = contactMessage.value.trim();

    if (!name || !email || !subject || !message) {
      alert("Please complete all fields before sending your email.");
      return;
    }

    const mailto = `mailto:uzomasorchi2006@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AProject: ${subject}%0D%0A%0D%0AMessage:%0D%0A${message}`)}`;
    window.location.href = mailto;
  });
}

renderProjects();
renderReviews();
