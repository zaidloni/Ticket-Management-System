const addBtnEl = document.querySelector(".add-btn");
const modalContainerEl = document.querySelector(".modal-container");
const mainContainerEl = document.querySelector(".main-container");
const textAreaEl = document.getElementsByTagName("textarea")[0];
const priorityColorsEl = document.querySelectorAll(".priority-color");
const toolBoxColors = document.querySelectorAll(".color");
let color = ["pink", "blue", "green", "black"];
let modalPriorityColor = color[3];
let ticketData = [];

//to get items from the localstorage & display it when user open new tab or refresh
if (localStorage.getItem("ticket")) {
  ticketData = JSON.parse(localStorage.getItem("ticket"));
  ticketData.forEach((obj) => {
    createTicket(obj.ticketColor, obj.ticketId, obj.ticketText);
  });
}

//to add the border if user selects a color in the modal
priorityColorsEl.forEach((colorEle) => {
  colorEle.addEventListener("click", () => {
    priorityColorsEl.forEach((e) => {
      e.classList.remove("active");
    });
    colorEle.classList.add("active");
    modalPriorityColor = colorEle.classList[0];
  });
});

// Add button functionality
addBtnEl.addEventListener("click", () => {
  modalContainerEl.classList.toggle("hide");
});

//to create ticket when user press enter
modalContainerEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    let text = textAreaEl.value;
    // let id = generateId();
    let id;
    createTicket(modalPriorityColor, id, text);
    modalContainerEl.classList.toggle("hide");
    textAreaEl.value = "";
  }
});

// create new ticket element
function createTicket(ticketColor, ticketId, ticketText) {
  let randomId = generateId();
  let id = ticketId || randomId;
  let ticketContainerEl = document.createElement("div");
  ticketContainerEl.setAttribute("class", "ticket-container");
  ticketContainerEl.innerHTML = `
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">${id}</div>
        <div class="ticket-text" spellcheck="false">
          ${ticketText}
        </div>
        <div class = "ticket-bottom">
          <i class="fa-solid fa-trash remove"></i>
          <i class = "fas fa-lock"></i>
        </div>
        `;
  if (!ticketId) {
    ticketData.push({ ticketColor, ticketId: id, ticketText });
    localStorage.setItem("ticket", JSON.stringify(ticketData));
  }

  handleRemoval(ticketContainerEl, ticketId);
  handleLock(ticketContainerEl, ticketId);
  handleColor(ticketContainerEl, ticketId);

  mainContainerEl.appendChild(ticketContainerEl);
}

//editing functionality by clicking on the lock
function handleLock(ticket, id) {
  let lockEl = ticket.lastElementChild.lastElementChild;
  lockEl.addEventListener("click", handleLockClick);
  function handleLockClick(e) {
    if (e.target.classList.contains("fa-lock")) {
      e.target.classList = "fas fa-unlock";
      e.target.parentElement.parentElement.children[2].setAttribute(
        "contenteditable",
        true
      );
    } else {
      e.target.classList = "fas fa-lock";
      e.target.parentElement.parentElement.children[2].setAttribute(
        "contenteditable",
        false
      );
    }

    //modify data in local storage
    let ticketIdx = getTicketIdx(id);
    ticketData[ticketIdx].ticketText = ticket.children[2].innerText;
    localStorage.setItem("ticket", JSON.stringify(ticketData));
  }
}

//to delete the ticket
function handleRemoval(ticket, id) {
  // function to delete the entire ticket
  ticket.lastElementChild.firstElementChild.addEventListener("click", (e) => {
    e.target.parentElement.parentElement.remove();
    let ticketIdx = getTicketIdx(id);
    ticketData.splice(ticketIdx, 1);
    localStorage.setItem("ticket", JSON.stringify(ticketData));
  });
}
// change the ticket color
function handleColor(ticket, id) {
  ticket.firstElementChild.addEventListener("click", () => {
    let ticketIdx = getTicketIdx(id);
    console.log(ticketIdx);
    let currentColor = ticket.firstElementChild.classList[1];
    let currentColorIdx = color.findIndex((c) => {
      return c === currentColor;
    });
    ticket.firstElementChild.classList.remove(currentColor);
    currentColorIdx++;
    currentColor = color[currentColorIdx % color.length];
    ticket.firstElementChild.classList.add(currentColor);

    //modify data in local storage
    ticketData[ticketIdx].ticketColor = currentColor;
    localStorage.setItem("ticket", JSON.stringify(ticketData));
  });
}

//to get the index of ticket from the ticketData array
function getTicketIdx(id) {
  let ticketIdx = ticketData.findIndex((ticketObj) => {
    return ticketObj.ticketId === id;
  });
  return ticketIdx;
}

//to generate random id of 9 characters
function generateId() {
  let id = crypto.randomUUID();
  return "#" + id.substring(0, 8);
}

/*to add the functionality to search all the tickets based on the color when single click
  s& show all the tickets when double click
*/
for (let i = 0; i < toolBoxColors.length; i++) {
  toolBoxColors[i].addEventListener("click", (e) => {
    let curColor = toolBoxColors[i].classList[0];
    let filteredTickets = ticketData.filter((ticketObj) => {
      return ticketObj.ticketColor === curColor;
    });
    mainContainerEl.innerHTML = ``;
    filteredTickets.forEach((ticketObj) => {
      createTicket(
        ticketObj.ticketColor,
        ticketObj.ticketId,
        ticketObj.ticketText
      );
    });
  });
  toolBoxColors[i].addEventListener("dblclick", () => {
    mainContainerEl.innerHTML = ``;
    ticketData.forEach((ticketObj) => {
      createTicket(
        ticketObj.ticketColor,
        ticketObj.ticketId,
        ticketObj.ticketText
      );
    });
  });
}
