const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filters = document.querySelectorAll(".filter");
const searchInput = document.getElementById("searchInput");
const prioritySelect = document.getElementById("priority");
const themeBtn = document.getElementById("themeBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

renderTasks();
updateStats();
loadTheme();

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", e => {
    if(e.key === "Enter") addTask();
});

searchInput.addEventListener("input", renderTasks);

filters.forEach(btn => {
    btn.addEventListener("click", () => {

        document
        .querySelector(".filter.active")
        .classList.remove("active");

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        renderTasks();
    });
});

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
        ? "dark"
        : "light"
    );
});

function addTask(){

    const text = taskInput.value.trim();

    if(!text) return;

    tasks.push({
        id: Date.now(),
        text,
        completed:false,
        priority: prioritySelect.value,
        created: new Date().toLocaleString()
    });

    saveTasks();

    taskInput.value="";

    renderTasks();

    updateStats();
}

function saveTasks(){
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function renderTasks(){

    taskList.innerHTML = "";

    let filtered = tasks.filter(task => {

        if(currentFilter==="active")
            return !task.completed;

        if(currentFilter==="completed")
            return task.completed;

        return true;
    });

    const search = searchInput.value.toLowerCase();

    filtered = filtered.filter(task =>
        task.text.toLowerCase().includes(search)
    );

    filtered.forEach(task => {

        const li = document.createElement("li");

        li.className =
            `task ${task.completed ? "completed" : ""}`;

        li.dataset.id = task.id;

        li.innerHTML = `
            <div class="task-info">
                <h3>${task.text}</h3>

                <p>${task.created}</p>

                <div class="priority">
                    ${task.priority}
                </div>
            </div>

            <div class="actions">

                <button class="complete">
                    ✔
                </button>

                <button class="edit">
                    ✏
                </button>

                <button class="delete">
                    🗑
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });
}

taskList.addEventListener("click", e => {

    const id =
    Number(
        e.target.closest(".task").dataset.id
    );

    if(e.target.classList.contains("delete")){

        tasks = tasks.filter(task =>
            task.id !== id
        );
    }

    if(e.target.classList.contains("complete")){

        tasks = tasks.map(task => {

            if(task.id === id)
                task.completed =
                !task.completed;

            return task;
        });
    }

    if(e.target.classList.contains("edit")){

        const task = tasks.find(
            task => task.id === id
        );

        const newText =
        prompt("Edit Task", task.text);

        if(newText){

            task.text = newText;
        }
    }

    saveTasks();

    renderTasks();

    updateStats();
});

function updateStats(){

    document.getElementById("total")
    .textContent = tasks.length;

    document.getElementById("completed")
    .textContent =
    tasks.filter(task => task.completed).length;

    document.getElementById("pending")
    .textContent =
    tasks.filter(task => !task.completed).length;
}

function loadTheme(){

    const theme =
    localStorage.getItem("theme");

    if(theme==="dark"){
        document.body.classList.add("dark");
    }
}
