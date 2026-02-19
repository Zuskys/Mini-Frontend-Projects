const cycles = document.querySelectorAll(".cycle");
const buttonsCont = document.querySelector(".buttons");
const clock = document.getElementById("clock");

let actualCycle = 0;
let timer = 1500; // 25min
let pomo;
let mode = "focus";

//CLOCK
const showClock = () => {
	const min = Math.floor(timer / 60);
	const sec = timer % 60;
	const clockMin = min.toString().padStart(2, "0");
	const clockSec = sec.toString().padStart(2, "0");

	clock.innerHTML = `${clockMin}:${clockSec}`;
};

//CYCLES
const updateCycle = () => {
	cycles.forEach((cycle, i) => {
		cycle.classList.remove("actual", "completed");

		if (i < actualCycle) {
			cycle.classList.add("completed");
		} else if (i === actualCycle && actualCycle < cycles.length) {
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
	if (mode === "focus") {
		document.body.classList.remove("rest");
	} else {
		document.body.classList.add("rest");
	}

	pomo = setInterval(() => {
		timer--;
		showClock();

		if (timer === 0) {
			clearInterval(pomo);
			if (actualCycle === 4) {
				mode = "longRest";
				timer = 900;
			} else {
				mode = "shortRest";
				timer = 300;
			}
			startClock();
		} else if (mode === "shortRest") {
			mode = "focus";
			timer = 1500;
			startClock();
		} else if (mode === "longRest") {
			resetClock();
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
	timer = 1500;
	mode = "focus";
	document.body.classList.add("rest");
	showClock();
	updateCycle();
};

//START/PAUSE/RESET EVENTLISTENER
buttonsCont.addEventListener("click", (e) => {
	if (e.target.id === "start-btn") {
		startClock();
	}
	if (e.target.id === "pause-btn") {
		pauseClock();
	}
	if (e.target.id === "reset-btn") {
		resetClock();
	}
});

showClock();
updateCycle();
