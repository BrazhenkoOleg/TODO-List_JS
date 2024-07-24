const taskInput = document.querySelector('#task-input');
const taskContainer = document.querySelector('#task-container');
const addTaskButton = document.querySelector('#task-button');
const checkAll = document.querySelector('#check-all');
const deleteAllCheck = document.querySelector('#delete-all-check');

let taskList = [];
let currentPage = 2;

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
    const taskInfo = {
        _id: Date.now(),
        text: taskInput.value,
        isChecked: false
    };

    getLayoutTodo(taskInfo);
    taskList.push(taskInfo); 
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
}

const editTask = (task, text) => {
    task.text = text;
    render(); 
}

const deleteTask = (task) => {
    taskList = taskList.filter((tasks) => tasks !== task);
    render(); 
} 

const deleteCheckTask = () => {
    taskList = taskList.filter((tasks) => !tasks.isChecked);

    render();
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

const paginationTask = (page) => {
    const countElem = 5;
    //const list = taskList.filter((task, index) => );
    console.log(list);
}

const render = () => {
    taskContainer.innerHTML = '';
    taskList.forEach((task) => {
        taskContainer.innerHTML += getLayoutTodo(task);
    });

    if (taskList.length > 0) {
        checkAll.disabled = false;
        checkAll.checked = taskList.every((task) => task.isChecked === true);
    } else {
        checkAll.disabled = true;
        checkAll.checked = false;
    }

    deleteAllCheck.disabled = !taskList.some((task) => task.isChecked === true);

    console.log(checkAll.checked);
    //paginationTask(currentPage);
}

const addTaskEvent = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
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

addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', addTaskEvent);
checkAll.addEventListener('click', checkAllEvent);
deleteAllCheck.addEventListener('click', deleteAllCheckEvent);
taskContainer.addEventListener('click', listenEvent);
taskContainer.addEventListener('keydown', keyTaskEvent);
taskContainer.addEventListener('blur', blurTaskEvent, true);