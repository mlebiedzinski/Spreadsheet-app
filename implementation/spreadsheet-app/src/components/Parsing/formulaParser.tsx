import { SumExpression } from '../RangeExpressions/sum-expression';
import { AverageExpression } from '../RangeExpressions/average-expression';
import { Spreadsheet } from '../Spreadsheet/spreadsheet';
import { Cell } from '../Cells/cell';
import { Calculator } from '../Calculator/calculator';

class FormulaParser {
  private spreadsheet: Spreadsheet;

  constructor(spreadsheet: Spreadsheet) {
    this.spreadsheet = spreadsheet;
  }

  // Returns true if the specified value is a formula, false otherwise
  isFormula(value: string): boolean {
    return value.startsWith('=');
  }

  // Returns the value of the specified formula, or an empty string if the formula is invalid
  computeFormulaValue(parsedResult: string, formulaCell: Cell): string | number {
    console.log('CHECKING ' + parsedResult);
    if (!this.isFormula(parsedResult)) {
      return '';
    }

    this.updateCellObservers(formulaCell, parsedResult);

    const formulaTypeMatch = parsedResult.match(/^=(\w+)/);
    if (formulaTypeMatch) {
      const formulaType = formulaTypeMatch[1];
      switch (formulaType) {
        case 'REF':
          return this.handleRefFormula(parsedResult);
        case 'SUM':
          return this.handleSumFormula(parsedResult);
        case 'AVG':
          return this.handleAvgFormula(parsedResult);
        case 'CALC':
          return this.handleArithmeticFormula(parsedResult);
        default:
          return '';
      }
    } else {
      return '';
    }
  }

  // Updates the cell observers for the specified cell based on the specified formula
  updateCellObservers(cell: Cell, formula: string): void {
    const dependentCells = this.extractCellReferences(formula);
    dependentCells.forEach(ref => {
      const [colLabel, rowIndex] = ref.split(/(\d+)/);
      const row = parseInt(rowIndex, 10) - 1;
      const col = this.colLabelToIndex(colLabel);
      const referencedCell = this.spreadsheet.getCell(row, col);
      cell.addDependency(referencedCell);
      referencedCell.addObserver(cell);
    });
  }

  // Extracts the cell references from the specified formula
  public extractCellReferences(formula: string): string[] {
    const references: string[] = [];
    const refPattern = /\b([A-Z]+[0-9]+):([A-Z]+[0-9]+)\b|\b([A-Z]+[0-9]+)\b/g;
    let match;

    while ((match = refPattern.exec(formula)) !== null) {
      if (match[1] && match[2]) {
        // Range detected
        const startRef = match[1];
        const endRef = match[2];
        const rangeRefs = this.calculateRange(startRef, endRef);
        references.push(...rangeRefs);
      } else if (match[3]) {
        // Single cell reference
        references.push(match[3]);
      }
    }

    return references;
  }

  // Calculates the range of cell references specified by the start and end cell references
  private calculateRange(startRef: string, endRef: string): string[] {
    const rangeRefs: string[] = [];
    const [startCol, startRow] = [
      startRef.replace(/\d+/g, ''),
      parseInt(startRef.replace(/\D+/g, '')),
    ];
    const [endCol, endRow] = [endRef.replace(/\d+/g, ''), parseInt(endRef.replace(/\D+/g, ''))];

    for (let col = startCol; col <= endCol; col = this.incrementColumn(col)) {
      for (let row = startRow; row <= endRow; row++) {
        rangeRefs.push(`${col}${row}`);
      }
    }
    return rangeRefs;
  }

  // Increments the specified column label by one
  private incrementColumn(col: string): string {
    // Convert column label to number, increment, convert back to label
    let colNum = col
      .split('')
      .reduce((sum, letter) => sum * 26 + letter.charCodeAt(0) - 'A'.charCodeAt(0) + 1, 0);
    colNum++;
    let newCol = '';
    while (colNum > 0) {
      colNum--;
      newCol = String.fromCharCode((colNum % 26) + 'A'.charCodeAt(0)) + newCol;
      colNum = Math.floor(colNum / 26);
    }
    return newCol;
  }

  // Converts a column label to a zero-based index
  private colLabelToIndex(columnLabel: string): number {
    let index = 0;
    for (let i = 0; i < columnLabel.length; i++) {
      index *= 26;
      index += columnLabel.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
    }
    return index - 1;
  }

  // Handles a reference formula in a spreadsheet.
  private handleRefFormula(formula: string): string | number {
    // Regex to match the formula pattern '=REF(cellReference)'
    const match = formula.match(/^=REF\((\w+\d+)\)$/);

    if (!match) return '';

    // Extract the cell reference from the formula (e.g., 'A1')
    const cellReference = match[1];

    // Split the cell reference into column label (e.g., 'A') and row index (e.g., '1')
    const [colLabel, rowIndex] = cellReference.split(/(\d+)/);

    // Convert the row index to a zero-based index
    const row = parseInt(rowIndex, 10) - 1;

    // Convert the column label to a zero-based index
    const col = this.colLabelToIndex(colLabel);

    // Retrieve and return the value from the specified cell in the spreadsheet
    return this.spreadsheet.getCellValue(row, col);
  }

