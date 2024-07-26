const taskInput = document.querySelector('#task-input');
const taskContainer = document.querySelector('#task-container');
const addTaskButton = document.querySelector('#task-button');
const checkAll = document.querySelector('#check-all');
const deleteAllCheck = document.querySelector('#delete-all-check');
const pageContainer = document.querySelector('#pages');
const filterContainer = document.querySelector('#filter');

const COUNT_ELEM = 5;
const FILTER_TASKS = {
    all : 'All',
    active : 'Active',
    complited : 'Complited'
};

let taskList = [];
let currentPage = 1;
let filterType = 'all';

const listenEvent = (e) => {
    const finderTask = taskList.find((task) => task._id == e.target.parentElement.id);

    /*switch (e.target.getAttribute('name')) {
        case 'check': 
            console.log('Check');
            checkTask(finderTask);
            break; 
        case 'delete': 
            console.log('Delete');
            deleteTask(finderTask);
            break;
        case 'text':
            if (e.detail == 2) {
                const textTask = e.target;
                const inputTask = e.target.nextElementSibling;
                inputTask.hidden = false;
                textTask.hidden = true;
                console.log("span: \n", textTask);
                console.log("input: \n", inputTask);
                inputTask.value = textTask.textContent;
                inputTask.focus();
            }
            break;
    }*/

    if (e.target.getAttribute('name') === 'check') checkTask(finderTask);

    if (e.target.getAttribute('name') === 'delete') deleteTask(finderTask);

    if (e.target.getAttribute('name') === 'text' && e.detail === 2) findTaskEdit(e.target);
}

const addTask = () => {
    //validation task

    const taskInfo = {
        _id: Date.now(),
        text: taskInput.value,
        isChecked: false
    };

    filterType = 'all';
    getLayoutTodo(taskInfo);
    taskList.push(taskInfo); 
    currentPageController('add');
    render(); 
} 

const checkTask = (task) => {
    task.isChecked = !task.isChecked;
    //console.log(taskList);
    render(); 
}

const checkAllTask = (check) => {
    taskList.forEach((task) => task.isChecked = check);
    render();
}

const findTaskEdit = (target) => {
    const textTask = target;
    const inputTask = target.nextElementSibling;
    inputTask.hidden = false;
    textTask.hidden = true;
    inputTask.value = textTask.textContent;
    inputTask.focus();
    checkInputTask(inputTask.value);
}

const editTask = (task, text) => {
    task.text = text;
    render(); 
}

const deleteTask = (task) => {
    taskList = taskList.filter((tasks) => tasks !== task);
    currentPageController('delete');
    render(); 
} 

const deleteCheckTask = () => {
    taskList = taskList.filter((tasks) => !tasks.isChecked);
    currentPageController('delete');
    render();
}


const checkInputTask = (input) => {
    if (!(/^\S{3,}$/.test(input))) {
        return false;
    } 
    else {
        return true;
    }
}

const renderLayoutFilter = () => {
    //TODO: delete _ ? _ : _
    filterContainer.innerHTML = '';
    for (const [id, text] of Object.entries(FILTER_TASKS)){
        filterContainer.innerHTML += 
            `<button id=${id} type="button" class="btn ${id === 'all' ? 
                'btn-danger' : id === 'active' ? 
                'btn-warning' : id === 'complited' ? 
                'btn-success' : '' } ${filterType === id ? 'active' : ''}">${text} <span class="badge text-bg-primary rounded-pill"> ${currentFilter(id).length} </span></button>`
    }

    return filterContainer.innerHTML;
    //return filterContainer.innerHTML += 
    //`<button id=${filter[0]} type="button" class="btn btn-danger ${filterType === filter[0] ? 'active' : ''}">${filter[1]} <span class="badge text-bg-primary rounded-pill"> ${taskList.length} </span></button>
    //<button id=${filter[0]} type="button" class="btn btn-warning ${filterType === filter[0] ? 'active' : ''}">${filter[1]} <span class="badge text-bg-primary rounded-pill"> ${taskList.filter((task) => !task.isChecked).length} </span></button>
    //<button id=${filter[0]} type="button" class="btn btn-success ${filterType === filter[0] ? 'active' : ''}">${filter[1]} <span class="badge text-bg-primary rounded-pill"> ${taskList.filter((task) => task.isChecked).length} </span></button>`;
}

const getLayoutTodo = (task) => {
    return taskContainer.innerHTML = 
        `<li id='${task._id}' class='list-group-item list-group-item-action'>
            <input name='check' class='form-check-input' type='checkbox' ${task.isChecked ? 'checked' : ''} />
            <span name='text' class='form-check-label' > ${task.text} </span>
            <input name='edit' type='text' class='form-control' value='' hidden />
            <button name='delete' type='button' class='btn btn-danger'> Delete </button>
        </li>`;
}

const getLayoutPage = (page) => {
    return pageContainer.innerHTML = `<li class="page-item ${page == currentPage ? 'active' : ''} "><a class="page-link" href="#"> ${page} </a></li>`;
}

