# Spreadsheet Application Project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Table of Contents:

-[About](#about)
-[Team](#team)
-[Installation][#installation]
-[System Architecture](#system-architecture)
-[Running the Spreadsheet](#running-the-spreadsheet-npm-start)

## About

Our spreadsheet application is that which implements the following basic spreadsheet
features: 
- Enabling cells to contain numeric constants, string constants
- Storing cells as formulas
- Storing cells as range expressions
- Row & Column insertion and deletion
- Clearing a cell's content
- Error Handling

It also implements the following additonal features:
- Importing files
- Exporting files
- Coloring cells and/or cell content

## Team

- Ousman Jobe
- Madison Lebiedzinski
- Hector Padilla
- Dylan Mccann


## Installation
1. Clone the repo and cd into `implementation` followed by `spreadsheet-app`.

2. To install dependencies, run `npm install` in the terminal.

3. To run tests, run `npm run test:coverage ` in the terminal.

4. To run the the spreadsheet application locally, run `npm start` which will run the 
application in development mode. Open [http://localhost:3000](http://localhost:3000) 
to view it in your browser.

The page will reload when you make changes.\
You may also see any line errors in the console.

## Using the Spreadsheet Application
1. To use CELL REFERENCES, enter `=REF(CR)`, where C -> the column letter and R-> the 
row number. This would display the corresponding cell's data. (e.g. =REF(A1) would 
create a cell reference to cell A1)

2. To use FORMULAS enter:
- `=AVG(C1R1:C2R2)` which will compute the average of the range of cells.

- `=SUM(C1R1:C2R2)` which will compute the average of the range of cells.

- `=CALC(expression)` which will compute the result of an expression using arithmetic 
operations, for example `=CALC(3*(2 + 1))` will result in the cell displaying 9.

- To CLEAR the contents of a cell, select the cell and use the down arrow key.

## System Architecture

1. The `Cell` class implements the `ICells` interface to create a cell object 
for storing string/numeric data and integrates with the `ColorPicker` class, as
well as help handle cell dependencies. It maintains a list of dependent cells (observers) 
and cells it depends on (dependencies).

2. The `Spreadsheet` class implements the `ISpreadsheet` interface and integrates with the 
`FormulaParser` class to manage a grid of cell objects.

3. The `Calculator` class implements the `ICalculator` interface to evaluate arithmetic 
operations and string concatenation 

4. The `SumExpression` and `AverageExpression` classes implement the `IExpression` interface 
to calculate the sums and averages in a range of cells using their cell references.

5. The `SpreadsheetUI` class manages the user controls for row & column insertion and deletion, 
as well as importing and exporting .csv files.

6. The `FormulaParser` class handles the parsing of formulas in the spreadsheet and recognizes 
formulas starting with the equal sign such as SUM, AVG, CALC, and REF (reference). It manages 
cell dependency based on the formula, and replaces the cell reference with its respective value/data.
