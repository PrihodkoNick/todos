$(document).ready(function () {
  const $checkAll = $(".check-all");
  const $todoText = $(".todo-text");
  const $todoList = $(".todo-list");
  const $footer = $(".footer");
  const $clearComplete = $(".clear-complete");
  const $filterAll = $("#all");
  const $filterActive = $("#active");
  const $filterComplete = $("#complete");
  const $pagination = $(".pagination");
  const $todosOnPage = $(".todos-on-page");

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

        // add new todo
        todos.push({ done: false, value: $todoText.val(), id: counter });
        counter++;

        render(true);
        $todoText.val("");
      } catch (err) {
        setTimeout(() => {
          setTimeout(() => {
            $todoText.removeClass("border border-danger");
          }, 500);
          $todoText.addClass("border border-danger");
        }, 0);
        console.log(err);
      }
    }
  }

  function renderHeader() {
    if (todos.length) {
      let arrLeft = todos.filter((item) => item.done === false);
      arrLeft.length
        ? ($checkAll[0].checked = false)
        : ($checkAll[0].checked = true);
      $checkAll.closest(".input-group-prepend").removeClass("invisible");
    } else {
      $checkAll.closest(".input-group-prepend").addClass("invisible");
      $checkAll[0].checked = false;
    }
  }

  function showTodoOnPage(array, page) {
    let start = +$todosOnPage.val() * (page - 1);
    let end = start + +$todosOnPage.val();

    return array.slice(start, end);
  }

  // All render
  function render(add = false) {
    let todosFilter = todos;
    let currentPage = 0;

    todosFilter = filterTodo(todosFilter); // all - active - complete

    let countPages = Math.ceil(todosFilter.length / +$todosOnPage.val());

    if (add) {
      currentPage = countPages;
    } else {
      currentPage = +$(".page-item.active").data("pageId");
      currentPage = currentPage || 1;
    }

    if (countPages > 1) {
      if (currentPage > countPages) {
        currentPage--;
      }
      todosFilter = showTodoOnPage(todosFilter, currentPage);
    }

    renderHeader();

    let str = "";
    todosFilter.forEach((item) => {
      str += `<div class="todo-item input-group" data-tid="${item.id}">
        <div class="input-group-prepend">
          <div class="input-group-text">
            <input type="checkbox" class="todo-check" ${
              item.done ? "checked" : ""
            }/>
          </div>
        </div>
        <li class="todo-list-item list-group-item flex-grow-1 ${
          item.done ? "completed" : ""
        }">
          ${item.value}
          <input type="text" class="todo-edit invisible">
          <button
            type="button"
            class="close text-danger"
          >
            <span class="btn-delete-todo">&times;</span>
          </button>
        </li>
      </div>`;
    });
    $todoList.html(str);

    renderFooter();
    renderPagination(countPages, currentPage);
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
    let activeCount = todos.filter((item) => !item.done).length;
    let doneCount = todos.length - activeCount;

    // show footer
    todos.length
      ? $footer.removeClass("invisible")
      : $footer.addClass("invisible");

    // create "items left"
    $(".items-left").text(`${activeCount} items left`);

    // show "Clear complete" +++
    doneCount
      ? $clearComplete.removeClass("invisible")
      : $clearComplete.addClass("invisible");
  }

  function renderPagination(countPages, page) {
    let str = "";

    if (countPages > 1) {
      for (let i = 1; i <= countPages; i++) {
        str += `<li class="page-item ${
          page === i ? "active" : ""
        }" data-page-id="${i}">
          <a class="page-link" href="#">${i}</a>
        </li>`;
      }
    }
    $pagination.html(str);
  }

  // check/uncheck one todo
  function checkTodo(id) {
    let idx = todos.findIndex((curr) => curr.id === id);
    todos[idx].done = !todos[idx].done;

    render();
  }

  // check/uncheck all todos
  function checkAllTodo() {
    for (key of todos) {
      key.done = $checkAll[0].checked;
    }

    render();
  }

  // delete one todo
  function deleteTodo(id) {
    let idx = todos.findIndex((curr) => curr.id === id);
    todos.splice(idx, 1);

    render();
  }

  // clear complete
  function clearAllTodo() {
    todos = todos.filter((item) => item.done === false);

    render();
  }

  // edit todo
  function editTodo(e, id) {
    let el = e.target.firstElementChild;
    let idx = todos.findIndex((curr) => curr.id === id);

    el.classList.remove("invisible");
    el.focus();
    el.value = todos[idx].value;
  }

  // save todo
  function saveTodo(e, id) {
    let idx = todos.findIndex((curr) => curr.id === id);

    if (e.target.value === "") {
      todos.splice(idx, 1);
    } else {
      todos[idx].value = e.target.value;
    }

    e.target.classList.add("invisible");
    render();
  }

  // filter all
  function setFilter(e) {
    $(".filters .btn.active").removeClass("active");

    if (e.target.id === "all") {
      $filterAll.closest(".btn").addClass("active");
    } else if (e.target.id === "active") {
      $filterActive.closest(".btn").addClass("active");
    } else if (e.target.id === "complete") {
      $filterComplete.closest(".btn").addClass("active");
    }

    render();
  }

  // "Enter" на поле ввода
  $todoText.keydown(addTodo);

  // click "Check all"
  $checkAll.click(checkAllTodo);

  // click "Clear complete"
  $clearComplete.click(clearAllTodo);

  // click filter
  $filterAll.click(setFilter);
  $filterActive.click(setFilter);
  $filterComplete.click(setFilter);

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
  $(document).on("dblclick", ".todo-list-item", (e) => {
    editTodo(e, +e.target.closest(".todo-item").dataset.tid);
  });

  // keydown "enter" on edit input
  $(document).on("keyup", ".todo-edit", (e) => {
    if (e.keyCode === 13) {
      e.target.blur();
    }
  });

  // blur on edit input
  $(document).on("blur", ".todo-edit", (e) => {
    saveTodo(e, +e.target.closest(".todo-item").dataset.tid);
  });

  // change quantity todos on page
  $todosOnPage.change(() => {
    render(true); // goto last page
  });

  // click on pagination
  $(document).on("click", ".page-link", function (e) {
    e.preventDefault();
    $(".page-item").removeClass("active");
    $(this).closest(".page-item").addClass("active");

    render();
  });
});
