// Advanced Scientific Calculator - JavaScript
class AdvancedCalculator {
    constructor() {
        // Calculator state
        this.state = {
            displayValue: '0',
            expression: '',
            firstOperand: null,
            waitingForSecondOperand: false,
            operator: null,
            memory: 0,
            hasMemory: false,
            history: [],
            isScientificMode: false,
            isProgrammerMode: false,
            angleMode: 'DEG', // DEG or RAD
            currentNumberSystem: 'DEC', // DEC, BIN, OCT, HEX
            lastResult: null
        };
        
        // DOM Elements
        this.display = document.getElementById('display');
        this.expressionDisplay = document.getElementById('expressionDisplay');
        this.memoryIndicator = document.getElementById('memoryIndicator');
        this.historyList = document.getElementById('historyList');
        this.currentMode = document.getElementById('currentMode');
        this.angleModeDisplay = document.getElementById('angleMode');
        
        // Mode buttons
        this.basicModeBtn = document.getElementById('basicMode');
        this.scientificModeBtn = document.getElementById('scientificMode');
        this.programmerModeBtn = document.getElementById('programmerMode');
        
        // Button containers
        this.basicButtons = document.getElementById('basicButtons');
        this.scientificButtons = document.getElementById('scientificButtons');
        this.programmerButtons = document.getElementById('programmerButtons');
        
        // Modal elements
        this.conversionModal = document.getElementById('conversionModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalBody = document.getElementById('modalBody');
        this.closeModalBtn = document.getElementById('closeModal');
        
        // Initialize calculator
        this.init();
    }
    
    init() {
        // Set up event listeners
        this.setupEventListeners();
        
        // Update display
        this.updateDisplay();
        
        // Load history from localStorage if available
        this.loadHistory();
        
        // Add welcome message
        this.addToHistory("Welcome to Advanced Calculator!", "");
    }
    
    setupEventListeners() {
        // Button click event delegation
        document.addEventListener('click', (event) => {
            const target = event.target;
            
            // Handle number buttons
            if (target.hasAttribute('data-number')) {
                this.inputDigit(target.getAttribute('data-number'));
                return;
            }
            
            // Handle action buttons
            if (target.hasAttribute('data-action')) {
                const action = target.getAttribute('data-action');
                this.handleAction(action);
                return;
            }
            
            // Handle mode toggle buttons
            if (target.id === 'basicMode') {
                this.setMode('basic');
            } else if (target.id === 'scientificMode') {
                this.setMode('scientific');
            } else if (target.id === 'programmerMode') {
                this.setMode('programmer');
            }
            
            // Handle clear history button
            if (target.id === 'clearHistoryBtn') {
                this.clearHistory();
            }
            
            // Handle tool buttons
            if (target.classList.contains('tool-btn')) {
                const action = target.getAttribute('data-action');
                this.handleToolAction(action);
            }
            
            // Handle modal close
            if (target.id === 'closeModal' || target.classList.contains('modal')) {
                this.closeModal();
            }
        });
        
        // Keyboard support
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardInput(event);
        });
        
