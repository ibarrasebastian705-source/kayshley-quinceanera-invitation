// Change this date to match the event. Local time uses the visitor's timezone.
const eventDate = new Date("2027-02-13T15:00:00");

const fields = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

function updateCountdown() {
  const remaining = Math.max(0, eventDate.getTime() - Date.now());
  const seconds = Math.floor(remaining / 1000);
  fields.days.textContent = Math.floor(seconds / 86400);
  fields.hours.textContent = String(Math.floor((seconds % 86400) / 3600)).padStart(2, "0");
  fields.minutes.textContent = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  fields.seconds.textContent = String(seconds % 60).padStart(2, "0");
}

updateCountdown();
window.setInterval(updateCountdown, 1000);
