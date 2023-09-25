import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import { Grid, List,ListItem,ListItemText,TextField,Typography } from "@mui/material";
import {useDropzone} from "react-dropzone";
import { Form, Formik,Field  } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import * as yup from "yup";
import JumboTextField from '@jumbo/components/JumboFormik/JumboTextField';
import Div from '@jumbo/shared/Div/Div';
import JumboCardQuick from '@jumbo/components/JumboCardQuick/JumboCardQuick';
import DndWrapper from './DndWrapper';
import {CKEditor} from "ckeditor4-react";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { uploadProduct } from 'backendServices/ApiCalls';


const CKEditorField = ({ field, form, ...props }) => {
    const handleEditorChange = (event, editor) => {
      const data = editor.getData();
      form.setFieldValue(field.name, data);
    };
  
    return (
      <CKEditor
        onChange={handleEditorChange}
        data={field.value}
        {...props}
      />
    );
  };

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box',
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%',
};


  const validationSchema = yup.object({
    title: yup
        .string('Enter product title')
        .required('product title is required'),
    price: yup
        .number('Enter price in numbers')
        .required('price is required'),
       
  });

const AddProduct = () => {
  const [productPicture, setproductPicture] = useState(null);
    const [files, setFiles] = React.useState([]);
    // const {getRootProps, getInputProps} = useDropzone({
    //     accept: 'image/*',
    //     onDrop: acceptedFiles => {
    //         setFiles(
    //             acceptedFiles.map(file =>
    //                 Object.assign(file, {
    //                     preview: URL.createObjectURL(file),
    //                 }),
    //             ),
    //         );
    //     },
    // });

    const handleUpload = (e) => {

      if (e.target.files && e.target.files.length > 0) {
          const selectedFile = e.target.files[0];
          if (selectedFile.type.startsWith("image/")) {
              const reader = new FileReader();
              reader.onloadend = () => {
                  const base64Data = reader.result; // Extract base64 encoded string
                  if (base64Data) {
                    setproductPicture(base64Data)
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

    // const thumbs = files.map(file => (
    //     <div style={thumb} key={file.name}>
    //         <div style={thumbInner}>
    //             <img src={file.preview} style={img} alt=""/>
    //         </div>
    //     </div>
    // ));

    React.useEffect(
        () => () => {
            files.forEach(file => URL.revokeObjectURL(file.preview));
        },
        [files],
    );

  const [alertData, setalertData] = React.useState({
    show: false,
    message: "",
    variant: ""
  })


  const handleSubmit = (data, setSubmitting, resetForm) => {
    const formData = new FormData()
    formData.append('title', data.title);
    formData.append('price', data.price);

    if (!productPicture) {
      setalertData({
          show: true,
          message: 'Invalid file type. Please select an image file.',
          variant: 'error',
      });
      return; // Don't proceed with form submission
  } else {
      formData.append('productPicture', productPicture)
  }

    uploadProduct(formData, (response) => {

        if (response?.data?.status === "error") {
            setalertData({
                show: true,
                message: response?.data?.message,
                variant: "error"
            })
        }
        else if (response?.data?.status === "success") {
            setSubmitting(false);
            resetForm();
            setproductPicture(null)
            setalertData({
                show: true,
                message: response?.data?.message,
                variant: "success"
            })

        }
        else {
            setalertData({
                show: true,
                message: 'Something went wrong please try again later',
                variant: "error"
            })
        }
    }, (error) => {
        setSubmitting(false);
        setalertData({
            show: true,
            message: 'Something went wrong please try again',
            variant: "error"
        })
    });

}

  return (
    <Grid container fullWidth sm={12} xs={12} p={2} alignItems="center" justifyContent="center">
      <Grid item sm={12} xs={12}>
        <JumboCardQuick title={"Add Product"} noWrapper >
          {
            alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
          }

            <List disablePadding sx={{ mb: 2 }}>
              <Formik
                initialValues={{
                  title:'',
                  price:'',
                  
                }}
                validationSchema={validationSchema}
                onSubmit={(data, { setSubmitting, resetForm }) => {
                  setSubmitting(true);
                  handleSubmit(data, setSubmitting, resetForm);
                }}
              >

                {({ isSubmitting, setFieldValue }) => (
                  <Form style={{ textAlign: 'left' }} noValidate autoComplete='off'>


                    <Box sx={{ mt: 1, mb: 3, pl: 2, pr: 2 }}>
                      <Grid container spacing={2}>
                      <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="title"
                            label="Enter Product Title"
                            type="text"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <JumboTextField
                            fullWidth
                            name="price"
                            label="Enter Price"
                            type="number"
                          />
                        </Grid>
                        <Grid item xs={12}>
                                                    <ListItem sx={{ px: 0, pb: 0 }}>
                                                        <ListItemText
                                                            primary={
                                                                <>
                                                                    <label>Product Picture *</label>
                                                                    <TextField
                                                                        onChange={(event) => {
                                                                            handleUpload(event);
                                                                            setFieldValue('productpicture', event.currentTarget.files[0]);
                                                                        }}
                                                                        required
                                                                        name='productpicture'
                                                                        type='file'
                                                                        margin="normal"
                                                                        sx={{ marginBottom: "0px", width: '100%' }}
                                                                        InputProps={{
                                                                            endAdornment:
                                                                                <CameraAltIcon fontSize={"small"} color={"success"} />
                                                                        }}

                                                                    />
                                                                    <br />
                                                                    {productPicture && (
                                                                        <img src={productPicture} alt="ID Front Preview" style={{ maxWidth: '100px', marginTop: '10px' }} />
                                                                    )}
                                                                </>

                                                            }
                                                        />
                                                    </ListItem>


                          </Grid>
                        {/* <Grid item xs={12}>
                        Description
                        <Field name="content" component={CKEditorField} />
                          
                        </Grid>
                        <Grid item xs={12}>
                        <DndWrapper>
                            <div {...getRootProps({className: 'dropzone'})}>
                                <input {...getInputProps()} />
                                <Typography variant={"body1"}>Drag 'n' drop some files here, or click to select
                                    files</Typography>
                            </div>
                        </DndWrapper>
                        <aside style={thumbsContainer}>{thumbs}</aside>
                        </Grid> */}
                      </Grid>
                    </Box>



                    <Div sx={{ mt: 1, pl: 2, pr: 2 }}>
                      <LoadingButton
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{ mb: 3 }}
                        loading={isSubmitting}
                      >
                        Add Product
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








