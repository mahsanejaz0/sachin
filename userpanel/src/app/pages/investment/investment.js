import React, { useState, useEffect, useContext } from 'react';
import JumboDemoCard from "@jumbo/components/JumboDemoCard";
import Box from "@mui/material/Box";
import { Button, TextField, Grid, IconButton, Alert, Select, MenuItem, InputLabel } from "@mui/material";
import { ContentCopy } from '@mui/icons-material';
import { Form, Formik } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import * as yup from "yup";
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import Div from '@jumbo/shared/Div/Div';
import { depositApi } from 'backendServices/ApiCalls';
import { CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InputAdornment from '@mui/material/InputAdornment';
import { Gr } from 'react-flags-select';
import { CustomProvider } from 'app/layouts/vertical-default/VerticalDefault';


const validationSchema = yup.object({
  amount: yup
    .number('Enter deposit amount')
    .required('amount is required'),
  password: yup
    .string('Enter your password')
    .required('Password is required'),
});
const Investment = () => {
  const { loginUserData, loading, setloginUserData } = useContext(CustomProvider);
  const [alertData, setalertData] = React.useState({
    show: false,
    message: "",
    variant: ""
  })

  const onSubmitForm = (amount, password, setSubmitting, resetForm) => {
    let params = {
      amount,
      password,
    }
    depositApi(params, (response) => {

      if (response?.data?.status === "error") {
        setalertData({
          show: true,
          message: response?.data?.message,
          variant: "error"
        })
        setSubmitting(false)
      } else if (response?.data?.status === "success") {
        // let updated_balance = loginUserData?.current_balance + params.amount
        // setloginUserData((prevState) => ({
        //   ...prevState,
        //   current_balance: updated_balance
        // }));
        setalertData({
          show: true,
          message: response?.data?.message,
          variant: "success"
        })
        setSubmitting(false)
        resetForm();
      }

    }, (error) => {
      console.log(error?.response?.data);
      setSubmitting(false)
    })
  }

  if (loading) {
    return <Div
      sx={{
        display: 'flex',
        minWidth: 0,
        alignItems: 'center',
        alignContent: 'center',
        height: '100%',
      }}
    >
      <CircularProgress sx={{ m: '-40px auto 0' }} />
    </Div>
  }

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center" >
      {
        alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
      }
      <Grid item sm={6} >
        <JumboDemoCard title={"Deposit"}
          wrapperSx={{ backgroundColor: 'background.paper', pt: 0 }}>
          <Formik
            validateOnChange={true}
            initialValues={{
              // current_balance: loginUserData?.current_balance,
              amount: '',
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(data, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              onSubmitForm(data.amount, data.password, setSubmitting, resetForm);
            }}
          >
            {({ isSubmitting }) => (
              <Form style={{ textAlign: 'left', width: '100%' }} noValidate autoComplete='off'>

                {/* <Grid xs={12} sx={{ mt: 2, }}>
                  <JumboTextField
                    fullWidth
                    name="current_balance"
                    label="E-Wallet"
                    type="text"
                    disabled={true}
                  /></Grid> */}
                <Grid xs={12} sx={{ mt: 2, }}>
                  <JumboTextField
                    fullWidth
                    name="amount"
                    label="Enter Amount"
                    type="number"
                  /></Grid>
                <Grid xs={12} sx={{ mt: 3, mb: 2 }}>
                  <JumboTextField
                    fullWidth
                    name="password"
                    label="Enter Password"
                    type="password"
                  /></Grid>

                <LoadingButton
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ mb: 3 }}
                  loading={isSubmitting}
                >Submit</LoadingButton>

              </Form>
            )}
          </Formik>
        </JumboDemoCard>
      </Grid>
    </Grid>
  );
};

export default Investment;








