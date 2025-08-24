const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const pomodoroModeButton = document.getElementById('pomodoro-mode');
const shortBreakModeButton = document.getElementById('short-break-mode');
const longBreakModeButton = document.getElementById('long-break-mode');

const pomodoroDurationInput = document.getElementById('pomodoro-duration');
const shortBreakDurationInput = document.getElementById('short-break-duration');
const longBreakDurationInput = document.getElementById('long-break-duration');
const pomodoroStreakDisplay = document.getElementById('pomodoro-streak');

const dailyTargetHoursInput = document.getElementById('daily-target-hours');
const remainingTargetTimeDisplay = document.getElementById('remaining-target-time');

const newTaskInput = document.getElementById('new-task-input');
const addTaskButton = document.getElementById('add-task-button');
const taskList = document.getElementById('task-list');

const progressBarFill = document.getElementById('progress-bar-fill');
const nyanCatImage = document.getElementById('nyan-cat');

const snowContainer = document.getElementById('snow-container');

// Settings Modal
const settingsButton = document.getElementById('settings-button');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsModal = document.getElementById('close-settings-modal');
const flags = document.querySelectorAll('.flag');
const fighters = document.querySelectorAll('.fighter');
const seasonButtons = document.querySelectorAll('.season-button');

let timerInterval;
let totalSeconds;
let isPaused = true;
let mode = 'pomodoro'; // 'pomodoro', 'shortBreak', 'longBreak'
let pomodoroStreak = 0;
let dailyTargetSeconds = 0;
let initialModeDuration = 0; // New variable to store initial duration of current mode
let currentLanguage = 'en'; // Default language
let currentFighter = 'nyan-cat.gif'; // Default fighter
let currentSeason = 'winter'; // Default season

// Translations
const translations = {
  en: {
    pomodoro: 'Pomodoro',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
    start: 'Start',
    reset: 'Reset',
    pomodoroStreak: 'Pomodoro Streak',
    dailyTarget: 'Daily Target (hours)',
    remaining: 'Remaining',
    dailyTasks: 'Daily Tasks',
    addTaskPlaceholder: 'Add a new task...',
    addTask: 'Add Task',
    settings: 'Settings',
    languages: 'Languages',
    chooseYourFighter: 'Choose your fighter',
    season: 'Season',
    spring: 'Spring',
    summer: 'Summer',
    autumn: 'Autumn',
    winter: 'Winter',
    timeForBreak: 'Time for a break!',
    backToWork: 'Back to work!',
    sessionEnded: 'Your {mode} session has ended.'
  },
  es: {
    pomodoro: 'Pomodoro',
    shortBreak: 'Descanso Corto',
    longBreak: 'Descanso Largo',
    start: 'Empezar',
    reset: 'Reiniciar',
    pomodoroStreak: 'Racha de Pomodoros',
    dailyTarget: 'Objetivo Diario (horas)',
    remaining: 'Restante',
    dailyTasks: 'Tareas Diarias',
    addTaskPlaceholder: 'Añadir una nueva tarea...',
    addTask: 'Añadir Tarea',
    settings: 'Ajustes',
    languages: 'Idiomas',
    chooseYourFighter: 'Elige tu luchador',
    season: 'Estación',
    spring: 'Primavera',
    summer: 'Verano',
    autumn: 'Otoño',
    winter: 'Invierno',
    timeForBreak: '¡Hora de un descanso!',
    backToWork: '¡De vuelta al trabajo!',
    sessionEnded: 'Tu sesión de {mode} ha terminado.'
  },
  el: {
    pomodoro: 'Pomodoro',
    shortBreak: 'Σύντομο Διάλειμμα',
    longBreak: 'Μεγάλο Διάλειμμα',
    start: 'Εκκίνηση',
    reset: 'Επαναφορά',
    pomodoroStreak: 'Σερί Pomodoro',
    dailyTarget: 'Ημερήσιος Στόχος (ώρες)',
    remaining: 'Απομένει',
    dailyTasks: 'Ημερήσιες Εργασίες',
    addTaskPlaceholder: 'Προσθήκη νέας εργασίας...',
    addTask: 'Προσθήκη Εργασίας',
    settings: 'Ρυθμίσεις',
    languages: 'Γλώσσες',
    chooseYourFighter: 'Διάλεξε τον μαχητή σου',
    season: 'Εποχή',
    spring: 'Άνοιξη',
    summer: 'Καλοκαίρι',
    autumn: 'Φθινόπωρο',
    winter: 'Χειμώνας',
    timeForBreak: 'Ώρα για διάλειμμα!',
    backToWork: 'Πίσω στη δουλειά!',
    sessionEnded: 'Η περίοδος {mode} σας έληξε.'
  },
  vi: {
    pomodoro: 'Pomodoro',
    shortBreak: 'Nghỉ Ngắn',
    longBreak: 'Nghỉ Dài',
    start: 'Bắt đầu',
    reset: 'Đặt lại',
    pomodoroStreak: 'Chuỗi Pomodoro',
    dailyTarget: 'Mục tiêu hàng ngày (giờ)',
    remaining: 'Còn lại',
    dailyTasks: 'Nhiệm vụ hàng ngày',
    addTaskPlaceholder: 'Thêm nhiệm vụ mới...',
    addTask: 'Thêm nhiệm vụ',
    settings: 'Cài đặt',
    languages: 'Ngôn ngữ',
    chooseYourFighter: 'Chọn chiến binh của bạn',
    season: 'Mùa',
    spring: 'Mùa xuân',
    summer: 'Mùa hè',
    autumn: 'Mùa thu',
    winter: 'Mùa đông',
    timeForBreak: 'Đã đến lúc nghỉ ngơi!',
    backToWork: 'Trở lại làm việc!',
    sessionEnded: 'Phiên {mode} của bạn đã kết thúc.'
  }
};

