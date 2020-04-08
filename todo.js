// ???-1 что-то не нравится мне тут
// checkAll[0].prop("checked", "checked");

$(document).ready(function () {
  const $checkAll = $(".check-all");
  const $todoText = $(".todo-text");
  const $todoList = $(".todo-list");
  const $footer = $(".footer");
  const $itemsLeft = $(".items-left");
  const $clearComplete = $(".clear-complete");
  const $filterAll = $("#all");
  const $filterActive = $("#active");
  const $filterComplete = $("#complete");
  const $tuningPanel = $(".tuning-panel");
  const $tuning = $(".tuning");
  const $tuningPage = $(".tuning-page input");
  const $pagination = $(".pagination");

  let todos = [];
  let counter = 0;

  function addTodo(e) {
    if (e.keyCode === 13) {
      try {
        if ($todoText.val() === "") {
          throw new SyntaxError(
            "Данные неполны: введите значение в поле ввода"
          );
        }

        pushTodos();
        render(true);
        $todoText.val("");
      } catch (err) {
        setTimeout(() => {
          setTimeout(() => {
            $todoText.removeClass("border border-danger");
          }, 500);
          $todoText.addClass("border border-danger");
        }, 0);
        // add hint or change placeholder
      }
    }
  }

  // add new todo
  function pushTodos() {
    todos.push({ done: false, value: $todoText.val(), id: counter });
    counter++;
  }

  function renderHeader(todosFilter) {
    if (todosFilter.length) {
      let arrLeft = todosFilter.filter((item) => item.done === false);
      arrLeft.length
        ? ($checkAll[0].checked = false)
        : ($checkAll[0].checked = true);
      $checkAll.closest(".input-group-prepend").removeClass("invisible");
    } else {
      $checkAll.closest(".input-group-prepend").addClass("invisible");
      $checkAll[0].checked = false;
    }
  }

  function getPageTodos() {
    let numberPage = $pagination.children(".page-item.active").data("pageId"); // find number of active page
    let start = +$tuningPage.val() * (numberPage - 1);
    let end = start + +$tuningPage.val();
    return todos.slice(start, end);
  }

  function render(add = false) {
    let todosFilter = todos;

    renderPagination(add);

    // filter array
    if (todos.length > $tuningPage.val()) {
      todosFilter = getPageTodos();
    }

    if (todosFilter.length === 0) {
      $pagination.children(".page-item").removeClass("active");
      $pagination.children(".page-item:last-child").addClass("active");
      todosFilter = getPageTodos();
    }

    todosFilter = filterTodo(todosFilter);

    renderHeader(todosFilter);

    let checked;
    let strike;

    $todoList.empty();
    todosFilter.forEach((item, index) => {
      checked = item.done ? "checked" : "";
      strike = item.done ? "strike" : "";

      $todoList.append(`<div class="todo-item input-group" data-tid="${item.id}">
        <div class="input-group-prepend">
          <div class="input-group-text">
            <input type="checkbox" class="todo-check" ${checked}/>
          </div>
        </div>
        <li class="todo-list-item list-group-item flex-grow-1 ${strike}">
          ${item.value}
          <input type="text" class="todo-edit invisible">
          <button
            type="button"
            class="close text-danger"
          >
            <span class="btn-delete-todo">&times;</span>
          </button>
        </li>
      </div>`);
    });

    renderFooter();
  }

  function filterTodo(todosFilter) {
    return $filterAll.closest(".btn").hasClass("active")
      ? todosFilter
      : todosFilter.filter(
          (item) =>
            item.done === $filterComplete.closest(".btn").hasClass("active")
        );
  }

  function renderFooter() {
    let arrLeftLength = todos.filter((item) => item.done == false).length;
    let arrDoneLength = todos.length - arrLeftLength;

    // show footer
    todos.length
      ? $footer.removeClass("invisible")
      : $footer.addClass("invisible");

    // build "items left"
    $itemsLeft.text(`${arrLeftLength} items left`);

    // show "Clear complete"
    arrDoneLength
      ? $clearComplete.removeClass("invisible")
      : $clearComplete.addClass("invisible");
  }

  function renderPagination(add) {
    let numberPage = $pagination.children(".page-item.active").data("pageId");

    $pagination.empty();
    if (todos.length > $tuningPage.val()) {
      let count = Math.ceil(todos.length / $tuningPage.val());
      for (let i = 0; i < count; i++) {
        $pagination.append(`<li class="page-item ${
          i === numberPage - 1 ? "active" : ""
        }" data-page-id="${i + 1}">
        <a class="page-link" href="#">${i + 1}</a>
      </li>`);
      }
    }
    if (add) {
      $pagination.children(".page-item").removeClass("active");
      $pagination.children(".page-item:last-child").addClass("active");
    }
  }

  // check one todo
  function checkTodo(id) {
    let index = todos.findIndex((curr) => curr.id === id);
    todos[index].done = !todos[index].done;

    render();
  }

  // check all todos
  function checkAllTodo() {
    for (key of todos) {
      key.done = $checkAll[0].checked;
    }

    render();
  }

  // delete one case
  function deleteTodo(id) {
    let index = todos.findIndex((curr) => curr.id === id);
    todos.splice(index, 1);

    render();
  }

  // clear complete
  function clearAllTodo() {
    todos = todos.filter((item) => item.done === false);

    render();
  }

  // edit todo
  function editTodo(e, id) {
    let elem = e.target.firstElementChild;
    let index = todos.findIndex((curr) => curr.id === id);

    elem.classList.remove("invisible");
    elem.focus();
    elem.value = todos[index].value;
  }

  // save todo
  function saveTodo(e, id) {
    let index = todos.findIndex((curr) => curr.id === id);
    todos[index].value = e.target.value;
    e.target.classList.add("invisible");

    render();
  }

  function setFilterActive(elem) {
    elem.closest(".filters").children(".btn").removeClass("active");
    elem.closest(".btn").addClass("active");
  }

  // filter all
  function filterAll() {
    setFilterActive($filterAll);

    render();
  }

  // filter active
  function filterActive() {
    setFilterActive($filterActive);

    render();
  }

  // filter complete
  function filterComplete() {
    setFilterActive($filterComplete);

    render();
  }

  // "Enter" на поле ввода
  $todoText.keydown(addTodo);

  // click "Check all"
  $checkAll.click(checkAllTodo);

  // click "Clear complete"
  $clearComplete.click(clearAllTodo);

  // click filter
  $filterAll.click(filterAll);
  $filterActive.click(filterActive);
  $filterComplete.click(filterComplete);

  // click list --> delegation events
  $todoList.click((e) => {
    let id = +e.target.closest(".todo-item").dataset.tid;

    // click check todo
    if (e.target.classList.contains("todo-check")) {
      checkTodo(id);
    }

    // click delete todo
    if (e.target.classList.contains("btn-delete-todo")) {
      deleteTodo(id);
    }
  });

  // dblclick, edit todo
  $(document).on("dblclick", ".todo-list-item", function (e) {
    editTodo(e, +e.target.closest(".todo-item").dataset.tid);
  });

  // keydown "enter" on edit input
  $(document).on("keydown", ".todo-edit", function (e) {
    if (e.keyCode === 13) {
      saveTodo(e, +e.target.closest(".todo-item").dataset.tid);
    }
  });

  // blur on edit input
  $(document).on("blur", ".todo-edit", function (e) {
    saveTodo(e, +e.target.closest(".todo-item").dataset.tid);
  });

  // click on tuning button
  $tuning.click(() => {
    $tuning.toggleClass("tuning-up");
    $tuningPanel.slideToggle("fast");
  });

  // check value tuning-page input
  $tuningPage.change(function () {
    if (this.value.length > 2) {
      this.value = this.value.slice(0, 2);
    }
    if (this.value < 0) {
      this.value = 3;
    }

    render();
  });

  // click on pagination
  $pagination.click((e) => {
    $pagination.children(".page-item").removeClass("active");
    e.target.closest(".page-item").classList.add("active");

    render();
  });
});
