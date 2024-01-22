import './App.css';
import SpreadsheetComponent from './components/Spreadsheet/spreadsheetComponent';
function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <SpreadsheetComponent rows={5} columns={5} />
      </header>
    </div>
  );
}

export default App;
