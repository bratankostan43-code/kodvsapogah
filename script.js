// script.js - Полная версия с профилем, тестированием и регистрацией

// Хранилище пользователей
let users = JSON.parse(localStorage.getItem('users')) || [];

// Вопросы для тестирования
const testQuestions = [
  {
    question: "Сколько тебе лет?",
    options: ["6 лет или меньше", "7-9 лет", "10-12 лет", "13-15 лет", "16 лет или больше"],
    scores: [0, 1, 2, 3, 3]
  },
  {
    question: "Играл(а) ли ты в компьютерные игры?",
    options: ["Нет, не играл(а)", "Да, иногда", "Да, часто", "Да, очень много"],
    scores: [0, 1, 2, 3]
  },
  {
    question: "Хотел(а) бы ты создавать свои игры или сайты?",
    options: ["Нет, не интересно", "Может быть", "Да, очень хочу!", "Уже пробовал(а) создавать"],
    scores: [0, 1, 2, 3]
  },
  {
    question: "Как у тебя с математикой и логикой?",
    options: ["Сложновато", "Нормально", "Хорошо", "Отлично, люблю решать задачи"],
    scores: [0, 1, 2, 3]
  },
  {
    question: "Есть ли у тебя опыт работы с компьютером?",
    options: ["Почти нет", "Немного", "Хорошо разбираюсь", "Отлично, умею многое"],
    scores: [0, 1, 2, 3]
  },
  {
    question: "Что тебе интереснее всего?",
    options: ["Рисовать и творить", "Решать головоломки", "Создавать игры", "Придумывать сайты и приложения"],
    scores: [1, 2, 3, 3]
  },
  {
    question: "Сколько времени готов(а) уделять обучению в неделю?",
    options: ["Меньше часа", "1-2 часа", "2-4 часа", "4 и более часов"],
    scores: [0, 1, 2, 3]
  },
  {
    question: "Что ты хочешь получить от курсов?",
    options: ["Новые знания", "Создать свой проект", "Подготовку к будущей профессии", "Просто интересно"],
    scores: [1, 2, 3, 1]
  }
];

// Функция для определения курса по результатам теста
function determineCourse(scores) {
  let totalScore = 0;
  for (let i = 0; i < scores.length; i++) {
    totalScore += scores[i];
  }
  
  const maxScore = testQuestions.reduce((sum, q, i) => sum + Math.max(...q.scores), 0);
  const percentage = (totalScore / maxScore) * 100;
  
  let recommendedCourse = {
    ageGroup: "",
    courseName: "",
    description: "",
    icon: ""
  };
  
  if (percentage < 30) {
    recommendedCourse = {
      ageGroup: "7-9 лет",
      courseName: "Scratch Junior",
      description: "Визуальное программирование в игровой форме. Создавай мультфильмы и простые игры!",
      icon: "fas fa-puzzle-piece"
    };
  } else if (percentage < 60) {
    recommendedCourse = {
      ageGroup: "7-12 лет",
      courseName: "Scratch + Minecraft",
      description: "Создание игр в Minecraft и программирование в Scratch. Развиваем логику и креативность!",
      icon: "fas fa-cubes"
    };
  } else if (percentage < 80) {
    recommendedCourse = {
      ageGroup: "10-14 лет",
      courseName: "Python для начинающих",
      description: "Первый текстовый язык программирования. Создавай чат-ботов, игры и полезные программы!",
      icon: "fab fa-python"
    };
  } else {
    recommendedCourse = {
      ageGroup: "12-15 лет",
      courseName: "Web-разработка",
      description: "Создавай сайты и веб-приложения. HTML, CSS, JavaScript — твой путь в IT!",
      icon: "fab fa-js"
    };
  }
  
  return {
    recommendedCourse,
    score: Math.round(percentage),
    totalScore,
    maxScore
  };
}

// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  
  // Получаем все элементы
  const homePage = document.getElementById('homePage');
  const coursesPage = document.getElementById('coursesPage');
  const profilePage = document.getElementById('profilePage');
  const registerModal = document.getElementById('registerModal');
  const loginModal = document.getElementById('loginModal');
  const testModal = document.getElementById('testModal');
  const registerBtnNav = document.getElementById('registerBtnNav');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtnHeader = document.getElementById('logoutBtnHeader');
  const profileLink = document.getElementById('profileLink');
  const userInfo = document.getElementById('userInfo');
  const guestInfo = document.getElementById('guestInfo');
  const userNameHeader = document.getElementById('userNameHeader');
  const startTestBtn = document.getElementById('startTestBtn');
  
  // Функция переключения страниц
  function switchPage(pageId) {
    if (homePage) homePage.classList.remove('active');
    if (coursesPage) coursesPage.classList.remove('active');
    if (profilePage) profilePage.classList.remove('active');
    
    if (pageId === 'home' && homePage) homePage.classList.add('active');
    else if (pageId === 'courses' && coursesPage) coursesPage.classList.add('active');
    else if (pageId === 'profile' && profilePage) {
      profilePage.classList.add('active');
      updateProfileData();
    }
  }
  
  // Обработка навигации
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = link.getAttribute('data-page');
      if (pageId) switchPage(pageId);
    });
  });
  
  // Курсы ссылка на главной
  const coursesLink = document.querySelector('.course-link');
  if (coursesLink) {
    coursesLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchPage('courses');
    });
  }
  
  // Открытие модальных окон
  if (registerBtnNav) {
    registerBtnNav.addEventListener('click', (e) => {
      e.preventDefault();
      if (registerModal) registerModal.style.display = 'block';
    });
  }
  
  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginModal) loginModal.style.display = 'block';
    });
  }
  
  // Закрытие модальных окон
  document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', () => {
      if (registerModal) registerModal.style.display = 'none';
      if (loginModal) loginModal.style.display = 'none';
      if (testModal) testModal.style.display = 'none';
    });
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === registerModal) registerModal.style.display = 'none';
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === testModal) testModal.style.display = 'none';
  });
  
  // Переключение между формами
  const switchToLogin = document.getElementById('switchToLogin');
  const switchToRegister = document.getElementById('switchToRegister');
  
  if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      if (registerModal) registerModal.style.display = 'none';
      if (loginModal) loginModal.style.display = 'block';
    });
  }
  
  if (switchToRegister) {
    switchToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginModal) loginModal.style.display = 'none';
      if (registerModal) registerModal.style.display = 'block';
    });
  }
  
  // Регистрация
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      if (!username || !password) {
        showNotification('❌ Пожалуйста, заполните все поля!', 'error');
        return;
      }
      
      if (username.length < 3) {
        showNotification('❌ Логин должен содержать минимум 3 символа!', 'error');
        return;
      }
      
      if (password.length < 4) {
        showNotification('❌ Пароль должен содержать минимум 4 символа!', 'error');
        return;
      }
      
      if (password !== confirmPassword) {
        showNotification('❌ Пароли не совпадают!', 'error');
        return;
      }
      
      if (users.find(u => u.username === username)) {
        showNotification('❌ Пользователь с таким логином уже существует!', 'error');
        return;
      }
      
      users.push({ 
        username, 
        password,
        joinDate: new Date().toLocaleDateString(),
        courses: [],
        completedLessons: 0,
        totalHours: 0,
        completedCourses: 0
      });
      localStorage.setItem('users', JSON.stringify(users));
      
      showNotification('✅ Регистрация успешна! Теперь войдите в аккаунт.', 'success');
      registerForm.reset();
      if (registerModal) registerModal.style.display = 'none';
      if (loginModal) loginModal.style.display = 'block';
    });
  }
  
  // Вход
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;
      
      if (!username || !password) {
        showNotification('❌ Пожалуйста, заполните все поля!', 'error');
        return;
      }
      
      const user = users.find(u => u.username === username && u.password === password);
      
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify({ username: user.username }));
        showNotification(`🎉 Добро пожаловать, ${username}!`, 'success');
        loginForm.reset();
        if (loginModal) loginModal.style.display = 'none';
        checkAuth();
        
        const selectedCourse = sessionStorage.getItem('selectedCourse');
        if (selectedCourse) {
          sessionStorage.removeItem('selectedCourse');
          setTimeout(() => {
            showNotification(`🎓 Вы успешно записались на курс "${selectedCourse}"!`, 'success');
          }, 500);
        }
      } else {
        showNotification('❌ Неверный логин или пароль!', 'error');
      }
    });
  }
  
  // Запись на курсы
  document.querySelectorAll('.course-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const courseCard = btn.closest('.age-card');
      const courseName = courseCard.querySelector('h3').innerText;
      const courseDescription = courseCard.querySelector('p').innerText;
      
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      if (!currentUser) {
        sessionStorage.setItem('selectedCourse', courseName);
        showNotification(`🔐 Чтобы записаться на курс "${courseName}", войдите в аккаунт`, 'warning');
        if (loginModal) loginModal.style.display = 'block';
        return;
      }
      
      const userIndex = users.findIndex(u => u.username === currentUser.username);
      if (userIndex !== -1) {
        if (!users[userIndex].courses) users[userIndex].courses = [];
        
        const alreadyEnrolled = users[userIndex].courses.some(c => c.name === courseName);
        if (!alreadyEnrolled) {
          users[userIndex].courses.push({
            name: courseName,
            description: courseDescription,
            date: new Date().toLocaleString(),
            progress: 0
          });
          localStorage.setItem('users', JSON.stringify(users));
          showNotification(`🎓 Вы записались на курс "${courseName}"!`, 'success');
          
          if (profilePage && profilePage.classList.contains('active')) {
            updateProfileData();
          }
        } else {
          showNotification(`📚 Вы уже записаны на курс "${courseName}"!`, 'info');
        }
      }
    });
  });
  
  // Выход
  if (logoutBtnHeader) {
    logoutBtnHeader.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      showNotification('👋 Вы вышли из аккаунта', 'info');
      checkAuth();
      switchPage('home');
    });
  }
  
  // Обновление данных профиля
  function updateProfileData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const user = users.find(u => u.username === currentUser.username);
    if (!user) return;
    
    const profileUsername = document.getElementById('profileUsername');
    const joinDateSpan = document.getElementById('joinDate');
    const coursesCountEl = document.getElementById('coursesCount');
    const completedLessonsEl = document.getElementById('completedLessons');
    const totalHoursEl = document.getElementById('totalHours');
    const coursesList = document.getElementById('userCoursesList');
    const overallProgressSpan = document.getElementById('overallProgress');
    const overallProgressBar = document.getElementById('overallProgressBar');
    const activityLevel = document.getElementById('activityLevel');
    const activityBar = document.getElementById('activityBar');
    
    if (profileUsername) profileUsername.textContent = user.username;
    if (joinDateSpan) joinDateSpan.textContent = user.joinDate || new Date().toLocaleDateString();
    
    const coursesCount = user.courses ? user.courses.length : 0;
    const completedLessons = user.completedLessons || 0;
    const totalHours = user.totalHours || 0;
    
    if (coursesCountEl) coursesCountEl.textContent = coursesCount;
    if (completedLessonsEl) completedLessonsEl.textContent = completedLessons;
    if (totalHoursEl) totalHoursEl.textContent = totalHours;
    
    if (coursesList) {
      if (user.courses && user.courses.length > 0) {
        coursesList.innerHTML = user.courses.map(course => `
          <div class="course-item">
            <h4>${course.name}</h4>
            <p>${course.description}</p>
            <div class="course-date">📅 Записан: ${course.date}</div>
          </div>
        `).join('');
      } else {
        coursesList.innerHTML = '<p class="empty-message">📚 У вас пока нет записей на курсы. Перейдите в раздел "Курсы" и запишитесь на обучение!</p>';
      }
    }
    
    const overallProgressValue = coursesCount > 0 ? Math.min(Math.floor((completedLessons / (coursesCount * 10)) * 100), 100) : 0;
    if (overallProgressSpan) overallProgressSpan.textContent = overallProgressValue + '%';
    if (overallProgressBar) overallProgressBar.style.width = overallProgressValue + '%';
    
    let activityValue = 0;
    let activityText = 'Низкая 🌱';
    if (coursesCount > 0) {
      activityValue = Math.min(Math.floor((completedLessons / (coursesCount * 10)) * 100), 100);
      if (activityValue >= 70) activityText = 'Высокая 🔥';
      else if (activityValue >= 30) activityText = 'Средняя 📈';
    }
    if (activityLevel) activityLevel.textContent = activityText;
    if (activityBar) activityBar.style.width = activityValue + '%';
    
    // Достижения
    const achievementsList = document.getElementById('achievementsList');
    if (achievementsList) {
      const achievements = [
        { name: 'Первый шаг', desc: 'Записаться на первый курс', icon: 'fa-star', condition: coursesCount >= 1 },
        { name: 'Юный программист', desc: 'Пройдите 5 уроков', icon: 'fa-code', condition: completedLessons >= 5 },
        { name: 'Взлет', desc: 'Завершите 3 курса', icon: 'fa-rocket', condition: (user.completedCourses || 0) >= 3 }
      ];
      
      achievementsList.innerHTML = achievements.map(ach => `
        <div class="achievement-item ${ach.condition ? 'unlocked' : 'locked'}">
          <i class="fas ${ach.icon}"></i>
          <div class="achievement-info">
            <h4>${ach.name}</h4>
            <p>${ach.desc}</p>
            ${ach.condition ? '<span style="color: #fbbf24; font-size: 0.8rem;">✓ Получено!</span>' : ''}
          </div>
        </div>
      `).join('');
    }
    
    // Рекомендованный курс
    const recommendedDiv = document.getElementById('recommendedCourse');
    if (recommendedDiv) {
      const testResult = localStorage.getItem('testResult');
      if (testResult) {
        const result = JSON.parse(testResult);
        recommendedDiv.innerHTML = `
          <h4><i class="fas fa-star" style="color: #fbbf24;"></i> ${result.recommendedCourse.courseName}</h4>
          <p>${result.recommendedCourse.description}</p>
          <div class="course-tag">Возраст: ${result.recommendedCourse.ageGroup}</div>
        `;
      } else {
        recommendedDiv.innerHTML = '<p>Пройдите пробный урок, чтобы получить рекомендацию!</p><button id="testFromProfile" class="btn-primary" style="margin-top: 10px;">Пройти пробный урок</button>';
        const testFromProfile = document.getElementById('testFromProfile');
        if (testFromProfile) {
          testFromProfile.addEventListener('click', () => {
            if (testModal) testModal.style.display = 'block';
            resetTest();
          });
        }
      }
    }
  }
  
  // Проверка авторизации
  function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser && currentUser.username) {
      if (userInfo) userInfo.style.display = 'flex';
      if (guestInfo) guestInfo.style.display = 'none';
      if (userNameHeader) userNameHeader.textContent = currentUser.username;
      if (profileLink) profileLink.style.display = 'inline-block';
    } else {
      if (userInfo) userInfo.style.display = 'none';
      if (guestInfo) guestInfo.style.display = 'flex';
      if (profileLink) profileLink.style.display = 'none';
    }
  }
  
  // Тестирование
  let currentQuestionIndex = 0;
  let userAnswers = new Array(testQuestions.length).fill(null);
  
  function renderQuestion() {
    const question = testQuestions[currentQuestionIndex];
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    const totalQuestionsSpan = document.getElementById('totalQuestions');
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    const submitBtn = document.getElementById('submitTest');
    const testProgressFill = document.getElementById('testProgressFill');
    
    if (currentQuestionSpan) currentQuestionSpan.textContent = currentQuestionIndex + 1;
    if (totalQuestionsSpan) totalQuestionsSpan.textContent = testQuestions.length;
    if (questionText) questionText.textContent = question.question;
    
    const progress = ((currentQuestionIndex + 1) / testQuestions.length) * 100;
    if (testProgressFill) testProgressFill.style.width = progress + '%';
    
    if (prevBtn) prevBtn.style.display = currentQuestionIndex === 0 ? 'none' : 'inline-block';
    if (nextBtn) nextBtn.style.display = currentQuestionIndex === testQuestions.length - 1 ? 'none' : 'inline-block';
    if (submitBtn) submitBtn.style.display = currentQuestionIndex === testQuestions.length - 1 ? 'inline-block' : 'none';
    
    if (optionsContainer) {
      optionsContainer.innerHTML = question.options.map((option, idx) => `
        <div class="option-item ${userAnswers[currentQuestionIndex] === idx ? 'selected' : ''}" data-option-index="${idx}">
          <div class="option-letter">${String.fromCharCode(65 + idx)}</div>
          <div class="option-text">${option}</div>
        </div>
      `).join('');
      
      document.querySelectorAll('.option-item').forEach(opt => {
        opt.addEventListener('click', () => {
          const optionIndex = parseInt(opt.dataset.optionIndex);
          userAnswers[currentQuestionIndex] = optionIndex;
          document.querySelectorAll('.option-item').forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');
        });
      });
    }
  }
  
  function showResults() {
    const scores = [];
    for (let i = 0; i < userAnswers.length; i++) {
      if (userAnswers[i] !== null) {
        scores.push(testQuestions[i].scores[userAnswers[i]]);
      } else {
        scores.push(0);
      }
    }
    
    const result = determineCourse(scores);
    const resultContainer = document.getElementById('resultContainer');
    const questionContainer = document.getElementById('questionContainer');
    const resultTitle = document.getElementById('resultTitle');
    const resultDescription = document.getElementById('resultDescription');
    const recommendedCoursesDiv = document.getElementById('recommendedCourses');
    
    if (resultTitle) resultTitle.textContent = `🎯 Рекомендованный курс: ${result.recommendedCourse.courseName}`;
    if (resultDescription) {
      resultDescription.innerHTML = `
        Ваш уровень подготовки: ${result.score}%<br>
        ${result.recommendedCourse.description}<br>
        <strong>Возрастная группа: ${result.recommendedCourse.ageGroup}</strong>
      `;
    }
    
    if (recommendedCoursesDiv) {
      recommendedCoursesDiv.innerHTML = `
        <div class="recommend-course-card">
          <i class="${result.recommendedCourse.icon}"></i>
          <h4>${result.recommendedCourse.courseName}</h4>
          <p>${result.recommendedCourse.description}</p>
          <button onclick="window.enrollToRecommendedCourse('${result.recommendedCourse.courseName}')">Записаться на курс</button>
        </div>
      `;
    }
    
    if (questionContainer) questionContainer.style.display = 'none';
    if (resultContainer) resultContainer.style.display = 'block';
    
    localStorage.setItem('testResult', JSON.stringify({
      date: new Date().toLocaleString(),
      score: result.score,
      recommendedCourse: result.recommendedCourse
    }));
  }
  
  function resetTest() {
    currentQuestionIndex = 0;
    userAnswers = new Array(testQuestions.length).fill(null);
    const questionContainer = document.getElementById('questionContainer');
    const resultContainer = document.getElementById('resultContainer');
    if (questionContainer) questionContainer.style.display = 'block';
    if (resultContainer) resultContainer.style.display = 'none';
    renderQuestion();
  }
  
  if (startTestBtn) {
    startTestBtn.addEventListener('click', () => {
      if (testModal) testModal.style.display = 'block';
      resetTest();
    });
  }
  
  const prevQuestionBtn = document.getElementById('prevQuestion');
  const nextQuestionBtn = document.getElementById('nextQuestion');
  const submitTestBtn = document.getElementById('submitTest');
  const closeTestBtn = document.getElementById('closeTestBtn');
  
  if (prevQuestionBtn) {
    prevQuestionBtn.addEventListener('click', () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
      }
    });
  }
  
  if (nextQuestionBtn) {
    nextQuestionBtn.addEventListener('click', () => {
      if (currentQuestionIndex < testQuestions.length - 1 && userAnswers[currentQuestionIndex] !== null) {
        currentQuestionIndex++;
        renderQuestion();
      } else if (userAnswers[currentQuestionIndex] === null) {
        showNotification('❌ Пожалуйста, выберите ответ!', 'warning');
      }
    });
  }
  
  if (submitTestBtn) {
    submitTestBtn.addEventListener('click', () => {
      if (userAnswers[currentQuestionIndex] !== null) {
        showResults();
      } else {
        showNotification('❌ Пожалуйста, выберите ответ!', 'warning');
      }
    });
  }
  
  if (closeTestBtn) {
    closeTestBtn.addEventListener('click', () => {
      if (testModal) testModal.style.display = 'none';
    });
  }
  
  // Инициализация
  checkAuth();
  createStars();
  
  // Параллакс эффект
  const heroImage = document.querySelector('.hero-image img');
  if (heroImage) {
    document.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      const moveX = (mouseX - 0.5) * 20;
      const moveY = (mouseY - 0.5) * 20;
      heroImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  }
  
  console.log('%c🚀 Код в сапогах - Школа программирования для детей!', 'color: #a855f7; font-size: 16px; font-weight: bold;');
});

