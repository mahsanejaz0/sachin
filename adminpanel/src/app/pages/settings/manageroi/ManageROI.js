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
  roi: yup
    .number()
    .required('ROI is required'),
});

const ManageROI = () => {
  const [payoutdata, setPayoutData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertData, setalertData] = React.useState({
    show: false,
    message: "",
    variant: ""
  })

  const fetchpayoutdata = () => {
    const params = {
      keynames: "'roi'"
    };
    getsettingsdata(params, (response) => {
      console.log("response?.data?.data?.values", response?.data?.data?.values)
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
        roi: data.roi
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
        <JumboCardQuick title={"Manage ROI"} noWrapper>
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
                  roi: payoutdata[0].keyvalue,
                }
                }
                validationSchema={validationSchema}
                onSubmit={(data, { setSubmitting }) => {
                  console.log("formikformdata", data)
                  setSubmitting(true);
                  handleSubmit(data, setSubmitting);
                }}
              >
                {({ isSubmitting }) => (
                  <Form style={{ textAlign: 'left' }} noValidate autoComplete='off'>
                    <Div sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <JumboTextField
                        fullWidth
                        name="roi"
                        label="ROI (%)"
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

export default ManageROI;
