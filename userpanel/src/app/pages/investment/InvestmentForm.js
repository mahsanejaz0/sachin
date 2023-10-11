import React from 'react'
import JumboDemoCard from "@jumbo/components/JumboDemoCard";
import {  Grid } from "@mui/material";
import { Form, Formik } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';

const InvestmentForm = ({onSubmitForm,alertData,setalertData,validationSchema}) => {

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
  )
}

export default InvestmentForm