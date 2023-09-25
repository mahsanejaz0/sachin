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
import { Link as   MyLink , useNavigate, useParams } from "react-router-dom";
import useApp from 'app/hooks/useApp';
import { passwordReset, requestPasswordReset, validateEmailToken } from 'backendServices/ApiCalls';
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import { useEffect } from 'react';


const validationSchema = yup.object({
    password: yup
      .string()
      .required('Password is required'),
    confirmpassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

const ResetPassword = () => {
    var {companyName} = useApp();
    const {token,email} = useParams();
    const [validToken, setValidToken] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true)
    const [alertData, setalertData] = React.useState({
        show:false,
        message:"",
        variant:""
    })
    const navigate = useNavigate();


    function checkToken(token,email){
        validateEmailToken(token,email, (response) => {
            if(response?.data?.status === "success")
            {
                setValidToken(true)
                setIsLoading(false)
            }
            else{
                setIsLoading(false)
            }
            
        }, (error) => {
            console.log(error?.response?.data);
        })

    }

    useEffect(() => {
        checkToken(token,email)
    }, [])
    const resetPassword = (email,password,setSubmitting) => {

        passwordReset(email,password, (response) => {
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
                setalertData({
                    show:true,
                    message:response?.data?.message,
                    variant:"success"
                })
                navigate('/login')
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
if(isLoading)
{
    return <div></div>
}
    return (
        
        <Div sx={{
            flex: 1,
            flexWrap: 'wrap',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: theme => theme.spacing(4),
        }}>
        {
            alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
        }
            <Div sx={{mb: 3, display: 'inline-flex'}}>
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
                            Reset Password
                        </Typography>
                    </Div>
                </Div>
                <CardContent>
            {
                validToken === true ? 
                (
<Formik
                        validateOnChange={true}
                        initialValues={{
                            password: '',
                            confirmpassword: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(data, {setSubmitting}) => {
                            setSubmitting(true);
                            resetPassword(email,data.password, setSubmitting);
                        }}
                    >
                        {({isSubmitting}) => (
                            <Form style={{textAlign: 'left'}} noValidate autoComplete='off'>

                                <Div sx={{mt: 1, mb: 3}}>
                                    <JumboTextField
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                    />
                                </Div>

                                <Div sx={{mt: 1, mb: 3}}>
                                    <JumboTextField
                                        fullWidth
                                        name="confirmpassword"
                                        label="Confirm Password"
                                        type="password"
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

                                

                            </Form>
                        )}
                    </Formik>
                ) :

                (
                    <Alert severity="error">Invalid password reset link. Please try with a new link again. </Alert>
                )
            }
                
                </CardContent>
            </Card>

        </Div>
    );
};

export default ResetPassword;
