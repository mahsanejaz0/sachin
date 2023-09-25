import React, { useState, useEffect } from 'react';
import JumboDemoCard from "@jumbo/components/JumboDemoCard";
import Box from "@mui/material/Box";
import {Grid} from "@mui/material";
import {Form, Formik} from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import * as yup from "yup";
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import Div from '@jumbo/shared/Div/Div';
import { getsettingsdata, payoutrequest } from 'backendServices/ApiCalls';
import useJumboAuth from '@jumbo/hooks/useJumboAuth';
import { useContext } from 'react';
import { CustomProvider } from 'app/layouts/vertical-default/VerticalDefault';
import {useTranslation} from "react-i18next";

const Payout = () => {
  const {t} = useTranslation();
  const [alertData, setalertData] = React.useState({
    show:false,
    message:"",
    variant:"" 
  })

  const {loginUserData,setloginUserData} = useContext(CustomProvider);
  const [settingsdata,setSettingsData] = useState([]);
  const userData = loginUserData

  const fetchsettingdata = () => {
    const params = {
      keynames: "'payout_fee', 'min_payout', 'payout_flat_fee'"
    };
    getsettingsdata(params, (response) => {
      setSettingsData(response?.data?.data);
    });
  };

  useEffect(()=>{
    fetchsettingdata();
  },[])

  const validationSchema = yup.object({
    amount: yup
        .number('Enter investment amount')
        .required('Amount is required')
        .min(settingsdata?.values[1]?.keyvalue, `Amount must be at least ${settingsdata?.values[1]?.keyvalue}`),
    payoutaccount1: yup
    .string('Enter Coin Name')
    .required('Coin name is required'),
    payoutaccount2: yup
    .string('Enter Wallet Address')
    .required('Wallet address is required'),
  });


  const onSubmitForm = (amount,payoutaccount1,payoutaccount2,password,setSubmitting,resetForm) => {
    let params = {
      amount,
      payoutaccount1,
      payoutaccount2,
      type: 'payout',
      status: 'Pending',
      details: 'Request payout of $'+amount,
      password,

  }
 



    payoutrequest(params, (response) => {
      console.log('respone',response)
      if( response?.status === "error"){
        setalertData({
          show:true,
          message:response?.data?.message,
          variant:"error"
      }) 
          setSubmitting(false)
      }else if(response?.data?.status === "success"){
        let netamount=userData.current_balance-amount;
        setloginUserData((prevState) => ({
          ...prevState,
          current_balance: netamount,
        }));

        setalertData({
          show:true,
          message:response?.data?.message,
          variant:"success"
      })
        setloginUserData((prevState) => ({
          ...prevState,
        }));
          setSubmitting(false)
          resetForm();

      }
     
  }, (error) => {
      console.log(error?.response?.data);
  })
}


    return (
      <Grid container spacing={2}  alignItems="center" justifyContent="center" >
         {
            alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
        }
     
      <Grid item sm={5} >
        <JumboDemoCard  title={'Request Withdrawal'}
                       wrapperSx={{backgroundColor: 'background.paper', pt: 0}}>
             <Formik
             enableReinitialize="true"
                        validateOnChange={true}
                        initialValues={{
                            amount: '',
                            payoutaccount1: '',
                            payoutaccount2: '',
                            random: loginUserData.walletbalance || ''
                        }}
                        
                        validationSchema={validationSchema}
                         onSubmit={(data, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              onSubmitForm(data.amount,data.payoutaccount1,data.payoutaccount2,data.password,setSubmitting, resetForm);
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
                                    <JumboTextField
                                        fullWidth
                                        name="current_balance"
                                        label={'Your Balance is $'+userData.current_balance}
                                        type="number"
                                        disabled
                                    /></Div>
                                    <Div sx={{mt: 3,}}>
                                    <JumboTextField
                                        fullWidth
                                        name="amount"
                                        label="Enter Payout Amount"
                                        type="number"
                                    /></Div>
                                   <Div sx={{mt: 3,}}>
                                        <JumboTextField
                                        fullWidth
                                        name="payoutaccount1"
                                        label="Enter Coin Name"
                                        type="text"
                                    /></Div>
                                    <Div sx={{mt: 3, mb:2}}>
                                        <JumboTextField
                                        fullWidth
                                        name="payoutaccount2"
                                        label="Enter Wallet Address"
                                        type="text"
                                    /></Div>
                                   {/* <Div sx={{mt: 3,mb:2}}>
                                        <JumboTextField
                                        fullWidth
                                        name="password"
                                        label="Enter Password"
                                        type="password"
                                    /></Div> */}

   



      
               

              
<LoadingButton
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    sx={{mb: 3}}
                                    loading={isSubmitting}
                                >Submit Request</LoadingButton>
            </Box>
            </Form>
             )}
             </Formik>
        </JumboDemoCard>
      </Grid>
      </Grid>
    );
};

export default Payout;