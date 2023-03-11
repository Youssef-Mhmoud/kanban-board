// -- Buttons
const btnNot = document.querySelector(".btn-not");
const btnIn = document.querySelector(".btn-in");
const btnComp = document.querySelector(".btn-comp");

// -- Progress List
const notStartedList = document.querySelector(".not-started");
const inProgressList = document.querySelector(".in-progress");
const completedList = document.querySelector(".completed");
const lists = document.querySelectorAll(".list");

// - Init
let tasksOne = [];

let tasksTwo = [];

let tasksThree = [];

const getStorage = function () {
  const retrive1 = JSON.parse(localStorage.getItem("listOne"));
  const retrive2 = JSON.parse(localStorage.getItem("listTwo"));
  const retrive3 = JSON.parse(localStorage.getItem("listThree"));

  tasksOne = retrive1 ?? [];
  tasksTwo = retrive2 ?? [];
  tasksThree = retrive3 ?? [];
};

getStorage();

// - Functions
const createTask = function (progress) {
  if (progress.classList.contains("not-started")) {
    progress.innerHTML = `<div class="empty"></div>`;

    tasksOne.forEach((task) => {
      const HTML = `
      <div class="task-flex" draggable="true" data-ID="${task.id}">
        <div class="task">${task.text}</div>
        <div class="icons">
          <i class="fa-solid fa-pen"></i>
          <i class="fa-solid fa-trash-can"></i>
        </div>
        <div class="empty"></div>
      </div>
      `;

      progress.innerHTML += HTML;
    });
  }

  if (progress.classList.contains("in-progress")) {
    progress.innerHTML = `<div class="empty"></div>`;

    tasksTwo.forEach((task) => {
      const HTML = `
      <div class="task-flex" draggable="true" data-ID="${task.id}">
        <div class="task">${task.text}</div>
        <div class="icons">
          <i class="fa-solid fa-pen"></i>
          <i class="fa-solid fa-trash-can"></i>
        </div>
        <div class="empty"></div>
      </div>
      `;

      progress.innerHTML += HTML;
    });
  }

  if (progress.classList.contains("completed")) {
    progress.innerHTML = `<div class="empty"></div>`;

    tasksThree.forEach((task) => {
      const HTML = `
      <div class="task-flex" draggable="true" data-ID="${task.id}">
        <div class="task">${task.text}</div>
        <div class="icons">
          <i class="fa-solid fa-pen"></i>
          <i class="fa-solid fa-trash-can"></i>
        </div>
        <div class="empty"></div>
      </div>
      `;

      progress.innerHTML += HTML;
    });
  }
};
createTask(notStartedList);
createTask(inProgressList);
createTask(completedList);

const removeTask = function (id, progress) {
  tasksOne = tasksOne.filter((task) => task.id != id);
  tasksTwo = tasksTwo.filter((task) => task.id != id);
  tasksThree = tasksThree.filter((task) => task.id != id);

  saveDate("listOne", tasksOne);
  saveDate("listTwo", tasksTwo);
  saveDate("listThree", tasksThree);

  createTask(progress);

  dragAndDrop();
};

const updateTask = function (id, text, progress) {
  const taskEl = tasksOne.find((task) => task.id == id);
  const taskEl2 = tasksTwo.find((task) => task.id == id);
  const taskEl3 = tasksThree.find((task) => task.id == id);

  if (progress.classList.contains("not-started")) {
    taskEl.text = text;
    saveDate("listOne", tasksOne);
  }

  if (progress.classList.contains("in-progress")) {
    taskEl2.text = text;
    saveDate("listTwo", tasksTwo);
  }

  if (progress.classList.contains("completed")) {
    taskEl3.text = text;
    saveDate("listThree", tasksThree);
  }

  createTask(progress);
};

// - UI Interface
const AddTask = function (progress) {
  let newTask = {
    id: Date.now(),
    text: "New Task",
  };

  if (progress.classList.contains("not-started")) {
    tasksOne.push(newTask);

    createTask(progress);

    saveDate("listOne", tasksOne);
  }

  if (progress.classList.contains("in-progress")) {
    tasksTwo.push(newTask);

    createTask(progress);
    saveDate("listTwo", tasksTwo);
  }

  if (progress.classList.contains("completed")) {
    tasksThree.push(newTask);

    createTask(progress);
    saveDate("listThree", tasksThree);
  }
  dragAndDrop();
};

