import logo from './logo.svg';
import './App.css';
import { useState } from 'react';


function App() {
  const [daily, setDaily] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [yearly, setYearly] = useState(0);

  function baseDaily(e) {
    setDaily(e.target.value);
    const v = parseFloat(e.target.value);
    if (v) {
      setMonthly( Math.pow(1+v, 30)-1 );
      setYearly( Math.pow(1+v, 365)-1 );
    }
  }

  function baseMonthly(e) {
    setMonthly(e.target.value);
    const v = parseFloat(e.target.value);
    if (v) {
      setDaily( Math.pow(1+v, 1/30)-1 );
      setYearly( Math.pow(1+v, 12)-1 );
    }
  }

  function baseYearly(e) {
    setYearly(e.target.value);
    const v = parseFloat(e.target.value);
    if (v) {
      setDaily( Math.pow(1+v, 1/365)-1 );
      setMonthly( Math.pow(1+v, 1/12)-1 );
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <fieldset>
          <label>Daily 
            <input type="text" value={daily} onChange={baseDaily} /> 
          </label>
        </fieldset>
        <fieldset> 
          <label>
            Monthly
          <input type="text" value={monthly} onChange={baseMonthly} /> 
          </label>
        </fieldset>
        <fieldset>
          <label>
            Yearly
          </label>
          <input type="text" value={yearly} onChange={baseYearly} /> 
        </fieldset>
      </header>
    </div>
  );
}

export default App;
