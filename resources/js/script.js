const taskList = [];
const taskContainer = document.getElementById('task-container');

//TODO: add function checkTask, editTask, deleteTask 
//and track this functions with Event Parent element id
const listenEvent = (e) => {
    //console.log(e.target.parentElement);
    const finderTask = taskList.find((task) => task._id == e.target.parentElement.id);
    //if (e.target.)
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
    
    const newLabelTask = document.createElement('label');
    newLabelTask.textContent = taskInput;
    setLabelAttribute(newLabelTask);

    newTaskElement.appendChild(newCheckTask);
    newTaskElement.appendChild(newLabelTask);
    taskContainer.appendChild(newTaskElement);

    taskList.push(taskInfo); 
    //console.log(newTaskElement);
} 

//TODO: add checkTask function
checkTask = (task) => {
    task.checked = !task.checked;
}

setListAttribute = (list) => {
    list.setAttribute('class', 'list-group-item');
}

setCheckAttribute = (checkbox) => {
    checkbox.setAttribute('id', 'checkbox');
    checkbox.setAttribute('class', 'form-check-input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.checked = false;
}

setLabelAttribute = (label) => {
    label.setAttribute('id', 'label');
    label.setAttribute('class', 'form-check-label');
}

taskContainer.addEventListener('click', listenEvent);