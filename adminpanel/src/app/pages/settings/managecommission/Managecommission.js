import React, { useEffect } from 'react';
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import { Box, Button, CircularProgress, Grid, List, ListItem, MenuItem, TextField } from "@mui/material";
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
  referral_commission_type: yup
    .string()
    .required('Referral Commission is required'),
  referral_commission_value: yup
    .number()
    .required('Referral Commission Percentage is required'),

  referral_commission_status: yup
    .string()
    .typeError('Payout date must be a valid date')
    .required("Referral Commission Status is required"),
  unilevel_status: yup
    .string()
    .required("Unilevel Status is required"),
    unilevel_bonus_level1: yup
    .string()
    .required('Unilevel Bonus Level1 is required'),
  unilevel_bonus_level2: yup
    .string()
    .required('Unilevel Bonus Level2 is required'),
  unilevel_bonus_level3: yup
    .string()
    .required("Unilevel Bonus Level3 is required"),
  unilevel_bonus_level4: yup
    .string()
    .required("Unilevel Bonus Level4 is required"),
  unilevel_bonus_level5: yup
    .string()
    .required("Unilevel Bonus Leve5 is required"),
  // unilevel_bonus_level6: yup
  //   .string()
  //   .required("Unilevel Bonus Leve6 is required"),
  // unilevel_bonus_level7: yup
  //   .string()
  //   .required("Unilevel Bonus Leve7 is required"),
  // unilevel_bonus_level8: yup
  //   .string()
  //   .required("Unilevel Bonus Leve8 is required"),
  // unilevel_bonus_level9: yup
  //   .string()
  //   .required("Unilevel Bonus Leve9 is required"),
  // unilevel_bonus_level10: yup
  //   .string()
  //   .required("Unilevel Bonus Leve10 is required"),
});

