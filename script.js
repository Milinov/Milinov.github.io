// Загрузка данных из JSON
async function loadData() {
    try {
        const response = await fetch('data/data.json');
        const data = await response.json();
        renderData(data);
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

// Отрисовка данных на странице
function renderData(data) {
    // Шапка
    document.getElementById('headerName').textContent = data.siteSettings.name;
    document.getElementById('headerTitle').textContent = data.siteSettings.title;
    
    // О себе
    document.getElementById('aboutBio').textContent = data.about.bio;
    
    const specializationsContainer = document.getElementById('specializations');
    specializationsContainer.innerHTML = '';
    data.about.specializations.forEach(spec => {
        const tag = document.createElement('span');
        tag.className = 'specialization-tag';
        tag.textContent = spec;
        specializationsContainer.appendChild(tag);
    });
    
    const skillsContainer = document.getElementById('skills');
    skillsContainer.innerHTML = '';
    data.about.skills.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.textContent = skill;
        skillsContainer.appendChild(tag);
    });
    
    // Опыт работы
    const experienceContainer = document.getElementById('experience');
    experienceContainer.innerHTML = '';
    data.experience.forEach(item => {
        const expItem = document.createElement('div');
        expItem.className = 'timeline-item';
        expItem.innerHTML = `
            <div class="timeline-period">${item.period}</div>
            <div>
                <div class="timeline-company">${item.company}</div>
                <div class="timeline-position">${item.position}</div>
            </div>
        `;
        experienceContainer.appendChild(expItem);
    });
    
    // Проекты - С ПОЛНОЙ ПОДДЕРЖКОЙ ССЫЛОК
    const projectsContainer = document.getElementById('projects');
    projectsContainer.innerHTML = '';
    
    data.projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        // Проверяем, есть ли ссылка у проекта
        const hasLink = project.link && project.link.trim() !== '';
        
        // Создаём содержимое карточки
        const img = new Image();
        img.src = project.image;
        img.alt = project.title;
        img.className = 'project-image';
        
        img.onload = function() {
            // Изображение загрузилось успешно
            projectCard.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="project-image">
                <div class="project-content">
                    <span class="project-category">${project.category}</span>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    ${hasLink ? `
                        <a href="${project.link}" class="project-link" target="_blank" rel="noopener noreferrer">
                            ${project.linkText || 'Смотреть проект'}
                            <span class="project-link__arrow">→</span>
                        </a>
                    ` : ''}
                </div>
            `;
        };
        
        img.onerror = function() {
            // Ошибка загрузки изображения - показываем заглушку
            projectCard.innerHTML = `
                <div class="project-image-placeholder">
                    <span>📷 ${project.title}</span>
                </div>
                <div class="project-content">
                    <span class="project-category">${project.category}</span>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    ${hasLink ? `
                        <a href="${project.link}" class="project-link" target="_blank" rel="noopener noreferrer">
                            ${project.linkText || 'Смотреть проект'}
                            <span class="project-link__arrow">→</span>
                        </a>
                    ` : ''}
                </div>
            `;
        };
        
        projectsContainer.appendChild(projectCard);
    });
    
    // Контакты
    const contactsContainer = document.getElementById('contacts');
    contactsContainer.innerHTML = '';
    
    const contacts = [
        { icon: '✉️', text: data.contacts.email, link: `mailto:${data.contacts.email}` },
        { icon: '📞', text: data.contacts.phone, link: `tel:${data.contacts.phone}` },
        { icon: '🐙', text: `github.com/${data.contacts.github}`, link: `https://github.com/${data.contacts.github}` }
    ];
    
    contacts.forEach(contact => {
        const contactItem = document.createElement('div');
        contactItem.className = 'contact-item';
        contactItem.innerHTML = `
            <div class="contact-icon">${contact.icon}</div>
            <a href="${contact.link}" class="contact-text" target="_blank" rel="noopener noreferrer">${contact.text}</a>
        `;
        contactsContainer.appendChild(contactItem);
    });
    
    // Текущий год в подвале
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

// Переключение темы
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle.querySelector('.theme-toggle__icon');
    
    // Проверяем сохранённую тему
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme;
        icon.textContent = savedTheme === 'dark-theme' ? '🌙' : '☀️';
    }
    
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            icon.textContent = '☀️';
            localStorage.setItem('theme', 'light-theme');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            icon.textContent = '🌙';
            localStorage.setItem('theme', 'dark-theme');
        }
    });
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initThemeToggle();
});