// Notification and Sound
let notificationPermission = 'default';
const bellSound = new Audio('bell.mp3'); // Local sound for timer end
const bubbleSound = new Audio('bubble.mp3'); // Local sound for button clicks

function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop desktop notification');
  } else if (Notification.permission === 'granted') {
    notificationPermission = 'granted';
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      notificationPermission = permission;
    });
  }
}

function playSound(sound) {
  sound.currentTime = 0; // Rewind to start for quick successive plays
  sound.play().catch(error => {
    console.error('Error playing sound:', error);
  });
}

function sendNotification(title, body) {
  if (notificationPermission === 'granted') {
    new Notification(title, { body: body });
  }
}

function getPomodoroDuration() {
  return parseInt(pomodoroDurationInput.value) * 60;
}

function getShortBreakDuration() {
  return parseInt(shortBreakDurationInput.value) * 60;
}

function getLongBreakDuration() {
  return parseInt(longBreakDurationInput.value) * 60;
}

function updateTimerDisplay() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  minutesSpan.textContent = String(minutes).padStart(2, '0');
  secondsSpan.textContent = String(seconds).padStart(2, '0');

  // Update progress bar and Nyan Cat position
  if (initialModeDuration > 0) {
    const progress = ((initialModeDuration - totalSeconds) / initialModeDuration) * 100;
    progressBarFill.style.width = `${progress}%`;
    nyanCatImage.style.left = `${progress}%`;
  }
}

function updatePomodoroStreakDisplay() {
  pomodoroStreakDisplay.textContent = pomodoroStreak;
}

