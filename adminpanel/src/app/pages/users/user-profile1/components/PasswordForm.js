import React from 'react';
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import {Button, List, ListItem, TextField} from "@mui/material";
import { useState } from 'react';
import { updateProfilePassword } from 'backendServices/ApiCalls';
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import * as yup from "yup";
import {Form, Formik} from "formik";
import Div from '@jumbo/shared/Div/Div';
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import { LoadingButton } from '@mui/lab';


const validationSchema = yup.object({
    oldpass: yup
    .string()
    .required('Password is required'),
    newpass: yup
      .string()
      .required('Confirm password is required')
      .min(8, 'Password must be at least 8 characters long')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
  });


const PasswordForm = () => {

    const [alertData, setalertData] = useState({
        show:false,
        message:"",
        variant:""
    })
    const style = {
        "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": {
            borderColor: "#fff"
          }
        }
      } 

      const handleSubmit = (data,setSubmitting) =>{


            updateProfilePassword(data.oldpass,data.newpass, (response) => {
                console.log(response);
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
            });


      }
    return (
        <JumboCardQuick title={"Update Password"} noWrapper>
        {
            alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
        }
            <List disablePadding sx={{mb: 2}}>
                <Formik
                        validateOnChange={true}
                        initialValues={{
                            password: '',
                            confirmpassword: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(data, {setSubmitting}) => {
                            setSubmitting(true);
                            handleSubmit(data, setSubmitting);
                        }}
                    >
                        {({isSubmitting}) => (
                            <Form style={{textAlign: 'left'}} noValidate autoComplete='off'>

                                <Div sx={{mt: 1, mb: 3, pl:2, pr:2}}>
                                    <JumboTextField
                                        fullWidth
                                        name="oldpass"
                                        label="Old Password"
                                        type="password"
                                    />
                                </Div>

                                <Div sx={{mt: 1, mb: 3, pl:2, pr:2}}>
                                    <JumboTextField
                                        fullWidth
                                        name="newpass"
                                        label="New Password"
                                        type="password"
                                    />
                                </Div>
                                <Div sx={{mt: 1, pl:2, pr:2}}>
                                <LoadingButton
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    sx={{mb: 3}}
                                    loading={isSubmitting}
                                >Submit</LoadingButton>
                                </Div>

                                

                            </Form>
                        )}
                    </Formik>
               
            </List>
        </JumboCardQuick>
    );
};

export default PasswordForm;
