import React, {useContext } from 'react';
import JumboDemoCard from "@jumbo/components/JumboDemoCard";
import Box from "@mui/material/Box";
import {Alert, AlertTitle, Button, Grid, Typography} from "@mui/material";
import { CustomProvider } from 'app/layouts/vertical-default/VerticalDefault';
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import Div from '@jumbo/shared/Div/Div';
import { deployuser, submitManualPayment } from 'backendServices/ApiCalls';
import PayPalButton from '../components/mui/Payments/Paypal';
import { CSSTransition } from 'react-transition-group';
import { Form, Formik} from "formik";
import * as yup from "yup";
import './CollapsibleBox.css'; // Import CSS for transition animation
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import { LoadingButton } from '@mui/lab';
import { Link } from 'react-router-dom';

const validationSchema = yup.object({
  username: yup.string()
    .required('User Name is required'),
  datetime: yup.string()
    .required('Date Time is required'),
    accountid: yup
    .number()
    .typeError('Invalid Transaction Number. Please enter a valid number')
    .min(11111111, 'Invalid Transaction Number. Please confirm the transaction Number from your Wise account')
    .max(999999999999, 'Invalid Transaction Number. Please confirm the transaction Number from your Wise account')
    .required('Transaction Number is required'),
  amount: yup.number()
    .required('Amount is required'),
});


const initialstates = {
  username: '',
  datetime: '',
  accountid: null,
  amount: '10',
}


const Investment = () => {

  const [alertData, setalertData] = React.useState({
    show:false,
    message:"",
    variant:""
})
  const [isOpen, setIsOpen] = React.useState(false);
  const {loginUserData, setloginUserData} = useContext(CustomProvider);
  let userData = loginUserData

  const handleButtonCollapse = () => {
    setIsOpen(!isOpen);
  };



  const handleSubmit=(data,setSubmitting,resetForm)=>{
    let params = {
      username:data.username,
      datetime:data.datetime,
      amount:data.amount,
      accountid:data.accountid
    }
  
    submitManualPayment(params, (response) => {
      if(response?.data?.status === "error") {
          setalertData({
              show:true,
              message:response?.data?.message,
              variant:"error"
          })
          setSubmitting(false)
  
      }
      else if(response?.data?.status === "success")
      {
          setalertData({
              show:true,
              message:response?.data?.message,
              variant:"success"
          })
          setSubmitting(false)
          resetForm();
  
      }
      else{
          setalertData({
              show:true,
              message:'Something went wrong please try again later',
              variant:"error"
          })
          setSubmitting(false)
  
      }
  }, (error) => {
      console.log(error?.response?.data);
  })
  
  }
  
const handlePaymentSuccess = (transactionDetails) => {
  // Handle the successful payment
  const amount = 10;
  deployuser(amount,(response) => {
      setalertData({
        show:true,
        message:'your donation has been submitted successfully',
        variant:"success"
    }) 
      setloginUserData((prevState) => ({
        ...prevState,
        status: 'approved',
      }));
      
      }, (error) => {
          console.log(error?.response?.data);
  
      })
      
  console.log("Transaction details:", transactionDetails);


};



    return (
      <Grid container spacing={2}  alignItems="center" justifyContent="center" >
         {
            alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
          }
     
      <Grid item sm={8} >
        <JumboDemoCard  title={"Payment Methods"}
                       wrapperSx={{backgroundColor: 'background.paper', pt: 0}}>


            <Box 

                sx={{
                    display: 'flex',
                    flexDirection: 'column',                  
                }}
                alignItems="center"
            >


<>
  <Div sx={{mt: 2,}}>
  <Typography variant="h3" gutterBottom component="div">
  Please Select Your Payment Method Here
  </Typography>
  </Div>
  <PayPalButton sx={{width:'100%'}} amount={10.0} onSuccess={handlePaymentSuccess} />

    <Button color='primary' variant='contained' sx={{mt:1, width:'80%'}} onClick={handleButtonCollapse}>
                Pay Using Wise
    </Button> 

    <CSSTransition in={isOpen} classNames="collapse" timeout={300} unmountOnExit>
        <Box sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
        <Formik
                validateOnChange={false}
                enableReinitialize = 'true'
                initialValues={initialstates}
                validationSchema={validationSchema}
                onSubmit={(data, {setSubmitting,resetForm}) => {
                            setSubmitting(true);
                            handleSubmit(data, setSubmitting,resetForm);
                        }}
            >
{({isSubmitting, values}) => (
            <Form style={{textAlign: 'left'}} noValidate autoComplete='off'>

            <Grid container spacing={2}>
                            
                <Grid item xs={12} >
                  <JumboTextField
                    fullWidth
                    name="username"
                    label="User Name"
                    type="text"
                  />
                </Grid>
                <Grid item xs={12}>
                  <JumboTextField
                    fullWidth
                    name="datetime"
                    label="Date Time"
                    type="datetime-local"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <JumboTextField
                    fullWidth
                    name="amount"
                    label="Amount"
                    type="number"
                    readonly
                  />
                </Grid>


                <Grid item xs={12}>
                  <JumboTextField
                    fullWidth
                    name="accountid"
                    label="Transaction Number (without #)"
                    type="text"
                  />
                </Grid>

                <Grid item sm={12}>
                             <LoadingButton
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    sx={{mb: 3}}
                                    loading={isSubmitting}
                                >Submit</LoadingButton>
                </Grid>

              </Grid>

  </Form>
)}
  </Formik>

        </Box>
    </CSSTransition>

</>



              
            </Box>

        </JumboDemoCard>
      </Grid>
      </Grid>
    );
};

export default Investment;








