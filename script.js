const form = document.getElementById('task-form');
const list = document.getElementById('task-list');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function showNotification(msg, tipo = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  toast.textContent = msg;

  document.getElementById('toast-container').appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const task = document.getElementById('task').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  const newTask = {
    id: Date.now(),
    texto: task,
    date: formatDate(date),
    time: formatTime(time),
    feita: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  showNotification("✅ Task created successfully!", "success");
  form.reset();
});

function saveTasks() {
  localStorage.setItem('tarefas', JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = '';
  tasks.forEach(task => {
    const div = document.createElement('div');
    div.className = 'task';
    if (task.feita) div.classList.add('done');

    const content = document.createElement('div');
    content.innerHTML = `<strong>${task.date} às ${task.time}:</strong> ${task.text}`;
    div.appendChild(content);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const btnEdit = document.createElement('button');
    btnEdit.textContent = '✏️ Edit';
    btnEdit.onclick = () => {
      document.getElementById('tasks').value = tasks.text;
      document.getElementById('date').value = formatarDataParaInput(tasks.date);
      document.getElementById('time').value = tasks.time;

      tasks = tasks.filter(t => t.id !== tasks.id);
      saveTasks();
      renderTasks();
    };

    const btnDone = document.createElement('button');
    btnDone.textContent = task.done ? '↩️ Undo' : '✅ Done';
    btnDone.onclick = () => {
      task.done = !task.done;
      saveTasks();
      renderTasks();
    };

    const btnRemove = document.createElement('button');
    btnRemove.textContent = '❌ Remove';
    btnRemove.onclick = () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
      showNotification("❌ Task successfully removed!", "error");
    };

    actions.appendChild(btnEdit);
    actions.appendChild(btnDone);
    actions.appendChild(btnRemove);
    div.appendChild(actions);

    list.appendChild(div);
  });
}

function formatDate(date) {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`; // Day/month/year format
}

function formatDateForInput(data) {
  const [day, month, year] = data.split('/');
  return `${year}-${month}-${day}`; // Format for date input
}

function formatTime(hour) {
  const [h, m] = hour.split(':');
  return `${h}:${m}`; // Mantém o formato 24h
}

renderTasks();
