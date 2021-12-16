import "./App.scss";
import { useRef, useEffect, useState } from "react";
import { evaluate } from "mathjs";

function App() {
  const [daily, setDaily] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [yearly, setYearly] = useState(0);
  const [yearly5, setYearly5] = useState(0);

  const dailyRef = useRef();
  const monthlyRef = useRef();
  const yearly5Ref = useRef();

  const [totalAmount, setTotalAmount] = useState(0);

  const [amount, setAmount] = useState(0);
  const [dailyAmount, setDailyAmount] = useState(0);
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [yearlyAmount, setYearlyAmount] = useState(0);
  const [yearly5Amount, setYearly5Amount] = useState(0);

  const dailyAmountRef = useRef();
  const monthlyAmountRef = useRef();
  const yearlyAmountRef = useRef();
  const yearly5AmountRef = useRef();

  const rates = useRef({});

  function calculate(expr) {
    expr = expr.toString();
    for (var k in rates.current) {
      expr = expr.replaceAll(k, "(1/" + rates.current[k] + ")");
    }

    try {
      return evaluate(expr);
    } catch (e) {
      return NaN;
    }
  }

  function percentToFactor(p) {
    return p / 100;
  }
  function factorToPercent(f) {
    return f * 100;
  }

  useEffect(() => {
    fetch("https://api.coinbase.com/v2/exchange-rates")
      .then((response) => response.json())
      .then((data) => {
        rates.current = data["data"]["rates"];
      });
  }, []);

  useEffect(() => {
    setTotalAmount(calculate(amount));
  }, [amount]);

  useEffect(() => {
    const v = 1 + percentToFactor(calculate(yearly));
    const daily_v = Math.pow(v, 1 / 365) - 1;
    const monthly_v = Math.pow(v, 1 / 12) - 1;
    const yearly5_v = Math.pow(v, 5) - 1;

    if (document.activeElement !== dailyRef.current) {
      setDaily(factorToPercent(daily_v));
    }
    if (document.activeElement !== monthlyRef.current) {
      setMonthly(factorToPercent(monthly_v));
    }
    if (document.activeElement !== yearly5Ref.current) {
      setYearly5(factorToPercent(yearly5_v));
    }

    if (document.activeElement !== dailyAmountRef.current) {
      setDailyAmount(totalAmount * daily_v);
    }
    if (document.activeElement !== monthlyAmountRef.current) {
      setMonthlyAmount(totalAmount * monthly_v);
    }
    if (document.activeElement !== yearlyAmountRef.current) {
      setYearlyAmount(totalAmount * (v - 1));
    }
    if (document.activeElement !== yearly5AmountRef.current) {
      setYearly5Amount(totalAmount * yearly5_v);
    }
  }, [yearly, totalAmount]);

  function baseDaily(e) {
    setDaily(e.target.value);
    const v = 1 + percentToFactor(calculate(e.target.value));
    setYearly(factorToPercent(Math.pow(v, 365) - 1));
  }

  function baseMonthly(e) {
    setMonthly(e.target.value);
    const v = 1 + percentToFactor(calculate(e.target.value));
    setYearly(factorToPercent(Math.pow(v, 12) - 1));
  }

  function baseYearly(e) {
    setYearly(e.target.value);
  }

  function baseYearly5(e) {
    setYearly5(e.target.value);
    const v = 1 + percentToFactor(calculate(e.target.value));
    setYearly(factorToPercent(Math.pow(v, 1 / 5) - 1));
  }

  function baseDailyAmount(e) {
    setDailyAmount(e.target.value);
    const v = calculate(e.target.value);
    setAmount(v / percentToFactor(daily));
  }

  function baseMonthlyAmount(e) {
    setMonthlyAmount(e.target.value);
    const v = calculate(e.target.value);
    setAmount(v / percentToFactor(monthly));
  }

  function baseYearlyAmount(e) {
    setYearlyAmount(e.target.value);
    const v = calculate(e.target.value);
    setAmount(v / percentToFactor(yearly));
  }

  function baseYearly5Amount(e) {
    setYearly5Amount(e.target.value);
    const v = calculate(e.target.value);
    setAmount(v / percentToFactor(yearly5));
  }

  function baseAmount(e) {
    setAmount(e.target.value);
  }

  return (
    <>
      <div className="field">
        <label className="label">Amount</label>
        <div className="columns is-mobile">
          <div className="column">
            <div className="control">
              <input
                className="input"
                type="text"
                value={amount}
                onChange={baseAmount}
              />
            </div>
            <p className="help">Amount to multiply by the interest.</p>
          </div>
          <div className="column">
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={totalAmount}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="columns is-mobile">
        <div className="column">
          <div className="field">
            <label className="label">Daily</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={daily}
                ref={dailyRef}
                onChange={baseDaily}
              />
            </div>
            <p className="help">Daily interest rate in %.</p>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Daily Amount</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={dailyAmount}
                ref={dailyAmountRef}
                onChange={baseDailyAmount}
              />
            </div>
            <p className="help">Amount earned in a day.</p>
          </div>
        </div>
      </div>
      <div className="columns is-mobile">
        <div className="column">
          <div className="field">
            <label className="label">Monthly</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={monthly}
                ref={monthlyRef}
                onChange={baseMonthly}
              />
            </div>
            <p className="help">Monthly interest rate in %.</p>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Monthly Amount</label>
            <div className="control">
              <input
                className="input"
                type="text"
                ref={monthlyAmountRef}
                value={monthlyAmount}
                onChange={baseMonthlyAmount}
              />
            </div>
            <p className="help">Amount earned in a month.</p>
          </div>
        </div>
      </div>
      <div className="columns is-mobile">
        <div className="column">
          <div className="field">
            <label className="label">Yearly</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={yearly}
                onChange={baseYearly}
              />
            </div>
            <p className="help">Yearly interest rate in %.</p>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Yearly Amount</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={yearlyAmount}
                ref={yearlyAmountRef}
                onChange={baseYearlyAmount}
              />
            </div>
            <p className="help">Amount earned in a year.</p>
          </div>
        </div>
      </div>
      <div className="columns is-mobile">
        <div className="column">
          <div className="field">
            <label className="label">5 years</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={yearly5}
                ref={yearly5Ref}
                onChange={baseYearly5}
              />
            </div>
            <p className="help">Yearly interest rate in 5 years in %.</p>
          </div>
        </div>

        <div className="column">
          <div className="field">
            <label className="label">5 year Amount</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={yearly5Amount}
                ref={yearly5AmountRef}
                onChange={baseYearly5Amount}
              />
            </div>
            <p className="help">Amount earned in 5 years.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