// Глобальная функция для записи на рекомендованный курс
window.enrollToRecommendedCourse = function(courseName) {
  const testModal = document.getElementById('testModal');
  if (testModal) testModal.style.display = 'none';
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    sessionStorage.setItem('selectedCourse', courseName);
    showNotification(`🔐 Чтобы записаться на курс "${courseName}", войдите в аккаунт`, 'warning');
    const loginModal = document.getElementById('loginModal');
    if (loginModal) loginModal.style.display = 'block';
    return;
  }
  
  let users = JSON.parse(localStorage.getItem('users')) || [];
  const userIndex = users.findIndex(u => u.username === currentUser.username);
  if (userIndex !== -1) {
    if (!users[userIndex].courses) users[userIndex].courses = [];
    
    const alreadyEnrolled = users[userIndex].courses.some(c => c.name === courseName);
    if (!alreadyEnrolled) {
      users[userIndex].courses.push({
        name: courseName,
        description: "Рекомендованный курс",
        date: new Date().toLocaleString(),
        progress: 0
      });
      localStorage.setItem('users', JSON.stringify(users));
      showNotification(`🎓 Вы записались на курс "${courseName}"!`, 'success');
      
      const profilePage = document.getElementById('profilePage');
      if (profilePage && profilePage.classList.contains('active')) {
        location.reload();
      }
    } else {
      showNotification(`📚 Вы уже записаны на курс "${courseName}"!`, 'info');
    }
  }
};

