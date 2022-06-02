import "./App.scss";
import { useRef, useEffect, useState, useMemo } from "react";
import { evaluate } from "mathjs";
import useFetch from "use-http";

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
    setValue(e.target.value);
    const targetValue = calculate(e.target.value, rates);
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
  const { data } = useFetch('https://api.coinbase.com/v2/exchange-rates', {}, []);

  const saved = useMemo(() => JSON.parse(window.localStorage.getItem("data")), []);

  const rates = data?.data?.rates || saved?.rates || {};

  const [yearlyRate, setYearlyRate] = useState(saved?.yearlyRate || 1);

  const dailyRate = Math.pow(yearlyRate, 1/365);
  const setDailyRate = (r) => setYearlyRate(Math.pow(r, 365));

  const monthlyRate = Math.pow(yearlyRate, 1/12);
  const setMonthlyRate = (r) => setYearlyRate(Math.pow(r, 12));

  const yearly5Rate = Math.pow(yearlyRate, 5);
  const setYearly5Rate = (r) => setYearlyRate(Math.pow(r, 1/5));

  const [amount, setAmount] = useState(saved?.amount || 0);

  const totalAmount = calculate(amount, rates);

  useEffect(() => {
    window.localStorage.setItem(
      "data",
      JSON.stringify({ yearlyRate, amount, rates })
    );
  }, [yearlyRate, amount, rates]);

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
                onChange={(e) => setAmount(e.target.value)}
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
                forward={totalAmount*(dailyRate-1)}
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
                forward={totalAmount*(monthlyRate-1)}
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
              <Field
                  forward={factorToPercent(yearlyRate)-100}
                  inverse={(v) => setYearlyRate(percentToFactor(v+100))}
                  rates={rates}
                />
            </div>
            <p className="help">Yearly interest rate in %.</p>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Yearly Amount</label>
            <div className="control">
              <Field
                forward={totalAmount*(yearlyRate-1)}
                inverse={(v) => setAmount(v/(yearlyRate-1))}
                rates={rates}
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
                forward={totalAmount*(yearly5Rate-1)}
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
