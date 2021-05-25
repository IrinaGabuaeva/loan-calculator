// import logo from './logo.svg';
import "./App.css";
import styled from "styled-components";
import { useState } from "react";
import calculatorLogo from "./Logo/mortgage-calculator.svg";

function App() {
  return (
    <div>
      <Calculator />
    </div>
  );
}

function Calculator() {
  console.log("Calculator!!!");
  const [userValues, setUserValues] = useState({
    amount: "",
    months: "",
    interest: "",
  });
  console.log("User VALUES", userValues);
  //state for the results of calculations
  const [results, setResults] = useState({
    monthlyPayments: "",
    totalPayment: "",
    totalInterest: "",
    isResult: false,
  });

  const [error, setError] = useState({
    amountError: "",
    monthsError: "",
    interestError: "",
  });

  const [isResultOpen, setIsResultOpen] = useState(false);

  const handleChange = (event) => {
    console.log("Event", event.target.value);
    // if (event.target.name === "years") convert();
    const inputName =
      event.target.name === "years" ? "months" : event.target.name;
    let inputValue =
      event.target.name === "years"
        ? event.target.value * 12
        : event.target.value;
    if (inputValue === 0) inputValue = "";
    const values = {
      ...userValues,
      [inputName]: inputValue,
    };

    console.log("values in handleChange", values);
    setUserValues(values);
    console.log("userValues", userValues);
    const actualError = returnError(values);
    setError(actualError);
  };

  const convert = () => {
    console.log("userValues.months / 12;", userValues.months / 12);
    if (userValues.months) {
      return userValues.months / 12;
    } else return "";
  };

  const returnError = (values) => {
    console.log("values in isValid", values);
    const { amount, interest, months } = values;
    let actualError = {
      amountError: "",
      monthsError: "",
      interestError: "",
    };
    console.log("Actual error", actualError);

    if (amount) {
      // Validade if the values are numbers
      if (isNaN(amount)) {
        console.log("in values must be a valid number");
        actualError.amountError = "All the values must be a valid number";
      }
      // Validade if the values are positive numbers
      if (Number(amount) <= 0) {
        console.log("Number(amount)", Number(amount));
        console.log("in values must be apositive numbers");
        actualError.amountError = "All the values must be a positive number";
      }
      // Validate if the values are in the correct range
      if (Number(amount) < 1000) {
        actualError.amountError = "Minimum loan amount is $1000";
      }
      if (Number(amount) > 1000000) {
        actualError.amountError = "Maximum loan amount is $1'000 000";
      }
    }

    if (months) {
      // Validade if the values are numbers
      if (isNaN(months)) {
        actualError.monthsError = "All the values must be a valid number";
      }
      // Validade if the values are positive numbers
      if (Number(months) <= 0) {
        actualError.monthsError = "All the values must be a positive number";
      }
      // Validate if the values are in the correct range
      if (Number(months) < 12 || Number(months) > 480) {
        actualError.monthsError = "Invalid loan term";
      }
    }

    if (interest) {
      // Validade if the values are numbers
      if (isNaN(interest)) {
        console.log("in values must be a valid number");
        actualError.interestError = "All the values must be a valid number";
      }
      // Validade if the values are positive numbers
      if (Number(interest) <= 0) {
        console.log("Number(interest)", Number(interest));
        console.log("in values must be apositive numbers");
        actualError.interestError = "All the values must be a positive number";
      }
      // Validate if the values are in the correct range
      if (Number(interest) < 0 || Number(interest) > 99) {
        actualError.interestError = "Invalid interest rate";
      }
    }
    // if (actualError) {
    //   console.log("actualError, end", actualError);
    //   setError(actualError);
    //   return false;
    // }
    // setError("");
    // return true;
    return actualError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let count = 0;
    Object.values(error).forEach((err) => {
      if (err.length !== 0) {
        count++;
      }
    });
    if (count === 0) {
      calculateResults(userValues);
      toggle();
    }
  };

  const toggle = () => {
    if (isResultOpen) {
      setIsResultOpen(false);
      clearFields();
    } else {
      setIsResultOpen(true);
    }
  };

  const calculateResults = ({ amount, interest, months }) => {
    console.log("IN calculate results");
    const userAmount = Number(amount);
    const calculatedInterest = Number(interest) / 100 / 12;
    const calculatedPayments = Number(months) * 12;
    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (userAmount * x * calculatedInterest) / (x - 1);

    if (isFinite(monthly)) {
      const monthlyPaymentCalculated = monthly.toFixed(2);
      const totalPaymentCalculated = (monthly * calculatedPayments).toFixed(2);
      const totalInterestCalculated = (
        monthly * calculatedPayments -
        userAmount
      ).toFixed(2);

      // Set up results to the state to be displayed to the user
      setResults({
        monthlyPayment: monthlyPaymentCalculated,
        totalPayment: totalPaymentCalculated,
        totalInterest: totalInterestCalculated,
        isResult: true,
      });
    }
    return;
  };

  // Clear input fields
  const clearFields = () => {
    setUserValues({
      amount: "",
      interest: "",
      months: "",
    });

    setResults({
      monthlyPayment: "",
      totalPayment: "",
      totalInterest: "",
      isResult: false,
    });
  };

  return (
    <ContentBox>
      <TitleBox>
        <Logo src={calculatorLogo} />
        <Title>Loan Calculator</Title>
      </TitleBox>
      <Form onSubmit={handleSubmit}>
        {!isResultOpen && (
          <FormContent>
            <Label>Loan amount</Label>
            <Input
              type="text"
              name="amount"
              autoComplete="off"
              onChange={handleChange}
              value={userValues.amount}
              required={true}
            />
            <Error>{error.amountError}</Error>
            <Label htmlFor="months">Loan term in years</Label>
            <Input
              type="text"
              name="years"
              onChange={handleChange}
              value={convert()}
              required={true}
              autoComplete="off"
            />
            <Error>{error.monthsError}</Error>
            <Text>Or</Text>
            <Label htmlFor="months">Loan term in months</Label>
            <Input
              type="text"
              name="months"
              onChange={handleChange}
              value={userValues.months}
              autoComplete="off"
            />
            <Error>{error.monthsError}</Error>
            <Label htmlFor="interest">Interest rate per year</Label>
            <Input
              type="text"
              name="interest"
              onChange={handleChange}
              value={userValues.interest}
              required={true}
              autoComplete="off"
            />
            <Error>{error.interestError}</Error>
            <Button type="submit">Calculate!</Button>
          </FormContent>
        )}
        {isResultOpen && (
          <FormContent>
            <ResultField>Loan amount: ${userValues.amount}</ResultField>
            <ResultField>Interest: {userValues.interest}%</ResultField>
            <ResultField>Months to repay: {userValues.months}</ResultField>
            <MonthlyPayment>
              {" "}
              Monthly Payment: ${results.monthlyPayment}{" "}
            </MonthlyPayment>

            <Result>Total Payment: ${results.totalPayment}</Result>

            <Result>Total Interest: ${results.totalInterest} </Result>
            <Button onClick={toggle}>Calculate again!</Button>
          </FormContent>
        )}
      </Form>
    </ContentBox>
  );
}

