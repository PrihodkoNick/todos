// ???-1 что-то не нравится мне тут

$(document).ready(function() {
  const divCheckAll = $(".in-group"),
    rbCheckAll = $(".in-check-all"),
    inTodo = $(".in-todo"),
    outList = $(".out-list"),
    outFooter = $(".out-footer"),
    outItemsLeft = $(".out-left"),
    outClearComplete = $(".out-clear"),
    outFilters = $(".out-filters");

  let arrTodo = [];
  let counter = 0;

  function addCase(e) {
    if (e.keyCode === 13) {
      try {
        if (inTodo.val() === "") {
          throw new SyntaxError(
            "Данные неполны: введите значение в поле ввода"
          );
        }

        buildTodo();
        renderHeader();
        renderBody();
        renderFooter();
        inTodo.val("");
      } catch (err) {
        // обрабатываем красным подсвечиваем input
        alert(err.type + " " + err.message);
      }
    }
  }

  function buildTodo() {
    let temp = {};
    temp.done = false;
    temp.value = inTodo.val();
    temp.id = counter;
    arrTodo.push(temp);
    counter++;
  }

  function renderHeader() {
    // show radio button "Check All"
    if (arrTodo.length > 0) {
      let arrLeft = arrTodo.filter(item => item.done == false);
      arrLeft.length > 0
        ? rbCheckAll.prop("checked", "")
        : rbCheckAll.prop("checked", "checked");
      divCheckAll.css("width", "39");
    } else {
      divCheckAll.css("width", "0");
      rbCheckAll.prop("checked", "");
    }
  }

  function renderBody() {
    let checked;
    let stroke;

    outList.empty();
    arrTodo.forEach((item, index) => {
      item.done ? (checked = "checked") : (checked = "");
      item.done ? (stroke = "out-item-stroke") : (stroke = "");
      outList.append(`<div class="out-item input-group" id="out-item-${item.id}">
        <div class="input-group-prepend">
          <div class="input-group-text">
            <input
              class="out-check"
              id="out-check-${item.id}"
              type="checkbox"
              aria-label="Checkbox for following text input"
              ${checked}
            />
          </div>
        </div>
        <li class="list-group-item flex-grow-1 ${stroke}">
          ${item.value}
          <button
            id="close-${item.id}"
            type="button"
            class="close text-danger"
            aria-label="Close"
          >
            <span id="span-${item.id}" aria-hidden="true">&times;</span>
          </button>
        </li>
      </div>`);
    });
  }

  function renderFooter() {
    let arrLeft = arrTodo.filter(item => item.done == false);
    let arrDone = arrTodo.filter(item => item.done == true);

    // show footer
    arrTodo.length > 0
      ? outFooter.removeClass("invisible")
      : outFooter.addClass("invisible");

    // build "items left"
    outItemsLeft.text(`${arrLeft.length} items left`);

    // show "Clear complete"
    arrDone.length > 0
      ? outClearComplete.removeClass("invisible")
      : outClearComplete.addClass("invisible");
  }

  function findIndexById(id) {
    let indexById = -1;

    // search index by id ???-1
    arrTodo.forEach((item, index) => {
      item.id == id ? (indexById = index) : -1;
    });

    return indexById;
  }

  function checkCase(e) {
    if (e.target.classList.contains("in-check-all")) {
      // check all cases
      rbCheckAll.prop("checked")
        ? arrTodo.forEach(item => (item.done = true))
        : arrTodo.forEach(item => (item.done = false));
    } else {
      // check one case
      let index = findIndexById(e.target.id.slice("out-check-".length)); // search index by Id

      arrTodo[index].done = $(`#${e.target.id}`).prop("checked");
    }

    renderHeader();
    renderBody();
    renderFooter();
  }

  function deleteCase(e) {
    if (e.target.classList.contains("out-clear")) {
      // delete all checked cases
      let arrLeft = arrTodo.filter(item => item.done == false);
      arrTodo = arrLeft;
    } else {
      // delete one case

      let index = findIndexById(e.target.id.slice("span-".length)); // search index by Id
      arrTodo.splice(index, 1);
    }

    renderHeader();
    renderBody();
    renderFooter();
  }

  function filterCases(e) {
    let arrFilter = [];

    if (e.target.id === "option1") {
    }
    if (e.target.id === "option2") {
      arrFilter = arrTodo.filter(item => item.done == false);
    }
    if (e.target.id === "option3") {
      arrFilter = arrTodo.filter(item => item.done == true);
    }

    console.log(arrFilter);
  }

  // "Enter" на поле ввода
  inTodo.keydown(addCase);

  // click "Check all"
  rbCheckAll.click(checkCase);

  // click "Clear complete"
  outClearComplete.click(deleteCase);

  // click filter
  outFilters.click(filterCases);

  // click list
  outList.click(e => {
    // click check case
    if (e.target.id.startsWith("out-check-")) {
      checkCase(e);
    }
    // click delete case
    if (e.target.id.startsWith("span-")) {
      deleteCase(e);
    }
  });
});