function updateDailyTargetDisplay() {
  const hours = Math.floor(dailyTargetSeconds / 3600);
  const minutes = Math.floor((dailyTargetSeconds % 3600) / 60);
  const seconds = dailyTargetSeconds % 60;

  remainingTargetTimeDisplay.textContent = 
    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function setLanguage(lang) {
  currentLanguage = lang;
  const t = translations[lang];

  document.querySelector('label[for="pomodoro-duration"]').textContent = t.pomodoro + ':';
  document.querySelector('label[for="short-break-duration"]').textContent = t.shortBreak + ':';
  document.querySelector('label[for="long-break-duration"]').textContent = t.longBreak + ':';
  document.querySelector('label[for="daily-target-hours"]').textContent = t.dailyTarget + ':';
  document.querySelector('#daily-target p').childNodes[0].nodeValue = `${t.remaining}: `;
  pomodoroModeButton.textContent = t.pomodoro;
  shortBreakModeButton.textContent = t.shortBreak;
  longBreakModeButton.textContent = t.longBreak;
  startButton.textContent = isPaused ? t.start : 'Pause';
  resetButton.textContent = t.reset;
  document.querySelector('#streak').childNodes[0].nodeValue = `${t.pomodoroStreak}: `;
  document.querySelector('#todo-list-container h2').textContent = t.dailyTasks;
  newTaskInput.placeholder = t.addTaskPlaceholder;
  addTaskButton.textContent = t.addTask;
  document.querySelector('#settings-modal-content h2').textContent = t.settings;
  document.querySelector('#language-settings h3').textContent = t.languages;
  document.querySelector('#fighter-settings h3').textContent = t.chooseYourFighter;
  document.querySelector('#season-settings h3').textContent = t.season;
  document.querySelector('.season-button[data-season="spring"]').textContent = t.spring;
  document.querySelector('.season-button[data-season="summer"]').textContent = t.summer;
  document.querySelector('.season-button[data-season="autumn"]').textContent = t.autumn;
  document.querySelector('.season-button[data-season="winter"]').textContent = t.winter;
}

function setFighter(fighterSrc) {
  console.log('Setting fighter to:', fighterSrc);
  currentFighter = fighterSrc;
  nyanCatImage.src = fighterSrc;
  fighters.forEach(fighter => {
    if (fighter.getAttribute('data-fighter') === fighterSrc) {
      fighter.classList.add('selected');
    } else {
      fighter.classList.remove('selected');
    }
  });
}

function setMode(newMode) {
  mode = newMode;
  clearInterval(timerInterval);
  isPaused = true;
  startButton.textContent = translations[currentLanguage].start;

  // Reset Nyan Cat position when mode changes
  nyanCatImage.style.left = '0%';

  // Remove active class from all mode buttons
  pomodoroModeButton.classList.remove('active');
  shortBreakModeButton.classList.remove('active');
  longBreakModeButton.classList.remove('active');

  // Remove previous mode classes from body
  document.body.classList.remove('pomodoro-mode', 'short-break-mode', 'long-break-mode');

  switch (mode) {
    case 'pomodoro':
      totalSeconds = getPomodoroDuration();
      initialModeDuration = getPomodoroDuration(); // Set initial duration
      document.body.classList.add('pomodoro-mode');
      pomodoroModeButton.classList.add('active');
      break;
    case 'shortBreak':
      totalSeconds = getShortBreakDuration();
      initialModeDuration = getShortBreakDuration(); // Set initial duration
      document.body.classList.add('short-break-mode');
      shortBreakModeButton.classList.add('active');
      break;
    case 'longBreak':
      totalSeconds = getLongBreakDuration();
      initialModeDuration = getLongBreakDuration(); // Set initial duration
      document.body.classList.add('long-break-mode');
      longBreakModeButton.classList.add('active');
      break;
  }
  updateTimerDisplay();
  saveData(); // Save data after mode change
}

function startTimer() {
  if (isPaused) {
    isPaused = false;
    startButton.textContent = 'Pause';
    timerInterval = setInterval(() => {
      totalSeconds--;
      updateTimerDisplay();

      if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        isPaused = true;
        startButton.textContent = translations[currentLanguage].start;
        handleTimerEnd();
      }
    }, 1000);
  }
}

function pauseTimer() {
  isPaused = true;
  startButton.textContent = translations[currentLanguage].start;
  clearInterval(timerInterval);
}

function resetTimer() {
  pauseTimer();
  setMode(mode); // Resets to the current mode's duration
  // Ensure Nyan Cat is reset on explicit reset
  nyanCatImage.style.left = '0%';
}

function handleTimerEnd() {
  playSound(bellSound);
  const t = translations[currentLanguage];
  const notificationTitle = mode === 'pomodoro' ? t.timeForBreak : t.backToWork;
  const notificationBody = t.sessionEnded.replace('{mode}', t[mode]);
  sendNotification(notificationTitle, notificationBody);

  if (mode === 'pomodoro') {
    const pomodoroDuration = getPomodoroDuration();
    dailyTargetSeconds -= pomodoroDuration;
    if (dailyTargetSeconds < 0) {
      dailyTargetSeconds = 0;
    }
    pomodoroStreak++;
    updatePomodoroStreakDisplay();
    updateDailyTargetDisplay();
    saveData();
  }

  // Switch to the next mode
  if (mode === 'pomodoro') {
    if (pomodoroStreak > 0 && pomodoroStreak % 4 === 0) {
      setMode('longBreak');
    } else {
      setMode('shortBreak');
    }
  } else {
    setMode('pomodoro');
  }
}

