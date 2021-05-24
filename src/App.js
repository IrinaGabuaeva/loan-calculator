// import logo from './logo.svg';
import "./App.css";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

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
    years: "",
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
    yearsError: "",
    interestError: "",
    isEmptyError: "",
  });

  const [isResultOpen, setIsResultOpen] = useState(false);

  const handleChange = (event) => {
    console.log("Event", event.target.value);
    const values = {
      ...userValues,
      [event.target.name]: event.target.value,
    };
    setUserValues(values);
    console.log("userValues", userValues);
    const actualError = returnError(values);
    setError(actualError);
  };

  const returnError = (values) => {
    console.log("values in isValid", values);
    const { amount, interest, years } = values;
    let actualError = {
      amountError: "",
      yearsError: "",
      interestError: "",
      isEmptyError: "",
    };
    console.log("Actual error", actualError);
    // Validate if there are values
    // if (!amount || !interest || !years) {
    //   actualError.isEmptyError = "All the values are required";
    // }
    // if "amount" field is being modified
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
      if (Number(amount) < 1000 || Number(amount) > 1000000) {
        console.log("Number(amount)", Number(amount));
        console.log("in invalid loan amount ");
        actualError.amountError = "Minimum loan amount is $1000";
      }
    }

    if (years) {
      // Validade if the values are numbers
      if (isNaN(years)) {
        actualError.yearsError = "All the values must be a valid number";
      }
      // Validade if the values are positive numbers
      if (Number(years) <= 0) {
        actualError.yearsError = "All the values must be a positive number";
      }
      // Validate if the values are in the correct range
      if (Number(years) < 0 || Number(years) > 40) {
        actualError.yearsError = "The number must be between 1 and 40";
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

  const calculateResults = ({ amount, interest, years }) => {
    console.log("IN calculate results");
    const userAmount = Number(amount);
    const calculatedInterest = Number(interest) / 100 / 12;
    const calculatedPayments = Number(years) * 12;
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
      years: "",
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
      <Form onSubmit={handleSubmit}>
        {!isResultOpen && (
          <FormContainer>
            <Label htmlFor="amount">Loan amount</Label>
            <Input
              type="text"
              name="amount"
              onChange={handleChange}
              value={userValues.amount}
              required={true}
            />
            <Error>{error.amountError}</Error>
            <Label htmlFor="years">Loan term in years</Label>
            <Input
              type="text"
              name="years"
              onChange={handleChange}
              value={userValues.years}
              required={true}
            />
            <Error>{error.yearsError}</Error>
            <Label htmlFor="interest">Interest rate per year</Label>
            <Input
              type="text"
              name="interest"
              onChange={handleChange}
              value={userValues.interest}
              required={true}
            />
            <Error>{error.interestError}</Error>
            <Button type="submit">Calculate!</Button>
          </FormContainer>
        )}
        {isResultOpen && (
          <FormContainer>
            <ResultField>
              Loan amount: ${userValues.amount} <br /> Interest:{" "}
              {userValues.interest}% <br /> Years to repay: {userValues.years}
            </ResultField>
            <ResultField>
              {" "}
              Monthly Payment: ${results.monthlyPayment}{" "}
            </ResultField>

            <ResultField>Total Payment: ${results.totalPayment}</ResultField>

            <ResultField>Total Interest: ${results.totalInterest} </ResultField>
            <Button onClick={toggle}>Calculate again!</Button>
          </FormContainer>
        )}
      </Form>
      <Error>{error.isEmptyError}</Error>
    </ContentBox>
  );
}

export default App;

const ContentBox = styled.div`
  display: flex;
  background-color: white;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // border-bottom: 2px ridge black;
  padding: 50px 0 50px 0;

  //   @media (max-width: 900px) {
  //     padding: 30px 0 50px 0;
  //   }
  //   @media (min-width: 1800px) {
  //     padding: 80px 0 80px 0;
  //   }
  //
`;
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  border: 3px solid #2c3531;
  margin: 20px;
  padding: 10px;
  background-color: #116466;

  // @media (max-width: 600px) {
  //   width: 450px;
  // }
  // @media (max-width: 450px) {
  //   width: 320px;
  // }
  // @media (min-width: 1800px) {
  //   width: 1200px;
  // }
`;
const Label = styled.label`
  padding: 10px;
`;
const Form = styled.form`
  display: flex;
  flex-direction: row;
  overflow: hidden;
`;
const Input = styled.input`
  height: 50px;
  margin: 8px 8px 0 8px;
  padding: 0 0 0 10px;
  background-color: #d1e8e2;
  border: 1px solid #2e1114;
  outline: none;

  color: #2c3531;
  font-size: 1rem;

  &::placeholder {
    color: black;
    font-family: "Raleway", sans-serif;
    letter-spacing: 0.8px;
  }
  @media (min-width: 1800px) {
    height: 100px;
    font-size: 1.4rem;
    margin: 16px 16px 0 16px;
  }
`;
const Button = styled.button`
  width: 150px;
  outline: none;
  font-weight: 700;
  background-color: #d9b08c;
  color: #2c3531;

  letter-spacing: 0.1rem;
  font-size: 1.2rem;

  margin: 10px;
  &:active {
    border: 1px solid black;
  }
  &:hover {
    cursor: pointer;
  }

  @media (max-width: 900px) {
    width: 100px;
    font-weight: 400;
    letter-spacing: 0;
    font-size: 0.9rem;
  }
  @media (max-width: 600px) {
    width: 70px;
    margin-right: 5px;
    font-size: 0.8rem;
    line-height: 12px;
    padding: 7px;
  }
  @media (min-width: 1800px) {
    width: 200px;
    height: 60px;
    letter-spacing: 0.2rem;
    font-size: 1.5rem;
  }
`;

const ResultField = styled.h4`
  margin: 10px;
`;

const Error = styled.h3`
  color: red;
`;
