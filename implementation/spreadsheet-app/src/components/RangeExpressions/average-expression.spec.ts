import Spreadsheet from "../Spreadsheet/spreadsheet";
import { AverageExpression } from "./average-expression";

jest.mock('../Spreadsheet/spreadsheet'); 

describe('AverageExpression', () => {
  let spreadsheet: Spreadsheet;
  let avgExpression: AverageExpression;

  beforeEach(() => {
    spreadsheet = new Spreadsheet(3, 4); 
    avgExpression = new AverageExpression(spreadsheet);

    jest.spyOn(spreadsheet, 'getCellValue').mockImplementation((row, col) => {
      return `${row * col}`; 
    });
  });

  it('retrieves range values correctly', () => {
    const values = avgExpression.getRangeValues(0, 0, 1, 1);
    expect(values).toEqual([0, 0, 0, 1]); 
  });

  it('calculates average correctly', () => {
    const values = [1, 2, 3, 4];
    const average = avgExpression.calcAVG(values);
    expect(average).toBe(2.5);
  });

  it('returns 0 for empty array', () => {
    const average = avgExpression.calcAVG([]);
    expect(average).toBe(0);
  });

  it('includes zero values in average calculation', () => {
    jest.spyOn(spreadsheet, 'getCellValue').mockReturnValue('0');
    const values = avgExpression.getRangeValues(0, 0, 1, 1);
    const average = avgExpression.calcAVG(values);
    expect(average).toBe(0);
  });

  it('handles empty cells correctly', () => {
    jest.spyOn(spreadsheet, 'getCellValue').mockReturnValue('');
    const values = avgExpression.getRangeValues(0, 0, 1, 1);
    const average = avgExpression.calcAVG(values);
    expect(average).toBe(0);
  });

  it('ignores non-numeric values in range', () => {
    jest.spyOn(spreadsheet, 'getCellValue').mockImplementation((row, col) => {
      return (row === 0 && col === 0) ? 'text' : `${row * col}`;
    });
    const values = avgExpression.getRangeValues(0, 0, 1, 1);
    const average = avgExpression.calcAVG(values);
    expect(average).toBeCloseTo(0.333, 3);
  });

  it('calculates average correctly for different ranges', () => {
    const values = avgExpression.getRangeValues(0, 0, 2, 2);
    const average = avgExpression.calcAVG(values);
    expect(average).toBe(1);
  });
  
  
  
  
  
});
