import React, { useEffect } from 'react';
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import { Box, Button, CircularProgress, Grid, List, ListItem, MenuItem, TextField } from "@mui/material";
import { useState } from 'react';
import { getcontractsdata, updatecontractsdata } from 'backendServices/ApiCalls';
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
  contract1_name: yup.string().required("Name is required"),
  contract1_amount: yup
    .number()
    .required("Amount is required")
    .test(
      "is-multiple-of-100",
      "Amount must be 100 or a multiple of 100",
      (value) => value % 100 === 0
    ),
  contract1_status: yup.string().required("Status is required"),
  contract2_name: yup.string().required("Name is required"),
  contract2_amount: yup
    .number()
    .required("Amount is required")
    .test(
      "is-multiple-of-100",
      "Amount must be 100 or a multiple of 100",
      (value) => value % 100 === 0
    ),
  contract2_status: yup.string().required("Status is required"),
  contract3_name: yup.string().required("Name is required"),
  contract3_amount: yup
    .number()
    .required("Amount is required")
    .test(
      "is-multiple-of-100",
      "Amount must be 100 or a multiple of 100",
      (value) => value % 100 === 0
    ),
  contract3_status: yup.string().required("Status is required"),
  contract4_name: yup.string().required("Name is required"),
  contract4_amount: yup
    .number()
    .required("Amount is required")
    .test(
      "is-multiple-of-100",
      "Amount must be 100 or a multiple of 100",
      (value) => value % 100 === 0
    ),
  contract4_status: yup.string().required("Status is required"),
  contract5_name: yup.string().required("Name is required"),
  contract5_amount: yup
    .number()
    .required("Amount is required")
    .test(
      "is-multiple-of-100",
      "Amount must be 100 or a multiple of 100",
      (value) => value % 100 === 0
    ),
  contract5_status: yup.string().required("Status is required"),
});


