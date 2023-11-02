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
import { buyContractApi, getContractsApi } from "backendServices/ApiCalls";
import { useContext } from "react";
import { CustomProvider } from "app/layouts/vertical-default/VerticalDefault";
import { useNavigate } from "react-router-dom";
const validationSchema = yup.object({
  selectedpkg: yup.mixed("select a package").required("package is required"),
  password: yup.string("Enter your password").required("Password is required"),
});
const BuyContract = () => {
  const navigate = useNavigate()
  const { loginUserData, loading, setloginUserData } = useContext(CustomProvider);
  const [contractData, setContractData] = React.useState([])
  const [isLoading, setisLoading] = useState(false);
  const [alertData, setalertData] = React.useState({
    show: false,
    message: "",
    variant: "",
  });

  const getContractFun = () => {
    setisLoading(true)
    getContractsApi((response) => {
      setContractData(response?.data?.data)
      setisLoading(false)
    }, (error) => {
      console.log(error?.response?.data);
      setisLoading(false)
    })
  }

  const onSubmitForm = (data, setSubmitting, resetForm) => {
    buyContractApi(data, (response) => {

      if (response?.data?.status === "error") {
        setalertData({
          show: true,
          message: response?.data?.message,
          variant: "error"
        })
        setSubmitting(false)
      } else if (response?.data?.status === "success") {
        setalertData({
          show: true,
          message: response?.data?.message,
          variant: "success"
        })
        navigate('/dashboard');
        setSubmitting(false)
        resetForm();
      }

    }, (error) => {
      console.log(error?.response?.data);
      setSubmitting(false)
    })
  }


  useEffect(() => {
    getContractFun()
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

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      {alertData.show && (
        <SweetAlert alertData={alertData} setalertData={setalertData} />
      )}

      <Grid item sm={5}>
        <JumboDemoCard
          title={"Buy Contract"}
          wrapperSx={{ backgroundColor: "background.paper", pt: 0 }}
        >

          <Formik
            enableReinitialize="true"
            validateOnChange={true}
            initialValues={{
              current_balance: loginUserData?.current_balance,
              selectedpkg: contractData[0]?.id,
              password: ""
            }}
            validationSchema={validationSchema}
            onSubmit={(data, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              onSubmitForm(data, setSubmitting, resetForm
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
                  <Grid item xs={12}>
                    <JumboTextField
                      fullWidth
                      name="current_balance"
                      label="Current Balance"
                      type="text"
                      disabled={true}
                    />
                  </Grid>
                  <Grid item xs={12} >
                    <InputLabel id="select-label">
                      Select Contract
                    </InputLabel>
                    <Select
                      labelId="select-label"
                      fullWidth
                      // value={contractData[0]?.id}
                      name="selectedpkg"
                      onChange={(event) => {
                        setisLoading(true);
                        const selectedValue = event.target.value;
                        const selectedOption = contractData?.find(
                          (option) => option?.id === selectedValue
                        );
                        if (selectedOption) {
                          // Update the 'selectedOption' field in Formik
                          setFieldValue("selectedpkg", selectedValue);
                          setisLoading(false);
                        }
                      }}
                    >
                      {contractData?.map((option) => (
                        <MenuItem
                          key={option?.id}
                          value={option?.id}
                        >
                          {`${option?.name} ($${option.amount})`}
                        </MenuItem>
                      ))}

                      {/* Add more options if needed */}
                    </Select>
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
                      Submit
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

export default BuyContract;
