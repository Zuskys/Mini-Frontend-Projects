const cycles = document.querySelectorAll(".cycle");
const buttonsCont = document.querySelector(".buttons");
const popUp = document.querySelector(".navbar");
const modal = document.getElementById("modal");
const saveBtn = document.getElementById("save-config");
const clock = document.getElementById("clock");
const session = document.getElementById("session-title");

//If a conf exists, write it
if (!localStorage.getItem("pomodoroConfig")) {
	localStorage.setItem("pomodoroConfig", JSON.stringify({ timer: 1500, rest: 300, longRest: 900 }));
}

const getConfig = () => JSON.parse(localStorage.getItem("pomodoroConfig"));

//Globals
let timer = getConfig().timer;
let mode = "focus";
let pomo;
let actualCycle = 0;
let isFocus = false;

const fillInputs = () => {
	const c = getConfig();
	document.getElementById("input-pomo").value = c.timer / 60;
	document.getElementById("input-rest").value = c.rest / 60;
	document.getElementById("input-long-rest").value = c.longRest / 60;
};

//CLOCK
const showClock = () => {
	const min = Math.floor(timer / 60);
	const sec = timer % 60;
	const clockMin = min.toString().padStart(2, "0");
	const clockSec = sec.toString().padStart(2, "0");

	clock.innerHTML = `${clockMin}:${clockSec}`;
};

//CYCLES TITLE
const changeTitle = () => {
	const cycle = document.getElementById("cycle-title");
	const titles = {
		focus: "Working...",
		shortRest: "Take a Rest!",
		longRest: "You did it!!",
	};
	session.classList.remove("hidden");
	cycle.innerText = titles[mode] ?? "Working";
};
//CYCLES
const updateCycle = () => {
	cycles.forEach((cycle, i) => {
		cycle.classList.remove("actual", "completed");

		if (i < actualCycle) {
			cycle.classList.add("completed");
		} else if (i === actualCycle && actualCycle < cycles.length && isFocus) {
			cycle.classList.add("actual");
		}
	});
};
const nextCycle = () => {
	if (actualCycle < cycles.length) {
		actualCycle++;
		updateCycle();
	}
};

//START FUNCTION
const startClock = () => {
	clearInterval(pomo);
	document.body.classList.remove("rest", "long-rest");
	if (mode !== "focus") {
		document.body.classList.add(mode === "longRest" ? "long-rest" : "rest");
	}

	isFocus = mode === "focus";
	updateCycle();
	changeTitle();

	pomo = setInterval(() => {
		timer--;
		showClock();
		if (timer === 0) {
			clearInterval(pomo);
			if (mode === "focus") {
				nextCycle();
				if (actualCycle === cycles.length) {
					mode = "longRest";
					timer = getConfig().longRest;
					document.body.classList.toggle("long-rest", mode !== "focus");
				} else {
					mode = "shortRest";
					timer = getConfig().rest;
				}
			} else if (mode === "shortRest" || mode === "longRest") {
				if (actualCycle === cycles.length) {
					resetClock();
					return;
				}
				mode = "focus";
				timer = getConfig().timer;
				updateCycle();
			}
			startClock();
		}
	}, 1000);
};
//PAUSE FUNCTION
const pauseClock = () => {
	clearInterval(pomo);
};
//RESET FUNCTION
const resetClock = () => {
	clearInterval(pomo);
	actualCycle = 0;
	timer = getConfig().timer;
	mode = "focus";
	isFocus = false;
	document.body.classList.add("rest");
	session.classList.add("hidden");
	showClock();
	updateCycle();
};

//START/PAUSE/RESET EVENTLISTENER
buttonsCont.addEventListener("click", (e) => {
	if (e.target.id === "start-btn") startClock();

	if (e.target.id === "pause-btn") pauseClock();

	if (e.target.id === "reset-btn") resetClock();
});

//POPUP OPEN/CLOSE
popUp.addEventListener("click", (e) => {
	if (e.target.closest("#settings-btn")) {
		fillInputs();
		modal.classList.add("is-open");
	} else if (e.target.closest("#close-btn")) {
		modal.classList.remove("is-open");
	}
});
//SAVE USER INPUT
saveBtn.addEventListener("click", () => {
	const inputPomo = parseInt(document.getElementById("input-pomo").value);
	const inputRest = parseInt(document.getElementById("input-rest").value);
	const inputLong = parseInt(document.getElementById("input-long-rest").value);

	if (!inputPomo || !inputRest || !inputLong) return;

	//save inputs value to localStorage
	localStorage.setItem(
		"pomodoroConfig",
		JSON.stringify({
			timer: inputPomo * 60,
			rest: inputRest * 60,
			longRest: inputLong * 60,
		}),
	);

	if (!pomo) {
		timer = getConfig().timer;
		showClock();
	}
	modal.classList.remove("is-open");
	resetClock();
});

showClock();
updateCycle();
