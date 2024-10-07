const form = document.querySelector('#task-form');
const todo = document.querySelector('#todo-lane');
const doing = document.querySelector('#doing-lane');
const done = document.querySelector('#done-lane');
const saveBtn = document.querySelector('#save');
const input = document.querySelector('#task-input');

let todoItems = [];
let doingItems = [];
let doneItems = [];
let source = null;
let target = null;

const stored = JSON.parse(localStorage.getItem('tasks'));
if (stored) {
    todoItems = stored.todo || [];
    doingItems = stored.doing || [];
    doneItems = stored.done || [];
    
    populateTaskLanes();
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const task = event.target[0].value;

    if (task.length) {
        addTaskToLane(task, todo);
        todoItems.push(task); 
        event.target[0].value = ""; 
    }
});

saveBtn.addEventListener('click', () => {
    saveTasksToLocalStorage();
    alert('Tasks successfully saved');
});

function populateTaskLanes() {
    todoItems.forEach(task => addTaskToLane(task, todo));
    doingItems.forEach(task => addTaskToLane(task, doing));
    doneItems.forEach(task => addTaskToLane(task, done));
}

function addTaskToLane(task, lane) {
    const div = document.createElement('div');
    const para = document.createElement('p');
    const div2 = document.createElement('div');
    const deleteDiv = document.createElement('div');
    const deleteButton = document.createElement('button');

    para.innerText = task;
    div.classList.add('task');
    div.setAttribute('draggable', 'true');

    div2.innerText = '...'; 
    div2.classList.add('dots'); 
    deleteButton.innerText = 'Delete';
    deleteButton.classList.add('del-btn');

    deleteDiv.appendChild(deleteButton);
    deleteDiv.classList.add('delete-div');
    deleteDiv.style.display = 'none'; 

   
    div2.addEventListener('click', () => {
        if (deleteDiv.style.display === 'none') {
            deleteDiv.style.display = 'block';
        } else {
            deleteDiv.style.display = 'none';
        }
    });
    
    div.addEventListener('mouseleave', () => {
        deleteDiv.style.display = 'none';
    });
    
    deleteButton.addEventListener('click', () => {
        div.remove(); 
        removeTaskFromStorage(task); 
    });

    
    div.addEventListener('dragstart', (e) => {
        source = e.target.parentNode.id;
        div.classList.add('is-dragging');
    });

    div.addEventListener('dragend', (e) => {
        div.classList.remove('is-dragging');
    });

   
    div.appendChild(para);
    div.appendChild(div2); 
    div.appendChild(deleteDiv); 
    lane.appendChild(div);
}


const taskLanes = document.querySelectorAll('.task-lane');

taskLanes.forEach(lane => {
    lane.addEventListener('dragover', (e) => {
        e.preventDefault(); 
        const bottomTask = closestSibling(lane, e.clientY);
        const currentTask = document.querySelector('.is-dragging');

        if (!bottomTask) {
            lane.appendChild(currentTask);
        } else {
            lane.insertBefore(currentTask, bottomTask);
        }
    });
    
    lane.addEventListener('drop', (e) => {
        const currentTask = document.querySelector('.is-dragging');
        if (currentTask) {
            const taskText = currentTask.querySelector('p').innerText;
            updateTaskArray(taskText, lane.id); 
            saveTasksToLocalStorage(); 
        }
    });
});


function closestSibling(phase, mouseY) {
    const els = phase.querySelectorAll(".task:not(.is-dragging)");
    let closestTask = null;
    let closestOffset = -100000000000;

    els.forEach(task => {
        const { top } = task.getBoundingClientRect();
        const offset = mouseY - top;

        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closestTask = task;
        }
    });
    return closestTask;
}

function removeTaskFromStorage(task) {
    const taskList = {
        todo: todoItems,
        doing: doingItems,
        done: doneItems,
    };

   
    if (todoItems.includes(task)) {
        todoItems.splice(todoItems.indexOf(task), 1);
    } else if (doingItems.includes(task)) {
        doingItems.splice(doingItems.indexOf(task), 1);
    } else if (doneItems.includes(task)) {
        doneItems.splice(doneItems.indexOf(task), 1);
    }

    saveTasksToLocalStorage(); 
}

function updateTaskArray(task, laneId) {
   
    removeTaskFromStorage(task);

    
    if (laneId === 'todo-lane') {
        todoItems.push(task);
    } else if (laneId === 'doing-lane') {
        doingItems.push(task);
    } else if (laneId === 'done-lane') {
        doneItems.push(task);
    }
}

function saveTasksToLocalStorage() {
    const tasks = JSON.stringify({
        todo: todoItems,
        doing: doingItems,
        done: doneItems
    });
    localStorage.setItem('tasks', tasks);
}
