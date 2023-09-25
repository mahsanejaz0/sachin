import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Paper, Typography, TextField, Divider, Button } from '@mui/material'
import { getproduct } from 'backendServices/ApiCalls';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {ErrorMessage, Form, Formik} from "formik";
import * as yup from "yup";
import { useContext } from 'react';
import { updateProfileData } from 'backendServices/ApiCalls';
import { LoadingButton } from '@mui/lab';
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
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
 
});



const Checkout = () => {

  const {loginUserData,setloginUserData} = useContext(CustomProvider);
  let userData = loginUserData
  const [alertData, setalertData] = React.useState({
      show:false,
      message:"",
      variant:"" 
    })
  const onSubmitForm = (data,setSubmitting) => {
      let params = {
        firstname:data.firstname,
        lastname:data.lastname,
        email:data.email,
        mobile:data.mobile,
        address:data.mailingaddress,
    }
       updateProfileData(params, (response) => {
        
        if( response?.data?.status === "error"){
          setalertData({
            show:true,
            message:response?.data?.message,
            variant:"error"
        }) 
            setSubmitting(false)
        }else if(response?.data?.status === "success"){
  
          setalertData({
            show:true,
            message:response?.data?.message,
            variant:"success"
        })
            setSubmitting(false)
            setloginUserData((prevState) => ({
              ...prevState,
              email:data.email,
              mobile:data.mobile,
              firstname:data.firstname,
              lastname:data.lastname
            }));
  
        }
       
    }, (error) => {
        console.log(error?.response?.data);
    })
  }



  const [cartItems, setCartItems] = useState([]);
  const [imageurl, setImageUrl] = useState(null);
  const GetAllProducts = () => {

    getproduct((response) => {
      setImageUrl(response?.data?.imageURL)
      if (response?.data === "success") { // change in everyone
        console.log("response get Successfully");
      }
    }, (error) => {
      console.log(error?.response?.data);
    })
  }


  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
    GetAllProducts();
  }, []);
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
      <Container>
        <Typography p={2} variant='h3' color='#F39711' textAlign='center' mb={2} bgcolor='#272727'> CheckOut </Typography>
        <Grid container spacing={2} >
          <Grid item xs={6} md={7}>
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
                zipcode: userData.zipcode || "",
                city: userData.city || "",
                state: userData.state || ""
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
                      <JumboTextField
                        fullWidth
                        label="Mailing Address"
                        name='mailingaddress'
                        type='text'
                      />

                    </Grid>
                    <LoadingButton

type="submit"
variant='contained' color='warning' size='small'
sx={{ mb: 3 }}
loading={isSubmitting}
><Link to='/payment' style={{ textDecoration: 'none', color: 'white' }}>
  Proceed To Payment
</Link></LoadingButton>

                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>
          <Grid item xs={6} md={5} p={1}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 150 }}>
                <TableHead style={{ fontWeight: 'bolder' }}>
                  <TableRow >
                    <TableCell></TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {cartItems.map((item) => (
                    <>
                      <TableRow key={item.id}>
                        <TableCell>
                          <img src={`${imageurl}${item.picture}`} alt={item.title} height="40"
                            style={{ borderRadius: "50%", width: '40px' }} />

                        </TableCell>
                        <TableCell > {item.title}</TableCell>
                        <TableCell>${item.price}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                      </TableRow>

                    </>
                  ))}


                </TableBody>
              </Table>
            </TableContainer>

            <Typography
              variant='h4'

              p={1}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              Subtotal: ${subtotal}

              
            </Typography>
          </Grid>
        </Grid>
      </Container>

    </>
  )
}

export default Checkout
