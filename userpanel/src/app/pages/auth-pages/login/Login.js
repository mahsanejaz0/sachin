import React from 'react';
import {Card, CardContent, Checkbox, CircularProgress, FormControlLabel, IconButton, Typography} from "@mui/material";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import {Facebook, Google, Twitter} from "@mui/icons-material";
import Div from "@jumbo/shared/Div";
import {alpha} from "@mui/material/styles";
import {ASSET_IMAGES} from "../../../utils/constants/paths";
import {getAssetPath} from "../../../utils/appHelpers";
import * as yup from "yup";
import {Form, Formik} from "formik";
import JumboTextField from "@jumbo/components/JumboFormik/JumboTextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import { Link as   MyLink , useNavigate, useParams } from "react-router-dom";
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import { useState } from 'react';
import { useBasicAuth } from 'app/auth-providers/BasicAuth/hooks';
import { useEffect } from 'react';
import { validateEmailToken, verifyemailaccount } from 'backendServices/ApiCalls';


const validationSchema = yup.object({
    username: yup
        .string('Enter your username')
        .required('Username is required'),
    password: yup
        .string('Enter your password')
        .required('Password is required'),
});

const Login = ({disableSmLogin}) => {
    const [randomQuote, setRandomQuote] = useState("");
    const {signIn} = useBasicAuth();
    const navigate = useNavigate();
    const [alertData, setalertData] = useState({
        show:false,
        message:"",
        variant:""
    })
    const [validToken, setValidToken] = React.useState()
    const [isLoading, setIsLoading] = React.useState(false)

    const [serverError, setServerError] = React.useState(null);
    const {token,email} = useParams();
    const quotes = [
        "Psalm 119:11 “I have stored up Your Word in my heart, that I might not sin against You”.",
        "“Faith expects from God what is beyond all expectation.” (Andrew Murray)",
        "“If we cannot believe God when circumstances seem be against us, we do not believe Him at all.” (Charles Spurgeon)",
        "“For we walk by faith, not by sight” (Paul, 2 Corinthians 5:7)",
        "“Faith is not the belief that God will do what you want.  It is the belief that God will do what is right.” (Max Lucado)",
        "“Faith consists in believing what reason cannot.” (Voltaire)",
        '"Faith is the gaze of a soul upon a saving God." (A.W. Tozer)',
        '"If by faith you are in Christ, God is as much for you in Christ as He will ever be or could ever be" (John Piper)',
        '“Faith is the strength by which a shattered world shall emerge into the light.” (Helen Keller)',
        '“Faith never knows where it is being led, but it loves and knows the One who is leading.” (Oswald Chambers)',
        '“True faith manifests itself through our actions.” (Francis Chan)',
        '“Joy is the infallible proof of the presence of God.”—Madeleine',
        '“For prayer is nothing else than being on terms of friendship with God.”—Saint Teresa of Ávila',
        '“What God intended for you goes far beyond anything you can imagine.”—Oprah Winfrey'
      ];
    

  
      useEffect(() => {
        const getRandomQuote = () => {
          const randomIndex = Math.floor(Math.random() * quotes.length);
          const quote = quotes[randomIndex];
          setRandomQuote(quote);
        };
    
        getRandomQuote();
      }, []);


    const onSignIn = (username, password,setSubmitting) => {

        const ipaddress = '127.0.0.1'
        signIn(username, password, ipaddress, (response) => {
            if(response?.status === "error")
            {
                setalertData({
                    show:true,
                    message:response?.message,
                    variant:"error"
                })
                setSubmitting(false)
                setIsLoading(false)
            }
            else if(response?.status === "success")
            {
                setIsLoading(false)
                navigate('/dashboard')
            }
            else{
                setIsLoading(false)
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


    function checkToken(token,email){
        if(token && email)
        {
            setIsLoading(true)
            verifyemailaccount(token,email, (response) => {
                if(response?.data?.status === "success")
                {
                    setValidToken(true)
                    setIsLoading(false)
                }
                else{
                    setValidToken(false)
                    setIsLoading(false)
                }
                
            }, (error) => {
                console.log(error?.response?.data);
            })
        }

    }

    useEffect(() => {
            checkToken(token,email)
    }, [])

    if(isLoading)
    {
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
        <Div sx={{
            width: 720,
            maxWidth: '100%',
            margin: 'auto',
            p: 4
        }}>
        {
            alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
        }
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
                        background: `#0267a0 url(${getAssetPath(`${ASSET_IMAGES}/widgets/login-page.jpg`, "640x428")}) no-repeat center`,
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
                            <Typography variant={"h3"} color={"inherit"} fontWeight={500} mb={3}>Sign In</Typography>
                            <Typography variant={""} mb={2}>
                            <h4>Quote of the day</h4>
                            <p>{randomQuote}</p>
                            </Typography>
                            <Typography variant={"body1"}>
                                <MyLink
                                    style={{color:'yellow'}}
                                    to={"/forget-password"}
                                    color={"inherit"}
                                    underline={'none'}
                                >Forgot your password? Recover Now
                                </MyLink>
                            </Typography>
                        </Div>

                        <Div sx={{mt: 'auto', textAlign:'center'}}>
                            <Link href="#" underline="none" sx={{display: 'inline-flex'}}>
                                <img src={`${ASSET_IMAGES}/logo.png`} style={{width:'150px'}} alt=""/>
                            </Link>
                        </Div>
                    </Div>
                </CardContent>
                <CardContent sx={{flex: 1, p: 4}}
                >
{
    validToken === true ?
    (
        <Alert severity="success">Your account is verified successfully. You can login to your account now </Alert>
    )
    : validToken === false ?
    (
        <Alert severity="error">Invalid verification link. </Alert>
    ) 
    :
    null

}
                    <Formik
                        validateOnChange={true}
                        initialValues={{
                            username: '',
                            password: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(data, {setSubmitting}) => {
                            setSubmitting(true);
                            onSignIn(data.username, data.password, setSubmitting);
                        }}
                    >
                        {({isSubmitting}) => (
                            <Form style={{textAlign: 'left'}} noValidate autoComplete='off'>
                                {
                                    serverError?.message &&
                                    <Alert severity="error">{serverError.message}</Alert>
                                }
                                <Div sx={{mt: 1, mb: 3}}>
                                    <JumboTextField
                                        fullWidth
                                        name="username"
                                        label="Username"
                                    />
                                </Div>
                                <Div sx={{mt: 1, mb: 2}}>
                                    <JumboTextField
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                    />
                                </Div>
                                <Div sx={{mb: 2}}>
                                    <FormControlLabel control={<Checkbox/>} label="Remember me"/>
                                </Div>
                                <LoadingButton
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    sx={{mb: 3}}
                                    loading={isSubmitting}
                                >Sign In</LoadingButton>
                                 <Div sx={{mb: 2}}>
                                    <Typography variant="p">Don't have an account? <MyLink style={{color:'yellow'}} component="Link" to="/signup">Signup</MyLink>
</Typography>
                                </Div>
                                {
                                    disableSmLogin && (
                                        <React.Fragment>
                                            <Typography variant={"body1"} mb={2}>Or sign in with</Typography>
                                            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                                <IconButton sx={{
                                                    bgcolor: '#385196',
                                                    color: 'common.white',
                                                    p: theme => theme.spacing(1.25),

                                                    '&:hover': {
                                                        backgroundColor: '#385196',
                                                    }
                                                }} aria-label="Facebook">
                                                    <Facebook fontSize="small"/>
                                                </IconButton>
                                                <IconButton sx={{
                                                    bgcolor: '#00a8ff',
                                                    color: 'common.white',
                                                    p: theme => theme.spacing(1.25),

                                                    '&:hover': {
                                                        backgroundColor: '#00a8ff',
                                                    }
                                                }} aria-label="Twitter">
                                                    <Twitter fontSize="small"/>
                                                </IconButton>
                                                <IconButton sx={{
                                                    bgcolor: '#23272b',
                                                    color: 'common.white',
                                                    p: theme => theme.spacing(1.25),

                                                    '&:hover': {
                                                        backgroundColor: '#23272b',
                                                    }
                                                }} aria-label="Twitter">
                                                    <Google fontSize="small"/>
                                                </IconButton>
                                            </Stack>
                                        </React.Fragment>
                                    )
                                }

                            </Form>
                        )}
                    </Formik>
                </CardContent>
            </Card>
        </Div>
    );
};

export default Login;