const Managecommission = () => {
  const [commissiondata, setCommissionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertData, setalertData] = React.useState({
    show: false,
    message: "",
    variant: ""
  })

  const fetchcommissiondata = () => {
    const params = {
      keynames: "'referral_commission_type', 'referral_commission_value', 'referral_commission_status', 'unilevel_status','unilevel_bonus_level1', 'unilevel_bonus_level2', 'unilevel_bonus_level3', 'unilevel_bonus_level4', 'unilevel_bonus_level5'"
    };
    getsettingsdata(params, (response) => {
      console.log("response?.data?.data?.values", response?.data?.data?.values)
      setCommissionData(response?.data?.data?.values);
      setIsLoading(false);
    });
  };


  useEffect(() => {
    fetchcommissiondata();
  }, []);

  const handleSubmit = (data, setSubmitting) => {
    console.log(data)
    const newData = {
      obj: {
        referral_commission_type: data.referral_commission_type,
        referral_commission_value: data.referral_commission_value,
        referral_commission_status: data.referral_commission_status,
        unilevel_status: data.unilevel_status,
        unilevel_bonus_level1: data.unilevel_bonus_level1,
        unilevel_bonus_level2: data.unilevel_bonus_level2,
        unilevel_bonus_level3: data.unilevel_bonus_level4,
        unilevel_bonus_level5: data.unilevel_bonus_level5,
        // unilevel_bonus_level6: data.unilevel_bonus_level6,
        // unilevel_bonus_level7: data.unilevel_bonus_level7,
        // unilevel_bonus_level8: data.unilevel_bonus_level8,
        // unilevel_bonus_level9: data.unilevel_bonus_level9,
        // unilevel_bonus_level10: data.unilevel_bonus_level10,
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
        <JumboCardQuick title={"Manage Commission"} noWrapper >
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
                initialValues={{
                  referral_commission_type: commissiondata[0]?.keyvalue || '',
                  referral_commission_value: commissiondata[1]?.keyvalue || '',
                  referral_commission_status: commissiondata[2]?.keyvalue || '',
                  unilevel_status: commissiondata[3]?.keyvalue || '',
                  unilevel_bonus_level1: commissiondata[4].keyvalue,
                  unilevel_bonus_level2: commissiondata[5].keyvalue,
                  unilevel_bonus_level3: commissiondata[6].keyvalue,
                  unilevel_bonus_level4: commissiondata[7].keyvalue,
                  unilevel_bonus_level5: commissiondata[8].keyvalue
                  // unilevel_bonus_level6: commissiondata[9].keyvalue,
                  // unilevel_bonus_level7: commissiondata[10].keyvalue,
                  // unilevel_bonus_level8: commissiondata[11].keyvalue ,
                  // unilevel_bonus_level9: commissiondata[12].keyvalue,
                  // unilevel_bonus_level10: commissiondata[13].keyvalue,
                }}
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
                        name="referral_commission_type"
                        label="Referral Commission Type"
                        select
                      >
                        <MenuItem value="Percentage">Percentage</MenuItem>
                        <MenuItem value="Flat">Flat</MenuItem>
                      </JumboTextField>
                    </Div>


                    <Box sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <JumboTextField
                            fullWidth
                            name="referral_commission_value"
                            label="Referral Commission Amount"
                            type="text"
                          />
                        </Grid>

                      </Grid>
                    </Box>

                    <Div sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography sx={{ pt: 1, pl: 1 }}>
                            Referral Commission Status
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={values.referral_commission_status === 'On'} // Check if referral_commission_status is 'On'
                                onChange={(e) =>
                                  setFieldValue('referral_commission_status', e.target.checked ? 'On' : 'Off')
                                } // Set 'On' or 'Off' based on the switch state
                                name="referral_commission_status"
                                color="primary"
                                value={values.referral_commission_status} // Set value as 'On' or 'Off'
                              />
                            }
                            label={values.referral_commission_status} // Display 'On' or 'Off' based on the switch state
                          />
                        </Grid>
                      </Grid>
                    </Div>

                    <Div sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography sx={{ pt: 1, pl: 1 }}>
                            Unilevel Status
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={values.unilevel_status === 'On'} // Check if referral_commission_status is 'On'
                                onChange={(e) =>
                                  setFieldValue('unilevel_status', e.target.checked ? 'On' : 'Off')
                                } // Set 'On' or 'Off' based on the switch state
                                name="unilevel_status"
                                color="primary"
                                value={values.unilevel_status} // Set value as 'On' or 'Off'
                              />
                            }
                            label={values.unilevel_status} // Display 'On' or 'Off' based on the switch state
                          />
                        </Grid>
                      </Grid>
                    </Div>
                    <Box sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level1"
                            label="Unilevel Bonus Level1 (%)"
                            type="text"
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level2"
                            label="Unilevel Bonus Level2 (%)"
                            type="text"
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level3"
                            label="Unilevel Bonus Level3 (%)"
                            type="text"
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level4"
                            label="Unilevel Bonus Level4 (%)"
                            type="text"
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Box sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level5"
                            label="Unilevel Bonus Level5 (%)"
                            type="text"
                          />
                        </Grid>

                        {/* <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level6"
                            label="Unilevel Bonus Level6 (%)"
                            type="text"
                          />
                        </Grid> */}
                      </Grid>
                    </Box>
{/* 
                    <Box sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level7"
                            label="Unilevel Bonus Level7 (%)"
                            type="text"
                          />
                        </Grid>


                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level8"
                            label="Unilevel Bonus Level8 (%)"
                            type="text"
                          />
                        </Grid>
                      </Grid>
                    </Box>


                    <Box sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level9"
                            label="Unilevel Bonus Level9 (%)"
                            type="text"
                          />
                        </Grid>


                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="unilevel_bonus_level10"
                            label="Unilevel Bonus Level10 (%)"
                            type="text"
                          />
                        </Grid>
                      </Grid>
                    </Box> */}

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

export default Managecommission;
