let taskList = [];
const taskContainer = document.getElementById('task-container');

//TODO: add function checkTask, editTask, deleteTask 
//and track this functions with Event Parent element id
const listenEvent = (e) => {
    //console.log(e.target.parentElement);
    const finderTask = taskList.find((task) => task._id == e.target.parentElement.id);
    switch (e.target.id) {
        case 'check': 
            checkTask(finderTask);
            break;
        case 'edit': 
            editTask(finderTask);
            break;
        case 'delete': 
            deleteTask(finderTask);
            break;
    }

    console.log(taskList);
}

addTask = () => {
    const taskInput = document.getElementById('task-input').value;
    const taskInfo = {
        _id: Date.now(),
        text: taskInput,
        isChecked: false
    };

    const newTaskElement = document.createElement('li');
    newTaskElement.setAttribute('id', taskInfo._id);
    setListAttribute(newTaskElement);
    
    const newCheckTask = document.createElement('input');
    setCheckAttribute(newCheckTask);
    
    const newSpanTask = document.createElement('span');
    newSpanTask.textContent = taskInput;
    setSpanAttribute(newSpanTask);

    const newDeleteTask = document.createElement('button');
    setDeleteAttribute(newDeleteTask);

    newTaskElement.appendChild(newCheckTask);
    newTaskElement.appendChild(newSpanTask);
    newTaskElement.appendChild(newDeleteTask);
    taskContainer.appendChild(newTaskElement);

    taskList.push(taskInfo); 
    //console.log(newTaskElement);
} 

//TODO: add checkTask function
checkTask = (task) => {
    task.isChecked = !task.isChecked;
}

editTask = (task) => {

}

deleteTask = (task) => {
    const del_task = document.getElementById(`${task._id}`);
    taskList = taskList.filter((tasks) => tasks !== task);
    del_task.remove();
} 

setListAttribute = (list) => {
    list.setAttribute('class', 'list-group-item');
}

setCheckAttribute = (checkbox) => {
    checkbox.setAttribute('id', 'check');
    checkbox.setAttribute('class', 'form-check-input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.checked = false;
}

setSpanAttribute = (span) => {
    span.setAttribute('id', 'edit');
    span.setAttribute('class', 'form-check-label');
}

setDeleteAttribute = (button) => {
    button.setAttribute('id', 'delete');
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'btn btn-danger');
    //button.setAttribute('onclick', 'deleteTask()');
    button.textContent = 'Delete';
}

taskContainer.addEventListener('click', listenEvent);