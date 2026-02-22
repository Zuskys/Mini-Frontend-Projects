const resultTxt = document.getElementById("result-txt");
const gridBtn = document.getElementById("grid");

//VALUE BTNS
const buttons = [
	[
		{ label: "AC", type: "action" },
		{ label: "%", type: "operator" },
		{ label: "⌫", type: "action" },
		{ label: "/", type: "operator" },
	],
	[
		{ label: "7", type: "number" },
		{ label: "8", type: "number" },
		{ label: "9", type: "number" },
		{ label: "*", type: "operator" },
	],
	[
		{ label: "4", type: "number" },
		{ label: "5", type: "number" },
		{ label: "6", type: "number" },
		{ label: "-", type: "operator" },
		{ label: "+", type: "operator" },
	],
	[
		{ label: "( )", type: "action" },
		{ label: "0", type: "number" },
		{ label: ".", type: "action" },
		{ label: "=", type: "action" },
	],
];

let expression = "";

//GET THE VALUE OF ACTIONS BTNS
function inputsValue(value) {
	if (value === "AC") {
		expression = "";
		updateDisplay("0");
		return;
	}
	if (value === "⌫") {
		expression = expression.slice(0, -1);
		updateDisplay(expression || "0");
		return;
	}
	if (value === "=") {
		const result = calcValue(expression);
		expression = result.toString();
		updateDisplay(expression);
		return;
	}
	expression += value;
	updateDisplay(expression);
}

//GET CLICK OF BTNS
gridBtn.addEventListener("click", (e) => {
	if (!e.target.classList.contains("calc-btn")) return;
	const value = e.target.textContent;
	inputsValue(value);
});

function calcValue(exp) {
	try {
		return eval(exp);
	} catch {
		return "Error";
	}
}

//RESULT TEXT
const updateDisplay = (value) => {
	resultTxt.textContent = value;
};
//CREATE BTNS
function renderButtons() {
	buttons.forEach((row) => {
		row.forEach((i) => {
			const btn = document.createElement("button");
			btn.classList.add("calc-btn");
			btn.dataset.type = i.type;
			btn.textContent = i.label;
			gridBtn.appendChild(btn);

			if (i.label === "=") {
				btn.classList.add("span");
			}
		});
	});
}
updateDisplay("0");
renderButtons();
