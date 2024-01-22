export class Cell {
    private displayValue!: string;
    private formula!: string | null;
    private observers: Cell[] = [];
    private formulaParserCallback: (formula: string, cell: Cell) => string | number;
    private updateCallback: () => void = () => { };
    private dependencies: Cell[] = [];
    private cellColor: string;
    private textColor: string;

    constructor(
        initialValue: string,
        formulaParserCallback: (formula: string, cell: Cell) => string | number,
    ) {
        this.cellColor = 'white';
        this.textColor = 'black';
        this.formulaParserCallback = formulaParserCallback;
        this.setValue(initialValue);
    }

    addDependency(cell: Cell): void {
        this.dependencies.push(cell);
    }

    removeDependency(cell: Cell): void {
        this.dependencies = this.dependencies.filter(dep => dep !== cell);
    }

    notifyDependencies(): void {
        this.dependencies.forEach(dep => dep.updateValue());
    }

    setUpdateCallback(callback: () => void): void {
        this.updateCallback = callback;
    }

    addObserver(observerCell: Cell): void {
        this.observers.push(observerCell);
        console.log(
            `Added observer. Current cell value: ${this.displayValue
            }, New observer cell value: ${observerCell.getValue()}, Total observers: ${this.observers.length
            }`,
        );
    }

    removeObserver(observerCell: Cell): void {
        this.observers = this.observers.filter(observer => observer !== observerCell);
    }

    notifyObservers(): void {
        this.observers.forEach(observerCell => observerCell.updateValue());
    }

    setValue(value: string): void {
        if (value.startsWith('=')) {
            // It's a formula
            this.formula = value;
            this.displayValue = this.evaluateFormula(value);
            this.notifyObservers(); // Notify observers
            this.notifyDependencies(); // Notify dependent cells
        } else {
            // It's a direct value
            this.displayValue = value;
            this.formula = null;
            this.notifyObservers(); // Notify observers
            this.notifyDependencies(); // Notify dependent cells
        }
    }

    getValue(): string {
        return this.displayValue;
    }

    private evaluateFormula(formula: string): string {
        // Use the formulaParserCallback to evaluate the formula
        const result = this.formulaParserCallback(formula, this);
        return result.toString();
    }

    updateValue(): void {
        if (this.formula) {
            this.displayValue = this.evaluateFormula(this.formula);
            this.notifyDependencies(); // Notify dependent cells
            //this.notifyObservers(); // Notify observers
        }
    }

    setCellColor(hex: string) {
        this.cellColor = hex;
    }
    getCellColor() {
        return this.cellColor;
    }
    setTextColor(hex: string) {
        this.textColor = hex;
    }
    getTextColor() {
        return this.textColor;
    }
}
