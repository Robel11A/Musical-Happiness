// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
  if (!nextId) {
    nextId = 1;
  } else {
    nextId++;
  }
  localStorage.setItem("nextId", JSON.stringify(nextId)); // Save the new nextId to local storage
  return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  return `
      <div class="card task-card" id="task-${task.id}" style="background-color: ${task.color};">
        <div class="card-body">
          <h5 class="card-title">${task.title}</h5>
          <p class="card-text">${task.description}</p>
          <p class="card-text"><small class="text-muted">Due: ${task.deadline}</small></p>
          <button class="btn btn-danger" onclick="handleDeleteTask(${task.id})">Delete</button>
        </div>
      </div>
    `;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  const todoColumn = $("#todo-cards");
  const inProgressColumn = $("#in-progress-cards");
  const doneColumn = $("#done-cards");

  todoColumn.empty();
  inProgressColumn.empty();
  doneColumn.empty();

  taskList.forEach((task) => {
    const cardHtml = createTaskCard(task);
    switch (task.status) {
      case "To Do":
        todoColumn.append(cardHtml);
        break;
      case "In Progress":
        inProgressColumn.append(cardHtml);
        break;
      case "Done":
        doneColumn.append(cardHtml);
        break;
    }
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  const title = $("#task-title").val();
  const description = $("#task-description").val();
  const deadline = $("#task-deadline").val();

  const taskId = generateTaskId();
  const newTask = {
    id: taskId,
    title: title,
    description: description,
    deadline: deadline,
    status: "To Do",
    color: dayjs().isSame(dayjs(deadline), "day")
      ? "yellow"
      : dayjs().isAfter(dayjs(deadline))
      ? "red"
      : "white",
  };

  taskList.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();

  $("#formModal").modal("hide");
  $("#taskForm").find("input[type=text], textarea").val("");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(taskId) {
  taskList = taskList.filter((task) => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const newStatus = ui.item.parent().attr("id");
  const taskId = parseInt(ui.item.attr("id").split("-")[1]);
  const task = taskList.find((task) => task.id === taskId);

  switch (newStatus) {
    case "to-do":
      task.status = "To Do";
      break;
    case "in-progress":
      task.status = "In Progress";
      break;
    case "done":
      task.status = "Done";
      break;
  }
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

  renderTaskList();

  $(".lane").sortable({
    connectWith: ".lane",
    stop: function (event, ui) {
      const newStatus = ui.item.parent().attr("id");
      const taskId = parseInt(ui.item.attr("id").split("-")[1]);
      const task = taskList.find((t) => t.id === taskId);
      if (task) {
        switch (newStatus) {
          case "to-do":
            task.status = "To Do";
            break;
          case "in-progress":
            task.status = "In Progress";
            break;
          case "done":
            task.status = "Done";
            break;
        }
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
      }
    },
  });

  $("#task-deadline").datepicker({
    dateFormat: "yy-mm-dd",
  });

  $("#taskForm").on("submit", handleAddTask);
});
