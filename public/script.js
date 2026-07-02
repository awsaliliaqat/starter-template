// This makes your page interactive. When the button is clicked, we show a
// friendly message. Try changing the messages below!

const button = document.getElementById("cheer-button");
const message = document.getElementById("message");

const cheers = [
  "🎉 You clicked it! You're coding!",
  "🌟 Nice! Try editing this message in script.js.",
  "🚀 Look at you go!",
];

let count = 0;

button.addEventListener("click", () => {
  // Pick a message that changes each time you click.
  message.textContent = cheers[count % cheers.length];
  count = count + 1;
});