const currentFilter = (type) => {
    switch (type) {
        case 'active':
            return taskList.filter((task) => !task.isChecked);
        case 'complited': 
            return taskList.filter((task) => task.isChecked);
        case 'all': 
            return taskList;
    }
}

const filterTask = (type) => {
    filterType = type;
    return currentFilter(filterType);
}

const filterActive = () => {
    let activeTask = taskList.filter((task) => task.isChecked === false);
    return activeTask;
}

const filterComplited = () => {
    let complitedTask = taskList.filter((task) => task.isChecked === true);
    return complitedTask;
}

const paginationTask = () => {
    let startIndex = (currentPage - 1) * COUNT_ELEM;
    let endIndex = currentPage * COUNT_ELEM;
    return filterTask(filterType).slice(startIndex, endIndex);
}

const currentPageController = (type) => {
    let countPage = Math.ceil(taskList.length / COUNT_ELEM);
    switch (type) {
        case 'add': 
            currentPage = countPage;
            break;
        case 'delete': 
            if (currentPage > countPage) {
                currentPage = countPage;
            } 
            break;
    }
}

const renderTasks = () => {
    taskContainer.innerHTML = '';
    paginationTask(filterTask(filterType)).forEach((task) => taskContainer.innerHTML += getLayoutTodo(task));
}

const renderActiveCheckAll = () => {
    if (filterTask(filterType).length > 0) {
        checkAll.disabled = false;
        checkAll.checked = filterTask(filterType).every((task) => task.isChecked === true);
    } else {
        checkAll.disabled = true;
        checkAll.checked = false;
    }
}

const renderActiveDeleteAll = () => deleteAllCheck.disabled = !filterTask(filterType).some((task) => task.isChecked === true);

const renderPagination = () => {
    let countPage = Math.ceil(filterTask(filterType).length / COUNT_ELEM);
    pageContainer.innerHTML = '';
    for (let i = 1; i <= countPage; i++) {
        if (countPage > 1) {
            pageContainer.innerHTML += getLayoutPage(i);
        }
    }
}

const render = () => {
    console.log(filterType);
    renderLayoutFilter();
    renderPagination();
    renderActiveCheckAll();
    renderActiveDeleteAll();
    renderTasks();
    /*const countPage = Math.floor((taskList.length + 1) / countElem);
    taskContainer.innerHTML = '';

    pageContainer.innerHTML = '';
    //PREV: taskList
    paginationTask(currentPage).forEach((task) => {
        taskContainer.innerHTML += getLayoutTodo(task);
    });

    pageContainer.innerHTML += getLayoutPage(countPage);

    if (taskList.length > 0) {
        checkAll.disabled = false;
        checkAll.checked = taskList.every((task) => task.isChecked === true);
    } else {
        checkAll.disabled = true;
        checkAll.checked = false;
    }

    deleteAllCheck.disabled = !taskList.some((task) => task.isChecked === true);

    console.log(checkAll.checked);*/
}

const addTaskEvent = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (checkInputTask(e.target.value)) {
            addTask();
        }
    }
}

const keyTaskEvent = (e) => {
    const finderTask = taskList.find((task) => task._id == e.target.parentElement.id);
    const inputTask = e.target;
    const textTask = e.target.previousElementSibling;
    if (e.sourceCapabilities !== null && e.key === 'Enter') {
        //console.log(e);
        e.preventDefault();
        textTask.hidden = false;
        inputTask.hidden = true;
        //if (checkInputTask(inputTask.value)) {
        //    textTask.textContent = inputTask.value;
        //    editTask(finderTask, inputTask.value);
        //}
        textTask.textContent = inputTask.value;
        editTask(finderTask, inputTask.value);
    }
}

const blurTaskEvent = (e) => {
    const finderTask = taskList.find((task) => task._id == e.target.parentElement.id);
    const inputTask = e.target;
    const textTask = e.target.previousElementSibling;
    if (e.sourceCapabilities !== null){
        textTask.hidden = false;
        inputTask.hidden = true;
        //textTask.textContent = inputTask.value;
        //if (checkInputTask(inputTask.value)) {
        //    textTask.textContent = inputTask.value;
        //    editTask(finderTask, inputTask.value);
        //}
        textTask.textContent = inputTask.value;
        editTask(finderTask, inputTask.value);
    }
}

const checkAllEvent = (e) => {
    const checkAll = e.target;
    if (checkAll.id === 'check-all') {
        checkAllTask(checkAll.checked);
    }
}

const deleteAllCheckEvent = (e) => {
    const deleteAllCheck = e.target;
    if (deleteAllCheck.id === 'delete-all-check') { 
        deleteCheckTask();
    }
}

const movePageEvent = (e) => {
    currentPage = e.target.textContent;
    render();
}

const filterEvent = (e) => {
    const type = e.target.getAttribute('id');
    currentPage = 1;
    filterTask(type);
    render(); 
}

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