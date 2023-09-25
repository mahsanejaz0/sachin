import React from "react";
import JumboCardQuick from "@jumbo/components/JumboCardQuick";
import { Grid, List, TextField } from "@mui/material";
import { useState } from "react";
import {  uploadProduct } from "backendServices/ApiCalls";
import SweetAlert from "app/pages/components/mui/Alerts/SweetAlert";
import * as yup from "yup";
import { Form, Formik } from "formik";
import Div from "@jumbo/shared/Div/Div";
import JumboTextField from "@jumbo/components/JumboFormik/JumboTextField";
import { LoadingButton } from "@mui/lab";
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  price: yup.number().required("Price is required"),
  image: yup.mixed().required("Image is required"),
});

const AddProduct = () => {
    const [image, setImage] = useState(null);

  const [alertData, setalertData] = useState({
    show: false,
    message: "",
    variant: "",
  });
  // const style = {
  //     "& .MuiOutlinedInput-root": {
  //         "&.Mui-focused fieldset": {
  //             borderColor: "#fff"
  //         }
  //     }
  // }

  
  const handleUpload = (e, field) => {

    if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];
        if (selectedFile.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Data = reader.result; // Extract base64 encoded string
                if (base64Data) {
                     setImage(base64Data)
                    console.log("Image loaded successfully!", base64Data);
                } else {
                    console.log("Error loading image.");
                }
            };
            reader.readAsDataURL(selectedFile); // Read the selected file as data URL
        } else {
            setalertData({
                show: true,
                message: 'Invalid file type. Please select an image file.',
                variant: 'error',
            });
        }
    }
};

  const handleSubmit = (data, setSubmitting, resetForm) => {

    const newData = { ...data, image };
    uploadProduct(
        newData,
      (response) => {
        console.log(response);
        if (response?.data?.status === "error") {
          setalertData({
            show: true,
            message: response?.data?.message,
            variant: "error",
          });
          setSubmitting(false);
        } else if (response?.data?.status === "success") {
          setalertData({
            show: true,
            message: response?.data?.message,
            variant: "success",
          });
          setSubmitting(false);
          resetForm(); // Reset the entire form
        } else {
          setalertData({
            show: true,
            message: "Something went wrong please try again later",
            variant: "error",
          });
          setSubmitting(false);
        }
      }, 
      (error) => {
        console.log(error?.response?.data);
      }
    );
  };

  return (
    <Grid
      container
      fullWidth
      sm={12}
      xs={12}
      p={2}
      alignItems="center"
      justifyContent="center"
    >
      <Grid item sm={6} xs={12}>
        <JumboCardQuick title={"Add Product"} noWrapper>
          {alertData.show && (
            <SweetAlert alertData={alertData} setalertData={setalertData} />
          )}

          <List disablePadding sx={{ mb: 2 }}>
            <Formik
              validateOnChange={true}
              initialValues={{
                title: "",
                price: "",
                image: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(data, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                handleSubmit(data, setSubmitting, resetForm);
              }}
            >
              {({ isSubmitting , setFieldValue}) => (
                <Form
                  style={{ textAlign: "left" }}
                  noValidate
                  autoComplete="off"
                >
                  <Div sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                    <JumboTextField
                      fullWidth
                      name="title"
                      label="Title"
                      type="text"
                    />
                  </Div>
                  <Div sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                    <JumboTextField
                      fullWidth
                      name="price"
                      label="Price"
                      type="number"
                    />
                  </Div>
                  <Div sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                    <TextField
                      onChange={(event) => {
                        handleUpload(event, "image");
                        setFieldValue(
                          "image",
                          event.currentTarget.files[0]
                        );
                      }}
                      required
                      name="image"
                      type="file"
                      margin="normal"
                      sx={{ marginBottom: "0px", width: "100%" }}
                      InputProps={{
                        endAdornment: (
                          <CameraAltIcon fontSize={"small"} color={"success"} />
                        ),
                      }}
                    />
                  </Div>
                  <Div sx={{ mt: 1, pl: 2, pr: 2 }}>
                    <LoadingButton
                      fullWidth
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{ mb: 3 }}
                      //loading={isSubmitting}
                    >
                      Submit
                    </LoadingButton>
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

export default AddProduct;
