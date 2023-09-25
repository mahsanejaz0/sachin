import React from 'react';
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import { Grid, List} from "@mui/material";
import { Form, Formik } from "formik";
import Div from '@jumbo/shared/Div/Div';
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import { LoadingButton } from '@mui/lab';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const AddDepositWallet = ({initialValues,validationSchema,handleUpload,handleSubmit}) => {

console.log('handleUploadhandleUpload', handleUpload)
    const style = {
        "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
                borderColor: "#fff"
            }
        }
    }
  return (
    <JumboCardQuick title={"Add New Deposit  Wallet"} noWrapper sx={{maxWidth: '100%', mb: 4}}>


    <List disablePadding sx={{ mb: 2 }}>

        <Formik
            enableReinitialize={true}
            validateOnChange={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(data, { setSubmitting,resetForm }) => {
                setSubmitting(true);
                handleSubmit(data, setSubmitting,resetForm);
            }}
        >

            {({ isSubmitting }) => (
                <Form style={{ textAlign: 'left' }} noValidate autoComplete='off'>
                        
                  <Grid container spacing={2} sx={{p:2}}>
                            <Grid item sm={6} sx={{ mt: 1,  pl: 2, pr: 2 }} >
                                <JumboTextField
                                onInput={(e)=>handleUpload(e)}
                                name='file'
                                type='file'
                                label='QR Image'
                                margin="normal"
                                InputProps={{endAdornment: 
                                    <CameraAltIcon fontSize={"small"} color={"success"}/>
                                }}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                        
                                />
                            </Grid>

                            <Grid item sm={6} sx={{ mt: 3,  pl: 2, pr: 2 }} >
                                <JumboTextField
                                    fullWidth
                                    name={'coinname'}
                                    label={'coin name e.g BNB (BEP-20)'}
                                    type='text'
                                />
                            </Grid>

                            <Grid item sm={6} sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }} >
                                <JumboTextField
                                    fullWidth
                                    name={'walletmessage'}
                                    label={'warning message e.g: make sure to send the amount to bep20 network'}
                                    type='text'
                                />
                            </Grid>


                            <Grid item sm={6} sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }} >
                                <JumboTextField
                                    fullWidth
                                    name={'walletaddress'}
                                    label={'wallet address'}
                                    type='text'
                                />
                            </Grid>

                  </Grid>

                    <Div sx={{ mt: 1, pl: 2, pr: 2 }}>
                        <LoadingButton
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{ mb: 3 }}
                            loading={isSubmitting}
                        >Update</LoadingButton>
                    </Div>



                </Form>
            )}
        </Formik>

    </List>
</JumboCardQuick>
  )
}

export default AddDepositWallet