import React, { useEffect } from 'react';
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import { CircularProgress, Grid, List} from "@mui/material";
import { useState } from 'react';
import { getsettingsdata, updatesettingdata } from 'backendServices/ApiCalls';
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import * as yup from "yup";
import { Form, Formik } from "formik";
import Div from '@jumbo/shared/Div/Div';
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import { LoadingButton } from '@mui/lab';

const validationSchema = yup.object({
  payout_fee: yup
    .number()
    .required('Widthdrawal fee is required'),
  min_payout: yup
    .number()
    .required('min payout is required')  
});

const Updatewithdrawal = () => {
  const [payoutdata, setPayoutData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertData, setalertData] = React.useState({
    show:false,
    message:"",
    variant:"" 
  })

  const fetchpayoutdata = () => {
    const params = {
      keynames: "'payout_fee', 'min_payout', 'payout_flat_fee'"
    };
    getsettingsdata(params,(response) => {
      console.log("response?.data?.data?.values", response?.data?.data?.values)
      setPayoutData(response?.data?.data?.values);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    });
  };
    

  useEffect(() => {
    fetchpayoutdata();
  }, []);

  const handleSubmit = (data, setSubmitting) => {
    const newData = {
      obj: {
        payout_fee: data.payout_fee,
        min_payout: data.min_payout,
        payout_flat_fee: data.payout_flat_fee,
      }
    };
    updatesettingdata(newData, (response) => {
 
      if (response?.data?.status === "error") {
        setalertData({
          show:true,
          message:response?.data?.message,
          variant:"error"
      }) 
        setSubmitting(false)

      } else if (response?.data?.status === "success") {
        setalertData({
          show:true,
          message:response?.data?.message,
          variant:"success"
      })
        setSubmitting(false);
      }
    }, (error) => {
      console.log(error?.response?.data);
    })
   };

  return (
    <Grid container fullWidth sm={12} xs={12} p={2} alignItems="center" justifyContent="center">
      <Grid item sm={6} xs={12}>
    <JumboCardQuick title={"Update Withdrawal"} noWrapper>
      {
          alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
      }
     {isLoading ? (
              <Div
              sx={{
                mt:"20%",
                ml:"45%",
                mb: "20%"
              }}
            >
              <CircularProgress />
            </Div>
      ):(
        <List disablePadding sx={{ mb: 2 }}>
          <Formik
            validateOnChange={true}
            initialValues={{
              payout_fee: payoutdata[0].keyvalue,
              min_payout: payoutdata[1].keyvalue,
              payout_flat_fee: payoutdata[2].keyvalue,
            }
          }
            validationSchema={validationSchema}
            onSubmit={(data, { setSubmitting }) => {
              console.log("formikformdata", data)
              setSubmitting(true);
              handleSubmit(data, setSubmitting);
            }}
          >
            {({ isSubmitting }) => (
              <Form style={{ textAlign: 'left' }} noValidate autoComplete='off'>
                <Div sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                  <JumboTextField
                    fullWidth
                    name="payout_fee"
                    label="WithDrawal Fee (%)"
                    type="text"
                  />
                </Div>

                <Div sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                  <JumboTextField
                    fullWidth
                    name="payout_flat_fee"
                    label="Flat Network Fee ($)"
                    type="text"
                  />
                </Div>

                <Div sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                  <JumboTextField
                    fullWidth
                    name="min_payout"
                    label="Min Withdrawal ($)"
                    type="text"
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
                  >
                    Submit
                  </LoadingButton>
                </Div>
              </Form>
            )}
          </Formik>
        </List>
      )}
    </JumboCardQuick>
    </Grid>
    </Grid>
  );
  
};

export default Updatewithdrawal;
