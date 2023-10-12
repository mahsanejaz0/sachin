import React, { useState } from 'react';
import Div from "@jumbo/shared/Div";
import { Autocomplete, Box, Card, CardContent, Checkbox, TextField, Typography, FormControlLabel, Grid } from "@mui/material";
import Link from "@mui/material/Link";
import { ASSET_IMAGES } from "../../../utils/constants/paths";
import { getAssetPath } from "../../../utils/appHelpers";
import { countries } from "../../components/mui/AutoCompletes/data"
import { registerUser } from '../../../../backendServices/ApiCalls';
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import { Link as MyLink, useNavigate, useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import * as yup from "yup";
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import { LoadingButton } from '@mui/lab';
import { data } from 'app/shared/metrics/SalesStatistics/data';
import '../login/login.css';


  
const validationSchema = yup.object({
  firstname: yup
    .string('Enter first name')
    .required('first name is required'),
  username: yup
    .string('Enter username')
    .matches(/^[a-z0-9]+$/, 'Username must be in lowercase  and space is not allwed')
    .matches(/^\S*$/, 'Username must not contain spaces')
    .required('Username is required'),
  sponsorid: yup
    .string('Enter sponsor id')
    .required('sponsor id is required'),
  lastname: yup
    .string('Enter last name')
    .required('last name is required'),
  email: yup
    .string('Enter email address')
    .email('Invalid email address')
    .required('Email is required'),
  mobile: yup
    .string('Enter mobile number')
    .required('mobile number is required'),
  address: yup
    .string('Enter mailing address')
    .required('Address is required'),
  country: yup
    .mixed('select country')
    .required('Country is required'),
  zipcode: yup
    .string('enter zipcode')
    .required('zipcode is required'),
  city: yup
    .string('city zipcode')
    .required('city is required'),
  state: yup
    .string('state zipcode')
    .required('state is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmpassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const Signup = () => {
  const { referralid } = useParams();
  const [country, setCountry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [alertData, setalertData] = React.useState({
    show: false,
    message: "",
    variant: ""
  })
  const navigate = useNavigate();

  const initialstates = {
    sponsorid: referralid || '2SWNLTC1SB',
    username: '',
    firstname: "",
    lastname: "",
    email: "",
    mobile: '',
    address: "",
    country: "",
    zipcode: '',
    city: '',
    state: '',
    password: '',
    confirmpassword: ''
  }
  const handleSubmit = (data, setSubmitting) => {
    let params = {
      sponsorid: data.sponsorid,
      username: data.username,
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      mobile: data.mobile,
      address: data.address,
      password: data.password,
      country: country,
      zipcode: data.zipcode,
      city: data.city,
      state: data.state,
      birthdate: data.birthdate
    }

    registerUser(params, (response) => {
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
        setSubmitting(false)
        navigate('/login')

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
    })
  }

  return (
    <Div  sx={{
      width: 900,
      maxWidth: '100%',
      margin: 'auto',
      p: 2
  }}>
  {
      alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} sx={{background: 'linear-gradient(to bottom, #6b8e29 50%,#2a3511 100%)'}} />)
  }
<center>
      <Card 
          sx={{
              display: 'flex',
              minWidth: 0,
              flexDirection: {xs: 'column', md: 'row'}
          }}
      >
          <CardContent
              sx={{
                  flex: '0 1 300px',
                  position: 'relative',
                  background: `#0267a0 url(${getAssetPath(`${ASSET_IMAGES}/widgets/signup-page.jpg`, "640x428")}) no-repeat center`,
                  backgroundSize: 'cover',

                  '&::after': {
                      display: 'inline-block',
                      position: 'absolute',
                      content: `''`,
                      inset: 0,
                      backgroundColor: 'rgb(27 32 62 / 85%)'
                  }
              }}
          >
              <Div
                  sx={{
                      display: 'flex',
                      minWidth: 0,
                      flex: 1,
                      flexDirection: 'column',
                      color: 'common.white',
                      position: 'relative',
                      zIndex: 1,
                      height: '100%'
                  }}
              >
                  <Div sx={{mb: 2}}>
                      <Typography variant={"h3"} color={"inherit"} fontWeight={500} mb={3}>Sign Up</Typography>
                    
                      <Typography variant="p">Already have an account? <MyLink style={{color:'yellow'}} component="Link" to="/login">Login</MyLink>
</Typography>
                  </Div>

                  <Div sx={{mt: 'auto', textAlign:'center'}}>
                      <Link href="#" underline="none" sx={{display: 'inline-flex'}}>
                          <img src={`${ASSET_IMAGES}/logo.png`} style={{width:'150px'}} alt="GDSG"/>
                      </Link>
                  </Div>
              </Div>
          </CardContent>
          
          <CardContent
              sx={{
                  flex: 1,
                  pl: 1,
                  pr: 1,
                  pt:4,
                  pb:4
              }}
          
          >
        <Formik
          validateOnChange={false}
          enableReinitialize='true'
          initialValues={initialstates}
          validationSchema={validationSchema}
          onSubmit={(data, { setSubmitting }) => {
            setSubmitting(true);
            handleSubmit(data, setSubmitting);
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form style={{ textAlign: 'left' }} noValidate autoComplete='off'>

              <Grid container spacing={2}>

                <Grid item xs={12} sm={6}>
                  <JumboTextField
                    fullWidth
                    name="sponsorid"
                    label="Sponsor ID"
                    type="text"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <JumboTextField
                    fullWidth
                    name="username"
                    label="Username"
                    type="text"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <JumboTextField
                    fullWidth
                    label="First Name"
                    name="firstname"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <JumboTextField
                    fullWidth
                    label="Last Name"
                    name="lastname"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <JumboTextField
                    fullWidth
                    name="email"
                    label="Email"
                    type="email"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <JumboTextField
                    fullWidth
                    label="Mobile No."
                    name="mobile"
                    type="tel"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <JumboTextField
                    fullWidth
                    label="Birth Date"
                    name="birthdate"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <Autocomplete
                  sx={{ width: '100%' }}
                  component={TextField}
                  onChange={(event, newValue) => {setFieldValue('country', newValue)}}
                  id="country-select-demo"
                  options={countries}
                  filterOptions={(options, state) => {
                    const inputValue = state.inputValue.toLowerCase();
                    return options.filter((option) =>
                      option.label.toLowerCase().startsWith(inputValue)
                    );
                  }}
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
                      label="Choose a country"
                      inputProps={{
                        ...params.inputProps,
                      }}
                    />
                  )}
                />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <JumboTextField
                    fullWidth
                    label="Address"
                    name="address"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <JumboTextField
                    fullWidth
                    label="Zipcode"
                    name="zipcode"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <JumboTextField
                    fullWidth
                    label="City"
                    name="city"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <JumboTextField
                    fullWidth
                    name="state"
                    label="State"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <JumboTextField
                    fullWidth
                    label="Password"
                    type="password"
                    name="password"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <JumboTextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmpassword"
                    type="password"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    
                    label={
                      <span>
                        I accept{" "}
                        <a href="/" style={{color:'yellow'}} target="_blank">
                          terms and conditions
                        </a>
                      </span>
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LoadingButton
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ mb: 3 }}
                    loading={isSubmitting}
                  >Sign up</LoadingButton>
                </Grid>

              </Grid>
            </Form>
          )}
        </Formik>
          </CardContent>
      </Card>
      </center>
  </Div>
  );
};

export default Signup;