const dragAndDrop = function () {
  document.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("task-flex")) {
      e.target.classList.add("drag");

      if (e.target.getAttribute("data-ID") == null) return;

      e.dataTransfer.setData("text/plain", e.target.getAttribute("data-ID"));
    }
  });

  document.addEventListener("dragend", (e) => {
    if (e.target.classList.contains("task-flex")) {
      e.target.classList.remove("drag");
    }
  });

  const emptyEls = document.querySelectorAll(".empty");

  emptyEls.forEach((emptyEl) => {
    emptyEl.addEventListener("dragover", (e) => {
      e.preventDefault();

      emptyEl.classList.add("draggable");
    });

    emptyEl.addEventListener("dragleave", (e) => {
      emptyEl.classList.remove("draggable");
    });

    emptyEl.addEventListener("drop", (e) => {
      emptyEl.classList.remove("draggable");

      const contTasks = emptyEl.closest(".cont-tasks");
      const emptyArr = [...contTasks.querySelectorAll(".empty")];
      const emptyIndex = emptyArr.indexOf(emptyEl);

      const taskID = e.dataTransfer.getData("text/plain");
      const taskEl = document.querySelector(`[data-ID="${taskID}"]`);
      const afterEl = emptyEl.parentElement.classList.contains("task-flex")
        ? emptyEl.parentElement
        : emptyEl;

      const task = {
        id: +taskID,
        text: taskEl.innerText,
      };

      tasksOne = tasksOne.filter((task) => task.id != taskID);
      tasksTwo = tasksTwo.filter((task) => task.id != taskID);
      tasksThree = tasksThree.filter((task) => task.id != taskID);

      if (contTasks.querySelector(".not-started")) {
        tasksOne.splice(emptyIndex, 0, task);
      }

      if (contTasks.querySelector(".in-progress")) {
        tasksTwo.splice(emptyIndex, 0, task);
      }

      if (contTasks.querySelector(".completed")) {
        tasksThree.splice(emptyIndex, 0, task);
      }

      saveDate("listOne", tasksOne);
      saveDate("listTwo", tasksTwo);
      saveDate("listThree", tasksThree);

      afterEl.after(taskEl);
    });
  });

  // ---------------- Mobile
  document.addEventListener("touchstart", (e) => {
    if (e.target.parentElement.classList.contains("task-flex")) {
      console.log(e);
      e.target.parentElement.classList.add("drag");

      // if (e.target.parentElement.getAttribute("data-ID") == null) return;

      // e.target.dataTransfer.setData(
      //   "text/plain",
      //   e.target.parentElement.getAttribute("data-ID")
      // );
    }
  });

  document.addEventListener("touchend", (e) => {
    if (e.target.parentElement.classList.contains("task-flex")) {
      e.target.parentElement.classList.remove("drag");
    }
  });

  document.addEventListener("touchmove", (e) => {
    // e.preventDefault();
    if (e.target.parentElement.classList.contains("task-flex")) {
      e.target.parentElement.classList.add("drag");

      // if()
    }
  });

  /////////////////////////////////////////////
};
dragAndDrop();

// - Local Storage
const saveDate = function (key, val) {
  localStorage.setItem(key, JSON.stringify(val));
};

// - Event Listeners
btnNot.addEventListener("click", () => {
  AddTask(notStartedList);
});

btnIn.addEventListener("click", () => {
  AddTask(inProgressList);
});

btnComp.addEventListener("click", () => {
  AddTask(completedList);
});

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-trash-can")) {
    const id = e.target.parentElement.parentElement.getAttribute("data-ID");
    const progress = e.target.parentElement.parentElement.parentElement;
    removeTask(id, progress);
  }
});

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-pen")) {
    const taskEl = e.target.parentElement.parentElement.querySelector(".task");
    taskEl.setAttribute("contentEditable", "true");
    taskEl.focus();

    taskEl.addEventListener("blur", () => {
      taskEl.removeAttribute("contentEditable");

      const id = e.target.parentElement.parentElement.getAttribute("data-ID");

      const text = taskEl.textContent;

      const progress = e.target.parentElement.parentElement.parentElement;

      updateTask(id, text, progress);
    });
    dragAndDrop();
  }
  dragAndDrop();
});
