const taskInput = document.querySelector('#task-input');
const taskContainer = document.querySelector('#task-container');
const addTaskButton = document.querySelector('#task-button');
const checkAll = document.querySelector('#check-all');
const deleteAllCheck = document.querySelector('#delete-all-check');
const pageContainer = document.querySelector('#pages');
const filterContainer = document.querySelector('#filter');

const COUNT_ELEM = 5;
const FILTER_TASKS = {
  all: 'All',
  active: 'Active',
  complited: 'Complited',
};

let taskList = [];
let currentPage = 1;
let filterType = 'all';

// Determinants
const checkInputTask = (input) => {
  const regex = /[\p{L}]/u;
  const escapeMap = {
    '"': '&quot;',
    '№': '&numero;',
    '%': '&percnt;',
    ':': '&colon;',
    '?': '&quest;',
    '*': '&ast;',
    "'": '&apos;',
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
  };
  const validInput = input
    .replace(/\s+/g, ' ').trim()
    .replace(/[""№%:?*'<>&"]/g, (char) => escapeMap[char]);
  if (!regex.test(input)) {
    return false;
  }
  return validInput;
};

const currentFilter = (type) => {
  switch (type) {
    case 'active':
      return taskList.filter((task) => !task.isChecked);
    case 'complited':
      return taskList.filter((task) => task.isChecked);
    case 'all':
      return taskList;
    // no default
  }
  return taskList;
};

const filterTask = (type) => {
  filterType = type;
  return currentFilter(filterType);
};

const currentPageController = (type) => {
  const countPage = Math.ceil(taskList.length / COUNT_ELEM);
  switch (type) {
    case 'add':
      currentPage = countPage;
      break;
    case 'delete':
      if (currentPage > countPage) {
        currentPage = countPage;
      }
      break;
    // no default
  }
};

const getClassButton = (id) => {
  switch (id) {
    case 'all':
      return 'btn-danger';
    case 'active':
      return 'btn-warning';
    case 'complited':
      return 'btn-success';
    // no default
  }
  return '';
};

// Render Functions
const renderLayoutFilter = () => {
  filterContainer.innerHTML = '';
  Object.entries(FILTER_TASKS).forEach(([id, text]) => {
    filterContainer.innerHTML += `<button id=${id} type="button" class="btn ${getClassButton(id)} ${filterType === id ? 'active' : ''}">
                                    ${text} <span class="badge text-bg-primary rounded-pill"> 
                                    ${currentFilter(id).length} </span>
                                </button>`;
  });
  return filterContainer.innerHTML;
};

const getLayoutTodo = (task) => {
  taskContainer.innerHTML = `<li id='${task.id}' class='list-group-item list-group-item-action d-flex align-items-center'>
                                <input name='check' class='form-check-input mr-2' type='checkbox' ${task.isChecked ? 'checked' : ''}/>
                                <span name='text' class='form-check-label ml-2 flex-grow-1 px-3'> ${task.text} </span>
                                <input name='edit' type='text' class='form-control flex-grow-1 mx-3 rounded-0' value='' hidden />
                                <button name='delete' type='button' class='btn ${getClassButton(filterType)} ml-2'> Delete </button>
                            </li>`;
  return taskContainer.innerHTML;
};

const getLayoutPage = (page) => {
  pageContainer.innerHTML = `<li class="page-item ${page === currentPage ? 'active' : ''} "><a name="page" class="page-link" href="#"> ${page} </a></li>`;
  return pageContainer.innerHTML;
};

const paginationTask = () => {
  const startIndex = (currentPage - 1) * COUNT_ELEM;
  const endIndex = currentPage * COUNT_ELEM;
  return filterTask(filterType).slice(startIndex, endIndex);
};

const renderTasks = () => {
  taskContainer.innerHTML = '';
  paginationTask(filterTask(filterType)).forEach((task) => {
    taskContainer.innerHTML += getLayoutTodo(task);
  });
};

const renderActiveCheckAll = () => {
  if (filterTask(filterType).length > 0) {
    checkAll.disabled = false;
    checkAll.checked = filterTask(filterType).every((task) => task.isChecked === true);
  } else {
    checkAll.disabled = true;
    checkAll.checked = false;
  }
};

const renderActiveDeleteAll = () => {
  deleteAllCheck.disabled = !filterTask(filterType).some((task) => task.isChecked === true);
};

const renderPagination = () => {
  const countPage = Math.ceil(filterTask(filterType).length / COUNT_ELEM);
  pageContainer.innerHTML = '';
  for (let i = 1; i <= countPage; i += 1) {
    if (countPage > 1) {
      pageContainer.innerHTML += getLayoutPage(i);
    }
  }
};

const render = () => {
  renderLayoutFilter();
  renderPagination();
  renderActiveCheckAll();
  renderActiveDeleteAll();
  renderTasks();
};

// Actions with Tasks
const addTask = () => {
  const validText = checkInputTask(taskInput.value);
  if (validText) {
    const taskInfo = {
      id: Date.now(),
      text: validText,
      isChecked: false,
    };
    filterType = 'all';
    getLayoutTodo(taskInfo);
    taskList.push(taskInfo);
    currentPageController('add');
    render();
  }
};

const checkTask = (task) => {
  task.isChecked = !task.isChecked;
  render();
};

const checkAllTask = (check) => {
  taskList.forEach((task) => {
    task.isChecked = check;
    return task.isChecked;
  });
  render();
};

const findTaskEdit = (target) => {
  const textTask = target;
  const inputTask = target.nextElementSibling;
  inputTask.hidden = false;
  textTask.hidden = true;
  inputTask.value = textTask.textContent.trim();
  inputTask.focus();
  checkInputTask(inputTask.value);
};

const editTask = (task, text) => {
  task.text = text;
  render();
};

const deleteTask = (task) => {
  taskList = taskList.filter((tasks) => tasks !== task);
  currentPageController('delete');
  render();
};

const deleteCheckTask = () => {
  taskList = taskList.filter((tasks) => !tasks.isChecked);
  currentPageController('delete');
  render();
};

// Events
const listenEvent = (e) => {
  const finderTask = taskList.find((task) => task.id.toString() === e.target.parentElement.id);
  if (e.target.getAttribute('name') === 'check') checkTask(finderTask);
  if (e.target.getAttribute('name') === 'delete') deleteTask(finderTask);
  if (e.target.getAttribute('name') === 'text' && e.detail === 2) findTaskEdit(e.target);
};

const addTaskEvent = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTask();
  }
};

