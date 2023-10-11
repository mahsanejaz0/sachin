import React, { useEffect } from 'react';
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import { CircularProgress, Grid, List } from "@mui/material";
import { useState } from 'react';
import { getsettingsdata, updatesettingdata } from 'backendServices/ApiCalls';
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import * as yup from "yup";
import { Form, Formik } from "formik";
import Div from '@jumbo/shared/Div/Div';
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import { LoadingButton } from '@mui/lab';

const validationSchema = yup.object({
  fee: yup
    .number()
    .required('Deposit fee is required'),
});

const ManageDepositFee = () => {
  const [payoutdata, setPayoutData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertData, setalertData] = React.useState({
    show: false,
    message: "",
    variant: ""
  })

  const fetchpayoutdata = () => {
    const params = {
      keynames: "'deposit_fee'"
    };
    getsettingsdata(params, (response) => {
      setPayoutData(response?.data?.data?.values);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    });
  };


  useEffect(() => {
    fetchpayoutdata();
  }, []);

  const handleSubmit = (data, setSubmitting) => {
    const newData = {
      obj: {
        deposit_fee: data.fee
      }
    };
    updatesettingdata(newData, (response) => {

      if (response?.data?.status === "error") {
        setalertData({
          show: true,
          message: response?.data?.message,
          variant: "error"
        })
        setSubmitting(false)

      } else if (response?.data?.status === "success") {
        setalertData({
          show: true,
          message: response?.data?.message,
          variant: "success"
        })
        setSubmitting(false);
      }
    }, (error) => {
      console.log(error?.response?.data);
    })
  };

  return (
    <Grid container fullWidth sm={12} xs={12} p={2} alignItems="center" justifyContent="center">
      <Grid item sm={6} xs={12}>
        <JumboCardQuick title={"Manage Deposit Fee"} noWrapper>
          {
            alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
          }
          {isLoading ? (
            <Div
              sx={{
                mt: "20%",
                ml: "45%",
                mb: "20%"
              }}
            >
              <CircularProgress />
            </Div>
          ) : (
            <List disablePadding sx={{ mb: 2 }}>
              <Formik
                validateOnChange={true}
                initialValues={{
                  fee: payoutdata[0].keyvalue,
                }
                }
                validationSchema={validationSchema}
                onSubmit={(data, { setSubmitting }) => {
                  setSubmitting(true);
                  handleSubmit(data, setSubmitting);
                }}
              >
                {({ isSubmitting }) => (
                  <Form style={{ textAlign: 'left' }} noValidate autoComplete='off'>
                    <Div sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <JumboTextField
                        fullWidth
                        name="fee"
                        label="Deposit Fee (%)"
                        type="number"
                      />
                    </Div>

                    <Div sx={{ mt: 1, pl: 2, pr: 2 }}>
                      <LoadingButton
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{ mb: 3 }}
                        loading={isSubmitting}
                      >
                        Submit
                      </LoadingButton>
                    </Div>
                  </Form>
                )}
              </Formik>
            </List>
          )}
        </JumboCardQuick>
      </Grid>
    </Grid>
  );

};

export default ManageDepositFee;
