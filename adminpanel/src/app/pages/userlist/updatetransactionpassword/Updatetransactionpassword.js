import React from 'react';
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import { Grid, List} from "@mui/material";
import { useState } from 'react';
import { UpdatetransactionPasswordApi } from 'backendServices/ApiCalls';
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import * as yup from "yup";
import { Form, Formik } from "formik";
import Div from '@jumbo/shared/Div/Div';
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import { LoadingButton } from '@mui/lab';


const validationSchema = yup.object({
    old_transaction_password: yup
        .string()
        .required('Old transaction password is required'),
    new_transaction_password: yup
        .string()
        .required('New transaction password is required')
        .min(4, 'Password must be at least 8 characters long'),
});


const Updatetransactionpassword = () => {

    const [alertData, setalertData] = useState({
        show: false,
        message: "",
        variant: ""
    })
    const style = {
        "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
                borderColor: "#fff"
            }
        }
    }

    const handleSubmit = (data, setSubmitting, resetForm) => {
        let params = {
            oldpassword: data.old_transaction_password,
            newpassword: data.new_transaction_password
        }

        UpdatetransactionPasswordApi(params, (response) => {
            console.log(response);
            if (response?.data?.status === "error") {
                setalertData({
                    show: true,
                    message: response?.data?.message,
                    variant: "error"
                })
                setSubmitting(false)
            }
            else if (response?.data?.status === "success") {
                setalertData({
                    show: true,
                    message: response?.data?.message,
                    variant: "success"
                })
                setSubmitting(false);
                resetForm();
            }
            else {
                setalertData({
                    show: true,
                    message: 'Something went wrong please try again later',
                    variant: "error"
                })
                setSubmitting(false)
            }
        }, (error) => {
            console.log(error?.response?.data);
        });
    }

    return (
        <Grid container fullWidth sm={12} xs={12} p={2} alignItems="center" justifyContent="center">
            <Grid item sm={6} xs={12}>
                <JumboCardQuick title={"Update Transaction Password"} noWrapper>
                    {
                        alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
                    }
                    <List disablePadding sx={{ mb: 2 }}>
                        <Formik
                            validateOnChange={true}
                            initialValues={{
                                old_transaction_password: '',
                                new_transaction_password: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={(data, { setSubmitting, resetForm }) => {
                                setSubmitting(true);
                                handleSubmit(data, setSubmitting, resetForm);
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form style={{ textAlign: 'left' }} noValidate autoComplete='off'>

                                    <Div sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                                        <JumboTextField
                                            fullWidth
                                            name="old_transaction_password"
                                            label="Old transaction Password"
                                            type="password"
                                        />
                                    </Div>

                                    <Div sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                                        <JumboTextField
                                            fullWidth
                                            name="new_transaction_password"
                                            label="New transaction Password"
                                            type="password"
                                        />
                                    </Div>
                                    <Div sx={{ mt: 1, pl: 2, pr: 2 }}>
                                        <LoadingButton
                                            fullWidth
                                            type="submit"
                                            variant="contained"
                                            size="large"
                                            sx={{ mb: 3 }}
                                            loading={isSubmitting}
                                        >Submit</LoadingButton>
                                    </Div>
                                </Form>
                            )}
                        </Formik>
                    </List>
                </JumboCardQuick>
            </Grid>
        </Grid>
    );
};

export default Updatetransactionpassword;
