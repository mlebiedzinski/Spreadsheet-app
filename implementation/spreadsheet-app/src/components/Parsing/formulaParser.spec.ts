import FormulaParser from './formulaParser';
import Spreadsheet from '../Spreadsheet/spreadsheet';
import {Cell} from '../Cells/cell';

jest.mock('../Spreadsheet/spreadsheet');

describe('FormulaParser', () => {
    let spreadsheet: Spreadsheet;
    let formulaParser: FormulaParser;
    let mockCell: Cell;
    let mockFormulaParserCallback: jest.Mock<any, [formula: any, cell: any], any>;
  
    beforeEach(() => {
      spreadsheet = new Spreadsheet(3, 4);
      formulaParser = new FormulaParser(spreadsheet);
  
      mockFormulaParserCallback = jest.fn((formula, cell) => formula);
      mockCell = new Cell('initialValue', mockFormulaParserCallback);
  
      // Mocking getCell to return a valid Cell instance
      jest.spyOn(spreadsheet, 'getCell').mockImplementation((row, col) => {
        return new Cell(`MockValue${row}${col}`, mockFormulaParserCallback);
      });
    });
  
    it('computes REF formula correctly', () => {
      jest.spyOn(spreadsheet, 'getCellValue').mockReturnValue('5');
      expect(formulaParser.computeFormulaValue('=REF(A1)', mockCell)).toBe('5');
    });

    it('identifies formulas correctly', () => {
        expect(formulaParser.isFormula('=SUM(A1:B2)')).toBe(true);
        expect(formulaParser.isFormula('Not a formula')).toBe(false);
      });
    
      
      it('computes arithmetic formulas correctly', () => {
        expect(formulaParser.computeFormulaValue('=CALC(1+2)', mockCell)).toBe('3');
      });
      
      it('extracts cell references correctly', () => {
        const refs = formulaParser.extractCellReferences('=SUM(A1:A4)');
        expect(refs).toEqual(['A1', 'A2', 'A3', 'A4']);
      });

      it('returns empty string for invalid formulas', () => {
        expect(formulaParser.computeFormulaValue('=INVALID(A1:B2)', mockCell)).toBe('');
      });
    
  });