export default App;

/////////// STYLES ///////////

const colorPrimary = "#007f85";
const colorSecondary = "#eadd46";
const colorWhite = "#fdfffc";
const colorDark = "#1c2725";

const textShadow = "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
const boxShadow =
  "rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px";

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Verdana, sans-serif;
  text-transform: uppercase;
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 20px;
`;

const Logo = styled.img`
  width: 25px;
  height: 25px;
  background-color: white;
  margin: 10px;
  padding: 5px;
  box-shadow: ${boxShadow};

  @media (max-width: 900px) {
    width: 20px;
    height: 20px;
  }

  @media (min-width: 1800px) {
    width: 80px;
    height: 80px;
  }
`;

const Title = styled.h1`
  color: ${colorDark};
  text-shadow: ${textShadow};

  @media (max-width: 600px) {
    font-size: 20px;
  }

  @media (min-width: 1800px) {
    font-size: 80px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 450px;
  height: 500px;
  padding: 40px;
  background-color: ${colorPrimary};
  box-shadow: ${boxShadow};

  @media (max-width: 600px) {
    width: 300px;
    height: 400px;
  }

  @media (min-width: 1800px) {
    width: 900px;
    height: 1000px;
    padding: 100px;
  }
`;

const Label = styled.label`
  font-size: 17px;
  font-weight: bold;
  color: ${colorWhite};
  text-transform: uppercase;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;

  @media (min-width: 1800px) {
    font-size: 34px;
  }
`;

const Input = styled.input`
  height: 350px;
  margin-top: 5px;
  padding: 0 0 0 10px;
  background-color: ${colorWhite};
  color: ${colorDark};
  outline: none;
  font-size: 16px;

  @media (min-width: 1800px) {
    font-size: 30px;
    margin-top: 15px;
  }
`;

const Error = styled.h3`
  color: ${colorDark};
  font-size: 13px;

  @media (min-width: 1800px) {
    font-size: 25px;
  }
`;

const Text = styled.div`
  padding: 5px 0 20px 0;
  color: ${colorWhite};
  text-transform: uppercase;

  @media (min-width: 1800px) {
    font-size: 30px;
    padding: 15px 0 60px 0;
  }
`;

const Button = styled.button`
  outline: none;
  background-color: ${colorSecondary};
  color: ${colorDark};
  font-size: 16px;
  padding: 10px;
  margin: 15px 0 15px 0;

  &:active {
    border: 1px solid black;
  }
  &:hover {
    cursor: pointer;
  }

  @media (max-width: 600px) {
    font-size: 12px;
    padding: 7px;
  }
  @media (min-width: 1800px) {
    font-weight: 700;
    font-size: 35px;
    padding: 20px;
  }
`;

const ResultField = styled.h4`
  margin: 8px;
  color: ${colorWhite};

  @media (max-width: 600px) {
    margin: 6px;
  }
  @media (min-width: 1800px) {
    font-size: 40px;
    margin: 20px;
  }
`;

const MonthlyPayment = styled(Label)`
  font-size: 35px;
  margin: 60px;
  text-align: center;
  color: ${colorSecondary};

  @media (max-width: 600px) {
    margin: 35px;
    font-size: 25px;
  }
  @media (min-width: 1800px) {
    margin: 100px;
    font-size: 70px;
  }
`;

const Result = styled(ResultField)`
  text-shadow: ${textShadow};
  margin-bottom: 15px;

  @media (min-width: 1800px) {
    margin-bottom: 50px;
  }
`;
