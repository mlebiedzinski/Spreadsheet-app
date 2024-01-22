import { Spreadsheet as SpreadsheetModel } from '../Spreadsheet/spreadsheet'; // Adjust the path as necessary
import { IExpression } from '../../interfaces/IExpression';

export class AverageExpression implements IExpression {
  private spreadGrid: SpreadsheetModel;

  public constructor(grid: SpreadsheetModel) {
    this.spreadGrid = grid;
    //console.log('AverageExpression initialized with grid:', grid);
  }

  public getRangeValues(
    startCol: number,
    startRow: number,
    endCol: number,
    endRow: number,
  ): number[] {
    console.log(
      `Getting range values from column ${startCol} to ${endCol} and row ${startRow} to ${endRow}`,
    );

    let values: number[] = [];
    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        //console.log(`Accessing cell at row ${i}, column ${j}`);
        let cellValue = this.spreadGrid.getCellValue(i, j);
        let numericValue = Number(cellValue);

        if (!isNaN(numericValue)) {
          values.push(numericValue);
          //console.log(`Added value ${cellValue} to average calculation`);
        } else {
          console.error(`Non-numeric value encountered at cell: ${j}, ${i}`);
        }
      }
    }
    //console.log('Calculated values array: ', values);
    return values;
  }

  public calcAVG(values: Array<number>): number {
    if (values.length === 0) {
      return 0; // Avoid division by zero
    }

    let sum: number = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }
}
