import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import { deletenews, getnews} from 'backendServices/ApiCalls';
import { Grid } from "@mui/material";
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import DeleteIcon from '@mui/icons-material/Delete';


const Managenews = () => {
    const [manageallnews, setManageAllNews] = useState([]);

    const [alertData, setalertData] = useState({
        show: false,
        message: "",
        variant: ""
    })

    const GetallNews = () => {

        getnews((response) => {
            const processedData = response?.data?.data.map((row, index) => ({
                ...row,
                index: index + 1,
            }));
            setManageAllNews(processedData);
            if (response?.data?.data?.status === "success") {
                console.log("response get Successfully");
            }
        }, (error) => {
            console.log(error?.response?.data);
        })
    }

    useEffect(() => {
        GetallNews();
    }, [])
    const rowsWithIndex = manageallnews?.map((row) => ({ ...row, id: row.id }));


    const columns = [
            
        {
            field: "index",
            headerName: "#",
            width: 80,
        },
        {
            field: "title",
            headerName: "News Title",
            width: 200,
            editable: true,

        },
        {
            field: "description",
            headerName: "News Description",
            width: 400,
            editable: true,
            groupable: false,
        },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 200,
            renderCell: (params) => (
                <DeleteIcon
                    onClick={() => handleDelete(params.row.id)}
                    style={{ cursor: 'pointer', color: "red" }}
                />
            ),
        },

    ]

    // import Swal from 'sweetalert2'; // Import SweetAlert library

    // const handleDelete = (id) => {
    //   Swal.fire({
    //     title: 'Are you sure?',
    //     text: 'This action cannot be undone.',
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonText: 'Yes, delete it!',
    //     cancelButtonText: 'Cancel',
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       deletenews({ id }, (response) => {
    //         if (response?.data?.status === 'success') {
    //           setManageAllNews((prevData) => prevData.filter((row) => row.id !== id));
    //           Swal.fire('Deleted!', 'Data has been deleted successfully.', 'success');
    //         }
    //       }, (error) => {
    //         Swal.fire('Error', 'Failed to delete data.', 'error');
    //         console.log(error);
    //       });
    //     }
    //   });
    // };
    
    const handleDelete = (id) => {
        let params = { id: id }
        deletenews(params, (response) => {
            if (response?.data?.status === "error") {
                setalertData({
                    show: true,
                    message: response?.data?.message,
                    variant: "error"
                })
            }
            else if (response?.data?.status === "success") {
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
            console.log(error?.response?.data);
        });
        setManageAllNews((data) => data.filter((row) => row.id !== id));
    }


    const gridDesign = {
        '& .MuiDataGrid-toolbarContainer': {
            '& .MuiButton-text': {
                fontSize: '13px !important',
                color: '#fff',
            },
            '& .MuiBadge-badge': {
                backgroundColor: '#074682',
            },
            '& .MuiInput-root': {
                borderRadius: 2,
                paddingLeft: 2,
                overflow: 'hidden',
            },

        }
    }

    return (
        <Grid container fullWidth sm={12} xs={12} p={2} alignItems="center" justifyContent="center">
            <Grid item sm={12} xs={12}>
                <JumboDemoCard
                    title={'Manage All News'}
                    wrapperSx={{ backgroundColor: 'background.paper', pt: 0 }}
                >
                    {
                        alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
                    }
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

                    <Box sx={{ height: 500, width: 1 }}>
                        <DataGrid
                            initialState={{
                                pagination: { paginationModel: { pageSize: 6 } },
                            }}
                            rows={manageallnews}

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
                </JumboDemoCard>
            </Grid></Grid>
    )
}

export default Managenews