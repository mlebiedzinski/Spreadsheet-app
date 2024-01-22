export interface IExpression {
  // the value of each cell in a range is added to an array
  getRangeValues(startCol: number, startRow: number, endCol: number, endRow: number): Array<number>;
}
