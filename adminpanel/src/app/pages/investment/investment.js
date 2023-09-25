import React, { useState, useEffect } from 'react';
import JumboDemoCard from "@jumbo/components/JumboDemoCard";
import Box from "@mui/material/Box";
import {Button, TextField, Grid, IconButton, Alert, Typography} from "@mui/material";
import { ContentCopy } from '@mui/icons-material';
import {Form, Formik} from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import * as yup from "yup";
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import Div from '@jumbo/shared/Div/Div';
import { transaction, adminwallet } from 'backendServices/ApiCalls';
import {CircularProgress} from "@mui/material";
import PayPalButton from '../components/mui/Payments/Paypal';

const validationSchema = yup.object({
  amount: yup
      .number('Enter investment amount')
      .required('amount is required'),
  password: yup
      .string('Enter your password')
      .required('Password is required'),
  hash: yup
  .string('Enter transaction hash')
  .required('Password is required'),
});
const Investment = () => {
  const [alertData, setalertData] = React.useState({
    show:false,
    message:"",
    variant:"" 
  })
  const [adminwalletdata,setAdminWalletData]=useState([])
  const [loading,setLoading]=useState(true)

const WalletData =()=>{
  adminwallet((response) => {
  setAdminWalletData(response?.data?.data)
  console.log("adminwallet",response);
  setLoading(false)
    
    }, (error) => {
        console.log(error?.response?.data);
  setLoading(false)

    })
}


useEffect(()=>{
  WalletData();


},[])

const handlePaymentSuccess = (transactionDetails) => {
  // Handle the successful payment
  console.log("Transaction details:", transactionDetails);
};

  
  const handleCopy=()=>{
    navigator.clipboard.writeText(adminwalletdata?.entries[1]?.keyvalue);
    alert('copied');
  }

  const onSubmitForm = (amount,hash,password,setSubmitting,resetForm) => {
    let params = {
      amount,
      hash,
      type: 'investment',
      status: 'Pending',
      details: 'You invested an amount of $'+amount,
      password,
  }
     console.log('abc',amount)
    transaction(params, (response) => {
      console.log("respons",response)
      
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
          resetForm();

      }
     
  }, (error) => {
      console.log(error?.response?.data);
  })
}
  



if(loading){
  return  <Div
  sx={{
      display: 'flex',
      minWidth: 0,
      alignItems: 'center',
      alignContent: 'center',
      height: '100%',
  }}
>
  <CircularProgress sx={{m: '-40px auto 0'}}/>
</Div>
}
    return (
      <Grid container spacing={2}  alignItems="center" justifyContent="center" >
         {
            alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
        }
     
      <Grid item sm={5} >
        <JumboDemoCard  title={"Donate $10"}
                       wrapperSx={{backgroundColor: 'background.paper', pt: 0}}>
             <Formik
                        validateOnChange={true}
                        initialValues={{
                            amount: '',
                            hash: '',
                            password: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(data, {setSubmitting, resetForm}) => {
                            setSubmitting(true);
                            onSubmitForm(data.amount, data.hash, data.password, setSubmitting,resetForm);
                        }}
                    >
                        {({isSubmitting}) => (
                            <Form style={{textAlign: 'left'}} noValidate autoComplete='off'>

            <Box 

                sx={{
                    display: 'flex',
                    flexDirection: 'column',                  
                    '& .MuiTextField-root': {width: '34ch'},
                }}
                alignItems="center"
            >
                                  
                                   <Div sx={{mt: 2,}}>
                                   <Typography variant="h3" gutterBottom component="div">
                    Please donate $10 to start your network
                </Typography>
                                   </Div>

   

                                   {/* <PayPalButton amount={10.0} onSuccess={handlePaymentSuccess} /> */}
                                   <PayPalButton amount={10.0} onSuccess={handlePaymentSuccess} />

              
            </Box>
            </Form>
             )}
             </Formik>
        </JumboDemoCard>
      </Grid>
      </Grid>
    );
};

export default Investment;








