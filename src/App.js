import './App.scss';
import { useState } from 'react';

function App() {
  const [daily, setDaily] = useState(1);
  const [monthly, setMonthly] = useState(0);
  const [yearly, setYearly] = useState(0);

  const [amount, setAmount] = useState(100);
  const [dailyAmount, setDailyAmount] = useState(0);
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [yearlyAmount, setYearlyAmount] = useState(0);

  // useEffect(() => {
  //   const v = daily / 100;
  //   setDaily(v);
  //   if (v) {
  //     setMonthly((Math.pow(1+v, 30)-1) * 100);
  //     setYearly((Math.pow(1+v, 365)-1) * 100);
  //   }
  // }, [dailyE]);
  // useEffect(baseMonthly, [monthlyE]);
  // useEffect(baseYearly, [yearlyE]);
  
  // function fixAmounts() {
    //   const v = parseFloat(amount);
    
    //   setDailyAmount(daily / 100 * v);
  //   setMonthlyAmount(monthly / 100 * v);
  //   setYearlyAmount(yearly / 100 * v);
  // }

  // function check(ref, d, u) {
  //   return (e) => {
  //     ref.current = e.target.value;
  //     const v = parseFloat(e.target.value);
  //     if(v) {
  //       u(d+1);
  //     }
  //   }
  // }

  // function baseAmount(e) {
  //   setAmount(e.target.value);
  //   const v = parseFloat(e.target.value);
  //   if (v) {
  //     setEvent(Events.AMOUNT);
  //   }    
  // }

  // function baseDailyAmount(e) {
    
  // }
  // function baseMonthlyAmount(e) {
    
  // }
  // function baseYearlyAmount(e) {
    
  // }


  function baseDaily(e) {
    setDaily( e.target.value );
    const v = e.target.value / 100;
    setMonthly( (Math.pow(1+v, 30)-1) * 100 );
    setYearly( (Math.pow(1+v, 365)-1) * 100);
  }

  function baseMonthly(e) {
    setMonthly( e.target.value );
    const v = e.target.value / 100;
    setDaily( (Math.pow(1+v, 1/30)-1) * 100 );
    setYearly( (Math.pow(1+v, 12)-1) * 100);
  }

  function baseYearly(e) {
    setYearly( e.target.value );
    const v = e.target.value / 100;
    setDaily( (Math.pow(1+v, 1/365)-1) * 100);
    setMonthly( (Math.pow(1+v, 1/12)-1) * 100);
  }

  function baseDailyAmount(e) {
    const v = e.target.value;
    setDailyAmount(v);
    const a = v / daily * 100;
    setAmount(a);
    setMonthlyAmount(a * monthly / 100);
    setYearlyAmount(a * yearly / 100);
  }
  
  function baseMonthlyAmount(e) {
    const v = e.target.value;
    setMonthlyAmount(v);
    const a = v / monthly * 100;
    setAmount(a);
    setDailyAmount(a * daily / 100);
    setYearlyAmount(a * yearly / 100);
  }
  
  function baseYearlyAmount(e) {
    const v = e.target.value;
    setYearlyAmount(v);
    const a = v / yearly * 100;
    setAmount(a);
    setDailyAmount(a * daily / 100);
    setMonthlyAmount(a * monthly / 100);
  }

  function baseAmount(e) {
    const v = e.target.value;
    setAmount(v);
    setDailyAmount(v * daily / 100);
    setMonthlyAmount(v * monthly / 100);
    setYearlyAmount(v * yearly / 100);
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
      <div className="field">
        <label className="label">Daily</label>
        <div className="control">
          <input className="input" type="text"  
            value={daily} onChange={baseDaily} />
        </div>
        <p className="help">Daily interest rate in %.</p>
      </div>
      <div className="field">
        <label className="label">Monthly</label>
        <div className="control">
          <input className="input" type="text"  
          value={monthly} onChange={baseMonthly} />
        </div>
        <p className="help">Monthly interest rate in %.</p>
      </div>
      <div className="field">
        <label className="label">Yearly</label>
        <div className="control">
          <input className="input" type="text"  
          value={yearly} onChange={baseYearly} />
        </div>
        <p className="help">Yearly interest rate in %.</p>
      </div>
      <div className="field">
        <label className="label">Daily Amount</label>
        <div className="control">
          <input className="input" type="text"  value={dailyAmount} onChange={baseDailyAmount} />
        </div>
        <p className="help">Amount earned in a day.</p>
      </div>
      <div className="field">
        <label className="label">Monthly Amount</label>
        <div className="control">
          <input className="input" type="text"  value={monthlyAmount} onChange={baseMonthlyAmount} />
        </div>
        <p className="help">Monthly interest rate in %</p>
      </div>
      <div className="field">
        <label className="label">Yearly Amount</label>
        <div className="control">
          <input className="input" type="text"  value={yearlyAmount} onChange={baseYearlyAmount} />
        </div>
        <p className="help">Yearly interest rate in %</p>
      </div>
    </>
  );
}

export default App;