        // Modal close button
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        
        // Close modal when clicking outside
        this.conversionModal.addEventListener('click', (event) => {
            if (event.target === this.conversionModal) {
                this.closeModal();
            }
        });
    }
    
    // Input handling methods
    inputDigit(digit) {
        const { displayValue, waitingForSecondOperand, currentNumberSystem } = this.state;
        
        // Handle programmer mode input restrictions
        if (this.state.isProgrammerMode) {
            if (!this.isValidDigitForNumberSystem(digit, currentNumberSystem)) {
                return;
            }
        }
        
        if (waitingForSecondOperand) {
            this.state.displayValue = digit;
            this.state.waitingForSecondOperand = false;
        } else {
            this.state.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
        
        this.updateDisplay();
    }
    
    isValidDigitForNumberSystem(digit, numberSystem) {
        const validDigits = {
            'BIN': ['0', '1'],
            'OCT': ['0', '1', '2', '3', '4', '5', '6', '7'],
            'DEC': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            'HEX': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
        };
        
        return validDigits[numberSystem].includes(digit.toUpperCase());
    }
    
    inputDecimal() {
        if (this.state.waitingForSecondOperand) {
            this.state.displayValue = '0.';
            this.state.waitingForSecondOperand = false;
            return;
        }
        
        if (!this.state.displayValue.includes('.')) {
            this.state.displayValue += '.';
        }
        
        this.updateDisplay();
    }
    
    // Action handling
    handleAction(action) {
        switch (action) {
            // Basic operations
            case 'clear':
                this.clear();
                break;
            case 'clearEntry':
                this.clearEntry();
                break;
            case 'delete':
                this.deleteLastCharacter();
                break;
            case 'equals':
                this.calculateResult();
                break;
            case 'decimal':
                this.inputDecimal();
                break;
                
            // Arithmetic operators
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.handleOperator(action);
                break;
                
            // Scientific functions
            case 'square':
                this.square();
                break;
            case 'power':
                this.power();
                break;
            case 'sqrt':
                this.squareRoot();
                break;
            case 'percent':
                this.percent();
                break;
            case 'inverse':
                this.inverse();
                break;
            case 'sin':
                this.sine();
                break;
            case 'cos':
                this.cosine();
                break;
            case 'tan':
                this.tangent();
                break;
            case 'asin':
                this.arcsine();
                break;
            case 'acos':
                this.arccosine();
                break;
            case 'atan':
                this.arctangent();
                break;
            case 'log':
                this.log10();
                break;
            case 'ln':
                this.naturalLog();
                break;
            case 'exp':
                this.exponential();
                break;
            case 'factorial':
                this.factorial();
                break;
            case 'abs':
                this.absolute();
                break;
            case 'floor':
                this.floor();
                break;
            case 'ceil':
                this.ceil();
                break;
            case 'round':
                this.round();
                break;
            case 'pi':
                this.pi();
                break;
            case 'e':
                this.euler();
                break;
            case 'random':
                this.random();
                break;
            case 'degRad':
                this.toggleAngleMode();
                break;
                
            // Memory functions
            case 'memoryClear':
                this.memoryClear();
                break;
            case 'memoryRecall':
                this.memoryRecall();
                break;
            case 'memoryAdd':
                this.memoryAdd();
                break;
            case 'memorySubtract':
                this.memorySubtract();
                break;
            case 'memoryStore':
                this.memoryStore();
                break;
                
            // Programmer functions
            case 'binary':
            case 'octal':
            case 'decimalSystem':
            case 'hexadecimal':
                this.setNumberSystem(action);
                break;
            case 'and':
            case 'or':
            case 'xor':
            case 'not':
            case 'leftShift':
            case 'rightShift':
            case 'modulo':
            case 'toggleBit':
            case 'clearBits':
            case 'bitToggle':
                this.handleBitwiseOperation(action);
                break;
                
            // Conversion functions
            case 'convertLength':
                this.showConversionModal('length');
                break;
            case 'convertWeight':
                this.showConversionModal('weight');
                break;
            case 'convertTemperature':
                this.showConversionModal('temperature');
                break;
            case 'convertCurrency':
                this.showConversionModal('currency');
                break;
        }
        
        this.updateDisplay();
    }
    
    // Basic operations
    clear() {
        this.state.displayValue = '0';
        this.state.firstOperand = null;
        this.state.waitingForSecondOperand = false;
        this.state.operator = null;
        this.state.expression = '';
        this.updateDisplay();
    }
    
    clearEntry() {
        this.state.displayValue = '0';
        this.updateDisplay();
    }
    
    deleteLastCharacter() {
        if (this.state.displayValue.length > 1) {
            this.state.displayValue = this.state.displayValue.slice(0, -1);
        } else {
            this.state.displayValue = '0';
        }
        this.updateDisplay();
    }
    
    // Operator handling
    handleOperator(nextOperator) {
        const { firstOperand, displayValue, operator } = this.state;
        const inputValue = parseFloat(displayValue);
        
        if (operator && this.state.waitingForSecondOperand) {
            this.state.operator = nextOperator;
            this.state.expression = `${firstOperand || ''} ${this.getOperatorSymbol(nextOperator)}`;
            return;
        }
        
        if (firstOperand === null && !isNaN(inputValue)) {
            this.state.firstOperand = inputValue;
        } else if (operator) {
            const result = this.performCalculation();
            
            this.state.displayValue = `${this.formatResult(result)}`;
            this.state.firstOperand = result;
        }
        
        this.state.waitingForSecondOperand = true;
        this.state.operator = nextOperator;
        this.state.expression = `${this.state.firstOperand || ''} ${this.getOperatorSymbol(nextOperator)}`;
    }
    
    performCalculation() {
        const { firstOperand, displayValue, operator } = this.state;
        const inputValue = parseFloat(displayValue);
        
        if (isNaN(firstOperand) || isNaN(inputValue)) {
            return 0;
        }
        
        let result = 0;
        
        switch (operator) {
            case 'add':
                result = firstOperand + inputValue;
                break;
            case 'subtract':
                result = firstOperand - inputValue;
                break;
            case 'multiply':
                result = firstOperand * inputValue;
                break;
            case 'divide':
                if (inputValue === 0) {
                    return 'Error: Division by zero';
                }
                result = firstOperand / inputValue;
                break;
            default:
                return inputValue;
        }
        
        return result;
    }
    
    calculateResult() {
        if (this.state.operator && this.state.firstOperand !== null) {
            const result = this.performCalculation();
            const expression = `${this.state.expression} ${this.state.displayValue}`;
            
            if (typeof result === 'string' && result.startsWith('Error')) {
                this.state.displayValue = result;
            } else {
                this.addToHistory(expression, this.formatResult(result));
                this.state.displayValue = `${this.formatResult(result)}`;
                this.state.lastResult = result;
            }
            
            this.state.expression = '';
            this.state.firstOperand = null;
            this.state.waitingForSecondOperand = false;
            this.state.operator = null;
            
            this.updateDisplay();
        }
    }
    
    // Scientific functions
    square() {
        const value = parseFloat(this.state.displayValue);
        const result = Math.pow(value, 2);
        this.addToHistory(`sqr(${value})`, this.formatResult(result));
        this.state.displayValue = `${this.formatResult(result)}`;
    }
    
    power() {
        this.state.expression = `${this.state.displayValue}^`;
        this.state.firstOperand = parseFloat(this.state.displayValue);
        this.state.waitingForSecondOperand = true;
        this.state.operator = 'powerCustom';
        this.updateDisplay();
    }
    
    squareRoot() {
        const value = parseFloat(this.state.displayValue);
        if (value < 0) {
            this.state.displayValue = 'Error: Invalid input';
        } else {
            const result = Math.sqrt(value);
            this.addToHistory(`√(${value})`, this.formatResult(result));
            this.state.displayValue = `${this.formatResult(result)}`;
        }
    }
    
    percent() {
        const value = parseFloat(this.state.displayValue);
        const result = value / 100;
        this.state.displayValue = `${this.formatResult(result)}`;
    }
    
    inverse() {
        const value = parseFloat(this.state.displayValue);
        if (value === 0) {
            this.state.displayValue = 'Error: Division by zero';
        } else {
            const result = 1 / value;
            this.addToHistory(`1/(${value})`, this.formatResult(result));
            this.state.displayValue = `${this.formatResult(result)}`;
        }
    }
    
    sine() {
        const value = parseFloat(this.state.displayValue);
        const angle = this.state.angleMode === 'DEG' ? value * Math.PI / 180 : value;
        const result = Math.sin(angle);
        this.addToHistory(`sin(${value}${this.state.angleMode === 'DEG' ? '°' : ' rad'})`, this.formatResult(result));
        this.state.displayValue = `${this.formatResult(result)}`;
    }
    
    cosine() {
        const value = parseFloat(this.state.displayValue);
        const angle = this.state.angleMode === 'DEG' ? value * Math.PI / 180 : value;
        const result = Math.cos(angle);
        this.addToHistory(`cos(${value}${this.state.angleMode === 'DEG' ? '°' : ' rad'})`, this.formatResult(result));
        this.state.displayValue = `${this.formatResult(result)}`;
    }
    
    tangent() {
        const value = parseFloat(this.state.displayValue);
        const angle = this.state.angleMode === 'DEG' ? value * Math.PI / 180 : value;
        const result = Math.tan(angle);
        this.addToHistory(`tan(${value}${this.state.angleMode === 'DEG' ? '°' : ' rad'})`, this.formatResult(result));
        this.state.displayValue = `${this.formatResult(result)}`;
    }
    
    arcsine() {
        const value = parseFloat(this.state.displayValue);
        if (value < -1 || value > 1) {
            this.state.displayValue = 'Error: Invalid input';
            return;
        }
        const result = Math.asin(value);
        const finalResult = this.state.angleMode === 'DEG' ? result * 180 / Math.PI : result;
        this.addToHistory(`sin⁻¹(${value})`, this.formatResult(finalResult));
        this.state.displayValue = `${this.formatResult(finalResult)}`;
    }
    
    arccosine() {
        const value = parseFloat(this.state.displayValue);
        if (value < -1 || value > 1) {
            this.state.displayValue = 'Error: Invalid input';
            return;
        }
        const result = Math.acos(value);
        const finalResult = this.state.angleMode === 'DEG' ? result * 180 / Math.PI : result;
        this.addToHistory(`cos⁻¹(${value})`, this.formatResult(finalResult));
        this.state.displayValue = `${this.formatResult(finalResult)}`;
    }
    
    arctangent() {
        const value = parseFloat(this.state.displayValue);
        const result = Math.atan(value);
        const finalResult = this.state.angleMode === 'DEG' ? result * 180 / Math.PI : result;
        this.addToHistory(`tan⁻¹(${value})`, this.formatResult(finalResult));
        this.state.displayValue = `${this.formatResult(finalResult)}`;
    }
    
    log10() {
        const value = parseFloat(this.state.displayValue);
        if (value <= 0) {
            this.state.displayValue = 'Error: Invalid input';
            return;
        }
        const result = Math.log10(value);
        this.addToHistory(`log(${value})`, this.formatResult(result));
        this.state.displayValue = `${this.formatResult(result)}`;
    }
    
    naturalLog() {
        const value = parseFloat(this.state.displayValue);
        if (value <= 0) {
            this.state.displayValue = 'Error: Invalid input';
            return;
        }
        const result = Math.log(value);
        this.addToHistory(`ln(${value})`, this.formatResult(result));
        this.state.displayValue = `${this.formatResult(result)}`;
    }
    
    exponential() {
        const value = parseFloat(this.state.displayValue);
        const result = Math.exp(value);
        this.addToHistory(`e^(${value})`, this.formatResult(result));
        this.state.displayValue = `${this.formatResult(result)}`;
    }
    
    factorial() {
        const value = parseInt(this.state.displayValue);
        if (value < 0 || value > 100) {
            this.state.displayValue = 'Error: Invalid input';
            return;
        }
        let result = 1;
        for (let i = 2; i <= value; i++) {
            result *= i;
        }
        this.addToHistory(`factorial(${value})`, this.formatResult(result));
        this.state.displayValue = `${this.formatResult(result)}`;
    }
    
    absolute() {
        const value = parseFloat(this.state.displayValue);
        const result = Math.abs(value);
        this.addToHistory(`abs(${value})`, this.formatResult(result));
        this.state.displayValue = `${this.formatResult(result)}`;
    }
    
    floor() {
        const value = parseFloat(this.state.displayValue);
        const result = Math.floor(value);
        this.addToHistory(`floor(${value})`, this.formatResult(result));
        this.state.displayValue = `${this.formatResult(result)}`;
    }
    
    ceil() {
        const value = parseFloat(this.state.displayValue);
        const result = Math.ceil(value);
        this.addToHistory(`ceil(${value})`, this.formatResult(result));
        this.state.displayValue = `${this.formatResult(result)}`;
    }
    
    round() {
        const value = parseFloat(this.state.displayValue);
        const result = Math.round(value);
        this.addToHistory(`round(${value})`, this.formatResult(result));
        this.state.displayValue = `${this.formatResult(result)}`;
    }
    
    pi() {
        this.state.displayValue = Math.PI.toString();
    }
    
    euler() {
        this.state.displayValue = Math.E.toString();
    }
    
    random() {
        const result = Math.random();
        this.addToHistory(`random()`, this.formatResult(result));
        this.state.displayValue = `${this.formatResult(result)}`;
    }
    
    toggleAngleMode() {
        this.state.angleMode = this.state.angleMode === 'DEG' ? 'RAD' : 'DEG';
        this.angleModeDisplay.textContent = this.state.angleMode;
    }
    
    // Memory functions
    memoryClear() {
        this.state.memory = 0;
        this.state.hasMemory = false;
        this.updateMemoryIndicator();
    }
    
    memoryRecall() {
        this.state.displayValue = this.state.memory.toString();
        this.updateDisplay();
    }
    
    memoryAdd() {
        const value = parseFloat(this.state.displayValue);
        this.state.memory += value;
        this.state.hasMemory = true;
        this.updateMemoryIndicator();
    }
    
    memorySubtract() {
        const value = parseFloat(this.state.displayValue);
        this.state.memory -= value;
        this.state.hasMemory = true;
        this.updateMemoryIndicator();
    }
    
    memoryStore() {
        const value = parseFloat(this.state.displayValue);
        this.state.memory = value;
        this.state.hasMemory = true;
        this.updateMemoryIndicator();
    }
    
    updateMemoryIndicator() {
        if (this.state.hasMemory) {
            this.memoryIndicator.textContent = `M: ${this.formatResult(this.state.memory)}`;
        } else {
            this.memoryIndicator.textContent = '';
        }
    }
    
    // Programmer functions
    setNumberSystem(system) {
        const systemMap = {
            'binary': 'BIN',
            'octal': 'OCT',
            'decimalSystem': 'DEC',
            'hexadecimal': 'HEX'
        };
        
        this.state.currentNumberSystem = systemMap[system];
        
        // Convert current display value to new number system
        const decimalValue = this.convertToDecimal(this.state.displayValue, this.state.currentNumberSystem);
        
        if (decimalValue !== null) {
            this.state.displayValue = this.convertFromDecimal(decimalValue, systemMap[system]);
            this.updateDisplay();
        }
    }
    
    convertToDecimal(value, fromSystem) {
        try {
            switch (fromSystem) {
                case 'BIN':
                    return parseInt(value, 2);
                case 'OCT':
                    return parseInt(value, 8);
                case 'DEC':
                    return parseInt(value, 10);
                case 'HEX':
                    return parseInt(value, 16);
                default:
                    return null;
            }
        } catch (e) {
            return null;
        }
    }
    
    convertFromDecimal(value, toSystem) {
        if (isNaN(value)) return '0';
        
        switch (toSystem) {
            case 'BIN':
                return (value >>> 0).toString(2);
            case 'OCT':
                return (value >>> 0).toString(8);
            case 'DEC':
                return value.toString(10);
            case 'HEX':
                return (value >>> 0).toString(16).toUpperCase();
            default:
                return value.toString();
        }
    }
    
    handleBitwiseOperation(operation) {
        const value = parseInt(this.state.displayValue, 10);
        
        if (isNaN(value)) return;
        
        let result = 0;
        let operationText = '';
        
        switch (operation) {
            case 'and':
                result = value & this.state.lastResult || 0;
                operationText = `AND`;
                break;
            case 'or':
                result = value | this.state.lastResult || 0;
                operationText = `OR`;
                break;
            case 'xor':
                result = value ^ this.state.lastResult || 0;
                operationText = `XOR`;
                break;
            case 'not':
                result = ~value;
                operationText = `NOT`;
                break;
            case 'leftShift':
                result = value << 1;
                operationText = `<<`;
                break;
            case 'rightShift':
                result = value >> 1;
                operationText = `>>`;
                break;
            case 'modulo':
                result = value % (this.state.lastResult || 2);
                operationText = `MOD`;
                break;
            case 'toggleBit':
                result = ~value;
                operationText = `~`;
                break;
        }
        
        // Convert result back to current number system
        const decimalResult = parseInt(result, 10);
        this.state.displayValue = this.convertFromDecimal(decimalResult, this.state.currentNumberSystem);
        this.addToHistory(`${operationText}(${value})`, this.state.displayValue);
    }
    
    // Mode management
    setMode(mode) {
        // Reset mode buttons
        this.basicModeBtn.classList.remove('active');
        this.scientificModeBtn.classList.remove('active');
        this.programmerModeBtn.classList.remove('active');
        
        // Hide all button containers
        this.basicButtons.classList.add('scientific-hidden');
        this.scientificButtons.classList.add('scientific-hidden');
        this.programmerButtons.classList.add('scientific-hidden');
        
        // Set current mode
        switch (mode) {
            case 'basic':
                this.basicModeBtn.classList.add('active');
                this.basicButtons.classList.remove('scientific-hidden');
                this.state.isScientificMode = false;
                this.state.isProgrammerMode = false;
                this.currentMode.textContent = 'Basic';
                break;
            case 'scientific':
                this.scientificModeBtn.classList.add('active');
                this.scientificButtons.classList.remove('scientific-hidden');
                this.state.isScientificMode = true;
                this.state.isProgrammerMode = false;
                this.currentMode.textContent = 'Scientific';
                break;
            case 'programmer':
                this.programmerModeBtn.classList.add('active');
                this.programmerButtons.classList.remove('scientific-hidden');
                this.state.isScientificMode = false;
                this.state.isProgrammerMode = true;
                this.currentMode.textContent = 'Programmer';
                break;
        }
    }
    
    // History management
    addToHistory(calculation, result) {
        const historyItem = {
            calculation,
            result,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.state.history.unshift(historyItem);
        
        // Keep only last 50 items
        if (this.state.history.length > 50) {
            this.state.history.pop();
        }
        
        this.updateHistoryList();
        this.saveHistory();
    }
    
    updateHistoryList() {
        this.historyList.innerHTML = '';
        
        this.state.history.slice(0, 10).forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div>
                    <div class="history-calculation">${item.calculation}</div>
                    <div class="history-timestamp">${item.timestamp}</div>
                </div>
                <div class="history-result">= ${item.result}</div>
            `;
            
            // Add click event to use history item
            historyItem.addEventListener('click', () => {
                this.state.displayValue = item.result.toString();
                this.updateDisplay();
            });
            
            this.historyList.appendChild(historyItem);
        });
    }
    
    clearHistory() {
        this.state.history = [];
        this.updateHistoryList();
        this.saveHistory();
    }
    
    saveHistory() {
        try {
            localStorage.setItem('calculatorHistory', JSON.stringify(this.state.history));
        } catch (e) {
            console.log('Could not save history:', e);
        }
    }
    
    loadHistory() {
        try {
            const savedHistory = localStorage.getItem('calculatorHistory');
            if (savedHistory) {
                this.state.history = JSON.parse(savedHistory);
                this.updateHistoryList();
            }
        } catch (e) {
            console.log('Could not load history:', e);
        }
    }
    
    // Conversion modal
    showConversionModal(type) {
        let title = '';
        let content = '';
        
        switch (type) {
            case 'length':
                title = 'Length Conversion';
                content = this.getLengthConversionHTML();
                break;
            case 'weight':
                title = 'Weight Conversion';
                content = this.getWeightConversionHTML();
                break;
            case 'temperature':
                title = 'Temperature Conversion';
                content = this.getTemperatureConversionHTML();
                break;
            case 'currency':
                title = 'Currency Conversion';
                content = this.getCurrencyConversionHTML();
                break;
        }
        
        this.modalTitle.textContent = title;
        this.modalBody.innerHTML = content;
        this.conversionModal.style.display = 'flex';
        
        // Add event listeners to conversion form
        this.setupConversionForm(type);
    }
    
    getLengthConversionHTML() {
        return `
            <div class="conversion-form">
                <div class="form-group">
                    <label>From:</label>
                    <input type="number" id="fromValue" value="${this.state.displayValue}" step="any">
                    <select id="fromUnit">
                        <option value="m">Meters (m)</option>
                        <option value="km">Kilometers (km)</option>
                        <option value="cm">Centimeters (cm)</option>
                        <option value="mm">Millimeters (mm)</option>
                        <option value="in">Inches (in)</option>
                        <option value="ft">Feet (ft)</option>
                        <option value="yd">Yards (yd)</option>
                        <option value="mi">Miles (mi)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>To:</label>
                    <select id="toUnit">
                        <option value="m">Meters (m)</option>
                        <option value="km">Kilometers (km)</option>
                        <option value="cm">Centimeters (cm)</option>
                        <option value="mm">Millimeters (mm)</option>
                        <option value="in">Inches (in)</option>
                        <option value="ft">Feet (ft)</option>
                        <option value="yd">Yards (yd)</option>
                        <option value="mi">Miles (mi)</option>
                    </select>
                </div>
                <button class="btn btn-equals" id="convertBtn">Convert</button>
                <div class="conversion-result" id="conversionResult"></div>
            </div>
        `;
    }
    
    getWeightConversionHTML() {
        return `
            <div class="conversion-form">
                <div class="form-group">
                    <label>From:</label>
                    <input type="number" id="fromValue" value="${this.state.displayValue}" step="any">
                    <select id="fromUnit">
                        <option value="kg">Kilograms (kg)</option>
                        <option value="g">Grams (g)</option>
                        <option value="mg">Milligrams (mg)</option>
                        <option value="lb">Pounds (lb)</option>
                        <option value="oz">Ounces (oz)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>To:</label>
                    <select id="toUnit">
                        <option value="kg">Kilograms (kg)</option>
                        <option value="g">Grams (g)</option>
                        <option value="mg">Milligrams (mg)</option>
                        <option value="lb">Pounds (lb)</option>
                        <option value="oz">Ounces (oz)</option>
                    </select>
                </div>
                <button class="btn btn-equals" id="convertBtn">Convert</button>
                <div class="conversion-result" id="conversionResult"></div>
            </div>
        `;
    }
    
    getTemperatureConversionHTML() {
        return `
            <div class="conversion-form">
                <div class="form-group">
                    <label>From:</label>
                    <input type="number" id="fromValue" value="${this.state.displayValue}" step="any">
                    <select id="fromUnit">
                        <option value="c">Celsius (°C)</option>
                        <option value="f">Fahrenheit (°F)</option>
                        <option value="k">Kelvin (K)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>To:</label>
                    <select id="toUnit">
                        <option value="c">Celsius (°C)</option>
                        <option value="f">Fahrenheit (°F)</option>
                        <option value="k">Kelvin (K)</option>
                    </select>
                </div>
                <button class="btn btn-equals" id="convertBtn">Convert</button>
                <div class="conversion-result" id="conversionResult"></div>
            </div>
        `;
    }
    
    getCurrencyConversionHTML() {
        return `
            <div class="conversion-form">
                <div class="form-group">
                    <label>Amount:</label>
                    <input type="number" id="fromValue" value="${this.state.displayValue}" step="any">
                    <select id="fromUnit">
                        <option value="usd">US Dollar (USD)</option>
                        <option value="eur">Euro (EUR)</option>
                        <option value="gbp">British Pound (GBP)</option>
                        <option value="jpy">Japanese Yen (JPY)</option>
                        <option value="inr">Indian Rupee (INR)</option>
                        <option value="aud">Australian Dollar (AUD)</option>
                        <option value="cad">Canadian Dollar (CAD)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Convert to:</label>
                    <select id="toUnit">
                        <option value="usd">US Dollar (USD)</option>
                        <option value="eur">Euro (EUR)</option>
                        <option value="gbp">British Pound (GBP)</option>
                        <option value="jpy">Japanese Yen (JPY)</option>
                        <option value="inr">Indian Rupee (INR)</option>
                        <option value="aud">Australian Dollar (AUD)</option>
                        <option value="cad">Canadian Dollar (CAD)</option>
                    </select>
                </div>
                <button class="btn btn-equals" id="convertBtn">Convert</button>
                <div class="conversion-result" id="conversionResult"></div>
                <div class="conversion-note">
                    <small>Note: Using approximate exchange rates. For real-time rates, use a financial API.</small>
                </div>
            </div>
        `;
    }
    
    setupConversionForm(type) {
        const convertBtn = document.getElementById('convertBtn');
        if (convertBtn) {
            convertBtn.addEventListener('click', () => {
                this.performConversion(type);
            });
        }
    }
    
    performConversion(type) {
        const fromValue = parseFloat(document.getElementById('fromValue').value);
        const fromUnit = document.getElementById('fromUnit').value;
        const toUnit = document.getElementById('toUnit').value;
        
        if (isNaN(fromValue)) {
            document.getElementById('conversionResult').textContent = 'Please enter a valid number';
            return;
        }
        
        let result = 0;
        let resultText = '';
        
        switch (type) {
            case 'length':
                result = this.convertLength(fromValue, fromUnit, toUnit);
                resultText = `${fromValue} ${this.getUnitName(fromUnit, 'length')} = ${this.formatResult(result)} ${this.getUnitName(toUnit, 'length')}`;
                break;
            case 'weight':
                result = this.convertWeight(fromValue, fromUnit, toUnit);
                resultText = `${fromValue} ${this.getUnitName(fromUnit, 'weight')} = ${this.formatResult(result)} ${this.getUnitName(toUnit, 'weight')}`;
                break;
            case 'temperature':
                result = this.convertTemperature(fromValue, fromUnit, toUnit);
                resultText = `${fromValue} ${this.getUnitName(fromUnit, 'temperature')} = ${this.formatResult(result)} ${this.getUnitName(toUnit, 'temperature')}`;
                break;
            case 'currency':
                result = this.convertCurrency(fromValue, fromUnit, toUnit);
                resultText = `${fromValue} ${fromUnit.toUpperCase()} ≈ ${this.formatResult(result)} ${toUnit.toUpperCase()}`;
                break;
        }
        
        document.getElementById('conversionResult').textContent = resultText;
        
        // Add to calculator history
        this.addToHistory(resultText, 'Conversion');
    }
    
    convertLength(value, fromUnit, toUnit) {
        // Convert to meters first
        let meters = 0;
        
        switch (fromUnit) {
            case 'm': meters = value; break;
            case 'km': meters = value * 1000; break;
            case 'cm': meters = value / 100; break;
            case 'mm': meters = value / 1000; break;
            case 'in': meters = value * 0.0254; break;
            case 'ft': meters = value * 0.3048; break;
            case 'yd': meters = value * 0.9144; break;
            case 'mi': meters = value * 1609.34; break;
        }
        
        // Convert from meters to target unit
        switch (toUnit) {
            case 'm': return meters;
            case 'km': return meters / 1000;
            case 'cm': return meters * 100;
            case 'mm': return meters * 1000;
            case 'in': return meters / 0.0254;
            case 'ft': return meters / 0.3048;
            case 'yd': return meters / 0.9144;
            case 'mi': return meters / 1609.34;
            default: return meters;
        }
    }
    
    convertWeight(value, fromUnit, toUnit) {
        // Convert to kilograms first
        let kg = 0;
        
        switch (fromUnit) {
            case 'kg': kg = value; break;
            case 'g': kg = value / 1000; break;
            case 'mg': kg = value / 1000000; break;
            case 'lb': kg = value * 0.453592; break;
            case 'oz': kg = value * 0.0283495; break;
        }
        
        // Convert from kg to target unit
        switch (toUnit) {
            case 'kg': return kg;
            case 'g': return kg * 1000;
            case 'mg': return kg * 1000000;
            case 'lb': return kg / 0.453592;
            case 'oz': return kg / 0.0283495;
            default: return kg;
        }
    }
    
    convertTemperature(value, fromUnit, toUnit) {
        // Convert to Celsius first
        let celsius = 0;
        
        switch (fromUnit) {
            case 'c': celsius = value; break;
            case 'f': celsius = (value - 32) * 5/9; break;
            case 'k': celsius = value - 273.15; break;
        }
        
        // Convert from Celsius to target unit
        switch (toUnit) {
            case 'c': return celsius;
            case 'f': return (celsius * 9/5) + 32;
            case 'k': return celsius + 273.15;
            default: return celsius;
        }
    }
    
    convertCurrency(value, fromUnit, toUnit) {
        // Mock exchange rates (in a real app, you would use an API)
        const rates = {
            'usd': 1,
            'eur': 0.92,
            'gbp': 0.79,
            'jpy': 151.5,
            'inr': 83.3,
            'aud': 1.52,
            'cad': 1.36
        };
        
        // Convert to USD first
        const usdValue = value / rates[fromUnit];
        
        // Convert from USD to target currency
        return usdValue * rates[toUnit];
    }
    
    getUnitName(unit, type) {
        const unitNames = {
            'length': {
                'm': 'meters',
                'km': 'kilometers',
                'cm': 'centimeters',
                'mm': 'millimeters',
                'in': 'inches',
                'ft': 'feet',
                'yd': 'yards',
                'mi': 'miles'
            },
            'weight': {
                'kg': 'kilograms',
                'g': 'grams',
                'mg': 'milligrams',
                'lb': 'pounds',
                'oz': 'ounces'
            },
            'temperature': {
                'c': '°C',
                'f': '°F',
                'k': 'K'
            }
        };
        
        return unitNames[type][unit] || unit;
    }
    
    closeModal() {
        this.conversionModal.style.display = 'none';
    }
    
    // Tool actions
    handleToolAction(action) {
        switch (action) {
            case 'solveEquation':
                this.solveEquation();
                break;
            case 'geometryCalculator':
                this.showGeometryCalculator();
                break;
            case 'statisticsTool':
                this.showStatisticsTool();
                break;
        }
    }
    
    solveEquation() {
        const equation = prompt('Enter an equation to solve (e.g., 2x + 5 = 13):');
        if (!equation) return;
        
        // Simple equation solver for demonstration
        try {
            // This is a very basic equation solver
            // In a real application, you would use a proper equation parsing library
            const result = eval(equation.replace(/x/g, '*').replace(/=/g, '==='));
            this.addToHistory(`Solve: ${equation}`, result ? 'True' : 'False');
            alert(`Equation ${equation} is ${result ? 'true' : 'false'}`);
        } catch (e) {
            alert('Could not solve the equation. Please check the format.');
        }
    }
    
    showGeometryCalculator() {
        const shape = prompt('Enter shape (circle, triangle, rectangle, sphere):').toLowerCase();
        if (!shape) return;
        
        let calculation = '';
        let result = 0;
        
        switch (shape) {
            case 'circle':
                const radius = parseFloat(prompt('Enter radius:'));
                if (!isNaN(radius)) {
                    const area = Math.PI * radius * radius;
                    const circumference = 2 * Math.PI * radius;
                    calculation = `Circle: r=${radius}`;
                    result = `Area: ${this.formatResult(area)}, Circumference: ${this.formatResult(circumference)}`;
                }
                break;
            case 'triangle':
                const base = parseFloat(prompt('Enter base:'));
                const height = parseFloat(prompt('Enter height:'));
                if (!isNaN(base) && !isNaN(height)) {
                    const area = 0.5 * base * height;
                    calculation = `Triangle: b=${base}, h=${height}`;
                    result = `Area: ${this.formatResult(area)}`;
                }
                break;
            case 'rectangle':
                const length = parseFloat(prompt('Enter length:'));
                const width = parseFloat(prompt('Enter width:'));
                if (!isNaN(length) && !isNaN(width)) {
                    const area = length * width;
                    const perimeter = 2 * (length + width);
                    calculation = `Rectangle: l=${length}, w=${width}`;
                    result = `Area: ${this.formatResult(area)}, Perimeter: ${this.formatResult(perimeter)}`;
                }
                break;
            case 'sphere':
                const sphereRadius = parseFloat(prompt('Enter radius:'));
                if (!isNaN(sphereRadius)) {
                    const volume = (4/3) * Math.PI * Math.pow(sphereRadius, 3);
                    const surfaceArea = 4 * Math.PI * Math.pow(sphereRadius, 2);
                    calculation = `Sphere: r=${sphereRadius}`;
                    result = `Volume: ${this.formatResult(volume)}, Surface Area: ${this.formatResult(surfaceArea)}`;
                }
                break;
        }
        
        if (calculation) {
            this.addToHistory(calculation, result);
            alert(result);
        }
    }
    
    showStatisticsTool() {
        const input = prompt('Enter numbers separated by commas:');
        if (!input) return;
        
        const numbers = input.split(',').map(num => parseFloat(num.trim())).filter(num => !isNaN(num));
        
        if (numbers.length === 0) {
            alert('Please enter valid numbers.');
            return;
        }
        
        const sum = numbers.reduce((a, b) => a + b, 0);
        const mean = sum / numbers.length;
        const sorted = [...numbers].sort((a, b) => a - b);
        const median = sorted.length % 2 === 0 
            ? (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2
            : sorted[Math.floor(sorted.length/2)];
        
        const variance = numbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / numbers.length;
        const stdDev = Math.sqrt(variance);
        const min = Math.min(...numbers);
        const max = Math.max(...numbers);
        
        const result = `
            Count: ${numbers.length}
            Sum: ${this.formatResult(sum)}
            Mean: ${this.formatResult(mean)}
            Median: ${this.formatResult(median)}
            Min: ${this.formatResult(min)}
            Max: ${this.formatResult(max)}
            Variance: ${this.formatResult(variance)}
            Std Dev: ${this.formatResult(stdDev)}
        `;
        
        this.addToHistory(`Statistics: ${numbers.join(', ')}`, 'See details');
        alert(result);
    }
    
    // Utility methods
    formatResult(value) {
        if (typeof value === 'string') return value;
        
        // Format number to avoid scientific notation for large numbers
        if (Math.abs(value) >= 1e12 || (Math.abs(value) < 1e-6 && value !== 0)) {
            return value.toExponential(6);
        }
        
        // Round to 10 decimal places to avoid floating point errors
        const rounded = Math.round(value * 1e10) / 1e10;
        
        // Remove trailing zeros
        return parseFloat(rounded.toFixed(10)).toString();
    }
    
    getOperatorSymbol(operator) {
        const symbols = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷',
            'powerCustom': '^'
        };
        
        return symbols[operator] || operator;
    }
    
    updateDisplay() {
        this.display.textContent = this.state.displayValue;
        this.expressionDisplay.textContent = this.state.expression;
        this.updateMemoryIndicator();
    }
    
    // Keyboard input handling
    handleKeyboardInput(event) {
        const key = event.key;
        
        // Prevent default for calculator keys
        if (this.isCalculatorKey(key)) {
            event.preventDefault();
        }
        
        // Number keys
        if (key >= '0' && key <= '9') {
            this.inputDigit(key);
        }
        
        // Decimal point
        else if (key === '.') {
            this.inputDecimal();
        }
        
        // Operators
        else if (key === '+') {
            this.handleOperator('add');
        }
        else if (key === '-') {
            this.handleOperator('subtract');
        }
        else if (key === '*') {
            this.handleOperator('multiply');
        }
        else if (key === '/') {
            event.preventDefault();
            this.handleOperator('divide');
        }
        
        // Equals and Enter
        else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            this.calculateResult();
        }
        
        // Clear and Escape
        else if (key === 'Escape' || key === 'Delete') {
            this.clear();
        }
        
        // Backspace
        else if (key === 'Backspace') {
            this.deleteLastCharacter();
        }
        
        // Parentheses
        else if (key === '(' || key === ')') {
            this.inputDigit(key);
        }
        
        // Pi
        else if (key.toLowerCase() === 'p' && event.altKey) {
            this.pi();
        }
    }
    
    isCalculatorKey(key) {
        const calculatorKeys = [
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            '.', '+', '-', '*', '/', '=', 'Enter', 'Escape',
            'Delete', 'Backspace', '(', ')'
        ];
        
        return calculatorKeys.includes(key);
    }
}

// Initialize calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedCalculator();
});