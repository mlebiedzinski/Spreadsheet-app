import { Spreadsheet as SpreadsheetModel } from '../Spreadsheet/spreadsheet';
import { SumExpression } from './sum-expression';

jest.mock('../Spreadsheet/spreadsheet'); // Adjust the path as necessary

describe('SumExpression', () => {
  let spreadsheet: SpreadsheetModel;
  let sumExpression: SumExpression;

  beforeEach(() => {
    spreadsheet = new SpreadsheetModel(3, 4); 
    sumExpression = new SumExpression(spreadsheet);

    jest.spyOn(spreadsheet, 'getCellValue').mockImplementation((row, col) => {
      return `${row + col}`; 
    });
  });

  it('retrieves range values correctly', () => {
    const values = sumExpression.getRangeValues(0, 0, 1, 1);
    expect(values).toEqual([0, 1, 1, 2]); 
  });

  it('calculates sum correctly', () => {
    const values = [1, 2, 3, 4];
    const sum = sumExpression.calcSum(values);
    expect(sum).toBe(10);
  });

  it('ignores non-numeric values', () => {
    jest.spyOn(spreadsheet, 'getCellValue').mockImplementation((row, col) => {
      return row === 0 && col === 0 ? 'text' : `${row + col}`;
    });
    const values = sumExpression.getRangeValues(0, 0, 1, 1);
    expect(values).toEqual([1, 1, 2]);
  });
  
  it('calculates sum correctly with mocked data', () => {
    jest.spyOn(spreadsheet, 'getCellValue').mockImplementation((row, col) => {
      const mockData = [[1, 2], [3, 4]];
      return mockData[row][col].toString();
    });
    const values = sumExpression.getRangeValues(0, 0, 1, 1);
    const sum = sumExpression.calcSum(values);
    expect(sum).toBe(10); // 1+2+3+4
  });
  
  it('handles large ranges correctly', () => {
    const values = sumExpression.getRangeValues(0, 0, 2, 3);
    expect(values.length).toBeGreaterThan(4); 
  });

});
