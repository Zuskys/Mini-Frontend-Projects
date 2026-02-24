let todo = JSON.parse(localStorage.getItem("todo")) || [];
const inputTask = document.getElementById("input-item");
const addBtn = document.getElementById("add-btn");
const itemList = document.getElementById("show-todo");
const delAllBtn = document.getElementById("del-all-btn");
const totalItems = document.getElementById("num-items");

//Initialize the page
document.addEventListener("DOMContentLoaded", () => {
	displayItems();
	//add the new task
	addBtn.addEventListener("click", newTask);
	inputTask.addEventListener("keypress", (e) => {
		if (e.key === "Enter") newTask();
	});
	//delete all items in the list
	delAllBtn.addEventListener("click", () => {
		todo = [];
		saveItems();
		displayItems();
	});
});

//Add Task to localStorage
function newTask() {
	//get input
	const textTask = inputTask.value.trim();
	//push task to localStorage
	if (textTask !== "") {
		todo.push({
			name: textTask,
			checked: false,
		});
		inputTask.value = ""; //back to normal
		saveItems();
		displayItems();
	} else {
		alert("The item must contain text. Please write something.");
	}
}
//Show Items in HTML
function displayItems() {
	itemList.innerHTML = "";
	//create element for each item in the array
	todo.forEach((item, index) => {
		const li = document.createElement("li");
		li.className = "task";
		li.innerHTML = `
        <label for="task-${index}">
			<input type="checkbox" id="task-${index}" class="todo-ckbox" ${item.checked ? "checked" : ""} />
			<span class="todo-text ${item.checked ? "text-checked" : "text-unchecked"}">${item.name}</span>
		</label>
		<button class="del-btn">
			<i class="fa-solid fa-trash"></i>
		</button>
		<button class="edit-btn">
			<i class="fa-solid fa-pencil"></i>
		</button>
        `;
		itemList.appendChild(li); //Add the item to the container
	});
	//Change the txt for all the items
	totalItems.textContent = todo.length;
}
//Delete Item
function delItem(e) {
	todo.splice(e, 1);
	saveItems();
	displayItems();
}
//Edit Item
function editItem(e, li) {
	const liText = li.querySelector(".todo-text");
	const oldText = todo[e].name;

	//create and replace input
	const input = document.createElement("input");
	input.type = "text";
	input.className = "edit-input";
	input.value = oldText;
	liText.replaceWith(input);
	input.focus();

	//save text
	const saveEdit = () => {
		const newText = input.value.trim();
		if (newText && newText !== oldText) {
			todo[e].name = newText;
			saveItems();
		}
		displayItems();
	};
	input.addEventListener("blur", saveEdit);
	input.addEventListener("keypress", (e) => {
		if (e.key === "Enter") saveEdit();
	});
}

//Toggle Checkbox
function toggleCheck(e) {
	todo[e].checked = !todo[e].checked;
	saveItems();
	displayItems();
}

//Save Items in localStorage
function saveItems() {
	localStorage.setItem("todo", JSON.stringify(todo));
}

//Event Listener Edit and Delete
itemList.addEventListener("click", (e) => {
	const li = e.target.closest("li");
	if (!li) return;
	const index = Array.from(itemList.children).indexOf(li);

	if (e.target.closest(".del-btn")) {
		delItem(index);
	} else if (e.target.closest(".edit-btn")) {
		editItem(index, li);
	} else if (e.target.classList.contains("todo-ckbox")) {
		toggleCheck(index);
	}
});
