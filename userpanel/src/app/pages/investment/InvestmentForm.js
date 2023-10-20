import React, { useState, useEffect } from 'react'
import JumboDemoCard from "@jumbo/components/JumboDemoCard";
import { Alert, CircularProgress, Grid } from "@mui/material";
import { Form, Formik } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import { getsettingsdata } from "backendServices/ApiCalls";
import Div from '@jumbo/shared/Div';


const InvestmentForm = ({ onSubmitForm, alertData, setalertData, validationSchema }) => {

  const [fee, setFee] = useState(0)
  const [loader, setLoader] = useState(false)

  const fetchcommissiondata = () => {
    setLoader(true)
    const params = {
      keynames: "'deposit_fee'"
    };
    getsettingsdata(params, (response) => {
      setFee(response?.data?.data?.values[0]?.keyvalue);
      setLoader(false)
    });
  };

  useEffect(() => {
    fetchcommissiondata()
  }, [])

  if (loader) {
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

          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item sm={12} lg={12} md={12}>
              <Alert sx={{ color: 'red', fontWeight: 'bold', textAlign: 'center', justifyContent: 'center' }} variant='outlined' icon={false}>{fee + "% fee will be charged on deposit."}</Alert>
            </Grid>


            <Grid item sm={12} lg={12} md={12}>
              <Formik
                validateOnChange={true}
                initialValues={{
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
            </Grid>
          </Grid>

        </JumboDemoCard>
      </Grid>
    </Grid>
  )
}

export default InvestmentForm