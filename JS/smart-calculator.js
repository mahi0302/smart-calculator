const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    resultDisplayed: false
};

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand, resultDisplayed } = calculator;

    if (waitingForSecondOperand === true || resultDisplayed) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
        calculator.resultDisplayed = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }

    updateDisplay();
    enableDelButton();
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true || calculator.resultDisplayed) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        calculator.resultDisplayed = false;
    } else if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }

    updateDisplay();
    enableDelButton();
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand == null) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const currentValue = firstOperand || 0;
        const result = performCalculation[operator](currentValue, inputValue);

        calculator.displayValue = String(result);
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
    calculator.resultDisplayed = true;

    updateDisplay();
    disableDelButton(); 
}

const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand
};

function lastEnterDigit() {
    calculator.displayValue = calculator.displayValue.slice(0, -1) || '0';
    updateDisplay();
}

function clearDigit() {
    lastEnterDigit();
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    calculator.resultDisplayed = false;
    enableDelButton();
    updateDisplay();
}

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

function disableDelButton() {
    document.querySelector('.digit-clear').disabled = true;
}

function enableDelButton() {
    document.querySelector('.digit-clear').disabled = false;
}

updateDisplay();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        return;
    }

    if (target.classList.contains('digit-clear')) {
        clearDigit();
        return;
    }

    inputDigit(target.value);
});
