import React, { useState, useEffect } from "react";
import JumboDemoCard from "@jumbo/components/JumboDemoCard";
import Box from "@mui/material/Box";
import { CircularProgress, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { Form, Formik } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import SweetAlert from "app/pages/components/mui/Alerts/SweetAlert";
import * as yup from "yup";
import JumboTextField from "@jumbo/components/JumboFormik/JumboTextField";
import Div from "@jumbo/shared/Div/Div";
import { postRequest } from "backendServices/ApiCalls";
import { useContext } from "react";
import { CustomProvider } from "app/layouts/vertical-default/VerticalDefault";
import { useNavigate } from "react-router-dom";
const validationSchema = yup.object({
  selectedpkg: yup.mixed("select a package").required("package is required"),
  amount: yup.number("enter amount").required("amount is required"),
  password: yup.string("Enter your password").required("Password is required"),
});
const Payout = () => {
  const nav = useNavigate()
  const { loginUserData } = useContext(CustomProvider);
  const [packageData, setPackageData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [alertData, setalertData] = React.useState({
    show: false,
    message: "",
    variant: "",
  });

  const getPackages = () => {
    postRequest(
      "/getpackages",
      "",
      (response) => {
        setisLoading(true);
        setPackageData(response?.data?.data);
        setisLoading(false);
      },
      (error) => {
        console.log(error?.response?.data);
        setisLoading(false);
      }
    );
  };


  const onSubmitForm = (data,setSubmitting,resetForm) =>{
    postRequest(
        "/deployuser",
        data,
        (response) => {
            if(response?.data?.status === "success")
            {
                setSubmitting(false)
                setalertData({
                    show: true,
                    message: response?.data?.message,
                    variant: response?.data?.status
                  })
                  nav('/package-summary')
            }else{
                setSubmitting(false)
                setalertData({
                    show: true,
                    message: response?.data?.message,
                    variant: response?.data?.status
                  })
            }

        },
        (error) => {
          console.log(error?.response?.data);
          setSubmitting(false)

        }
      );
  }
  useEffect(() => {
    getPackages();
  }, []);
  


  if (isLoading) {
    return (
      <Div
        sx={{
          display: "flex",
          minWidth: 0,
          alignItems: "center",
          alignContent: "center",
          height: "100%",
        }}
      >
        <CircularProgress sx={{ m: "-40px auto 0" }} />
      </Div>
    );
  }

  let amountToPay,pkgAmount,feeText;
  pkgAmount = packageData[0].amount
  if(packageData[0].fee_type === "percentage") 
  {
  amountToPay = ((parseInt(packageData[0].fee)/100) * parseInt(pkgAmount)) + parseInt(pkgAmount)
  feeText = `${packageData[0].fee}% fee`
  }else{
  amountToPay = parseInt(packageData[0].fee) + parseInt(pkgAmount)
  feeText = `${packageData[0].fee}$ fee`

  }
  console.log('dddddddd', amountToPay)
  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      {alertData.show && (
        <SweetAlert alertData={alertData} setalertData={setalertData} />
      )}

      <Grid item sm={5}>
        <JumboDemoCard
          title={"BUy Package"}
          wrapperSx={{ backgroundColor: "background.paper", pt: 0 }}
        >

          <Formik
            enableReinitialize="true"
            validateOnChange={true}
            initialValues={{
              amount: amountToPay,
              selectedpkg: packageData[0].tid,
              password:""
            }}
            validationSchema={validationSchema}
            onSubmit={(data, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              onSubmitForm(data,setSubmitting,resetForm
              );
            }}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form style={{ textAlign: "left" }} noValidate autoComplete="off">
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                >
                  <Grid item xs={12} >
                    <InputLabel id="select-label">
                      Select Package
                    </InputLabel>
                    <Select
                      labelId="select-label"
                      fullWidth
                      name="selectedpkg"
                      value={packageData[0].tid}
                      onChange={(event) => {
                        setisLoading(true);
                        const selectedValue = event.target.value;
                        const selectedOption = packageData.find(
                          (option) => option.tid === selectedValue
                        );
                        if (selectedOption) {
                          // Update the 'selectedOption' field in Formik
                          setFieldValue("selectedpkg", selectedValue);
                          setFieldValue("amount", selectedOption.amount);
                          setisLoading(false);
                        }
                      }}
                    >
                      {packageData.map((option) => (
                        <MenuItem
                          key={option.tid}
                          value={option.tid}
                          disabled={option.tid > loginUserData.pkgid + 1}
                        >
                          {`${option.title} ($${option.amount})`}
                        </MenuItem>
                      ))}

                      {/* Add more options if needed */}
                    </Select>
                  </Grid>
                  <Grid item xs={12} >
                    <JumboTextField
                      fullWidth
                      name="amount"
                      label={`Amount to pay ( Including ${feeText} )`}
                      type="number"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <JumboTextField
                      fullWidth
                      name="password"
                      label="Enter Password"
                      type="password"
                    />
                  </Grid>

                  <Grid item xs={12}>
                  <LoadingButton
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ mb: 3 }}
                    loading={isSubmitting}
                  >
                    Submit Request
                  </LoadingButton>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </JumboDemoCard>
      </Grid>
    </Grid>
  );
};

export default Payout;
