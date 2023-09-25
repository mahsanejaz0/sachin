import React, { useEffect } from 'react';
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import { Box, CircularProgress, Grid, List } from "@mui/material";
import { useState } from 'react';
import { getsettingsdata, updatesettingdata } from 'backendServices/ApiCalls';
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import * as yup from "yup";
import { Form, Formik } from "formik";
import Div from '@jumbo/shared/Div/Div';
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import { LoadingButton } from '@mui/lab';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
const validationSchema = yup.object({
  zoom_link: yup
    .string()
    .required('Zoom Link is required'),
  zoom_description: yup
    .string()
    .required('Zoom Description is required'),
  zoom_status: yup
    .string()
    .required("Zoom Status required"),
  zoom_date: yup
    .date()
    .typeError('Payout date must be a valid date')
    .required("Zoom Date is required"),
});

const Managezoom = () => {
  const [zoomdata, setZoomData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertData, setalertData] = React.useState({
    show: false,
    message: "",
    variant: ""
  })

  const fetchzoomdata = () => {
    const params = {
      keynames: "'zoom_link', 'zoom_description', 'zoom_status', 'zoom_date'"
    };
    getsettingsdata(params, (response) => {
      console.log("response?.data?.data?.values", response?.data?.data?.values)
      setZoomData(response?.data?.data?.values);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    });
  };


  useEffect(() => {
    fetchzoomdata();
  }, []);

  const handleSubmit = (data, setSubmitting) => {
    const newData = {
      obj: {
        zoom_link: data.zoom_link,
        zoom_description: data.zoom_description,
        zoom_status: data.zoom_status,
        zoom_date: data.zoom_date
      }
    };
    updatesettingdata(newData, (response) => {
      console.log("updatesetting", response);

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
        <JumboCardQuick title={"Manage Zoom"} noWrapper>
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
                  zoom_link: zoomdata[0].keyvalue,
                  zoom_description: zoomdata[1].keyvalue,
                  zoom_status: zoomdata[2].keyvalue,
                  zoom_date: zoomdata[3].keyvalue,
                }
                }
                validationSchema={validationSchema}
                onSubmit={(data, { setSubmitting }) => {
                  console.log("formikformdata", data)
                  setSubmitting(true);
                  handleSubmit(data, setSubmitting);
                }}
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form style={{ textAlign: 'left' }} noValidate autoComplete='off'>
                    <Div sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <JumboTextField
                        fullWidth
                        name="zoom_link"
                        label="Zoom Link"
                        type="text"
                      />
                    </Div>

                    <Div sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <JumboTextField
                        fullWidth
                        name="zoom_description"
                        label="Zoom Description"
                        type="text"
                        multiline
                        rows={4}
                      />
                    </Div>

                    <Box sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography sx={{ pt: 1, pl: 1 }}>
                            Zoom Status
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={values.zoom_status === 'On'} // Check if referral_commission_status is 'On'
                                onChange={(e) =>
                                  setFieldValue('zoom_status', e.target.checked ? 'On' : 'Off')
                                } // Set 'On' or 'Off' based on the switch state
                                name="zoom_status"
                                color="primary"
                                value={values.zoom_status} // Set value as 'On' or 'Off'
                              />
                            }
                            label={values.zoom_status} // Display 'On' or 'Off' based on the switch state
                          />
                        </Grid>
                      </Grid>
                      </Grid>
                    
                      <Grid item xs={6}>
                        <Grid item xs={10}>
                          <JumboTextField
                            fullWidth
                            name="zoom_date"
                            label="Zoom Date"
                            type="date"
                          />
                        </Grid>
                        </Grid>
                        </Grid>
                    </Box>

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

export default Managezoom;
