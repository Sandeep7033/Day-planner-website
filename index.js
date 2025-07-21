// sandeep.js - updated with checkbox, edit, delete in order

const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const authTitle = document.getElementById('authTitle');
const authUsername = document.getElementById('authUsername');
const authPassword = document.getElementById('authPassword');
const authAction = document.getElementById('authAction');
const toggleAuth = document.getElementById('toggleAuth');
const displayUser = document.getElementById('displayUser');
const liveDate = document.getElementById('liveDate');
const taskTitle = document.getElementById('taskTitle');
const taskTime = document.getElementById('taskTime');
const taskDate = document.getElementById('taskDate');
const addTask = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const logoutBtn = document.getElementById('logoutBtn');
const clearAll = document.getElementById('clearAll');

let isLoginMode = true;
let users = JSON.parse(localStorage.getItem('users') || '{}');
let currentUser = localStorage.getItem('currentUser');
let tasks = JSON.parse(localStorage.getItem('tasks') || '{}');

function updateDate() {
  const now = new Date();
  liveDate.textContent = now.toLocaleString();
}
setInterval(updateDate, 1000);

function toggleAuthMode() {
  isLoginMode = !isLoginMode;
  authTitle.textContent = isLoginMode ? 'Login' : 'Sign Up';
  authAction.textContent = isLoginMode ? 'Login' : 'Sign Up';
  toggleAuth.innerHTML = isLoginMode
    ? `Don't have an account? <a href="#" onclick="toggleAuthMode()">Sign up</a>`
    : `Already have an account? <a href="#" onclick="toggleAuthMode()">Login</a>`;
}

function saveUsers() {
  localStorage.setItem('users', JSON.stringify(users));
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  if (!tasks[currentUser]) return;
  tasks[currentUser].forEach((task, i) => {
    const taskItem = document.createElement('div');
    taskItem.className = 'task';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.onchange = () => {
      task.completed = checkbox.checked;
      saveTasks();
    };

    const textDiv = document.createElement('div');
    textDiv.className = 'text';
    const title = document.createElement('h3');
    title.textContent = task.title;
    const time = document.createElement('span');
    time.textContent = `${task.time} | ${task.date}`;
    textDiv.append(title, time);

    const actions = document.createElement('div');
    actions.className = 'actions';

    actions.appendChild(checkbox);

    const editBtn = document.createElement('button');
    editBtn.className = 'editBtn';
    editBtn.textContent = '✏️';
    editBtn.onclick = () => {
      taskTitle.value = task.title;
      taskTime.value = task.time;
      taskDate.value = task.date;
      tasks[currentUser].splice(i, 1);
      saveTasks();
      renderTasks();
    };
    actions.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'deleteBtn';
    deleteBtn.textContent = '🗑️';
    deleteBtn.onclick = () => {
      tasks[currentUser].splice(i, 1);
      saveTasks();
      renderTasks();
    };
    actions.appendChild(deleteBtn);

    taskItem.append(textDiv, actions);
    taskList.appendChild(taskItem);
  });
}

function handleAuth() {
  const username = authUsername.value.trim();
  const password = authPassword.value.trim();
  if (!username || !password) return alert('Fill all fields');

  if (isLoginMode) {
    if (users[username] !== password) return alert('Invalid credentials');
    currentUser = username;
  } else {
    if (users[username]) return alert('User already exists');
    users[username] = password;
    tasks[username] = [];
    saveUsers();
    saveTasks();
    currentUser = username;
  }
  localStorage.setItem('currentUser', currentUser);
  authSection.style.display = 'none';
  appSection.style.display = 'block';
  displayUser.textContent = currentUser;
  renderTasks();
}

authAction.onclick = handleAuth;

addTask.onclick = () => {
  const title = taskTitle.value.trim();
  const time = taskTime.value;
  const date = taskDate.value;
  if (!title || !time || !date) return alert('Please fill in all fields');

  const task = { title, time, date, completed: false };
  tasks[currentUser].push(task);
  saveTasks();
  renderTasks();
  taskTitle.value = taskTime.value = taskDate.value = '';
};

logoutBtn.onclick = () => {
  localStorage.removeItem('currentUser');
  location.reload();
};

clearAll.onclick = () => {
  if (confirm('Clear all tasks?')) {
    tasks[currentUser] = [];
    saveTasks();
    renderTasks();
  }
};

if (currentUser) {
  authSection.style.display = 'none';
  appSection.style.display = 'block';
  displayUser.textContent = currentUser;
  renderTasks();
}
