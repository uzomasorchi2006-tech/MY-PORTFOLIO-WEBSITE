const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

const projectForm = document.getElementById("project-form");
const projectList = document.getElementById("project-list");
const projectFilters = document.getElementById("project-filters");
const projectPreview = document.getElementById("project-preview");
const previewImage = document.getElementById("preview-image");
const previewTitle = document.getElementById("preview-title");
const previewDescription = document.getElementById("preview-description");
const previewClose = document.querySelector(".preview-close");
const projectTitle = document.getElementById("project-title");
const projectCategory = document.getElementById("project-category");
const projectDescription = document.getElementById("project-description");
const projectImage = document.getElementById("project-image");
const projectIdInput = document.getElementById("project-id");
const imagePreview = document.getElementById("image-preview");
const showProjectFormBtn = document.getElementById("show-project-form");
const cancelEditBtn = document.getElementById("cancel-edit");
const adminToggleBtn = document.getElementById("admin-toggle");
const adminLoginPanel = document.getElementById("admin-login-panel");
const adminPasswordInput = document.getElementById("admin-password");
const adminLoginBtn = document.getElementById("admin-login-btn");
const adminDashboard = document.getElementById("admin-dashboard");
const adminMessage = document.getElementById("admin-message");
const adminLogoutBtn = document.getElementById("admin-logout");
const reviewForm = document.getElementById("review-form");
const reviewIdInput = document.getElementById("review-id");
const reviewNameInput = document.getElementById("review-name");
const reviewRoleInput = document.getElementById("review-role");
const reviewRatingInput = document.getElementById("review-rating");
const reviewQuoteInput = document.getElementById("review-quote");
const showReviewFormBtn = document.getElementById("show-review-form");
const cancelReviewEditBtn = document.getElementById("cancel-review-edit");
const reviewAdminMessage = document.getElementById("review-admin-message");
const reviewAdminList = document.getElementById("review-admin-list");
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

const ADMIN_PASSWORD = "brandedge123";
let currentImageData = "";
let isAdmin = false;
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

const PROJECT_STORAGE_KEY = "brandedge-portfolio-projects";

function isValidProject(project) {
  return (
    project &&
    Number.isSafeInteger(project.id) &&
    project.id > 0 &&
    typeof project.title === "string" &&
    typeof project.category === "string" &&
    typeof project.description === "string" &&
    typeof project.imageData === "string"
  );
}

function loadProjects() {
  try {
    const savedProjects = localStorage.getItem(PROJECT_STORAGE_KEY);
    if (savedProjects === null) return defaultProjects;

    const storedData = JSON.parse(savedProjects);
    const parsedProjects = Array.isArray(storedData)
      ? storedData
      : storedData?.projects;
    const deletedDefaultProjectIds = Array.isArray(storedData)
      ? []
      : storedData?.deletedDefaultProjectIds;
    if (
      !Array.isArray(parsedProjects) ||
      !parsedProjects.every(isValidProject)
    ) {
      throw new Error("Saved project data has an invalid format.");
    }
    if (
      !Array.isArray(deletedDefaultProjectIds) ||
      !deletedDefaultProjectIds.every(Number.isSafeInteger)
    ) {
      throw new Error("Saved deleted-project data has an invalid format.");
    }

    const savedProjectsById = new Map(
      parsedProjects.map((project) => [project.id, project]),
    );
    const defaultProjectIds = new Set(
      defaultProjects.map((project) => project.id),
    );
    const deletedIds = new Set(deletedDefaultProjectIds);
    const mergedDefaults = defaultProjects
      .filter((project) => !deletedIds.has(project.id))
      .map((project) => {
        const savedProject = savedProjectsById.get(project.id);
        if (
          project.id === 2 &&
          savedProject?.imageData === "ASSETS/birthday-glow-night.jpg"
        ) {
          return { ...savedProject, imageData: project.imageData };
        }
        return savedProject || project;
      });
    const savedCustomProjects = parsedProjects.filter(
      (project) => !defaultProjectIds.has(project.id),
    );

    return [...mergedDefaults, ...savedCustomProjects];
  } catch (error) {
    console.error("Could not load saved projects.", error);
    return defaultProjects;
  }
}

