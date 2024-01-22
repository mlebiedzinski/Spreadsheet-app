import { Cell } from "./cell";

describe('Cell', () => {
  let mockFormulaParser: jest.Mock;
  let cell: Cell;
  let observerCell: Cell;

  beforeEach(() => {
    mockFormulaParser = jest.fn();
    cell = new Cell('initialValue', mockFormulaParser);
    observerCell = new Cell('observerInitialValue', mockFormulaParser);
  });

  it('should initialize with the correct value', () => {
    expect(cell.getValue()).toBe('initialValue');
  });

  it('should add and notify an observer', () => {
    const spyUpdate = jest.spyOn(observerCell, 'updateValue');
    cell.addObserver(observerCell);
    cell.setValue('newValue');
    expect(spyUpdate).toHaveBeenCalled();
  });

  it('should remove an observer', () => {
    cell.addObserver(observerCell);
    cell.removeObserver(observerCell);
    const spyUpdate = jest.spyOn(observerCell, 'updateValue');
    cell.setValue('newValue');
    expect(spyUpdate).not.toHaveBeenCalled();
  });

  it('should evaluate and set a formula value', () => {
    mockFormulaParser.mockReturnValue('formulaResult');
    cell.setValue('=someFormula');
    expect(cell.getValue()).toBe('formulaResult');
    expect(mockFormulaParser).toHaveBeenCalledWith('=someFormula', cell);
  });

  it('should add a dependency and notify it', () => {
    const dependencyCell = new Cell('dependencyValue', mockFormulaParser);
    const spyUpdate = jest.spyOn(dependencyCell, 'updateValue');
    cell.addDependency(dependencyCell);
    cell.setValue('newValue');
    expect(spyUpdate).toHaveBeenCalled();
  });

  it('should remove a dependency', () => {
    const dependencyCell = new Cell('dependencyValue', mockFormulaParser);
    cell.addDependency(dependencyCell);
    cell.removeDependency(dependencyCell);
    const spyUpdate = jest.spyOn(dependencyCell, 'updateValue');
    cell.setValue('newValue');
    expect(spyUpdate).not.toHaveBeenCalled();
  });

  it('should update value when formula changes', () => {
    mockFormulaParser.mockReturnValue('formulaResult');
    cell.setValue('=someFormula');
    mockFormulaParser.mockReturnValue('newFormulaResult');
    cell.updateValue();
    expect(cell.getValue()).toBe('newFormulaResult');
  });

  it('sets and gets cell color correctly', () => {
    cell.setCellColor('#FF5733');
    expect(cell.getCellColor()).toBe('#FF5733');
  });
  
  it('sets and gets text color correctly', () => {
    cell.setTextColor('#123456');
    expect(cell.getTextColor()).toBe('#123456');
  });

  it('handles invalid formula values', () => {
    mockFormulaParser.mockReturnValue('Error');
    cell.setValue('=invalidFormula');
    expect(cell.getValue()).toBe('Error');
  });

  it('notifies dependencies and observers for non-formula value', () => {
    const dependencySpy = jest.spyOn(observerCell, 'updateValue');
    const observerSpy = jest.spyOn(observerCell, 'updateValue');
    cell.addDependency(observerCell);
    cell.addObserver(observerCell);
    cell.setValue('nonFormulaValue');
    expect(dependencySpy).toHaveBeenCalled();
    expect(observerSpy).toHaveBeenCalled();
  });

  it('does nothing when updateValue is called without a formula', () => {
    cell.setValue('nonFormulaValue');
    const initialValue = cell.getValue();
    cell.updateValue();
    expect(cell.getValue()).toBe(initialValue);
  });
  
  
  
  
  

});
