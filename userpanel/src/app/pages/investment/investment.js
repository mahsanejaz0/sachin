import React, { useState, useEffect } from 'react';
import JumboDemoCard from "@jumbo/components/JumboDemoCard";
import Box from "@mui/material/Box";
import {Button, TextField, Grid, IconButton, Alert, Select, MenuItem, InputLabel} from "@mui/material";
import { ContentCopy } from '@mui/icons-material';
import {Form, Formik} from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import * as yup from "yup";
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import Div from '@jumbo/shared/Div/Div';
import { transaction, adminwallet, getsingledepositwallet } from 'backendServices/ApiCalls';
import {CircularProgress} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InputAdornment from '@mui/material/InputAdornment';
import { Gr } from 'react-flags-select';

const validationSchema = yup.object({
  amount: yup
      .number('Enter deposit amount')
      .required('amount is required'),
  password: yup
      .string('Enter your password')
      .required('Password is required'),
  hash: yup
  .string('Enter transaction hash')
  .required('Password is required'),
});
const Investment = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [alertData, setalertData] = React.useState({
    show:false,
    message:"",
    variant:"" 
  })
  const [adminwalletdata,setAdminWalletData]=useState([])
  const [loading,setLoading]=useState(true)

const WalletData =()=>{
  let params = {
    keynames:"'depositwallet'"
  }
  adminwallet(params,(response) => {
    setLoading(true)
  setAdminWalletData(response?.data?.data?.entries)
  setLoading(false)
    
    }, (error) => {
        console.log(error?.response?.data);
  setLoading(false)

    })
}

const handleSelectChange = (event) => {
  setSelectedOption('')
  setLoading(true)
  const coinid = event.target.value;
  let params = {
    tid:  coinid  
  }
  getsingledepositwallet(params,(response) => {
    setSelectedOption(response?.data?.data)
  setLoading(false)
    
    }, (error) => {
        console.log(error?.response?.data);
  setLoading(false)

    })

  //setSelectedOption();
  // Call your function here
};


useEffect(()=>{
  WalletData();
},[])

  
  const handleCopy=()=>{
    navigator.clipboard.writeText(selectedOption?.entries[0]?.walletaddress || '');
    setIsCopied(true);

    // Reset the state after a certain duration if needed
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);

    setalertData({
      show:true,
      message:'address copied to clipboard',
      variant:"success"
    })
  }

  const onSubmitForm = (amount,hash,password,setSubmitting,resetForm) => {
    if(selectedOption === "" || selectedOption === null)
    {
      setalertData({
        show:true,
        message:'select a deposit method',
        variant:"error"
    }) 
    setSubmitting(false)
      return
    }
    let params = {
      amount,
      hash,
      type: 'deposit',
      status: 'pending',
      details: 'User deposit an amount of $'+amount,
      password,
      payoutmethod:selectedOption?.entries[0]?.coinname
  }
    transaction(params, (response) => {
      
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
          message:'Deposit request submitted successfully',
          variant:"success"
      })
          setSubmitting(false)
          resetForm();

      }
     
  }, (error) => {
      console.log(error?.response?.data);
      setSubmitting(false)
  })
}

    return (
      <Grid container spacing={2}  alignItems="center" justifyContent="center" >
        {
            alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
        }
      <Grid item sm={5}>
      <JumboDemoCard title={"Deposit Address"}
                       wrapperSx={{backgroundColor: 'background.paper', pt: 0, minHeight:'390px', display:'block'}}>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={12}>
            <InputLabel id="select-label">Select deposit method</InputLabel>
            <Select labelId="select-label" value={selectedOption.tid} fullWidth onChange={handleSelectChange}>
              {adminwalletdata.map((option) => (
              <MenuItem key={option.value} value={option.tid}>
                {option.coinname}
              </MenuItem>
              ))}

              {/* Add more options if needed */}
            </Select>
            </Grid>
          </Grid>



{

loading ?(<Grid xs={12}
  sx={{
      display: 'flex',
      minWidth: 0,
      alignItems: 'center',
      alignContent: 'center',
      height: '100%',
      marginTop:'50px'
  }}
>
  <CircularProgress sx={{m: '-40px auto 0'}}/>
</Grid>
): null
}

{

  selectedOption ? (            
  
  <Box
    sx={{
        display: 'flex',
        flexDirection: 'column',                  
    }}
    alignItems="center"
>
<Alert severity="warning">{selectedOption?.entries[0]?.walletmessage}</Alert>
<Box
component="img"
sx={{
marginTop:1,
height: 155,
width: 155,
backgroundColor: 'white',

}}
alt="The house from the offer."
src={selectedOption.picturelink+selectedOption?.entries[0]?.walletqrcode}
/>
<TextField 
   
type='text'
disabled
value={selectedOption?.entries[0]?.walletaddress}
margin="normal"
InputProps={{
endAdornment: (
<InputAdornment position="end">
  <IconButton onClick={handleCopy}>
    {isCopied ? (
      <CheckCircleOutlineIcon />
    ) : (
      <ContentCopy />
    )}
  </IconButton>
</InputAdornment>
),
}}

/>

</Box>
) : null
}


             
        </JumboDemoCard>
      </Grid>
      <Grid item sm={6} >
        <JumboDemoCard  title={"Deposit Form"}
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
                            <Form style={{textAlign: 'left', width:'100%'}} noValidate autoComplete='off'>


                                  
                                   <Grid xs={12} sx={{mt: 2,}}>
                                    <JumboTextField
                                        fullWidth
                                        name="amount"
                                        label="Enter Amount"
                                        type="number"
                                    /></Grid>
                                   <Grid xs={12} sx={{mt: 3,}}>
                                        <JumboTextField
                                        fullWidth
                                        name="hash"
                                        label="Enter Transaction Hash"
                                        type="text"
                                    /></Grid>
                                   <Grid xs={12} sx={{mt: 3,mb:2}}>
                                        <JumboTextField
                                        fullWidth
                                        name="password"
                                        label="Enter Password"
                                        type="password"
                                    /></Grid>


<LoadingButton
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    sx={{mb: 3}}
                                    loading={isSubmitting}
                                >Submit</LoadingButton>

            </Form>
             )}
             </Formik>
        </JumboDemoCard>
      </Grid>
      </Grid>
    );
};

export default Investment;








