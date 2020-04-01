// ???-1 что-то не нравится мне тут
// checkAll[0].prop("checked", "checked");

$(document).ready(function() {
  const $checkAll = $(".check-all");
  const $todoText = $(".todo-text");
  const $todoList = $(".todo-list");
  const $footer = $(".footer");
  const $itemsLeft = $(".items-left");
  const $clearComplete = $(".clear-complete");
  const $filterAll = $("#all");
  const $filterActive = $("#active");
  const $filterComplete = $("#complete");

  let todos = [];
  let counter = 0;

  function addCase(e) {
    if (e.keyCode === 13) {
      try {
        if ($todoText.val() === "") {
          throw new SyntaxError(
            "Данные неполны: введите значение в поле ввода"
          );
        }

        addTodo();
        render();
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
  function addTodo() {
    todos.push({ done: false, value: $todoText.val(), id: counter });
    counter++;
  }

  function renderHeader() {
    if (todos.length) {
      let arrLeft = todos.filter(item => item.done === false);
      arrLeft.length
        ? ($checkAll[0].checked = false)
        : ($checkAll[0].checked = true);
      $checkAll.closest(".input-group-prepend").removeClass("invisible");
    } else {
      $checkAll.closest(".input-group-prepend").addClass("invisible");
      $checkAll[0].checked = false;
    }
  }

  function render() {
    renderHeader();

    let checked;
    let strike;

    $todoList.empty();
    todos.forEach((item, index) => {
      checked = item.done ? "checked" : "";
      strike = item.done ? "strike" : "";

      $todoList.append(`<div class="todo-item input-group" data-tid="${item.id}">
        <div class="input-group-prepend">
          <div class="input-group-text">
            <input
              class="todo-check"              
              type="checkbox"
              aria-label="Checkbox for following text input"
              ${checked}
            />
          </div>
        </div>
        <li class="todo-list-item list-group-item flex-grow-1 ${strike}">
          ${item.value}
          <input type="text" class="todo-edit invisible">
          <button
            type="button"
            class="close text-danger"
            aria-label="Close"
          >
            <span class="btn-delete-todo" aria-hidden="true">&times;</span>
          </button>
        </li>
      </div>`);
    });

    renderFooter();
  }

  function renderFooter() {
    let arrLeftLength = todos.filter(item => item.done == false).length;
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

  // check one todo
  function checkTodo(id) {
    let index = todos.findIndex(curr => curr.id === id);
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
    let index = todos.findIndex(curr => curr.id === id);
    todos.splice(index, 1);

    render();
  }

  // clear complete
  function clearAllTodo() {
    todos = todos.filter(item => item.done == false);

    render();
  }

  // edit todo
  function editTodo(e, id) {
    let elem = e.target.firstElementChild;
    elem.classList.remove("invisible");
    elem.value = todos.filter(item => item.id === id)[0].value;
  }

  // filter all
  function filterAll() {
    setFilterActive($filterAll);
  }

  function setFilterActive(elem) {
    elem
      .closest(".filters")
      .children(".btn")
      .removeClass("active");
    elem.closest(".btn").addClass("active");
  }

  // filter active
  function filterActive() {
    setFilterActive($filterActive);
  }

  // filter complete
  function filterComplete() {
    setFilterActive($filterComplete);
  }

  // "Enter" на поле ввода
  $todoText.keydown(addCase);

  // click "Check all"
  $checkAll.click(checkAllTodo);

  // click "Clear complete"
  $clearComplete.click(clearAllTodo);

  // click filter
  $filterAll.click(filterAll);
  $filterActive.click(filterActive);
  $filterComplete.click(filterComplete);

  // click list
  $todoList.click(e => {
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

  // dbl click "edit" todo
  $todoList.dblclick(e => {
    let id = +e.target.closest(".todo-item").dataset.tid;

    if (e.target.classList.contains("todo-list-item")) {
      editTodo(e, id);
    }
  });
});