let projects = loadProjects();

function persistProjects(nextProjects) {
  try {
    const deletedDefaultProjectIds = defaultProjects
      .filter((project) => !nextProjects.some((item) => item.id === project.id))
      .map((project) => project.id);
    localStorage.setItem(
      PROJECT_STORAGE_KEY,
      JSON.stringify({ projects: nextProjects, deletedDefaultProjectIds }),
    );
    return true;
  } catch (error) {
    console.error("Could not save portfolio projects.", error);
    alert(
      "This project could not be saved in this browser. Storage may be full or unavailable. Try a smaller image and save again.",
    );
    return false;
  }
}

const REVIEW_STORAGE_KEY = "brandedge-client-reviews";
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

function isValidClientReview(review) {
  return (
    review &&
    Number.isSafeInteger(review.id) &&
    review.id > 0 &&
    typeof review.name === "string" &&
    review.name.trim() &&
    typeof review.role === "string" &&
    review.role.trim() &&
    typeof review.quote === "string" &&
    review.quote.trim() &&
    Number.isInteger(review.rating) &&
    review.rating >= 1 &&
    review.rating <= 5
  );
}

function loadClientReviews() {
  try {
    const savedReviews = localStorage.getItem(REVIEW_STORAGE_KEY);
    if (savedReviews === null) return defaultClientReviews;

    const parsedReviews = JSON.parse(savedReviews);
    if (
      !Array.isArray(parsedReviews) ||
      !parsedReviews.every(isValidClientReview)
    ) {
      throw new Error("Saved review data has an invalid format.");
    }

    return parsedReviews;
  } catch (error) {
    console.error("Could not load saved client reviews.", error);
    if (reviewAdminMessage) {
      reviewAdminMessage.textContent =
        "Saved reviews could not be loaded. Check browser storage before making changes.";
    }
    return defaultClientReviews;
  }
}

let clientReviews = loadClientReviews();

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

function renderReviewAdminList() {
  if (!reviewAdminList) return;

  reviewAdminList.replaceChildren();
  if (!isAdmin) return;

  if (clientReviews.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "review-admin-empty";
    emptyMessage.textContent = "No reviews yet. Add your first client review.";
    reviewAdminList.append(emptyMessage);
    return;
  }

  clientReviews.forEach((review) => {
    const item = document.createElement("article");
    item.className = "review-admin-item";

    const details = document.createElement("div");
    details.className = "review-admin-details";

    const author = document.createElement("strong");
    author.textContent = `${review.name} · ${review.role}`;

    const quote = document.createElement("p");
    quote.textContent = review.quote;

    const rating = document.createElement("span");
    rating.className = "review-admin-rating";
    rating.textContent = `${review.rating} of 5 stars`;

    const actions = document.createElement("div");
    actions.className = "review-admin-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "secondary-btn";
    editButton.dataset.action = "edit-review";
    editButton.dataset.id = String(review.id);
    editButton.textContent = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "secondary-btn";
    deleteButton.dataset.action = "delete-review";
    deleteButton.dataset.id = String(review.id);
    deleteButton.textContent = "Delete";

    details.append(author, quote, rating);
    actions.append(editButton, deleteButton);
    item.append(details, actions);
    reviewAdminList.append(item);
  });
}

function persistClientReviews(nextReviews) {
  try {
    localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(nextReviews));
    return true;
  } catch (error) {
    console.error("Could not save client reviews.", error);
    reviewAdminMessage.textContent =
      "Reviews could not be saved in this browser. Check storage permissions and try again.";
    return false;
  }
}