  // Handles formula that contains a REF, SUM, or AVG formula and returns the value of the formula
  replaceWithValues(formula: string): string {
    // Replace REF formulas
    formula = formula.replace(/REF\((\w+\d+)\)/g, (match, cellRef) => {
      const value = this.handleRefFormula(`=REF(${cellRef})`);
      return value.toString();
    });

    // Replace SUM formulas
    formula = formula.replace(/SUM\((\w+\d+):(\w+\d+)\)/g, (match, startCell, endCell) => {
      console.log('value: ' + this.handleSumFormula(`=SUM(${startCell}:${endCell})`).toString());
      const value = this.handleSumFormula(`=SUM(${startCell}:${endCell})`);
      return value.toString();
    });

    // Replace AVG formulas
    formula = formula.replace(/AVG\((\w+\d+):(\w+\d+)\)/g, (match, startCell, endCell) => {
      const value = this.handleAvgFormula(`=AVG(${startCell}:${endCell})`);
      return value.toString();
    });

    return formula;
  }

  // Handles a SUM formula in a spreadsheet
  private handleSumFormula(formula: string): number {
    const sumExpression = new SumExpression(this.spreadsheet);
    const result = this.handleRangeFormula(formula, sumExpression, sumExpression.calcSum);
    console.log('handleSumFormula: ' + result);
    return result;
  }

  // Handles an AVG formula in a spreadsheet
  private handleAvgFormula(formula: string): number {
    const avgExpression = new AverageExpression(this.spreadsheet);
    const result = this.handleRangeFormula(formula, avgExpression, avgExpression.calcAVG);
    return result;
  }

  // Handles a range formula in a spreadsheet
  private handleRangeFormula(
    formula: string,
    expressionInstance: SumExpression | AverageExpression,
    calculationFunction: {
      (values: number[]): number;
      (values: number[]): number;
      (arg0: any): number;
    },
  ): number {
    console.group('handleRangeFormula');
    console.log(formula);
    const rangeMatch = formula.match(/^=\w+\((\w+\d+):(\w+\d+)\)$/);
    console.log(rangeMatch);
    console.groupEnd();
    if (!rangeMatch) return 0;

    const startCellRef = rangeMatch[1];
    const endCellRef = rangeMatch[2];
    const [startColLabel, startRowIndex] = startCellRef.split(/(\d+)/);
    const [endColLabel, endRowIndex] = endCellRef.split(/(\d+)/);

    const startRow = parseInt(startRowIndex, 10) - 1;
    const endRow = parseInt(endRowIndex, 10) - 1;
    const startCol = this.colLabelToIndex(startColLabel);
    const endCol = this.colLabelToIndex(endColLabel);

    const values = expressionInstance.getRangeValues(startCol, startRow, endCol, endRow);
    return calculationFunction(values);
  }

  // Handles an arithmetic formula in a spreadsheet
  private handleArithmeticFormula(formula: string): string {
    console.log(`Handling CALC formula: ${formula}`);

    // Use regex to check for the presence of REF, SUM, or AVG
    const formulaCheckRegex = /\b(REF|SUM|AVG)\b/;
    if (formulaCheckRegex.test(formula)) {
      console.log('formula includes REF, SUM, or AVG');
      formula = this.replaceWithValues(formula);
    }

    console.log(`Handling CALC formula: ${formula}`);

    // =CALC(1+2) -> 1+2
    // =CALC((2+3)*4) -> (2+3)*4
    const value = this.extractExpression(formula);
    console.log('value: ' + value);

    const calculator = new Calculator();

    const evaluationResult = calculator.evaluateExpression(value);

    // Check if the evaluation result is NaN
    if (isNaN(evaluationResult)) {
      // If NaN, treat it as a string concatenation and remove the '+' sign
      return value.toString().replace(/\+/g, '');
    } else {
      // If not NaN, return the evaluation result
      return evaluationResult.toString();
    }
  }

  // Extracts the expression from the specified formula
  extractExpression(expression: string): string {
    // Find the start of the expression after "=CALC("
    const startIndex = expression.indexOf('=CALC(') + '=CALC('.length;

    // Find the ending parenthesis
    const endIndex = expression.lastIndexOf(')');

    // Extract and return the expression between these indices
    console.log('extractExpression: ' + expression.slice(startIndex, endIndex));
    return expression.slice(startIndex, endIndex);
  }
}

export default FormulaParser;
