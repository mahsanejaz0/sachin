import React from 'react';
import {Alert, Card, CardContent, FormControlLabel, IconButton, TextField, Typography} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import Link from "@mui/material/Link";
import {alpha} from "@mui/material/styles";
import Div from "@jumbo/shared/Div";
import {ASSET_IMAGES} from "../../../utils/constants/paths";
import {getAssetPath} from "../../../utils/appHelpers";
import * as yup from "yup";
import {Form, Formik} from "formik";
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import { LoadingButton } from '@mui/lab';
import { Link as   MyLink , useNavigate } from "react-router-dom";
import useApp from 'app/hooks/useApp';
import { requestPasswordReset } from 'backendServices/ApiCalls';
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';


const validationSchema = yup.object({
    email: yup
        .string('Enter email address')
        .email('Invalid email address')
        .required('Email is required')

});

const ForgotPassword = () => {
    var {companyName} = useApp();
    const [alertData, setalertData] = React.useState({
        show:false,
        message:"",
        variant:""
    })
    const [serverError, setServerError] = React.useState(null);


    const resetPassword = (email,setSubmitting) => {

        requestPasswordReset(email, (response) => {
            if(response?.data?.status === "error")
            {
                setalertData({
                    show:true,
                    message:response?.data?.message,
                    variant:"error"
                })
                setSubmitting(false)
            }
            else if(response?.data?.status === "success")
            {
                setServerError(response?.data?.message)
                setalertData({
                    show:true,
                    message:response?.data?.message,
                    variant:"success"
                })
                setSubmitting(false)

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
        
    
    };
    
    
    return (
        <Div sx={{
            flex: 1,
            flexWrap: 'wrap',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: theme => theme.spacing(1),
        }}>
        {
            alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
        }
            <Div sx={{display: 'inline-flex'}}>
                <Link href="#" underline="none" sx={{display: 'inline-flex'}}>
                    <img src={`${ASSET_IMAGES}/logo.png`} style={{width:'150px'}} alt={companyName} />
                </Link>
            </Div>
            <Card sx={{maxWidth: '100%', width: 360, mb: 4}}>
                <Div sx={{position: 'relative', height: '200px'}}>
                    <CardMedia
                        component="img"
                        alt="green iguana"
                        height="200"
                        image={getAssetPath(`${ASSET_IMAGES}/colin-watts.jpg`)}
                    />
                    <Div sx={{
                        flex: 1,
                        inset: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: theme => alpha(theme.palette.common.black, .5),
                        p: theme => theme.spacing(3),
                    }}>
                        <Typography
                            variant={"h2"}
                            sx={{
                                color: 'common.white',
                                fontSize: '1.5rem',
                                mb: 0
                            }}>
                            Forgot password
                        </Typography>
                    </Div>
                </Div>
                <CardContent>
                <Formik
                        validateOnChange={true}
                        initialValues={{
                            email: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(data, {setSubmitting}) => {
                            setSubmitting(true);
                            resetPassword(data.email, setSubmitting);
                        }}
                    >
                        {({isSubmitting}) => (
                            <Form style={{textAlign: 'left'}} noValidate autoComplete='off'>

                                <Div sx={{mt: 1, mb: 3}}>
                                    <JumboTextField
                                        fullWidth
                                        name="email"
                                        label="Email"
                                        type="email"
                                    />
                                </Div>

                                <LoadingButton
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    sx={{mb: 3}}
                                    loading={isSubmitting}
                                >Submit</LoadingButton>
                                 <Div sx={{mb: 2}}>
                                    <Typography variant="p">Don't want to reset? <MyLink style={{color:'black'}} component="Link" to="/login">Login</MyLink>
</Typography>
                                </Div>
                                

                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>

        </Div>
    );
};

export default ForgotPassword;