function commitClientReviews(nextReviews, successMessage) {
  if (!persistClientReviews(nextReviews)) return false;

  clientReviews = nextReviews;
  renderReviews();
  renderReviewAdminList();
  reviewAdminMessage.textContent = successMessage;
  return true;
}

function resetReviewForm() {
  reviewForm?.reset();
  if (reviewIdInput) reviewIdInput.value = "";
  reviewForm?.classList.add("hidden");
}

function setAdminState(nextState) {
  isAdmin = nextState;
  adminDashboard?.classList.toggle("hidden", !isAdmin);
  showProjectFormBtn?.classList.toggle("hidden", !isAdmin);
  if (!isAdmin) {
    projectForm?.classList.add("hidden");
    resetReviewForm();
    adminLoginPanel?.classList.add("hidden");
    adminMessage.textContent = "";
    adminPasswordInput.value = "";
  } else {
    renderReviewAdminList();
  }
}

function resetForm() {
  projectForm.reset();
  projectIdInput.value = "";
  currentImageData = "";
  imagePreview.src = "";
  imagePreview.classList.add("hidden");
  projectForm.classList.add("hidden");
}

function openForm() {
  projectForm.classList.remove("hidden");
  window.scrollTo({
    top: projectForm.offsetTop - 30,
    behavior: "smooth",
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
            <button type="button" class="project-preview-trigger" data-action="preview" data-id="${project.id}" aria-label="View ${project.title} larger">
                <img src="${project.imageData || "ASSETS/SUMAS-BANNER.png"}" alt="${project.title}">
            </button>
            <div class="project-content">
                <span class="project-category">${project.category || "Design Project"}</span>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                ${
                  isAdmin
                    ? `
                    <div class="project-actions">
                        <button type="button" data-action="edit" data-id="${project.id}">Edit</button>
                        <button type="button" data-action="delete" data-id="${project.id}">Delete</button>
                    </div>
                `
                    : ""
                }
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

  if (!isAdmin) return;

  document.querySelectorAll('[data-action="edit"]').forEach((button) => {
    button.addEventListener("click", () => {
      const project = projects.find(
        (item) => item.id === Number(button.dataset.id),
      );
      if (!project) return;

      projectIdInput.value = project.id;
      projectTitle.value = project.title;
      projectCategory.value = project.category;
      projectDescription.value = project.description;
      currentImageData = project.imageData;

      if (project.imageData) {
        imagePreview.src = project.imageData;
        imagePreview.classList.remove("hidden");
      }

      openForm();
    });
  });

  document.querySelectorAll('[data-action="delete"]').forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      const projectIndex = projects.findIndex((item) => item.id === id);

      if (projectIndex !== -1) {
        const confirmDelete = confirm("Delete this project?");
        if (confirmDelete) {
          const nextProjects = projects.filter((item) => item.id !== id);
          if (persistProjects(nextProjects)) {
            projects = nextProjects;
            renderProjects();
          }
        }
      }
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

if (showProjectFormBtn) {
  showProjectFormBtn.addEventListener("click", () => {
    projectForm.classList.remove("hidden");
    projectTitle.focus();
  });
}

if (cancelEditBtn) {
  cancelEditBtn.addEventListener("click", () => {
    resetForm();
  });
}

if (projectImage) {
  projectImage.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      currentImageData = reader.result;
      imagePreview.src = reader.result;
      imagePreview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });
}

if (projectForm) {
  projectForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = projectTitle.value.trim();
    const category = projectCategory.value.trim();
    const description = projectDescription.value.trim();

    if (!title || !category || !description) {
      alert("Please complete the title, category, and description.");
      return;
    }

    const imageSource = currentImageData || "ASSETS/SUMAS-BANNER.png";

    let nextProjects;
    if (projectIdInput.value) {
      const projectId = Number(projectIdInput.value);
      nextProjects = projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              title,
              category,
              description,
              imageData: imageSource,
            }
          : project,
      );
    } else {
      nextProjects = [
        ...projects,
        {
          id: Date.now(),
          title,
          category,
          description,
          imageData: imageSource,
        },
      ];
    }

    if (!persistProjects(nextProjects)) return;
    projects = nextProjects;
    renderProjects();
    resetForm();
  });
}

