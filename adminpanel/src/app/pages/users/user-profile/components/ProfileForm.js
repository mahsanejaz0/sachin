import React, { useEffect } from 'react';
import List from "@mui/material/List";
import { Autocomplete, Box, Button, InputAdornment, Grid, MenuItem, TextField } from "@mui/material";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import { useState } from 'react';
import { countries } from 'app/pages/components/mui/AutoCompletes/data';
import { useContext } from 'react';
import { UserData } from '../UserProfile';
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import { ErrorMessage, Form, Formik } from "formik";
import * as yup from "yup";
import { updateProfileData } from 'backendServices/ApiCalls';
import { LoadingButton } from '@mui/lab';
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import { CustomProvider } from 'app/layouts/vertical-default/VerticalDefault';


const validationSchema = yup.object({
    firstname: yup
        .string('Enter first name')
        .required('first name is required'),
    lastname: yup
        .string('Enter last name')
        .required('last name is required'),
    email: yup
        .string('Enter email address')
        .email('Invalid email address')
        .required('Email is required'),
    mobile: yup
        .string('Enter mobile number')
        .required('Mobile is required'),
});

const About = () => {
    const [country, setCountry] = useState('')
    const { loginUserData, setloginUserData } = useContext(CustomProvider);
    let userData = loginUserData
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [alertData, setalertData] = React.useState({
        show: false,
        message: "",
        variant: ""
    })
    const onSubmitForm = (data, setSubmitting) => {
        let params = {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            mobile: data.mobile,
        }
        updateProfileData(params, (response) => {

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
                setSubmitting(false)
                setloginUserData((prevState) => ({
                    ...prevState,
                    email: data.email,
                    mobile: data.mobile,
                    firstname: data.firstname,
                    lastname: data.lastname
                }));

            }

        }, (error) => {
            console.log(error?.response?.data);
        })
    }
    
    if (userData.firstname === "") {
        return <div>laoding</div>
    }



    return (

        <JumboCardQuick
            title={"Update Profile"}
        >
            {
                alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
            }
            <List
                disablePadding

            >
                <Formik
                    validateOnChange={true}
                    enableReinitialize='true'
                    initialValues={{
                        firstname: userData.firstname || "",
                        lastname: userData.lastname || "",
                        email: userData.email || "",
                        mobile: userData.mobile || "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(data, { setSubmitting }) => {
                        setSubmitting(true);
                        onSubmitForm(data, setSubmitting);
                    }}
                >
                    {({ isSubmitting, values }) => (
                        <Form style={{ textAlign: 'left' }} noValidate autoComplete='off'>
                            <Grid container spacing={2}>
                                <Grid item sm={6} xs={12}>
                                    <JumboTextField
                                        fullWidth
                                        name="firstname"
                                        label="First Name"
                                        type="text"
                                    />

                                </Grid>
                                <Grid item sm={6} xs={12} >
                                    <JumboTextField
                                        fullWidth
                                        label="Last Name"
                                        name='lastname'
                                        type="text"
                                    />

                                </Grid>

                                <Grid item sm={6} sx={{ width: { xs: '100%' } }} >
                                    <JumboTextField
                                        fullWidth
                                        label="Email"
                                        name='email'
                                        type='email'
                                    />

                                </Grid>


                                <Grid item sm={6} sx={{ width: { xs: '100%' } }} >
                                    <JumboTextField
                                        fullWidth
                                        label="Mobile"
                                        name='mobile'
                                        type='tel'
                                    />

                                </Grid>


                                <Grid item sm={6} sx={{ width: { xs: '100%' }, justifyContent: 'end', }}  >
                                    <LoadingButton
                                        fullWidth
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        sx={{ mb: 3 }}
                                        loading={isSubmitting}
                                    >Submit</LoadingButton>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </List>
        </JumboCardQuick>
    );
};

export default About;
