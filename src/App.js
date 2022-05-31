import "./App.scss";
import { useRef, useEffect, useState } from "react";
import { evaluate } from "mathjs";

function calculate(expr, rates) {
  expr = expr.toString();
  for (var k in rates) {
    expr = expr.replaceAll(k, "(1/" + rates[k] + ")");
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

const Field = (props) => {
  const { rates, forward, inverse } = props;
  const ref = useRef(null);

  const [value, setValue] = useState(forward);

  const onChange = (e) => {
    const targetValue = calculate(e.target.value, rates);
    setValue(targetValue);
    inverse(targetValue);
  };

  const inputValue = document.activeElement === ref.current ? value : forward;

  return <input
    className="input"
    type="text"
    value={inputValue}
    onChange={onChange}
    ref={ref}
  />
};

function App() {
  const [daily, setDaily] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [yearly, setYearly] = useState(0);
  const [yearly5, setYearly5] = useState(0);
  const [rates, setRates] = useState({});

  const yearlyRate = 1+percentToFactor(yearly);
  const setYearlyRate = (r) => setYearly(factorToPercent(r-1));

  const dailyRate = Math.pow(yearlyRate, 1/365);
  const setDailyRate = (r) => setYearlyRate(Math.pow(r, 365));

  const monthlyRate = Math.pow(yearlyRate, 1/12);
  const setMonthlyRate = (r) => setYearlyRate(Math.pow(r, 12));

  const yearly5Rate = Math.pow(yearlyRate, 5);
  const setYearly5Rate = (r) => setYearlyRate(Math.pow(r, 1/5));

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

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("data"));
      if (saved) {
        setYearly(saved.yearly);
        setAmount(saved.amount);
        setRates(saved.rates);
      }
    } catch (e) {
      console.error(e);
    }
    fetch("https://api.coinbase.com/v2/exchange-rates")
      .then((response) => response.json())
      .then((data) => {
        setRates(data["data"]["rates"]);
      });
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "data",
      JSON.stringify({ yearly, amount, rates })
    );
  }, [yearly, amount, rates]);

  useEffect(() => {
    setTotalAmount(calculate(amount, rates));
  }, [amount, rates]);

  useEffect(() => {
    const v = 1 + percentToFactor(calculate(yearly, rates));
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
  }, [yearly, totalAmount, rates]);

  function baseDaily(e) {
    setDaily(e.target.value);
    const v = 1 + percentToFactor(calculate(e.target.value, rates));
    setYearly(factorToPercent(Math.pow(v, 365) - 1));
  }

  function baseMonthly(e) {
    setMonthly(e.target.value);
    const v = 1 + percentToFactor(calculate(e.target.value, rates));
    setYearly(factorToPercent(Math.pow(v, 12) - 1));
  }

  function baseYearly(e) {
    setYearly(e.target.value);
  }

  function baseYearly5(e) {
    setYearly5(e.target.value);
    const v = 1 + percentToFactor(calculate(e.target.value, rates));
    setYearly(factorToPercent(Math.pow(v, 1 / 5) - 1));
  }

  function baseDailyAmount(e) {
    setDailyAmount(e.target.value);
    const v = calculate(e.target.value, rates);
    setAmount(v / percentToFactor(daily));
  }

  function baseMonthlyAmount(e) {
    setMonthlyAmount(e.target.value);
    const v = calculate(e.target.value, rates);
    setAmount(v / percentToFactor(monthly));
  }

  function baseYearlyAmount(e) {
    setYearlyAmount(e.target.value);
    const v = calculate(e.target.value, rates);
    setAmount(v / percentToFactor(yearly));
  }

  function baseYearly5Amount(e) {
    setYearly5Amount(e.target.value);
    const v = calculate(e.target.value, rates);
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
              <Field
                forward={factorToPercent(dailyRate)-100}
                inverse={(v) => setDailyRate(percentToFactor(v+100))}
                rates={rates}
              />
            </div>
            <p className="help">Daily interest rate in %.</p>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Daily Amount</label>
            <div className="control">
              <Field
                forward={amount*(dailyRate-1)}
                inverse={(v) => setAmount(v/(dailyRate-1))}
                rates={rates}
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
              <Field
                forward={factorToPercent(monthlyRate)-100}
                inverse={(v) => setMonthlyRate(percentToFactor(v+100))}
                rates={rates}
              />
            </div>
            <p className="help">Monthly interest rate in %.</p>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Monthly Amount</label>
            <div className="control">
              <Field
                forward={amount*(monthlyRate-1)}
                inverse={(v) => setAmount(v/(monthlyRate-1))}
                rates={rates}
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
            <Field
                forward={factorToPercent(yearly5Rate)-100}
                inverse={(v) => setYearly5Rate(percentToFactor(v+100))}
                rates={rates}
              />

            </div>
            <p className="help">Yearly interest rate in 5 years in %.</p>
          </div>
        </div>

        <div className="column">
          <div className="field">
            <label className="label">5 year Amount</label>
            <div className="control">
              <Field
                forward={amount*(yearly5Rate-1)}
                inverse={(v) => setAmount(v/(yearly5Rate-1))}
                rates={rates}
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
