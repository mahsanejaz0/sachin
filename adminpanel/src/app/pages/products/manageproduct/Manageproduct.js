import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import JumboDemoCard from "@jumbo/components/JumboDemoCard/JumboDemoCard";
import { deleteproduct, getproduct } from "backendServices/ApiCalls";
import { updateproduct } from "backendServices/ApiCalls";
import { Button, CircularProgress, Grid, List, TextField } from "@mui/material";
import SweetAlert from "app/pages/components/mui/Alerts/SweetAlert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";
import Div from "@jumbo/shared/Div";
import { Form, Formik } from "formik";
import * as yup from "yup";
import JumboTextField from "@jumbo/components/JumboFormik/JumboTextField";
import { LoadingButton } from "@mui/lab";
import Typography from "@mui/material/Typography";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { Link } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  price: yup.number().integer().required("Price is required"),
  image: yup.string().required("Price is required"),
});

const Manageproduct = () => {
  const [image, setImage] = useState(null);
  const [imageurl, setImageUrl] = useState(null);
  const [manageallproduct, setManageAllProduct] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = useState(null);
  const [alertData, setalertData] = useState({
    show: false,
    message: "",
    variant: "",
  });

  
  const GetallProduct = () => {
    getproduct(
      (response) => {
        setManageAllProduct(response?.data?.data);
        setImageUrl(response?.data?.imageURL)
        if (response?.data?.data?.status === "success") {
          console.log("response get Successfully");
        }
      },
      (error) => {
        console.log(error?.response?.data);
      }
    );
  };


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

  const handleUpdate = (data, setSubmitting, resetForm) => {
    // Add an additional key-value pair to the data object
    const additionalData = {
      // Replace 'yourKey' with the actual key you want to add
      id: rowData.id,
    };

    // Merge the additionalData with the existing data object
    const newData = { ...data, ...additionalData, image };
    console.log("Image", image);
    updateproduct(
      newData,
      (response) => {
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
          setTimeout(() => {
          setSubmitting(false);
          }, 2000);
          GetallProduct();
        }
      },
      (error) => {
        console.log(error?.response?.data);
      }
    );
  };


  useEffect(() => {
    GetallProduct();
  }, []);

  const columns = [
    {
      field: "title",
      headerName: "Product Title",
      width: 300,
      editable: true,
    },
    {
      field: "price",
      headerName: "Price",
      width: 300,
      editable: true,
      groupable: false,
    },
    {
      field: "picture",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img
          src={`${imageurl}${params.row.picture}`} // Assuming your image URLs are constructed like this
          alt={`Product ${params.row.title}`}
          style={{ width: "50%", height: "auto" }}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 400,
      renderCell: (params) => (
        <>
          <Button
            onClick={() => handleOpen(params.row.id)} 
            style={{ color: "white", backgroundColor: '#009688' }}
            className="btn btn-secondary"
          >Revise</Button>
                          <Button
            style={{ marginLeft: '5px' }}
            onClick={() => handleDelete(params.row.id)}
            variant="contained" color="warning">
                    Take off the shelves
                </Button>
         
        </>
      ),
    },
  ];
  console.log(manageallproduct);
  const handleOpen = (id) => {
    const rowToEdit = manageallproduct.find((row) => row.id === id);
    setRowData(rowToEdit);
    console.log("IDDDDD", rowToEdit.id);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleDelete = (id) => {
    let params = { id: id };
    deleteproduct(
      params,
      (response) => {
        if (response?.data?.status === "error") {
          setalertData({
            show: true,
            message: response?.data?.message,
            variant: "error",
          });
        } else if (response?.data?.status === "success") {
          setalertData({
            show: true,
            message: response?.data?.message,
            variant: "success",
          });
        } else {
          setalertData({
            show: true,
            message: "Something went wrong please try again later",
            variant: "error",
          });
        }
      },
      (error) => {
        console.log(error?.response?.data);
      }
    );
    setManageAllProduct((data) => data.filter((row) => row.id !== id));
  };

  const gridDesign = {
    "& .MuiDataGrid-toolbarContainer": {
      "& .MuiButton-text": {
        fontSize: "13px !important",
        color: "#fff",
      },
      "& .MuiBadge-badge": {
        backgroundColor: "#074682",
      },
      "& .MuiInput-root": {
        borderRadius: 2,
        paddingLeft: 2,
        overflow: "hidden",
      },
    },
  };

  return (
    <Grid container fullWidth p={2} alignItems="center" justifyContent="center">
      <Grid item sm={12} xs={12}>
        <JumboDemoCard
          title={"Manage All Product"}
          wrapperSx={{ backgroundColor: "background.paper", pt: 0 }}
        >
          
          
          {alertData.show && (
            <SweetAlert alertData={alertData} setalertData={setalertData} />
          )}
          {/* {isLoading ? (
              <Div
              sx={{
                mt:"20%",
                ml:"45%",
                mb: "20%"
              }}
            >
              <CircularProgress />
            </Div>
          ):( */}

          <Box sx={{ height: 500, width: 1 }} textAlign='right'>
          <Link to="/addproduct">
                <Button variant="contained" sx={{ marginTop: '-50px'}} href="!#">
                        Add Product
                </Button>
          </Link>
          {({ isSubmitting }) => (
            <Div
              sx={{
                mt:"20%",
                ml:"45%",
                mb: "20%"
              }}
            >
              <CircularProgress />
            </Div>
              )}
            <DataGrid
              initialState={{
                pagination: { paginationModel: { pageSize: 6 } },
              }}
              rows={manageallproduct}
              getRowId={(row) => row.id}
              columns={columns}
              slots={{ toolbar: GridToolbar }}
              sx={gridDesign}
              pageSizeOptions={[6, 12, 18, 24, 30]}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
            />
          </Box>
          {/* )} */}
          {/* Update Product Modal */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Div sx={style}>
              <Typography id="modal-modal-title" variant="h3" component="h2">
                Update Product
              </Typography>
              <List disablePadding sx={{ mb: 2, mt: 5 }}>
                <Formik
                  validateOnChange={true}
                  initialValues={{
                    title: rowData?.title || "",
                    price: rowData?.price || "",
                    image: rowData?.image || "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(data, { setSubmitting, resetForm }) => {
                    setSubmitting(true);
                    handleUpdate(data, setSubmitting, resetForm);
                    handleClose();
                  }}
                >
                  {({ isSubmitting, setFieldValue }) => (
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
                          loading={isSubmitting}
                        >
                          Submit
                        </LoadingButton>
                      </Div>
                    </Form>
                  )}
                </Formik>
              </List>
            </Div>
          </Modal>
        </JumboDemoCard>
      </Grid>
    </Grid>
  );
};

export default Manageproduct;
