// output today's date
const date = document.getElementById('date');
options = {weekday: 'long', month: 'short', day: 'numeric'};
const today = new Date();
date.innerHTML = today.toLocaleDateString('en-US', options);

const list = document.querySelector('#list');
let id = 0;

// UI object
class UI{

    static displayToDo(){
        const todos = Store.getToDos();
        todos.forEach((todo) => UI.addToDoList(todo.text, todo.id, todo.completed));
    }

    static addToDoList(toDo, id, ifChecked){
        const completed = ifChecked ? 'checkedLine' : '';
        const statusIcon = ifChecked ? 'fa-check-circle' : 'fa-circle';
        const listItem = `
        <li>
            <p class="text" ${completed}>${toDo}</p>
            <i class="far ${statusIcon} co" action="complete" id="${id}"></i>
            <i class="far fa-trash-alt" action="delete" id="${id}"></i>
        </li>
        `;
        const position = 'beforeend';
        list.insertAdjacentHTML(position, listItem);
    }

    static removeToDo(element){
        element.parentNode.parentNode.removeChild(element.parentNode);

        // remove todo from the storage
        const curId = element.attributes.id.value;
        const todos = Store.getToDos();

        todos.forEach((todo, index) => {
            if(+todo.id === +curId){
                todos.splice(index, 1);
            }
        });

        localStorage.setItem('toDo', JSON.stringify(todos));
    }

    static completeToDo(element){
        const CHECK = 'fa-check-circle';
        const UNCHECK = 'fa-circle';
        element.classList.toggle(CHECK);
        element.classList.toggle(UNCHECK);
        element.parentNode.querySelector('.text').classList.toggle('checkedLine');

        //update the storage
        const curId = element.attributes.id.value;
        const todos = Store.getToDos();
        todos.forEach((todo, index) => {
            if(+todo.id === +curId){
                todos[index].completed = todos[index].completed ? false : true;
            }
        });

        localStorage.setItem('toDo', JSON.stringify(todos));
    }

    static clearToDo(){
        list.innerHTML = '';
        localStorage.clear();
    }
}

class Store{
    static getToDos(){
        let todos;
        if(localStorage.getItem('toDo') === null){
            todos = [];
        }else{
            todos = JSON.parse(localStorage.getItem('toDo'));
        }
        return todos;
    }

    static addToDoList(toDo, id){
        const todos = Store.getToDos();

        todos.push({
            text: toDo,
            id: id,
            completed: false
        });

        localStorage.setItem('toDo', JSON.stringify(todos));
    }

}

// Event to display todos
document.addEventListener('DOMContentLoaded', UI.displayToDo);

// If press ENTER then call addNewToDo()
document.addEventListener('keyup', function(){
    if(event.keyCode == 13){
        const toDoItem = input.value;
        // a little validation
        if(toDoItem){
            // add item to UI
           UI.addToDoList(toDoItem, Date.now());
           // add item to local storage
           Store.addToDoList(toDoItem, Date.now());
           id++;
       }
       input.value = "";
    }
});

document.addEventListener('click', (event) => {
    const element = event.target;
    if(element.attributes.action){
        const elementAction = element.attributes.action.value;
        if(elementAction == 'complete'){
            UI.completeToDo(element);
        }else if(elementAction == 'delete'){
            UI.removeToDo(element);
        }
    }
});