if (showReviewFormBtn && reviewForm) {
  showReviewFormBtn.addEventListener("click", () => {
    resetReviewForm();
    reviewForm.classList.remove("hidden");
    reviewNameInput.focus();
  });
}

if (cancelReviewEditBtn) {
  cancelReviewEditBtn.addEventListener("click", resetReviewForm);
}

if (reviewForm) {
  reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = reviewNameInput.value.trim();
    const role = reviewRoleInput.value.trim();
    const quote = reviewQuoteInput.value.trim();
    const rating = Number(reviewRatingInput.value);
    if (
      !name ||
      !role ||
      !quote ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      reviewAdminMessage.textContent =
        "Enter the client name, role, review, and a rating from 1 to 5.";
      return;
    }

    const editingId = Number(reviewIdInput.value);
    let nextReviews;
    let successMessage;
    if (editingId) {
      const currentReview = clientReviews.find(
        (review) => review.id === editingId,
      );
      if (!currentReview) {
        reviewAdminMessage.textContent =
          "That review could not be found. Refresh the dashboard and try again.";
        return;
      }

      nextReviews = clientReviews.map((review) =>
        review.id === editingId
          ? { ...review, name, role, quote, rating }
          : review,
      );
      successMessage = "Review updated.";
    } else {
      const id =
        clientReviews.reduce(
          (highestId, review) => Math.max(highestId, review.id),
          0,
        ) + 1;
      nextReviews = [...clientReviews, { id, name, role, quote, rating }];
      successMessage = "Review added.";
    }

    if (commitClientReviews(nextReviews, successMessage)) {
      resetReviewForm();
    }
  });
}

if (reviewAdminList) {
  reviewAdminList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button || !isAdmin) return;

    const reviewId = Number(button.dataset.id);
    const review = clientReviews.find((item) => item.id === reviewId);
    if (!review) {
      reviewAdminMessage.textContent =
        "That review could not be found. Refresh the dashboard and try again.";
      return;
    }

    if (button.dataset.action === "edit-review") {
      reviewIdInput.value = String(review.id);
      reviewNameInput.value = review.name;
      reviewRoleInput.value = review.role;
      reviewRatingInput.value = String(review.rating);
      reviewQuoteInput.value = review.quote;
      reviewForm.classList.remove("hidden");
      reviewAdminMessage.textContent = `Editing ${review.name}'s review.`;
      reviewNameInput.focus();
      return;
    }

    if (button.dataset.action === "delete-review") {
      if (!confirm(`Delete the review from ${review.name}?`)) return;

      const nextReviews = clientReviews.filter((item) => item.id !== review.id);
      commitClientReviews(nextReviews, "Review deleted.");
    }
  });
}

if (adminToggleBtn) {
  adminToggleBtn.addEventListener("click", () => {
    adminLoginPanel?.classList.toggle("hidden");
    adminPasswordInput?.focus();
  });
}

if (adminLoginBtn) {
  adminLoginBtn.addEventListener("click", () => {
    const password = adminPasswordInput.value.trim();

    if (password === ADMIN_PASSWORD) {
      setAdminState(true);
      adminLoginPanel?.classList.add("hidden");
      adminMessage.textContent = "Welcome back, admin.";
      renderProjects();
      renderReviewAdminList();
    } else {
      adminMessage.textContent = "Incorrect password. Try again.";
    }
  });
}

if (adminLogoutBtn) {
  adminLogoutBtn.addEventListener("click", () => {
    setAdminState(false);
    adminLoginPanel?.classList.remove("hidden");
    adminPasswordInput?.focus();
    renderProjects();
    renderReviewAdminList();
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

setAdminState(false);
renderProjects();
renderReviews();
