import Spreadsheet from '../Spreadsheet/spreadsheet';

describe('Spreadsheet', () => {
  let spreadsheet: Spreadsheet;

  beforeEach(() => {
    spreadsheet = new Spreadsheet(3, 4); // For example, a 3x4 grid
  });

  it('should initialize with the correct grid size', () => {
    expect(spreadsheet.getRowCount()).toBe(3);
    expect(spreadsheet.getColumnCount()).toBe(4);
  });

  it('should set and get cell value correctly', () => {
    spreadsheet.setCellValue(0, 0, 'Test');
    expect(spreadsheet.getCellValue(0, 0)).toBe('Test');
  });

  it('should correctly convert grid to CSV', () => {
    
    const expectedCsv = '"1","2","3","4"\n"5","6","7","8"\n"9","10","11","12"';
    expect(spreadsheet.convertGridToCSV()).toBe(expectedCsv);
  });

  it('should correctly add and remove rows', () => {
    spreadsheet.addRow(3); // Adding at the end
    expect(spreadsheet.getRowCount()).toBe(4);

    spreadsheet.removeRow(3); // Removing the newly added row
    expect(spreadsheet.getRowCount()).toBe(3);
  });

  it('should correctly add and remove columns', () => {
    spreadsheet.addColumn(4); // Adding at the end
    expect(spreadsheet.getColumnCount()).toBe(5);

    spreadsheet.removeColumn(4); // Removing the newly added column
    expect(spreadsheet.getColumnCount()).toBe(4);
  });

  it('should throw error for invalid row addition', () => {
    expect(() => spreadsheet.addRow(-1)).toThrow();
    expect(() => spreadsheet.addRow(spreadsheet.getRowCount() + 1)).toThrow();
  });

  it('should handle cell values with special characters for CSV conversion', () => {
    spreadsheet.setCellValue(0, 0, 'Value "with" quotes, commas, and\nnewlines');
    const expectedCsv = '"Value ""with"" quotes, commas, and\nnewlines","2","3","4"\n"5","6","7","8"\n"9","10","11","12"';
    expect(spreadsheet.convertGridToCSV()).toBe(expectedCsv);
  });

});
