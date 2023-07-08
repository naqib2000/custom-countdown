const inputContainer = document.getElementById("input-container");
// this will get our results from input fields
const countdownForm = document.getElementById("countdownForm");
const dateEl = document.getElementById("date-picker");

const countdownEl = document.getElementById("countdown");
const countdownElTitle = document.getElementById("countdown-title");
const countdownBtn = document.getElementById("countdown-button");
const timeElements = document.querySelectorAll("span");

const completeEl = document.getElementById("complete");
const completeElInfo = document.getElementById("countdown-info");
const completeBtn = document.getElementById("complete-button");

let countdownTitle = "";
let countdownDate = "";
let countdownValue = new Date();
let countdownActive;
let saveCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// set date input to current day minimum
const today = new Date().toISOString().split("T")[0];
// set attribute for date element to have a min value of the value of today
dateEl.setAttribute("min", today);

// populate countdown / complete UI
function updateDOM() {
  // wrap in setInterval which takes a function and time in ms as parameters
  countdownActive = setInterval(() => {
    // gets the time elapsed from Jan 1970 till the current time in ms
    const now = new Date().getTime();
    const distance = countdownValue - now;
    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    // hide input
    inputContainer.hidden = true;

    // if countdown has ended, show complete
    if (distance < 0) {
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeEl.hidden = false;
    } else {
      // else, show the countdown in progress
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${hours}`;
      timeElements[2].textContent = `${minutes}`;
      timeElements[3].textContent = `${seconds}`;
      completeEl.hidden = true;
      countdownEl.hidden = false;
    }
  }, second);
}

// take values form form input
function updateCountdown(e) {
  e.preventDefault();
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;
  saveCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };
  //   save value in local storage, and convert object to JSON string
  localStorage.setItem("countdown", JSON.stringify(saveCountdown));
  // get number version of current date, updateDOM
  //   check for valid date
  if (countdownDate === "") {
    alert("Please select a date for a countdown.");
  } else {
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// reset all values
function reset() {
  // hide countdowns ans show input
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;
  //   stop countdown
  clearInterval(countdownActive);
  //   reset values
  countdownTitle = "";
  countdownDate = "";
  localStorage.removeItem("countdown");
}

function restorePreviousCountdown() {
  // get countdown from local storage if available
  if (localStorage.getItem("countdown")) {
    inputContainer.hidden = true;
    saveCountdown = JSON.parse(localStorage.getItem("countdown"));
    countdownTitle = saveCountdown.title;
    countdownDate = saveCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// event listener
countdownForm.addEventListener("submit", updateCountdown);
countdownBtn.addEventListener("click", reset);
completeBtn.addEventListener("click", reset);

// on load, check local storage
restorePreviousCountdown();
