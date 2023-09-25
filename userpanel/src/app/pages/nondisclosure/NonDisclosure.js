import React, { useState } from 'react';
import {Checkbox, FormControlLabel, Grid} from "@mui/material";
import { Typography  } from '@mui/material';
import { makeStyles } from '@mui/styles';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import { Form, Formik} from "formik";
import * as yup from "yup";
import { LoadingButton } from '@mui/lab';
import { submitnda } from 'backendServices/ApiCalls';
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import { useNavigate } from 'react-router-dom';


const validationSchema = yup.object({
    firstname: yup
    .string('Enter first name')
    .required('first name is required'),
    lastname: yup
    .string('Enter last name')
    .required('last name is required'),
});

const initialstates = {
    firstname:"",
    lastname: "",
    }

const useStyles = makeStyles((theme) => ({
  faqContainer: {
    marginBottom: theme.spacing(0.5),
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));


const NonDisclosure = () => {
  const classes = useStyles();
  const [alertData, setalertData] = React.useState({
    show:false,
    message:"",
    variant:""
})
const navigate = useNavigate();



const handleSubmit=(data,setSubmitting)=>{
    let params = {
        firstname:data.firstname,
        lastname:data.lastname,
    }

    submitnda(params, (response) => {
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
                message:'NDA signed successfully',
                variant:"success"
            })
            setSubmitting(false)
            navigate('/dashboard')

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

    return (
      <Grid container spacing={2}  alignItems="center" justifyContent="center" >
      <Grid item sm={10} >
      <JumboDemoCard  title={"Non Disclosure Agreement"}
                       wrapperSx={{backgroundColor: 'background.paper', pt: 0}}>
        {
            alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} sx={{background: 'linear-gradient(to bottom, #6b8e29 50%,#2a3511 100%)'}} />)
        }
<div>

<Typography variant="body1" component="p">
By voluntarily participating in the Global Dynamic Savings group, you acknowledge that:
</Typography>

        <ol>
        <li>
        You are who you say you are, you are not sponsoring anyone, and your identity can be validated
through proper state, country, or territory identification. You will use your <b>LEGAL</b> first and last
name.
        </li>
        <li>
        You are 18 years of age.
        </li>
        <li>
        You understand that you will not disclose to anyone or use the personal information of this group
for any form of solicitation or advertisement.
        </li>
        <li>
        You will not send any marketing, spam content, or links associated for business gain or misleading
scam sites to any member or authorized administrator of the group.
        </li>
        <li>
        You will not send derogatory, illicit, obscene, disrespectful, or discriminating words, images, anti-
Semitic, racist, bullying, or other offensive content in any form to any member or authorized
administrator.
        </li>
        <li>
        You understand that no one has guaranteed you anything, there are <b>NO refunds</b>, and you fully
accept the risk of investing or donating into any program offered by Global Dynamic Savings
Group and its authorized affiliates.
        </li>
        <li>
        You agree to fully comply with the referral requirements and any such stipulations within Global
Dynamic Savings Group authorized or affiliated programs.
        </li>
        <li>
        You acknowledge that everyone participating in donating is following the same process & no one
has asked you to do anything outside of the process.
        </li>
        <li>
        The monies you are using to donate are not acquired through any illegal or unauthorized means.
        </li>
        <li>
        You understand that you <b>MUST</b> consult with a certified financial advisor or tax professional
regarding all questions regarding taxable giving or monies considered as being received as income.
You understand that no authorized administrator or leader of Global Dynamic Savings Group is
offering you professional tax advice.
        </li>
        <li>
        You will <b>respect</b> ALL members and designated/authorized administrators.
        </li>
        <li>
            You will not portray to be or act as an authorized administrator for Global Dynamic Savings Group.
        </li>
        <li>
        You <b>agree</b> to direct ALL questions or suggestions to your designated & authorized administrator.
        </li>
        <li>
        You will actively participate in the group by attending at least one to two Opportunity Zoom calls
a month.
        </li>
        <li>
        You will join the Global Dynamic Savings Group chat on GroupMe to stay up to date with
announcements and group updates: <a href="https://groupme.com/join_group/72039825/MGqyeyJf">https://groupme.com/join_group/72039825/MGqyeyJf</a>.
        </li>
        <li>
        You are fully aware and agree to all the terms of being a member of Global Dynamic Savings
Group. You understand that non-compliance of the stated policies or rules will forfeit your
eligibility and membership status.
        </li>
        </ol>


<Typography mt={5} variant="h3" component="h3">
  Compliance Standards.
</Typography>


<Typography variant="body1" mt={2} component="p">
As part of our compliance and oversight procedures we routinely audit the information that our members provide us.
As a legitimate organization, Global Dynamic Savings Group (Aura Coinex) requires full transparency from each vetted
member. You must enter your legal first and last name, along with your accurate email, phone, two qualified referral
names and contact information, and payment method information. The mandatory payout platform for ALL donations
within Aura Coinex will be WISE (Formerly TransferWise).
</Typography>

<Typography variant="body1" mt={2} component="p">
The exception of the mandatory payout platform will be if you currently reside in a country that will not allow you to
register an account with WISE. At those instances only authorized payment platforms will be allowable. It is the
responsibility of Aura Coinex members to follow the complete verification processes for the approved payment platforms
to establish his/her personal accounts.
</Typography>

<Typography variant="body1" mt={2} component="p">
Additionally, we ask each member who joins the ‘Global Dynamic Savings Group 2’ GroupMe application to ensure
that their user profile name is their legal first and last name. During our compliance checks an authorized Administrator
will conduct compliance checks to verify members’ identity and information.
</Typography>

<Typography variant="body1" mt={2} component="p">
It is the policy of Aura Coinex to prohibit and actively prevent money laundering and any activity that facilitates money
laundering or the funding of terrorist or criminal activities by complying with all applicable requirements under the
Bank Secrecy Act (BSA) and its implementing regulations.
</Typography>

<Typography variant="body1" mt={2} component="p">
Money laundering can be defined as engaging in acts designed to conceal or disguise the true origins of criminally
derived proceeds so that the proceeds appear to have derived from legitimate origins or constitute legitimate assets.
Generally, money laundering occurs in the "placement", "layering", and "integration" stages of cash, such as money
orders or traveler's checks, or deposited monetary instruments into accounts at financial institutions. Criminal and
fraudulent activities involving money laundering or intentional financial mismanagement include insider trading,
market manipulation, ponzi schemes, terrorist financing, cybercrimes, and other investment-related fraudulent
activity.
</Typography>

<Typography variant="body1" mt={2} component="p">
Our Anti-Money Laundering (AML) policies, procedures and internal controls are designed to ensure compliance
with all applicable BSA regulations and Financial Industry Regulatory Authority (FINRA) rules and will be reviewed
and updated on a regular basis to ensure appropriate policies, procedures and internal controls are in place to account
for both changes in regulations and changes within our organization.
</Typography>

<Typography variant="body1" mt={2} component="p">
Global Dynamic Savings Group (Aura Coinex) will comply with all local, state, and federal laws and regulations involving
any subpoenas or requests to provide information to law enforcement agencies. We will employ strict procedures both
to ensure that only relevant information is shared and to protect the security and confidentiality of this information.
</Typography>

<Typography variant="body2" mt={2}>
  <i><u>Rules:</u> 31 C.F.R. § 1023.210; FINRA Rule 3310.</i>
</Typography>

<Typography variant="h3" mt={2} component="h6">
  Agreement.
</Typography>
             <Formik
                validateOnChange={false}
                enableReinitialize = 'true'
                initialValues={initialstates}
                validationSchema={validationSchema}
                onSubmit={(data, {setSubmitting}) => {
                            setSubmitting(true);
                            handleSubmit(data, setSubmitting);
                        }}
            >
{({isSubmitting, values}) => (
            <Form style={{textAlign: 'left'}} noValidate autoComplete='off'>

<Typography variant="body1" mt={1} component="p">
<FormControlLabel
    control={<Checkbox name='agreement' />}
    label={
      <span>
        I understand and agree that I am expected to carefully review and comply with all Global Dynamic Savings Group
(Aura Coinex) policies, rules, procedures, prohibited activities, and guidelines (collectively called “Global Dynamic Savings
Group (Aura Coinex) Rules and Policies”). Global Dynamic Savings Group (Aura Coinex) reserves the right to change or update
the organizational Rules and Policies at any time. Violation of such rules may result in member termination.
      </span>
    }
  />
  
</Typography>

<Typography variant="h3" mt={2} component="h6">
  Enter your name
</Typography>
<Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
    <JumboTextField
    size='small'
      fullWidth
      label="First Name"
      name="firstname"
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <JumboTextField
    size='small'
      fullWidth
      label="Last Name"
      name="lastname"
    />
  </Grid>

  <Grid item xs={12}>
                    <LoadingButton
                    size='small'
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    sx={{mb: 3}}
                                    loading={isSubmitting}
                                >Submit</LoadingButton>
  </Grid>

</Grid>
                </Form>
             )}
             </Formik>
</div>
    </JumboDemoCard>
      </Grid>
      </Grid>
    );
};

export default NonDisclosure;