function createTaskElement(taskText, completed = false) {
  const listItem = document.createElement('li');
  listItem.draggable = true;
  const dragHandle = document.createElement('span');
  dragHandle.classList.add('drag-handle');
  dragHandle.innerHTML = '&#x2630;'; // Hamburger icon for dragging
  const taskSpan = document.createElement('span');
  taskSpan.textContent = taskText;
  taskSpan.classList.add('task-text');

  if (completed) {
    listItem.classList.add('completed');
  }

  // Click to toggle completion
  taskSpan.addEventListener('click', () => {
    listItem.classList.toggle('completed');
    saveData();
  });

  // Double-click to edit
  taskSpan.addEventListener('dblclick', () => {
    editTask(listItem, taskSpan);
  });

  const removeButton = document.createElement('button');
  removeButton.textContent = 'X';
  removeButton.classList.add('remove-task-button');
  removeButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent listItem click from firing
    listItem.remove();
    saveData();
  });

  listItem.appendChild(dragHandle);
  listItem.appendChild(taskSpan);
  listItem.appendChild(removeButton);
  return listItem;
}

function editTask(listItem, taskSpan) {
  const originalText = taskSpan.textContent;
  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.value = originalText;
  editInput.classList.add('edit-task-input');

  // Replace taskSpan with input
  listItem.replaceChild(editInput, taskSpan);
  editInput.focus();
  editInput.select();

  const saveEditedTask = () => {
    const newText = editInput.value.trim();
    if (newText !== '') {
      taskSpan.textContent = newText;
    } else {
      taskSpan.textContent = originalText; // Revert if empty
    }
    listItem.replaceChild(taskSpan, editInput);
    saveData();
  };

  editInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      saveEditedTask();
    }
  });

  editInput.addEventListener('blur', () => {
    saveEditedTask();
  });
}

function addTask() {
  const taskText = newTaskInput.value.trim();
  if (taskText !== '') {
    const listItem = createTaskElement(taskText);
    taskList.appendChild(listItem);
    newTaskInput.value = '';
    saveData();
  }
}

function saveData() {
  const data = {
    pomodoroDuration: parseInt(pomodoroDurationInput.value),
    shortBreakDuration: parseInt(shortBreakDurationInput.value),
    longBreakDuration: parseInt(longBreakDurationInput.value),
    pomodoroStreak: pomodoroStreak,
    dailyTargetSeconds: dailyTargetSeconds,
    tasks: [],
    language: currentLanguage,
    fighter: currentFighter,
    season: currentSeason
  };

  // Collect tasks from the DOM
  taskList.querySelectorAll('li').forEach(item => {
    const taskTextSpan = item.querySelector('.task-text');
    if (taskTextSpan) {
      data.tasks.push({
        text: taskTextSpan.textContent,
        completed: item.classList.contains('completed')
      });
    }
  });

  localStorage.setItem('pomodoroAppData', JSON.stringify(data));
}

function loadData() {
  console.log('Loading data...');
  const storedData = localStorage.getItem('pomodoroAppData');
  if (storedData) {
    const data = JSON.parse(storedData);
    console.log('Loaded data:', data);

    pomodoroDurationInput.value = data.pomodoroDuration || 25;
    shortBreakDurationInput.value = data.shortBreakDuration || 5;
    longBreakDurationInput.value = data.longBreakDuration || 15;
    pomodoroStreak = data.pomodoroStreak || 0;
    dailyTargetSeconds = data.dailyTargetSeconds || parseInt(dailyTargetHoursInput.value) * 3600;
    currentLanguage = data.language || 'en';
    currentFighter = data.fighter || 'nyan-cat.gif';
    currentSeason = data.season || 'winter';

    setLanguage(currentLanguage);
    setFighter(currentFighter);
    setSeason(currentSeason);
    updatePomodoroStreakDisplay();
    updateDailyTargetDisplay();

    // Load tasks
    taskList.innerHTML = ''; // Clear existing tasks
    if (data.tasks) {
      data.tasks.forEach(task => {
        const listItem = createTaskElement(task.text, task.completed);
        taskList.appendChild(listItem);
      });
    }
  }
}

// Drag and Drop
let dragged = null;

