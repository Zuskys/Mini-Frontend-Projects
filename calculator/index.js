const resultTxt = document.getElementById("result-txt");
const gridBtn = document.getElementById("grid");

//VALUE BTNS
const buttons = [
	[
		{ label: "AC", type: "action" },
		{ label: "%", type: "operator" },
		{ label: "DEL", type: "action" },
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
	],
	[
		{ label: "1", type: "number" },
		{ label: "2", type: "number" },
		{ label: "3", type: "number" },
		{ label: "+", type: "operator" },
	],
	[
		{ label: "(", type: "action" },
		{ label: "0", type: "number" },
		{ label: ")", type: "action" },
		{ label: ".", type: "action" },
		{ label: "=", type: "action" },
	],
];
const priority = { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2 };

let expression = "";
let finishCalc = false;

//FUNCTION FOR THE ACTIONS BTNS
function actionValue(value) {
	if (value === "AC") {
		expression = "";
		updateDisplay("0");
		return;
	}
	if (value === "DEL") {
		if (finishCalc) {
			expression = "";
			updateDisplay("0");
			finishCalc = false;
			return;
		}
		expression = expression.slice(0, -1);
		updateDisplay(expression || "0");
		return;
	}
	//can't put two . togethers
	if (value === ".") {
		const reg = expression.split(/[\+\-\*\/]/).pop();
		if (reg.includes(".")) return;
		expression += value;
		updateDisplay(expression);
		return;
	}
	if (["+", "-"].includes(value)) {
		const last = expression.slice(-1);
		if (["+", "-"].includes(last)) return;
		if (expression === "" || last === "(") {
			expression += value;
			updateDisplay(expression);
			return;
		}
	}
	if (value === "=") {
		const result = getExpression(expression);
		if (!isFinite(result) || Number.isNaN(result)) {
			expression = "";
			updateDisplay("ERROR");
			return;
		}
		expression = result.toString();
		finishCalc = true;
		updateDisplay(expression);
		return;
	}
	finishCalc = false;
	expression += value;
	updateDisplay(expression);
}

//EVALUATE AND CALCULATE EXPRESSION
const getExpression = (value) => {
	//clean the + at the begging
	value = value.replace(/^\+/, "");

	//normalize the expression
	if (/[\+\-]{2,}/.test(value)) return "ERROR";
	value = value.replace(/([\*\/\%])([\+\-])(\d+\.?\d*)/g, "$1($2$3)");
	//start with -
	value = value.replace(/^\-/, "0-");
	//REGEX and save the tokens on a array
	const reg = value.match(/(\d+\.?\d*)|([\+\-\*\/\%\(\)])/g);
	if (!reg) return 0;

	const numbers = [];
	const symbols = [];

	//MAKE THE CALCULATIONS
	const calcValue = () => {
		//eliminate and save the last thing on each constant
		const b = numbers.pop();
		const a = numbers.pop();
		const op = symbols.pop();
		let result;
		//basic counts
		switch (op) {
			case "+":
				numbers.push(a + b);
				break;
			case "-":
				numbers.push(a - b);
				break;
			case "*":
				numbers.push(a * b);
				break;
			case "/":
				numbers.push(a / b);
				break;
			case "%":
				numbers.push(a % b);
				break;
			default:
				break;
		}
	};

	for (let i = 0; i < reg.length; i++) {
		let token = reg[i];

		if (!isNaN(token)) {
			numbers.push(parseFloat(token));
			continue;
		}
		//negative numbers
		if (token === "-" && (i === 0 || ["+", "-", "*", "/", "%", "("].includes(reg[i - 1]))) {
			const nextNum = reg[i + 1];
			if (!isNaN(nextNum)) {
				numbers.push(-parseFloat(nextNum));
				i++;
				continue;
			}
		}
		//positive numbers
		if (token === "+" && (i === 0 || ["+", "-", "*", "/", "%", "("].includes(reg[i - 1]))) {
			continue;
		}
		if (token === "(") {
			symbols.push(token);
			continue;
		} else if (token === ")") {
			while (symbols.length && symbols[symbols.length - 1] !== "(") {
				calcValue();
			}
			symbols.pop();
			continue;
		}
		//priority of operations
		while (symbols.length && priority[symbols[symbols.length - 1]] >= priority[token]) {
			calcValue();
		}
		symbols.push(token);
	}

	while (symbols.length) {
		calcValue();
	}
	return numbers[0];
};

//RENDER RESULT TEXT
const updateDisplay = (value) => {
	resultTxt.textContent = value;
	resultTxt.scrollLeft = resultTxt.scrollWidth;
};

//CREATE  RENDER BTNS
function renderButtons() {
	buttons.forEach((row) => {
		row.forEach((i) => {
			const btn = document.createElement("button");
			btn.classList.add("calc-btn");
			btn.dataset.type = i.type;
			btn.textContent = i.label;
			gridBtn.appendChild(btn);

			if (i.label === "=") btn.classList.add("span");
		});
	});
}

//GET CLICK OF BTNS
gridBtn.addEventListener("click", (e) => {
	if (!e.target.classList.contains("calc-btn")) return;
	const value = e.target.textContent;
	actionValue(value);
});
//GET KEYBOARD
document.addEventListener("keydown", (e) => {
	const keyMap = {
		Enter: "=",
		Backspace: "DEL",
		Delete: "AC",
	};
	let key = keyMap[e.key] || e.key;
	const validKeys = buttons.flat().map((btn) => btn.label);

	if (validKeys.includes(key)) actionValue(key);
});

updateDisplay(0);
renderButtons();
