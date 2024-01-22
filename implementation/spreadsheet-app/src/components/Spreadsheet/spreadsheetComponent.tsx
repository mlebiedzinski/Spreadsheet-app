import React, { useState, useEffect, ChangeEvent } from 'react';
import { Spreadsheet } from './spreadsheet';
import FormulaParser from '../Parsing/formulaParser';
import ColorPicker from '../Cells/colorPicker';
import { Cell } from '../Cells/cell';

interface SpreadsheetComponentProps {
  rows: number;
  columns: number;
}

type Color = {
  color: string;
};

const SpreadsheetComponent: React.FC<SpreadsheetComponentProps> = ({ rows, columns }) => {
  const [spreadsheet, setSpreadsheet] = useState(new Spreadsheet(rows, columns));
  const [grid, setGrid] = useState(spreadsheet.getGrid());
  const [inputValues, setInputValues] = useState<string[][]>(
    spreadsheet.getGrid().map(row => row.map(cell => cell.getValue())),
  );

  useEffect(() => {
    setGrid(spreadsheet.getGrid());
  }, [spreadsheet]);

  // Added useEffect here to log changes to the spreadsheet
  useEffect(() => {
    //console.log('Spreadsheet data changed:', grid);
  }, [grid]);

  const handleCellChange = (row: number, col: number, value: string) => {
    // Update the local state, not the spreadsheet
    const newInputValues = [...inputValues];
    newInputValues[row][col] = value;
    setInputValues(newInputValues);
  };

  const handleKeyDown = (row: number, col: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const inputValue = inputValues[row][col];
      spreadsheet.setCellValue(row, col, inputValue);

      try {
        // Update grid state
        setGrid([...spreadsheet.getGrid()]);

        // Update inputValues state based on the spreadsheet's current state
        const updatedInputValues = spreadsheet
          .getGrid()
          .map(row => row.map(cell => cell.getValue()));
        setInputValues(updatedInputValues);
        e.preventDefault();
      } catch (error) {
        console.error('Error in handleKeyDown:', error);
      }
      //Clearing (selected) cell data
      //Uses down arrow instead of backspace so that normal backspace functionality remains
    } else if (e.key === 'ArrowDown') {
      spreadsheet.setCellValue(row, col, '');

      try {
        // Update grid state
        setGrid([...spreadsheet.getGrid()]);

        // Update inputValues state based on the spreadsheet's current state
        const updatedInputValues = spreadsheet
          .getGrid()
          .map(row => row.map(cell => cell.getValue()));
        setInputValues(updatedInputValues);
        e.preventDefault();
      } catch (error) {
        console.error('Error in handleKeyDown:', error);
      }
    }
  };

  const getColumnLabel = (index: number) => {
    let label = '';
    while (index >= 0) {
      let remainder = index % 26;
      label = String.fromCharCode(65 + remainder) + label;
      index = Math.floor(index / 26) - 1;
    }
    return label;
  };

  const removeRow = (atIndex: number) => {
    try {
      spreadsheet.removeRow(atIndex);
      setGrid([...spreadsheet.getGrid()]);

      // Also update inputValues
      const newInputValues = [...inputValues];
      newInputValues.splice(atIndex, 1);
      setInputValues(newInputValues);
    } catch (error) {
      console.error(error);
    }
  };

  const removeColumn = (atIndex: number) => {
    try {
      spreadsheet.removeColumn(atIndex);
      setGrid([...spreadsheet.getGrid()]);

      // Also update inputValues
      const newInputValues = inputValues.map(row => {
        const newRow = [...row];
        newRow.splice(atIndex, 1);
        return newRow;
      });
      setInputValues(newInputValues);
    } catch (error) {
      console.error(error);
    }
  };

  const removeLastRow = () => {
    if (spreadsheet.getRowCount() > 1) {
      removeRow(spreadsheet.getRowCount() - 1);
    } else {
      alert('Cannot remove the only remaining row.');
    }
  };

  const removeLastColumn = () => {
    if (spreadsheet.getColumnCount() > 1) {
      removeColumn(spreadsheet.getColumnCount() - 1);
    } else {
      alert('Cannot remove the only remaining column.');
    }
  };

  const addLastRow = () => {
    if (spreadsheet) {
      const rowCount = spreadsheet.getRowCount();
      spreadsheet.addRow(rowCount);
      setGrid([...spreadsheet.getGrid()]);

      // Update inputValues
      const newRowValues = new Array(spreadsheet.getColumnCount()).fill('');
      setInputValues([...inputValues, newRowValues]);
    } else {
      alert('Spreadsheet object is not defined.');
    }
  };

  const addLastColumn = () => {
    if (spreadsheet) {
      const columnCount = spreadsheet.getColumnCount();
      spreadsheet.addColumn(columnCount);
      setGrid([...spreadsheet.getGrid()]);

      // Update inputValues
      const newInputValues = inputValues.map(row => [...row, '']);
      setInputValues(newInputValues);
    } else {
      alert('Spreadsheet object is not defined.');
    }
  };

  const getRowIndexFromCellId = (cellId: string): number => {
    // Assuming cellId is in the format "A1", "B3", etc.
    const rowLabel = parseInt(String(cellId).substring(1));
    return rowLabel - 1; // Adjust row label to index (1 becomes 0, 2 becomes 1, ...)
  };

  const getColIndexFromCellId = (cellId: string): number => {
    // Assuming cellId is in the format "A1", "B3", etc.

    const colLabel = String(cellId).charAt(0).toUpperCase();
    return colLabel.charCodeAt(0) - 65; // Convert column label to index (A=0, B=1, C=2, ...)
  };

  // Event handler for the export button
  const handleExportToCSV = () => {
    spreadsheet.downloadCSV(); // This calls the method in your Spreadsheet class
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          updateSpreadsheetWithCSVData(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const updateSpreadsheetWithCSVData = (csvData: string) => {
    const rows = csvData.split('\n');
    rows.forEach((row, rowIndex) => {
      const values = row.split(',');
      values.forEach((value, colIndex) => {
        spreadsheet.setCellValue(rowIndex, colIndex, value.trim());
      });
    });

    // Trigger a re-render
    setGrid([...spreadsheet.getGrid()]);
    const updatedInputValues = spreadsheet.getGrid().map(row => row.map(cell => cell.getValue()));
    setInputValues(updatedInputValues);
  };

  const handleCellColorChange = (color: Color, cellId: string) => {
    console.log(color);
    const hex: string = color.color;
    // Find the row and column indices based on the cell id
    // Update the color of the input field in the grid state
    const newGrid: Cell[][] = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (
          colIndex === getColIndexFromCellId(cellId) &&
          rowIndex === getRowIndexFromCellId(cellId)
        ) {
          const updatedCell = cell.setCellColor(hex);

          if (updatedCell !== undefined) {
            return updatedCell;
          } else {
            console.error('setCellColor returned undefined');
            return cell; // Keep the existing cell
          }
        }
        return cell;
      }),
    );
    // Update the grid state
    setGrid(newGrid);
  };

  const handleTextColorChange = (color: Color, cellId: string) => {
    console.log(color);
    const hex: string = color.color;
    // Find the row and column indices based on the cell id
    // Update the color of the input field in the grid state
    const newGrid: Cell[][] = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (
          colIndex === getColIndexFromCellId(cellId) &&
          rowIndex === getRowIndexFromCellId(cellId)
        ) {
          const updatedCell = cell.setTextColor(hex);

          if (updatedCell !== undefined) {
            return updatedCell;
          } else {
            console.error('setCellColor returned undefined');
            return cell; // Keep the existing cell
          }
        }
        return cell;
      }),
    );
    // Update the grid state
    setGrid(newGrid);
  };

  return (
    <div className='row'>
      <div className='col-2'>
        <ColorPicker
          onCellColorChange={handleCellColorChange}
          onTextColorChange={handleTextColorChange}
        />
      </div>
      <div className='col-10'>
        <div>
          <button className='button-style' onClick={addLastRow}>
            <i className='fas fa-plus' style={{ marginRight: '5px' }}></i>Add Last Row
          </button>
          <button className='button-style' onClick={addLastColumn}>
            <i className='fas fa-plus' style={{ marginRight: '5px' }}></i>Add Last Column
          </button>
          <button className='button-style' onClick={removeLastRow}>
            <i className='fas fa-minus' style={{ marginRight: '5px' }}></i>Remove Last Row
          </button>
          <button className='button-style' onClick={removeLastColumn}>
            <i className='fas fa-minus' style={{ marginRight: '5px' }}></i>Remove Last Column
          </button>
          <button className='button-style' onClick={handleExportToCSV}>
            <i className='fas fa-file-export' style={{ marginRight: '5px' }}></i>Export to CSV
          </button>
          <input type='file' accept='.csv' onChange={handleFileUpload} />
        </div>
        <table className='spreadsheet-container'>
          <thead className='row-header'>
            <tr>
              <th></th>
              {Array.from({ length: spreadsheet.getColumnCount() }, (_, index) => (
                <th className='row-header' key={index}>
                  {getColumnLabel(index)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className='row-header'>{rowIndex + 1}</td> {/* Row label */}
                {row.map((cell, colIndex) => (
                  <td key={colIndex}>
                    <input
                      className='cells'
                      type='text'
                      value={inputValues[rowIndex][colIndex]}
                      onChange={e => handleCellChange(rowIndex, colIndex, e.target.value)}
                      onKeyDown={e => handleKeyDown(rowIndex, colIndex, e)}
                      style={{
                        backgroundColor: cell.getCellColor(), // Set background color
                        color: cell.getTextColor(), // Set text color
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <h6 style={{ color: 'red' }}>Press Down Arrow Key to Clear Cell</h6>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetComponent;
