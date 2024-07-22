let taskList = [];
const taskInput = document.getElementById('task-input');
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
        case 'text': 
            editTask(finderTask);
            break;
        case 'delete': 
            deleteTask(finderTask);
            break;
    }

    console.log(taskList);
}

/*getLayoutTodo = () => {
    for (let i = 0; i < taskList.length; i++) {
        const newTaskElement = document.createElement('li');
        newTaskElement.setAttribute('id', taskList[i]._id);
        setListAttribute(newTaskElement);
    
        const newCheckTask = document.createElement('input');
        setCheckAttribute(newCheckTask);
    
        const newSpanTask = document.createElement('span');
        newSpanTask.textContent = taskInput.value;
        setSpanAttribute(newSpanTask);

        const newEditTask = document.createElement('input');
        setEditAttribute(newEditTask);

        const newDeleteTask = document.createElement('button');
        setDeleteAttribute(newDeleteTask);

        newTaskElement.appendChild(newCheckTask);
        newTaskElement.appendChild(newSpanTask);
        newTaskElement.appendChild(newEditTask);
        newTaskElement.appendChild(newDeleteTask);
        taskContainer.appendChild(newTaskElement);
    }
}*/

addTask = () => {
    const taskInfo = {
        _id: Date.now(),
        text: taskInput.value,
        isChecked: false
    };

    const newTaskElement = document.createElement('li');
    newTaskElement.setAttribute('id', taskList._id);
    ыetListAttribute(newTaskElement);
    
    const newCheckTask = document.createElement('input');
    setCheckAttribute(newCheckTask);
    
    const newSpanTask = document.createElement('span');
    newSpanTask.textContent = taskInput.value;
    setSpanAttribute(newSpanTask);

    const newEditTask = document.createElement('input');
    setEditAttribute(newEditTask);

    const newDeleteTask = document.createElement('button');
    setDeleteAttribute(newDeleteTask);

    newTaskElement.appendChild(newCheckTask);
    newTaskElement.appendChild(newSpanTask);
    newTaskElement.appendChild(newEditTask);
    newTaskElement.appendChild(newDeleteTask);
    taskContainer.appendChild(newTaskElement);

    //getLayoutTodo();

    taskList.push(taskInfo); 
    //console.log(newTaskElement);
} 

//TODO: add checkTask function
checkTask = (task) => {
    task.isChecked = !task.isChecked;
}

editTask = (task) => {
    const edit_task = document.getElementById(`${task._id}`);

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
    //checkbox.setAttribute('id', 'check');
    checkbox.setAttribute('class', 'form-check-input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.checked = false;
}

setSpanAttribute = (span) => {
    //span.setAttribute('id', 'text');
    span.setAttribute('class', 'form-check-label');
}

setEditAttribute = (input) => {
    //input.setAttribute('id', 'edit');
    input.hidden = true;
}

setDeleteAttribute = (button) => {
    //button.setAttribute('id', 'delete');
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'btn btn-danger');
    //button.setAttribute('onclick', 'deleteTask()');
    button.textContent = 'Delete';
}

taskInput.onkeydown = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
    }
};

taskContainer.addEventListener('click', listenEvent);