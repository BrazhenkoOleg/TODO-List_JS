(() => {
  const taskInput = document.querySelector('#task-input');
  const taskContainer = document.querySelector('#task-container');
  const addTaskButton = document.querySelector('#task-button');
  const checkAll = document.querySelector('#check-all');
  const deleteAllCheck = document.querySelector('#delete-all-check');
  const pageContainer = document.querySelector('#pages');
  const filterContainer = document.querySelector('#filter');

  const COUNT_ELEM = 5;
  const DOUBLE_CLICK = 2;
  const MAX_INPUT = 255;
  const ADD_KEY = 'Enter';
  const TASK_CONTENT = {
    text: 'text',
    delete: 'delete',
    check: 'check',
  };
  const FILTER_TASKS = {
    all: 'All',
    active: 'Active',
    complited: 'Complited',
  };
  const ACTIONS_TASK = {
    add: 'add',
    delete: 'delete',
    check: 'check',
  };
  const CLASS_BUTTONS = {
    all: 'btn-danger',
    active: 'btn-warning',
    complited: 'btn-success',
  };
  const ACTIVE_BUTTON = {
    active: 'active',
    deactivate: '',
  };
  const ACTIVE_CHECKED = {
    checked: 'checked',
    not_checked: '',
  };
  const EVENT_ID = {
    delete: 'delete-all-check',
    check: 'check-all',
    move: 'page',
  };

  let taskList = [];
  let currentPage = 1;
  let filterType = 'all';

  // Determinants
  const checkInputTask = (input) => {
    const regex = /[\p{L}\p{N}]/u;
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

  const limitMaxText = (form) => {
    if (form.value.length > MAX_INPUT) {
      form.value = form.value.substring(0, MAX_INPUT);
    }
  };

  const currentFilter = (type) => {
    switch (type) {
      case FILTER_TASKS.active.toLowerCase():
        return taskList.filter((task) => !task.isChecked);
      case FILTER_TASKS.complited.toLowerCase():
        return taskList.filter((task) => task.isChecked);
      default:
        return taskList;
    }
  };

  const currentPageController = (action) => {
    const countPage = Math.ceil(currentFilter(filterType).length / COUNT_ELEM);
    if (action === ACTIONS_TASK.add) {
      currentPage = countPage;
    } else if (currentPage > countPage
      && (action === ACTIONS_TASK.delete || action === ACTIONS_TASK.check)) {
      currentPage = countPage;
    }
  };

  const getClassButton = (id) => {
    switch (id) {
      case FILTER_TASKS.all.toLowerCase():
        return CLASS_BUTTONS.all;
      case FILTER_TASKS.active.toLowerCase():
        return CLASS_BUTTONS.active;
      case FILTER_TASKS.complited.toLowerCase():
        return CLASS_BUTTONS.complited;
      default:
        return '';
    }
  };

  // Render Functions
  const renderLayoutFilter = () => {
    filterContainer.innerHTML = '';
    Object.entries(FILTER_TASKS).forEach(([id, text]) => {
      filterContainer.innerHTML += `<button id=${id} type="button" class="btn ${getClassButton(id)} ${filterType === id ? ACTIVE_BUTTON.active : ACTIVE_BUTTON.deactivate}">
                                    ${text} <span class="badge text-bg-primary rounded-pill"> 
                                    ${currentFilter(id).length} </span>
                                </button>`;
    });
    return filterContainer.innerHTML;
  };

  const getLayoutTodo = (task) => {
    taskContainer.innerHTML = `<li id='${task.id}' class='list-group-item list-group-item-action d-flex align-items-center'>
                                <input name='check' class='form-check-input mr-2' type='checkbox' ${task.isChecked ? ACTIVE_CHECKED.checked : ACTIVE_CHECKED.not_checked}/> 
                                <span name='text' class='form-check-label ml-2 flex-grow-1 px-3'> ${task.text} </span>
                                <input name='edit' type='text' class='form-control flex-grow-1 mx-3 rounded-0' value='' hidden />
                                <button name='delete' type='button' class='btn ${getClassButton(filterType)} ml-2'> Delete </button>
                            </li>`;
    return taskContainer.innerHTML;
  };

  const getLayoutPage = (page) => {
    pageContainer.innerHTML = `<li class="page-item ${page === currentPage ? ACTIVE_BUTTON.active : ACTIVE_BUTTON.deactivate} "><a name="page" class="page-link" href="#"> ${page} </a></li>`; // add var active
    return pageContainer.innerHTML;
  };

  const paginationTask = () => {
    const startIndex = (currentPage - 1) * COUNT_ELEM;
    const endIndex = currentPage * COUNT_ELEM;
    return currentFilter(filterType).slice(startIndex, endIndex);
  };

  const renderTasks = () => {
    taskContainer.innerHTML = '';
    paginationTask(currentFilter(filterType)).forEach((task) => {
      taskContainer.innerHTML += getLayoutTodo(task);
    });
  };

  const renderActiveCheckAll = () => {
    if (currentFilter(filterType).length) {
      checkAll.disabled = false;
      checkAll.checked = currentFilter(filterType).every((task) => task.isChecked);
    } else {
      checkAll.disabled = true;
      checkAll.checked = false;
    }
  };

  const renderActiveDeleteAll = () => {
    deleteAllCheck.disabled = !currentFilter(filterType).some((task) => task.isChecked);
  };

  const renderPagination = () => {
    const countPage = Math.ceil(currentFilter(filterType).length / COUNT_ELEM);
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
      filterType = FILTER_TASKS.all.toLowerCase();
      getLayoutTodo(taskInfo);
      taskList.push(taskInfo);
      taskInput.value = '';
      currentPageController(ACTIONS_TASK.add);
      render();
    }
  };

  const checkTask = (task) => {
    task.isChecked = !task.isChecked;
    currentPageController(ACTIONS_TASK.check);
    render();
  };

  const checkAllTask = (check) => {
    taskList.forEach((task) => {
      task.isChecked = check;
      return task.isChecked;
    });
    currentPageController(ACTIONS_TASK.check);
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

  const deleteTask = (task) => {
    taskList = taskList.filter((tasks) => tasks !== task);
    currentPageController(ACTIONS_TASK.delete);
    render();
  };

  const deleteCheckTask = () => {
    taskList = taskList.filter((tasks) => !tasks.isChecked);
    currentPageController(ACTIONS_TASK.delete);
    render();
  };

  // Events
  const listenEvent = (e) => {
    const finderTask = taskList.find((task) => task.id === Number(e.target.parentElement.id));
    if (e.target.getAttribute('name') === TASK_CONTENT.check) checkTask(finderTask);
    if (e.target.getAttribute('name') === TASK_CONTENT.delete) deleteTask(finderTask);
    if (e.target.getAttribute('name') === TASK_CONTENT.text && e.detail === DOUBLE_CLICK) findTaskEdit(e.target);
  };

  const addTaskEvent = (e) => {
    limitMaxText(taskInput);
    if (e.key === ADD_KEY) {
      e.preventDefault();
      addTask();
    }
  };

  const keyTaskEvent = (e) => {
    limitMaxText(e.target);
    const finderTask = taskList.find((task) => task.id === Number(e.target.parentElement.id));
    const inputTask = e.target;
    const textTask = e.target.previousElementSibling;
    const validText = checkInputTask(inputTask.value);
    if (e.sourceCapabilities !== null && e.key === ADD_KEY) {
      e.preventDefault();
      textTask.hidden = false;
      inputTask.hidden = true;
      if (validText) {
        textTask.textContent = validText;
        finderTask.text = validText;
        render();
      }
    }
  };

  const blurTaskEvent = (e) => {
    limitMaxText(e.target);
    const finderTask = taskList.find((task) => task.id === Number(e.target.parentElement.id));
    const inputTask = e.target;
    const textTask = e.target.previousElementSibling;
    const validText = checkInputTask(inputTask.value);
    if (e.sourceCapabilities !== null) {
      textTask.hidden = false;
      inputTask.hidden = true;
      if (validText) {
        textTask.textContent = validText;
        finderTask.text = validText;
        render();
      }
    }
  };

  const checkAllEvent = (e) => {
    const checkboxTask = e.target;
    if (checkboxTask.id === EVENT_ID.check) {
      checkAllTask(checkboxTask.checked);
    }
  };

  const deleteAllCheckEvent = (e) => {
    const deleteCheck = e.target;
    if (deleteCheck.id === EVENT_ID.delete) deleteCheckTask();
  };

  const movePageEvent = (e) => {
    if (e.target.getAttribute('name') === EVENT_ID.move) {
      currentPage = Number(e.target.textContent);
      render();
    }
  };

  const filterEvent = (e) => {
    const type = e.target.getAttribute('id');
    currentPage = 1;
    filterType = type;
    currentFilter(filterType);
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
})();
