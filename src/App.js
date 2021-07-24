import './App.scss';
import { useState } from 'react';
import { evaluate } from 'mathjs';


function calculate(expr) {
  try {
    return evaluate(expr);
  }
  catch(e) {
    return NaN;
  }
}

function App() {
  const [daily, setDaily] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [yearly, setYearly] = useState(0);

  const [amount, setAmount] = useState(0);
  const [dailyAmount, setDailyAmount] = useState(0);
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [yearlyAmount, setYearlyAmount] = useState(0);

  function baseDaily(e) {
    setDaily( e.target.value );
    const v = calculate(e.target.value) / 100;
    const m = (Math.pow(1+v, 30)-1);
    const y = (Math.pow(1+v, 365)-1);

    setMonthly( m * 100 );
    setYearly( y * 100 );

    baseAmountHelp(calculate(amount), v, m, y);
  }

  function baseMonthly(e) {
    setMonthly( e.target.value );
    const v = calculate(e.target.value) / 100;
    const d = (Math.pow(1+v, 1/30)-1);
    const y = (Math.pow(1+v, 12)-1);

    setDaily( d * 100 );
    setYearly( y * 100);

    baseAmountHelp(calculate(amount), d, v, y);
  }

  function baseYearly(e) {
    setYearly( e.target.value );
    const v = calculate(e.target.value) / 100;

    const d = (Math.pow(1+v, 1/365)-1);
    const m = (Math.pow(1+v, 1/12)-1);
    setDaily( d * 100 );
    setMonthly( m * 100);

    baseAmountHelp(calculate(amount), d, m, v);
  }

  function baseDailyAmount(e) {
    setDailyAmount(e.target.value);
    const v = calculate(e.target.value);
    const a = v / calculate(daily) * 100;
    setAmount(a);
    setMonthlyAmount(a * calculate(monthly) / 100);
    setYearlyAmount(a * calculate(yearly) / 100);
  }
  
  function baseMonthlyAmount(e) {
    setMonthlyAmount(e.target.value);
    const v = calculate(e.target.value);
    const a = v / calculate(monthly) * 100;
    setAmount(a);
    setDailyAmount(a * calculate(daily) / 100);
    setYearlyAmount(a * calculate(yearly) / 100);
  }
  
  function baseYearlyAmount(e) {
    setYearlyAmount(e.target.value);
    const v = calculate(e.target.value);
    const a = v / calculate(yearly) * 100;
    setAmount(a);
    setDailyAmount(a * calculate(daily) / 100);
    setMonthlyAmount(a * calculate(monthly) / 100);
  }

  function baseAmount(e) {
    setAmount(e.target.value);
    const v = calculate(e.target.value);
    baseAmountHelp(v, calculate(daily)/100, calculate(monthly)/100, calculate(yearly)/100);
  }

  function baseAmountHelp(v, d, m, y) {
    setDailyAmount(v * d);
    setMonthlyAmount(v * m);
    setYearlyAmount(v * y);
  }



  return (
    <>
      <div className="field">
        <label className="label">Amount</label>
        <div className="control">
          <input className="input" type="text" 
          value={amount} onChange={baseAmount} />
        </div>
        <p className="help">Amount to multiply by the interest.</p>
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Daily</label>
            <div className="control">
              <input className="input" type="text"  
                value={daily} onChange={baseDaily} />
            </div>
            <p className="help">Daily interest rate in %.</p>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Daily Amount</label>
            <div className="control">
              <input className="input" type="text"  value={dailyAmount} onChange={baseDailyAmount} />
            </div>
            <p className="help">Amount earned in a day.</p>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Monthly</label>
            <div className="control">
              <input className="input" type="text"  
              value={monthly} onChange={baseMonthly} />
            </div>
            <p className="help">Monthly interest rate in %.</p>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Monthly Amount</label>
            <div className="control">
              <input className="input" type="text"  value={monthlyAmount} onChange={baseMonthlyAmount} />
            </div>
            <p className="help">Amount earned in a month.</p>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Yearly</label>
            <div className="control">
              <input className="input" type="text"  
              value={yearly} onChange={baseYearly} />
            </div>
            <p className="help">Yearly interest rate in %.</p>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Yearly Amount</label>
            <div className="control">
              <input className="input" type="text"  value={yearlyAmount} onChange={baseYearlyAmount} />
            </div>
            <p className="help">Amount earned in a year.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