taskList.addEventListener('dragstart', (event) => {
  dragged = event.target;
  event.target.classList.add('dragging');
});

taskList.addEventListener('dragend', (event) => {
  event.target.classList.remove('dragging');
  saveData();
});

taskList.addEventListener('dragover', (event) => {
  event.preventDefault();
  const afterElement = getDragAfterElement(taskList, event.clientY);
  if (afterElement == null) {
    taskList.appendChild(dragged);
  } else {
    taskList.insertBefore(dragged, afterElement);
  }
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function generateSnow() {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 3;
        let sizeClass = 'small';
        if (size < 1) {
            sizeClass = 'small';
        } else if (size < 2) {
            sizeClass = 'medium';
        } else {
            sizeClass = 'large';
        }
        particle.className = `particle snow-particle ${sizeClass}`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
        snowContainer.appendChild(particle);
    }
}

function generateFlowers() {
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle flower-particle';
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
    snowContainer.appendChild(particle);
  }
}

function generateSunFlares() {
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle sun-flare-particle';
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
    snowContainer.appendChild(particle);
  }
}

function generateLeaves() {
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    const leafType = Math.floor(Math.random() * 3) + 1;
    const color = Math.random() < 0.5 ? 'red' : 'yellow';
    particle.className = `particle leaf-particle leaf-${leafType} ${color}`;
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
    snowContainer.appendChild(particle);
  }
}

function setSeason(season) {
  currentSeason = season;
  document.body.classList.remove('spring', 'summer', 'autumn', 'winter');
  document.body.classList.add(season);
  seasonButtons.forEach(button => {
    if (button.getAttribute('data-season') === season) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  snowContainer.innerHTML = '';
  switch (season) {
    case 'winter':
      generateSnow();
      break;
    case 'spring':
      generateFlowers();
      break;
    case 'summer':
      generateSunFlares();
      break;
    case 'autumn':
      generateLeaves();
      break;
  }
}

// Settings Modal Listeners
settingsButton.addEventListener('click', () => {
  settingsModal.classList.remove('hidden');
});

closeSettingsModal.addEventListener('click', () => {
  settingsModal.classList.add('hidden');
});

window.addEventListener('click', (event) => {
  if (event.target === settingsModal) {
    settingsModal.classList.add('hidden');
  }
});

flags.forEach(flag => {
  flag.addEventListener('click', () => {
    const lang = flag.getAttribute('data-lang');
    setLanguage(lang);
    saveData();
  });
});

fighters.forEach(fighter => {
  console.log('Adding click listener to fighter:', fighter);
  fighter.addEventListener('click', () => {
    const fighterSrc = fighter.getAttribute('data-fighter');
    setFighter(fighterSrc);
    saveData();
  });
});

seasonButtons.forEach(button => {
  button.addEventListener('click', () => {
    const season = button.getAttribute('data-season');
    setSeason(season);
    saveData();
  });
});

startButton.addEventListener('click', () => {
  playSound(bubbleSound); // Play sound on start
  if (isPaused) {
    startTimer();
  } else {
    pauseTimer();
  }
});

resetButton.addEventListener('click', () => {
  playSound(bubbleSound); // Play sound on reset
  resetTimer();
});

pomodoroModeButton.addEventListener('click', () => setMode('pomodoro'));
shortBreakModeButton.addEventListener('click', () => setMode('shortBreak'));
longBreakModeButton.addEventListener('click', () => setMode('longBreak'));

pomodoroDurationInput.addEventListener('change', () => setMode('pomodoro'));
shortBreakDurationInput.addEventListener('change', () => setMode('shortBreak'));
longBreakDurationInput.addEventListener('change', () => setMode('longBreak'));

dailyTargetHoursInput.addEventListener('change', () => {
  dailyTargetSeconds = parseInt(dailyTargetHoursInput.value) * 3600;
  updateDailyTargetDisplay();
  saveData(); // Save data after daily target changes
});

addTaskButton.addEventListener('click', addTask);
newTaskInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM content loaded');
  setMode('pomodoro'); // Set the initial mode to default
  updatePomodoroStreakDisplay();
  dailyTargetSeconds = parseInt(dailyTargetHoursInput.value) * 3600; // Initialize daily target
  updateDailyTargetDisplay();
  requestNotificationPermission(); // Request notification permission on load
  loadData();
});
