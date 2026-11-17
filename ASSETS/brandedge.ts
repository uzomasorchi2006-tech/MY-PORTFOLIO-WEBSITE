const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

const projectList = document.getElementById('project-list');
const projectFilters = document.getElementById('project-filters');
const projectPreview = document.getElementById('project-preview');
const previewImage = document.getElementById('preview-image');
const previewTitle = document.getElementById('preview-title');
const previewDescription = document.getElementById('preview-description');
const previewClose = document.querySelector('.preview-close');
const faqItems = document.querySelectorAll('.faq-item');
const contactForm = document.getElementById('contact-form');
const contactName = document.getElementById('contact-name');
const contactEmail = document.getElementById('contact-email');
const contactSubject = document.getElementById('contact-subject');
const contactMessage = document.getElementById('contact-message');
const sendEmailBtn = document.getElementById('send-email-btn');
const serviceLinks = document.querySelectorAll('.service-link');
const comparisonSliders = document.querySelectorAll('[data-comparison]');

let activeProjectCategory = 'All';

const projects = [
    {
        id: 1,
        title: 'Church Revival Poster',
        category: 'Church Flyer Design',
        description: 'A warm, faith-centered event flyer created for a revival campaign with strong typography and meaningful color balance.',
        imageData: 'ASSETS/studio-workspace.jpg'
    },
    {
        id: 2,
        title: 'Birthday Glow Night',
        category: 'Birthday Flyer',
        description: 'A lively and celebratory flyer focused on mood, color, and social sharing appeal for a birthday event.',
        imageData: 'ASSETS/birthday-glow-night.jpg'
    },
    {
        id: 3,
        title: 'Launch Event Branding',
        category: 'Event Branding',
        description: 'A polished event identity designed to unify print materials, signage, and promotional content for a brand launch.',
        imageData: 'ASSETS/launch-event-branding.jpg'
    }
];

function renderProjects() {
    if (!projectList) return;

    renderProjectFilters();

    if (projects.length === 0) {
        projectList.innerHTML = '<div class="empty-state">No projects yet. Add your first portfolio project.</div>';
        return;
    }

    const visibleProjects = activeProjectCategory === 'All'
        ? projects
        : projects.filter(project => project.category === activeProjectCategory);

    projectList.innerHTML = visibleProjects.map(project => `
        <article class="project-card">
            <button type="button" class="project-preview-trigger" data-action="preview" data-id="${project.id}" aria-label="View ${project.title} larger">
                <img src="${project.imageData || 'ASSETS/SUMAS-BANNER.png'}" alt="${project.title}">
            </button>
            <div class="project-content">
                <span class="project-category">${project.category || 'Design Project'}</span>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
            </div>
        </article>
    `).join('');

    if (visibleProjects.length === 0) {
        projectList.innerHTML = '<div class="empty-state">No projects in this category yet.</div>';
    }

    document.querySelectorAll('[data-action="preview"]').forEach(button => {
        button.addEventListener('click', () => {
            const project = projects.find(item => item.id === Number(button.dataset.id));
            if (!project || !projectPreview) return;

            previewImage.src = project.imageData || 'ASSETS/SUMAS-BANNER.png';
            previewImage.alt = project.title;
            previewTitle.textContent = project.title;
            previewDescription.textContent = project.description;
            projectPreview.showModal();
        });
    });
}

function renderProjectFilters() {
    if (!projectFilters) return;

    const categories = ['All', ...new Set(projects.map(project => project.category).filter(Boolean))];
    if (!categories.includes(activeProjectCategory)) activeProjectCategory = 'All';

    projectFilters.replaceChildren();
    categories.forEach(category => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = category === activeProjectCategory ? 'project-filter active' : 'project-filter';
        button.textContent = category;
        button.setAttribute('aria-pressed', String(category === activeProjectCategory));
        button.addEventListener('click', () => {
            activeProjectCategory = category;
            renderProjects();
        });
        projectFilters.append(button);
    });
}

faqItems.forEach(item => {
    const button = item.querySelector('.faq-question');
    if (!button) return;

    button.addEventListener('click', () => {
        item.classList.toggle('active');
    });
});

if (previewClose && projectPreview) {
    previewClose.addEventListener('click', () => projectPreview.close());
    projectPreview.addEventListener('click', event => {
        if (event.target === projectPreview) projectPreview.close();
    });
}

serviceLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (contactSubject) contactSubject.value = link.dataset.service || '';
    });
});

comparisonSliders.forEach(comparison => {
    const slider = comparison.querySelector('.comparison-range');
    if (!slider) return;

    const updateComparison = () => {
        comparison.style.setProperty('--comparison-position', `${slider.value}%`);
    };

    slider.addEventListener('input', updateComparison);
    updateComparison();
});

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = contactName.value.trim();
        const email = contactEmail.value.trim();
        const subject = contactSubject.value.trim();
        const message = contactMessage.value.trim();

        if (!name || !email || !subject || !message) {
            alert('Please complete all fields before sending your message.');
            return;
        }

        const whatsappText = `Hello, my name is ${name}. Email: ${email}. Project type: ${subject}. Message: ${message}`;
        const whatsappUrl = `https://wa.me/EmmanuelVictorious?text=${encodeURIComponent(whatsappText)}`;
        window.open(whatsappUrl, '_blank');
    });
}

if (sendEmailBtn) {
    sendEmailBtn.addEventListener('click', () => {
        const name = contactName.value.trim();
        const email = contactEmail.value.trim();
        const subject = contactSubject.value.trim();
        const message = contactMessage.value.trim();

        if (!name || !email || !subject || !message) {
            alert('Please complete all fields before sending your email.');
            return;
        }

        const mailto = `mailto:uzomasorchi2006@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AProject: ${subject}%0D%0A%0D%0AMessage:%0D%0A${message}`)}`;
        window.location.href = mailto;
    });
}

renderProjects();
