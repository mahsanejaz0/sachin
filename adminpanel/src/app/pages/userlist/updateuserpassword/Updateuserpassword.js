import React from 'react';
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import { Button, Grid, List, MenuItem} from "@mui/material";
import { useState } from 'react';
import { GetUsersListApi, UpdateUserPasswordApi } from 'backendServices/ApiCalls';
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import * as yup from "yup";
import { Form, Formik } from "formik";
import Div from '@jumbo/shared/Div/Div';
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import { LoadingButton } from '@mui/lab';
import { useEffect } from 'react';


const validationSchema = yup.object({
  user_name: yup
         .string()
         .required('User name is Required'),
  password: yup
        .string()
        .required('Old transaction password is required'),
  confirm_password: yup
        .string()
        .required('New transaction password is required')
        .min(4, 'Password must be at least 8 characters long'),
  admin_transaction_password: yup
        .string()
        .required('Admin transaction password is required')
        .min(4, 'Password must be at least 8 characters long'),
});


const Updateuserpassword = () => {
    const [userdata, setUserData] =useState([]);
    const [alertData, setalertData] = useState({
        show: false,
        message: "",
        variant: ""
    })
    const style = {
        "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
                borderColor: "#fff"
            }
        }
    }
    const usernamelist = () => {
      GetUsersListApi(response =>{
        console.log("response22", response)
        //  userdata.filter(data =>(
        //   console.log("data", data.username)
        //  ))
        setUserData(response?.data?.userdata)
      })
    }
    // let data = userdata?.filter(data => data.username);
    // console.log("44444444444",data)
    useEffect(() => {
      usernamelist();
    }, [])
    const handleSubmit = (data, setSubmitting, resetForm) => {
        let params = {
            userid: data.user_name,
            password: data.password,
            confirmpassword: data.confirm_password,
            admintransactionpassword: data.admin_transaction_password
        }

        UpdateUserPasswordApi(params, (response) => {
            if (response?.data?.status === "error") {
                setalertData({
                    show: true,
                    message: response?.data?.message,
                    variant: "error"
                })
                setSubmitting(false)
            }
            else if (response?.data?.status === "success") {
                setalertData({
                    show: true,
                    message: response?.data?.message,
                    variant: "success"
                })
                setSubmitting(false);
                resetForm();
            }
            else {
                setalertData({
                    show: true,
                    message: 'Something went wrong please try again later',
                    variant: "error"
                })
                setSubmitting(false)
            }
        }, (error) => {
            console.log(error?.response?.data);
        });
    }

    // const test = () => {
    //   console.log('aaaaaaaaaaaaaaaaaaaaaa')
    //   console.log(userdata[0])
    // }

    return (
        <Grid container fullWidth sm={12} xs={12} p={2} alignItems="center" justifyContent="center">
            <Grid item sm={6} xs={12}>
                <JumboCardQuick title={"Update User Password"} noWrapper>
                    {
                        alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
                    }
                    <List disablePadding sx={{ mb: 2 }}>
                        <Formik
                            validateOnChange={true}
                            initialValues={{
                                user_name: '',
                                password: '',
                                confirm_password: '',
                                admin_transaction_password: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(data, { setSubmitting, resetForm }) => {
                                setSubmitting(true);
                                handleSubmit(data, setSubmitting, resetForm);
                                console.log("formikdata", data)
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form style={{ textAlign: 'left' }} noValidate autoComplete='off'>
                                  
                                    <Div sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                                        <JumboTextField
                                            select
                                            fullWidth
                                            name="user_name"
                                            label="Select a User"
                                        >
                                          {userdata && userdata.map(value => (
                                            <MenuItem value={value.id} key={value.id}>{value.username}</MenuItem>
                                            ))}
                                        </JumboTextField>
                                        
                                    </Div>
                                    <Div sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                                        <JumboTextField
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                        />
                                    </Div>

                                    <Div sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                                        <JumboTextField
                                            fullWidth
                                            name="confirm_password"
                                            label="Confirm Password"
                                            type="password"
                                        />
                                    </Div>

                                    <Div sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                                        <JumboTextField
                                            fullWidth
                                            name="admin_transaction_password"
                                            label="Admin transaction Password"
                                            type="password"
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
                                        >Submit</LoadingButton>

                                        {/* <Button type="button" onClick={test}>click me</Button> */}
                                    </Div>
                                </Form>
                            )}
                        </Formik>
                    </List>
                </JumboCardQuick>
            </Grid>
        </Grid>
    );
};

export default Updateuserpassword;
