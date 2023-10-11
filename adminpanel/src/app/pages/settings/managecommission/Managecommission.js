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
      keynames: "'unilevel_status','unilevel_bonus_level1', 'unilevel_bonus_level2', 'unilevel_bonus_level3', 'unilevel_bonus_level4', 'unilevel_bonus_level5'"
    };
    getsettingsdata(params, (response) => {
      setCommissionData(response?.data?.data?.values);
      setIsLoading(false);
    });
  };


  useEffect(() => {
    fetchcommissiondata();
  }, []);

  const handleSubmit = (data, setSubmitting) => {
    const newData = {
      obj: {
        unilevel_status: data.unilevel_status,
        unilevel_bonus_level1: data.unilevel_bonus_level1,
        unilevel_bonus_level2: data.unilevel_bonus_level2,
        unilevel_bonus_level3: data.unilevel_bonus_level3,
        unilevel_bonus_level4: data.unilevel_bonus_level4,
        unilevel_bonus_level5: data.unilevel_bonus_level5,
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
                  unilevel_status: commissiondata[0]?.keyvalue || '',
                  unilevel_bonus_level1: commissiondata[1].keyvalue,
                  unilevel_bonus_level2: commissiondata[2].keyvalue,
                  unilevel_bonus_level3: commissiondata[3].keyvalue,
                  unilevel_bonus_level4: commissiondata[4].keyvalue,
                  unilevel_bonus_level5: commissiondata[5].keyvalue
                }}
                validationSchema={validationSchema}
                onSubmit={(data, { setSubmitting }) => {
                  setSubmitting(true);
                  handleSubmit(data, setSubmitting);
                }}
              >

                {({ isSubmitting, values, setFieldValue }) => (
                  <Form style={{ textAlign: 'left' }} noValidate autoComplete='off'>

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

export default Managecommission;
