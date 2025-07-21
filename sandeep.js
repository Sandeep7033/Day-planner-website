let users = JSON.parse(localStorage.getItem("planner-users")) || {};
let currentUser = localStorage.getItem("planner-current-user") || null;
let tasks = [];

const taskTitle = document.getElementById("taskTitle");
const taskTime = document.getElementById("taskTime");
const taskDate = document.getElementById("taskDate");
const taskList = document.getElementById("taskList");

function saveTasks() {
  if (currentUser) {
    localStorage.setItem(`planner-tasks-${currentUser}`, JSON.stringify(tasks));
  }
}

function loadTasks() {
  if (currentUser) {
    tasks = JSON.parse(localStorage.getItem(`planner-tasks-${currentUser}`)) || [];
    renderTasks();
  }
}

function addTask() {
  if (taskTitle.value.trim() === "") {
    alert("Please enter a task.");
    return;
  }

  tasks.push({
    title: taskTitle.value,
    time: taskTime.value || null,
    date: taskDate.value || "No Date",
    completed: false
  });

  saveTasks();
  taskTitle.value = "";
  taskTime.value = "";
  renderTasks(); // do not reset taskDate
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const taskEl = document.createElement("div");
    taskEl.className = "task" + (task.completed ? " completed" : "");

    const textDiv = document.createElement("div");
    textDiv.className = "text";
    const title = document.createElement("h3");
    title.innerText = task.title;
    const meta = document.createElement("span");
    meta.innerText = `${task.date}${task.time ? ' at ' + task.time : ''}`;
    textDiv.appendChild(title);
    textDiv.appendChild(meta);

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "actions";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    };

    const delBtn = document.createElement("button");
    delBtn.className = "deleteBtn";
    delBtn.innerText = "🗑️";
    delBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    actionsDiv.appendChild(checkbox);
    actionsDiv.appendChild(delBtn);

    taskEl.appendChild(textDiv);
    taskEl.appendChild(actionsDiv);

    taskList.appendChild(taskEl);
  });
}

document.getElementById("addTask").addEventListener("click", addTask);
document.getElementById("clearAll").addEventListener("click", () => {
  if (confirm("Clear all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

// ------------------ Login / Signup ------------------

function toggleAuthMode() {
  const title = document.getElementById("authTitle");
  const button = document.getElementById("authAction");
  const toggle = document.getElementById("toggleAuth");

  if (title.innerText === "Login") {
    title.innerText = "Sign Up";
    button.innerText = "Sign Up";
    toggle.innerHTML = `Already have an account? <a href="#" onclick="toggleAuthMode()">Login</a>`;
  } else {
    title.innerText = "Login";
    button.innerText = "Login";
    toggle.innerHTML = `Don't have an account? <a href="#" onclick="toggleAuthMode()">Sign up</a>`;
  }
}

document.getElementById("authAction").addEventListener("click", () => {
  const username = document.getElementById("authUsername").value.trim();
  const password = document.getElementById("authPassword").value.trim();
  const isLogin = document.getElementById("authTitle").innerText === "Login";

  if (!username || !password) {
    alert("Please enter both fields.");
    return;
  }

  if (isLogin) {
    if (users[username] && users[username] === password) {
      currentUser = username;
      localStorage.setItem("planner-current-user", currentUser);
      document.getElementById("authSection").style.display = "none";
      document.getElementById("appSection").style.display = "block";
      document.getElementById("displayUser").innerText = currentUser;
      loadTasks();
    } else {
      alert("Invalid login.");
    }
  } else {
    if (users[username]) {
      alert("User already exists.");
    } else {
      users[username] = password;
      localStorage.setItem("planner-users", JSON.stringify(users));
      alert("Signup successful. Please login.");
      toggleAuthMode();
    }
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("planner-current-user");
  location.reload();
});

window.onload = function () {
  if (currentUser) {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("appSection").style.display = "block";
    document.getElementById("displayUser").innerText = currentUser;
    loadTasks();
  }

  // Show live date
  const liveDate = document.getElementById("liveDate");
  setInterval(() => {
    const now = new Date();
    liveDate.innerText = now.toLocaleString();
  }, 1000);
};
