const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-task');
const tasksList = document.getElementById('tasks-list');
const allBtn = document.getElementById('all-btn');
const activeBtn = document.getElementById('active-btn');
const completedBtn = document.getElementById('completed-btn');

let currentFilter = 'all';
let editingIndex = null;

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasksList.innerHTML = '';
  
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });
  
  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    
    if (editingIndex === index) {
      li.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} 
               onchange="toggleTask(${index})">
        <input type="text" id="edit-input-${index}" value="${task.text}">
        <button onclick="saveTask(${index})">Сохранить</button>
        <button onclick="cancelEdit()">Отмена</button>
      `;
    } else {
      li.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} 
               onchange="toggleTask(${index})">
        <span ondblclick="startEdit(${index})">${task.text}</span>
        <button onclick="deleteTask(${index})">Удалить</button>
        <button onclick="startEdit(${index})">Редактировать</button>
      `;
    }
    
    tasksList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const newTask = { text, completed: false, createdAt: new Date().toISOString() };
  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  
  taskInput.value = '';
  loadTasks();
  
  if (Notification.permission === 'granted') {
    showNotification('Новая задача', `Добавлена: "${text}"`);
  }
}

function startEdit(index) {
  editingIndex = index;
  loadTasks();
}

function saveTask(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const editInput = document.getElementById(`edit-input-${index}`);
  tasks[index].text = editInput.value.trim();
  localStorage.setItem('tasks', JSON.stringify(tasks));
  editingIndex = null;
  loadTasks();
}

function cancelEdit() {
  editingIndex = null;
  loadTasks();
}

function toggleTask(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
}

function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  loadTasks();
}

function setFilter(filter) {
  currentFilter = filter;
  allBtn.classList.remove('active');
  activeBtn.classList.remove('active');
  completedBtn.classList.remove('active');
  
  if (filter === 'all') allBtn.classList.add('active');
  if (filter === 'active') activeBtn.classList.add('active');
  if (filter === 'completed') completedBtn.classList.add('active');
  
  loadTasks();
}

function updateOnlineStatus() {
  const banner = document.getElementById('offline-indicator');
  banner.style.display = navigator.onLine ? 'none' : 'block';
}


document.getElementById('test-reminder-btn')?.addEventListener('click', () => {
  if (hasUncompletedTasks()) {
    showReminderNotification();
  } else {
    alert('Нет невыполненных задач для напоминания');
  }
});

function updateReminderInfo() {
  const infoEl = document.getElementById('reminder-info');
  if (!infoEl) return;
  
  if (!('PeriodicSyncManager' in window)) {
    infoEl.textContent = 'Используется резервный метод (интервалы)';
  } else {
    infoEl.textContent = 'Периодические напоминания активны';
  }
  
  const tasks = JSON.parse(localStorage.getItem('tasks') || []);
  const uncompletedCount = tasks.filter(task => !task.completed).length;
  
  if (uncompletedCount > 0) {
    infoEl.textContent += ` | ${uncompletedCount} невыполненных задач`;
  } else {
    infoEl.textContent += ' | Все задачи выполнены';
  }
}

window.addEventListener('load', updateReminderInfo);

addButton.addEventListener('click', addTask);
allBtn.addEventListener('click', () => setFilter('all'));
activeBtn.addEventListener('click', () => setFilter('active'));
completedBtn.addEventListener('click', () => setFilter('completed'));

window.addEventListener('load', () => {
  loadTasks();
  updateOnlineStatus();
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.log('SW registration failed: ', err));
  }
});

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
window.startEdit = startEdit;
window.saveTask = saveTask;
window.cancelEdit = cancelEdit;
