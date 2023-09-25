import React, { useEffect } from 'react';
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import { Box, CircularProgress, Grid, List, MenuItem } from "@mui/material";
import { useState } from 'react';
import { UpdateCurrentBalance, getuserslist } from 'backendServices/ApiCalls';
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import * as yup from "yup";
import { Form, Formik } from "formik";
import Div from '@jumbo/shared/Div/Div';
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import { LoadingButton } from '@mui/lab';



const validationSchema = yup.object({
  userid: yup
    .string()
    .required('User Name is required'),
  type: yup
    .string()
    .required('Balance Type is required'),
  amount: yup
    .number()
    .required("Amount is required"),
});

const Updateuserbalance = () => {
  const [userlist, setUserList] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [alertData, setalertData] = React.useState({
    show: false,
    message: "",
    variant: ""
  })

  const userslist = () => {
    getuserslist(response => {
      setUserList(response?.data?.userdata);
      setIsLoading(false);
    })
  }

  useEffect(() => {
    userslist();
  }, []);

  const handleSubmit = (data, setSubmitting) => {
    UpdateCurrentBalance(data, (response) => {

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
        <JumboCardQuick title={"Update User Balance"} noWrapper >
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
                  userid: '',
                  type: '',
                  amount: '',
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
                    <Div sx={{ mt: 1, pl: 2, pr: 2 }}>
                      <JumboTextField
                        fullWidth
                        name="userid"
                        label="User Name"
                        select
                      >
                       {userlist ? (
  userlist.map((value) => (
    <MenuItem value={value.id}>{value.username} ({value.firstname} {value.lastname})</MenuItem>
  ))
) : (
  <MenuItem value={''}>Loading...</MenuItem>
)}

                      </JumboTextField>
                    </Div>
                    {/* <Div sx={{  mb: 3, pl: 2, pr: 2 }}>
                      {userlist.map(value =>(
                        <>
                        {console.log("value", value)}
                          <p>Current Balance of Ahsan is 100 </p>
                          </>
                        ))}
                    </Div> */}

                    <Box sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <JumboTextField
                        fullWidth
                        name="type"
                        label="Balance Type"
                        select
                      >
                        <MenuItem value="Add">Add</MenuItem>
                        <MenuItem value="Deduct">Deduct</MenuItem>
                      </JumboTextField>
                    </Box>
                    <Div sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <JumboTextField
                        fullWidth
                        name="amount"
                        label="Total Amount"
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

export default Updateuserbalance;
