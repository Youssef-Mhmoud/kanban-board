const btnNot = document.querySelector(".btn-not");
const btnIn = document.querySelector(".btn-in");
const btnComp = document.querySelector(".btn-comp");
const notStartedList = document.querySelector(".not-started");
const inProgressList = document.querySelector(".in-progress");
const completedList = document.querySelector(".completed");
const lists = document.querySelectorAll(".list");

// Functions
let task = {
  id: Date.now(),
  text: "",
};

// Add a task
const addTask = function (progress) {
  progress.innerHTML += `
  <div class="task" draggable="true">
    <div class="current-task">${task.text}</div>
    <div>
      <i class="fa-solid fa-pen"></i>
      <i class="fa-solid fa-trash-can"></i>
    </div>
  </div>
  `;
};

// Drag & Drop
const dragAndDrop = function () {
  document.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("task")) {
      e.target.classList.add("draggable");
    }
  });

  document.addEventListener("dragend", (e) => {
    if (e.target.classList.contains("task")) {
      e.target.classList.remove("draggable");
    }
  });

  document.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("task")) {
      e.target.classList.add("drag");
    }
  });

  document.addEventListener("dragleave", (e) => {
    if (e.target.classList.contains("task")) {
      e.target.classList.remove("drag");
    }
  });

  document.addEventListener("drop", (e) => {
    if (e.target.classList.contains("task")) {
      e.target.classList.remove("drag");
    }
  });

  lists.forEach((list) => {
    list.addEventListener("drop", (e) => {
      // e.preventDefault();
      const curTask = document.querySelector(".draggable");

      const afterElement = getDrag(list, e.clientY);

      if (!afterElement) {
        list.appendChild(curTask);
      } else {
        list.insertBefore(curTask, afterElement);
      }
    });
  });
};

// To put element after element
const getDrag = function (container, y) {
  const els = container.querySelectorAll(".task:not(.draggable)");

  let closestTask = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  els.forEach((task) => {
    const { top } = task.getBoundingClientRect();

    const offset = y - top;

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestTask = task;
    }
  });

  return closestTask;
};

// Event listeners
btnNot.addEventListener("click", () => {
  dragAndDrop();
  addTask(notStartedList);
});

btnIn.addEventListener("click", () => {
  dragAndDrop();
  addTask(inProgressList);
});

btnComp.addEventListener("click", () => {
  dragAndDrop();
  addTask(completedList);
});

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-trash-can")) {
    e.target.parentElement.parentElement.remove();
  }

  if (e.target.classList.contains("fa-pen")) {
    const curTask =
      e.target.parentElement.parentElement.querySelector(".current-task");
    curTask.setAttribute("contenteditable", "true");
    curTask.focus();
    dragAndDrop();
  }

  if (
    !e.target.classList.contains("fa-pen") &&
    e.target.querySelector(".current-task") !== null
  ) {
    // e.target.querySelector(".current-task").removeAttribute("contenteditable");
    // task.text = e.target.querySelector(".current-task").textContent;
    e.target.querySelectorAll(".current-task").forEach((smTask) => {
      smTask.removeAttribute("contenteditable");
      task.text = smTask.textContent;
      task.text = "";
    });
  }
});
