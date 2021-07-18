import './App.scss';
import { useState } from 'react';


function App() {
  const [daily, setDaily] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [yearly, setYearly] = useState(0);

  function baseDaily(e) {
    setDaily(e.target.value);
    const v = parseFloat(e.target.value / 100);
    if (v) {
      setMonthly( (Math.pow(1+v, 30)-1) * 100 );
      setYearly( (Math.pow(1+v, 365)-1) * 100 );
    }
  }

  function baseMonthly(e) {
    setMonthly(e.target.value);
    const v = parseFloat(e.target.value / 100);
    if (v) {
      setDaily( (Math.pow(1+v, 1/30)-1) * 100 );
      setYearly( (Math.pow(1+v, 12)-1) * 100);
    }
  }

  function baseYearly(e) {
    setYearly(e.target.value);
    const v = parseFloat(e.target.value / 100);
    if (v) {
      setDaily( (Math.pow(1+v, 1/365)-1) * 100);
      setMonthly( (Math.pow(1+v, 1/12)-1) * 100);
    }
  }

  return (
    <>
      <div className="field">
        <label className="label">Daily</label>
        <div className="control">
          <input className="input" type="text"  value={daily} onChange={baseDaily} />
        </div>
        <p className="help">Daily inerest rate in %</p>
      </div>
      <div className="field">
        <label className="label">Monthly</label>
        <div className="control">
          <input className="input" type="text"  value={monthly} onChange={baseMonthly} />
        </div>
        <p className="help">Monthly inerest rate in %</p>
      </div>
      <div className="field">
        <label className="label">Yearly</label>
        <div className="control">
          <input className="input" type="text"  value={yearly} onChange={baseYearly} />
        </div>
        <p className="help">Yearly inerest rate in %</p>
      </div>
    </>
  );
}

export default App;
