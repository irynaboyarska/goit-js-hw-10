import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const dateTimePicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
startBtn.disabled = true;
const days = document.querySelector('[data-days]');
const hours = document.querySelector('[data-hours]');
const minutes = document.querySelector('[data-minutes]');
const seconds = document.querySelector('[data-seconds]');

let userSelectedDate;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

  if (selectedDate.getTime() < Date.now()) {
      iziToast.error({
          title: "Error",
          message: "Please choose a date in the future",
      });

    startBtn.disabled = true;
  } else {
    userSelectedDate = selectedDate;
    startBtn.disabled = false;
  }
},
};

flatpickr('#datetime-picker', options);

startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    dateTimePicker.disabled = true;

    const intervalId = setInterval(() => {
        const initTime = Date.now();
        const diff = userSelectedDate - initTime;

        if (diff < 0) {
            clearInterval(intervalId);
            dateTimePicker.disabled = false;
            return;
        }

        const time = convertMs(diff)

        days.innerHTML = addLeadingZero(time.days);
        hours.innerHTML = addLeadingZero(time.hours);
        minutes.innerHTML = addLeadingZero(time.minutes);
        seconds.innerHTML = addLeadingZero(time.seconds);
    }, 1000);
})

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
            return String(value).padStart(2, "0");
}