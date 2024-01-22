import { Spreadsheet as SpreadsheetModel } from '../Spreadsheet/spreadsheet'; // Adjust the path as necessary
import { IExpression } from '../../interfaces/IExpression';

export class SumExpression implements IExpression {
  private spreadGrid: SpreadsheetModel;

  public constructor(grid: SpreadsheetModel) {
    this.spreadGrid = grid;
  }

  public getRangeValues(
    startCol: number,
    startRow: number,
    endCol: number,
    endRow: number,
  ): number[] {

    let values: number[] = [];
    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        let cellValue = this.spreadGrid.getCellValue(i, j);
        let numericValue = Number(cellValue);

        if (!isNaN(numericValue)) {
          values.push(numericValue);
        } else {
          console.error(`Non-numeric value encountered at cell: ${j}, ${i}`);
        }
      }
    }
    return values;
  }

  public calcSum(values: Array<number>): number {
    return values.reduce((acc, val) => acc + val, 0);
  }
}