const keyTaskEvent = (e) => {
  const finderTask = taskList.find((task) => task.id.toString() === e.target.parentElement.id);
  const inputTask = e.target;
  const textTask = e.target.previousElementSibling;
  const validText = checkInputTask(inputTask.value);
  if (e.sourceCapabilities !== null && e.key === 'Enter') {
    e.preventDefault();
    textTask.hidden = false;
    inputTask.hidden = true;
    if (validText) {
      textTask.textContent = validText;
      editTask(finderTask, validText);
    }
  }
};

const blurTaskEvent = (e) => {
  const finderTask = taskList.find((task) => task.id.toString() === e.target.parentElement.id);
  const inputTask = e.target;
  const textTask = e.target.previousElementSibling;
  const validText = checkInputTask(inputTask.value);
  if (e.sourceCapabilities !== null) {
    textTask.hidden = false;
    inputTask.hidden = true;
    if (validText) {
      textTask.textContent = validText;
      editTask(finderTask, validText);
    }
  }
};

const checkAllEvent = (e) => {
  const checkboxTask = e.target;
  if (checkboxTask.id === 'check-all') {
    checkAllTask(checkboxTask.checked);
  }
};

const deleteAllCheckEvent = (e) => {
  const deleteCheck = e.target;
  if (deleteCheck.id === 'delete-all-check') {
    deleteCheckTask();
  }
};

const movePageEvent = (e) => {
  if (e.target.getAttribute('name') === 'page') {
    currentPage = parseInt(e.target.textContent, 10);
    render();
  }
};

const filterEvent = (e) => {
  const type = e.target.getAttribute('id');
  currentPage = 1;
  filterTask(type);
  render();
};

document.addEventListener('DOMContentLoaded', renderLayoutFilter);
addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', addTaskEvent);
checkAll.addEventListener('click', checkAllEvent);
deleteAllCheck.addEventListener('click', deleteAllCheckEvent);
taskContainer.addEventListener('click', listenEvent);
taskContainer.addEventListener('keydown', keyTaskEvent);
taskContainer.addEventListener('blur', blurTaskEvent, true);
pageContainer.addEventListener('click', movePageEvent);
filterContainer.addEventListener('click', filterEvent);