// Функция для создания уведомления
function showNotification(message, type = 'info') {
  const existingNotification = document.querySelector('.custom-notification');
  if (existingNotification) existingNotification.remove();

  const notification = document.createElement('div');
  notification.className = 'custom-notification';
  
  let gradient;
  switch(type) {
    case 'success': gradient = 'linear-gradient(135deg, #10b981, #059669)'; break;
    case 'error': gradient = 'linear-gradient(135deg, #ef4444, #dc2626)'; break;
    case 'warning': gradient = 'linear-gradient(135deg, #f59e0b, #d97706)'; break;
    default: gradient = 'linear-gradient(135deg, #8b5cf6, #6366f1)';
  }
  
  notification.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: ${gradient};
    color: white;
    padding: 16px 24px;
    border-radius: 50px;
    font-weight: 600;
    font-family: 'Quicksand', sans-serif;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 1000;
    animation: slideInRight 0.3s ease-out;
    cursor: pointer;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    max-width: 350px;
    font-size: 0.95rem;
  `;
  
  notification.innerHTML = `<i class="fas ${getIconForType(type)}" style="margin-right: 12px;"></i>${message}`;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification) {
      notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
      setTimeout(() => notification.remove(), 300);
    }
  }, 3000);
  
  notification.addEventListener('click', () => {
    notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
    setTimeout(() => notification.remove(), 300);
  });
}

function getIconForType(type) {
  switch(type) {
    case 'success': return 'fa-check-circle';
    case 'error': return 'fa-exclamation-circle';
    case 'warning': return 'fa-exclamation-triangle';
    default: return 'fa-star';
  }
}

// Создание звездного фона
function createStars() {
  const starContainer = document.createElement('div');
  starContainer.style.position = 'fixed';
  starContainer.style.top = '0';
  starContainer.style.left = '0';
  starContainer.style.width = '100%';
  starContainer.style.height = '100%';
  starContainer.style.pointerEvents = 'none';
  starContainer.style.zIndex = '1';
  
  for (let i = 0; i < 150; i++) {
    const star = document.createElement('div');
    star.style.position = 'absolute';
    star.style.width = Math.random() * 3 + 'px';
    star.style.height = star.style.width;
    star.style.backgroundColor = `rgba(255, 255, 255, ${Math.random() * 0.6 + 0.2})`;
    star.style.borderRadius = '50%';
    star.style.top = Math.random() * 100 + '%';
    star.style.left = Math.random() * 100 + '%';
    star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite ease-in-out`;
    starContainer.appendChild(star);
  }
  
  document.body.appendChild(starContainer);
}