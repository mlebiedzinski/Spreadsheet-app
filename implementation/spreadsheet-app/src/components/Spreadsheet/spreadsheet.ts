import FormulaParser from '../Parsing/formulaParser';
import { Cell } from '../Cells/cell';
import { ISpreadsheet } from '../../interfaces/ISpreadsheet';

export class Spreadsheet implements ISpreadsheet{
  private grid!: Cell[][];
  private formulaParser: FormulaParser;
  private nextCellValue: number;

  constructor(rows: number, columns: number) {
    this.formulaParser = new FormulaParser(this);
    this.nextCellValue = 1;
    this.initializeGrid(rows, columns);
  }

  private initializeGrid(rows: number, columns: number): void {
    this.grid = Array.from({ length: rows }, () => this.createRow(columns));
  }

  private createRow(columns: number): Cell[] {
    return Array.from({ length: columns }, () => this.createCell());
  }

  private createCell(): Cell {
    const cellValue = this.nextCellValue.toString();
    this.nextCellValue++;
    return new Cell(cellValue, (formula: string, cell: Cell) =>
      this.formulaParser.computeFormulaValue(formula, cell),
    );
  }

  private validateCellReference(row: number, col: number): void {
    if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[row].length) {
      throw new Error(`Invalid cell reference: (${row}, ${col})`);
    }
  }

  getCell(row: number, col: number): Cell {
    this.validateCellReference(row, col);
    return this.grid[row][col];
  }

  setCellValue(row: number, col: number, value: string): void {
    this.validateCellReference(row, col);
    const cell = this.getCell(row, col);

    cell.setValue(value); // Set value first
    if (this.formulaParser.isFormula(value)) {
      this.formulaParser.updateCellObservers(cell, value); // Then update observers
    }
    cell.notifyObservers();
  }

  getCellValue(row: number, col: number): string {
    return this.getCell(row, col).getValue();
  }

  public getGrid(): Cell[][] {
    return this.grid;
  }

  addRow(atIndex: number): void {
    this.validateRowInsertion(atIndex);
    const newRow = this.createRow(this.getColumnCount());
    this.grid.splice(atIndex, 0, newRow);
  }

  private validateRowInsertion(index: number): void {
    if (index < 0 || index > this.grid.length) {
      throw new Error('Invalid row index.');
    }
  }

  removeRow(atIndex: number): void {
    if (atIndex < 0 || atIndex >= this.grid.length) {
      throw new Error('Invalid operation. Cannot remove row.');
    }
    this.grid.splice(atIndex, 1);
  }

  addColumn(atIndex: number): void {
    this.validateColumnInsertion(atIndex);
    this.grid.forEach(row => row.splice(atIndex, 0, this.createCell()));
  }

  private validateColumnInsertion(index: number): void {
    if (index < 0 || index > this.getColumnCount()) {
      throw new Error('Invalid column index.');
    }
  }

  removeColumn(atIndex: number): void {
    if (atIndex < 0 || atIndex >= this.getColumnCount()) {
      throw new Error('Invalid operation. Cannot remove column.');
    }
    this.grid.forEach(row => row.splice(atIndex, 1));
  }

  public getRowCount(): number {
    return this.grid.length;
  }

  public getColumnCount(): number {
    return this.grid[0]?.length || 0;
  }

    // Method to convert the grid to CSV
    public convertGridToCSV(): string {
      return this.grid.map(row => 
        row.map(cell => {
          const cellValue = cell.getValue().replace(/"/g, '""');
          return `"${cellValue}"`; // Ensure each cell is enclosed in quotes
        }).join(',')
      ).join('\n');
    }
  
    // Method to trigger CSV download
    public downloadCSV(filename: string = 'spreadsheet.csv'): void {
      const csvString = this.convertGridToCSV();
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link); // Append link to body for Firefox compatibility
      link.click();
      document.body.removeChild(link); // Clean up after download
      URL.revokeObjectURL(link.href);
    }
}

export default Spreadsheet;
