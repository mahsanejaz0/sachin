import React, { useState, useContext } from "react";
import * as yup from "yup";
import Div from "@jumbo/shared/Div/Div";
import { depositApi } from "backendServices/ApiCalls";
import { CircularProgress } from "@mui/material";
import { CustomProvider } from "app/layouts/vertical-default/VerticalDefault";
import InvestmentForm from "./InvestmentForm";
import PaymentBox from "./PaymentBox";

const validationSchema = yup.object({
  amount: yup.number("Enter deposit amount").required("amount is required"),
  password: yup.string("Enter your password").required("Password is required"),
});
const Investment = () => {
  const { loading } = useContext(CustomProvider);
  const [alertData, setalertData] = React.useState({
    show: false,
    message: "",
    variant: "",
  });
  const [showPaymentBox, setShowPaymentBox] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const onSubmitForm = (amount, password, setSubmitting, resetForm) => {
    let params = {
      amount,
      password,
    };
    depositApi(
      params,
      (response) => {
        if (response?.data?.status === "error") {
          setalertData({
            show: true,
            message: response?.data?.message,
            variant: "error",
          });
          setSubmitting(false);
        } else if (response?.data?.status === "success") {
          setPaymentData(response?.data?.data);
          setShowPaymentBox(true);
          // let updated_balance = loginUserData?.current_balance + params.amount
          // setloginUserData((prevState) => ({
          //   ...prevState,
          //   current_balance: updated_balance
          // }));
          // setalertData({
          //   show: true,
          //   message: response?.data?.message,
          //   variant: "success",
          // });
          setSubmitting(false);
          resetForm();
        }
      },
      (error) => {
        console.log(error?.response?.data);
        setSubmitting(false);
      }
    );
  };

  if (loading) {
    return (
      <Div
        sx={{
          display: "flex",
          minWidth: 0,
          alignItems: "center",
          alignContent: "center",
          height: "100%",
        }}
      >
        <CircularProgress sx={{ m: "-40px auto 0" }} />
      </Div>
    );
  }

  return !showPaymentBox ? (
    <InvestmentForm
      onSubmitForm={onSubmitForm}
      alertData={alertData}
      setalertData={setalertData}
      validationSchema={validationSchema}
    />
  ) : (
    <PaymentBox
      paymentData={paymentData}
      alertData={alertData}
      setalertData={setalertData}
      setShowPaymentBox={setShowPaymentBox}
    />
  );
};

export default Investment;
