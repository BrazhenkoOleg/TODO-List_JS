const taskInput = document.querySelector('#task-input');
const taskContainer = document.querySelector('#task-container');
const addTaskButton = document.querySelector('#task-button');

let taskList = [];

const listenEvent = (e) => {
    const finderTask = taskList.find((task) => task._id == e.target.parentElement.id);
    console.log(e);
    switch (e.target.getAttribute('name')) {
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
                console.log(e.target.parentElement);
                const inputTask = e.target.parentElement.querySelector('input[name="edit"]');
                textTask.hidden = !textTask.hidden;
                inputTask.hidden = !inputTask.hidden;
                console.log("span: ", textTask);
                console.log("input: ", inputTask);
                inputTask.value = textTask.textContent;
                inputTask.focus();
                
                inputTask.onkeydown = (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        textTask.hidden = !textTask.hidden;
                        inputTask.hidden = !inputTask.hidden;
                        textTask.textContent = inputTask.value;
                        editTask(finderTask, inputTask.value);
                    }
                };
                
                inputTask.onblur = (e) => {
                    textTask.hidden = !textTask.hidden;
                    inputTask.hidden = !inputTask.hidden;
                    textTask.textContent = inputTask.value;
                    editTask(finderTask, inputTask.value);
                }
                //textTask.textContent = inputTask.value;
                //editTask(finderTask, inputTask.value);
            }
            break;
    }
}

addTask = () => {
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
    console.log(taskList);
    render(); 
}

const editTask = (task, text) => {
    task.text = text;
    render(); 
}

const deleteTask = (task) => {
    taskList = taskList.filter((tasks) => tasks !== task);
    render(); 
} 

    taskInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    };

const getLayoutTodo = (task) => {
    return taskContainer.innerHTML = 
        `<li id='${task._id}' class='list-group-item'>
            <input name='check' class='form-check-input' type='checkbox' ${task.isChecked ? 'checked' : ''} />
            <span name='text' class='form-check-label' > ${task.text} </span>
            <input name='edit' type='text' class='form-control me-2' hidden />
            <button name='delete' type='button' class='btn btn-danger'> Delete </button>
        </li>`;
}

const render = () => {
    taskContainer.innerHTML = '';
    taskList.forEach((task) => taskContainer.innerHTML += getLayoutTodo(task));
};


addTaskButton.addEventListener('click', addTask);
taskContainer.addEventListener('click', listenEvent);