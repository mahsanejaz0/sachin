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
    mailingaddress: yup
        .string('Enter mailing address')
        .required('Address is required'),
    country: yup
        .string('select country')
        .required('Country is required'),
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
            address: data.mailingaddress,
            country: country,
            zipcode: data.zipcode,
            city: data.city,
            state: data.state

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
                    country: country,
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
    useEffect(() => {
        if (userData && userData.country) {
            const country = countries.find(
                (country) =>
                    country.label.toLowerCase() === userData.country.toLowerCase()
            );
            setSelectedCountry(country);
        }
    }, [userData, countries]);
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
                        mailingaddress: userData.address || "",
                        mobile: userData.mobile || "",
                        country: userData.country || "",
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

                                <Grid item sm={12} sx={{ width: { xs: '100%' } }} >
                                    <Autocomplete
                                        sx={{ width: '100%' }}
                                        component={TextField}
                                        value={selectedCountry}
                                        onInputChange={(event, newCountry) => {
                                            setCountry(newCountry);
                                        }}
                                        onChange={(event, newCountry) => {
                                            setSelectedCountry(newCountry);
                                        }}

                                        id="country-select-demo"
                                        options={countries}
                                        autoHighlight
                                        getOptionLabel={(option) => option.label}
                                        renderOption={(props, option) => (
                                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                <img
                                                    loading="lazy"
                                                    width="20"
                                                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                                    alt=""
                                                />
                                                {option.label} ({option.code}) +{option.phone}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <JumboTextField
                                                name="country"
                                                fullWidth
                                                {...params}
                                                label="Country"
                                                inputProps={{
                                                    ...params.inputProps,

                                                }}


                                            />

                                        )}
                                    />

                                </Grid>

                                <Grid item sm={12} sx={{ width: { xs: '100%' } }} >
                                    <JumboTextField
                                        fullWidth
                                        label="Mailing Address"
                                        name='mailingaddress'
                                        type='text'
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