const ManageContracts = () => {
  const [commissiondata, setCommissionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contract1Status, setContract1Status] = useState('On');
  const [contract2Status, setContract2Status] = useState('On');
  const [contract3Status, setContract3Status] = useState('On');
  const [contract4Status, setContract4Status] = useState('On');
  const [contract5Status, setContract5Status] = useState('On');
  const [alertData, setalertData] = React.useState({
    show: false,
    message: "",
    variant: ""
  })

  const fetchcommissiondata = () => {
    const params = {
      keyids: "'1', '2', '3', '4', '5'"
    };
    getcontractsdata(params, (response) => {
      setCommissionData(response?.data?.data?.values);
      setContract1Status(response?.data?.data?.values[0]?.status)
      setContract2Status(response?.data?.data?.values[1]?.status)
      setContract3Status(response?.data?.data?.values[2]?.status)
      setContract4Status(response?.data?.data?.values[3]?.status)
      setContract5Status(response?.data?.data?.values[4]?.status)
      setIsLoading(false);
    });
  };

  const handleContractStatus = (contract, status) => {
    if (contract === 1) {
      setContract1Status(status)
    }
    if (contract === 2) {
      setContract2Status(status)
    }
    if (contract === 3) {
      setContract3Status(status)
    }
    if (contract === 4) {
      setContract4Status(status)
    }
    if (contract === 5) {
      setContract5Status(status)
    }
  }


  useEffect(() => {
    fetchcommissiondata();
  }, []);

  const handleSubmit = (data, setSubmitting) => {
    const newData = {
      obj: {
        1: {
          name: data.contract1_name,
          amount: data.contract1_amount,
          status: contract1Status
        },
        2: {
          name: data.contract2_name,
          amount: data.contract2_amount,
          status: contract2Status
        },
        3: {
          name: data.contract3_name,
          amount: data.contract3_amount,
          status: contract3Status
        },
        4: {
          name: data.contract4_name,
          amount: data.contract4_amount,
          status: contract4Status
        },
        5: {
          name: data.contract5_name,
          amount: data.contract5_amount,
          status: contract5Status
        },
      }
    };
    updatecontractsdata(newData, (response) => {
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
      <Grid item sm={8} xs={12}>
        <JumboCardQuick title={"Manage Contracts"} noWrapper >
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
                  contract1_name: commissiondata[0]?.name,
                  contract1_amount: commissiondata[0]?.amount,
                  contract1_status: commissiondata[0]?.status,
                  contract2_name: commissiondata[1]?.name,
                  contract2_amount: commissiondata[1]?.amount,
                  contract2_status: commissiondata[1]?.status,
                  contract3_name: commissiondata[2]?.name,
                  contract3_amount: commissiondata[2]?.amount,
                  contract3_status: commissiondata[2]?.status,
                  contract4_name: commissiondata[3]?.name,
                  contract4_amount: commissiondata[3]?.amount,
                  contract4_status: commissiondata[3]?.status,
                  contract5_name: commissiondata[4]?.name,
                  contract5_amount: commissiondata[4]?.amount,
                  contract5_status: commissiondata[4]?.status,
                }}
                validationSchema={validationSchema}
                onSubmit={(data, { setSubmitting }) => {
                  setSubmitting(true);
                  handleSubmit(data, setSubmitting);
                }}
              >

                {({ isSubmitting, values, setFieldValue }) => (
                  <Form style={{ textAlign: 'left' }} noValidate autoComplete='off'>

                    <Box sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={5}>
                          <JumboTextField
                            fullWidth
                            name="contract1_name"
                            label="Contract 1 Name"
                            type="text"
                          />
                        </Grid>

                        <Grid item xs={5}>
                          <JumboTextField
                            fullWidth
                            name="contract1_amount"
                            label="Contract 1 Amount"
                            type="number"
                          />
                        </Grid>

                        <Grid item xs={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={contract1Status === 'On'} // Check if referral_commission_status is 'On'
                                onChange={(e) => {
                                  let v = e.target.checked ? 'On' : 'Off'
                                  handleContractStatus(1, v)
                                }
                                } // Set 'On' or 'Off' based on the switch state
                                name="contract1_status"
                                color="primary"
                                value={contract1Status} // Set value as 'On' or 'Off'
                              />
                            }
                            label={contract1Status} // Display 'On' or 'Off' based on the switch state
                          />
                        </Grid>

                      </Grid>
                    </Box>


                    <Box sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={5}>
                          <JumboTextField
                            fullWidth
                            name="contract2_name"
                            label="Contract 2 Name"
                            type="text"
                          />
                        </Grid>

                        <Grid item xs={5}>
                          <JumboTextField
                            fullWidth
                            name="contract2_amount"
                            label="Contract 2 Amount"
                            type="number"
                          />
                        </Grid>

                        <Grid item xs={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={contract2Status === 'On'} // Check if referral_commission_status is 'On'
                                onChange={(e) => {
                                  let v = e.target.checked ? 'On' : 'Off'
                                  handleContractStatus(2, v)
                                }
                                } // Set 'On' or 'Off' based on the switch state
                                name="contract2_status"
                                color="primary"
                                value={contract2Status} // Set value as 'On' or 'Off'
                              />
                            }
                            label={contract2Status} // Display 'On' or 'Off' based on the switch state
                          />
                        </Grid>

                      </Grid>
                    </Box>

                    <Box sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={5}>
                          <JumboTextField
                            fullWidth
                            name="contract3_name"
                            label="Contract 3 Name"
                            type="text"
                          />
                        </Grid>

                        <Grid item xs={5}>
                          <JumboTextField
                            fullWidth
                            name="contract3_amount"
                            label="Contract 3 Amount"
                            type="number"
                          />
                        </Grid>

                        <Grid item xs={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={contract3Status === 'On'} // Check if referral_commission_status is 'On'
                                onChange={(e) => {
                                  let v = e.target.checked ? 'On' : 'Off'
                                  handleContractStatus(3, v)
                                }
                                } // Set 'On' or 'Off' based on the switch state
                                name="contract3_status"
                                color="primary"
                                value={contract3Status} // Set value as 'On' or 'Off'
                              />
                            }
                            label={contract3Status} // Display 'On' or 'Off' based on the switch state
                          />
                        </Grid>

                      </Grid>
                    </Box>

                    <Box sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={5}>
                          <JumboTextField
                            fullWidth
                            name="contract4_name"
                            label="Contract 4 Name"
                            type="text"
                          />
                        </Grid>

                        <Grid item xs={5}>
                          <JumboTextField
                            fullWidth
                            name="contract4_amount"
                            label="Contract 4 Amount"
                            type="number"
                          />
                        </Grid>

                        <Grid item xs={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={contract4Status === 'On'} // Check if referral_commission_status is 'On'
                                onChange={(e) => {
                                  let v = e.target.checked ? 'On' : 'Off'
                                  handleContractStatus(4, v)
                                }
                                } // Set 'On' or 'Off' based on the switch state
                                name="contract4_status"
                                color="primary"
                                value={contract4Status} // Set value as 'On' or 'Off'
                              />
                            }
                            label={contract4Status} // Display 'On' or 'Off' based on the switch state
                          />
                        </Grid>

                      </Grid>
                    </Box>

                    <Box sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={5}>
                          <JumboTextField
                            fullWidth
                            name="contract5_name"
                            label="Contract 5 Name"
                            type="text"
                          />
                        </Grid>

                        <Grid item xs={5}>
                          <JumboTextField
                            fullWidth
                            name="contract5_amount"
                            label="Contract 5 Amount"
                            type="number"
                          />
                        </Grid>

                        <Grid item xs={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={contract5Status === 'On'} // Check if referral_commission_status is 'On'
                                onChange={(e) => {
                                  let v = e.target.checked ? 'On' : 'Off'
                                  handleContractStatus(5, v)
                                }
                                } // Set 'On' or 'Off' based on the switch state
                                name="contract5_status"
                                color="primary"
                                value={contract5Status} // Set value as 'On' or 'Off'
                              />
                            }
                            label={contract5Status} // Display 'On' or 'Off' based on the switch state
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

export default ManageContracts;
