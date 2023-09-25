import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import { ApprovekycApi, RejectkycApi, deletenews, getkycreport, getnews } from 'backendServices/ApiCalls';
import { Grid } from "@mui/material";
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import DeleteIcon from '@mui/icons-material/Delete';
import RecommendIcon from '@mui/icons-material/Recommend';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ImageIcon from '@mui/icons-material/Image';

const KYCPending = () => {
    const [kycpending, setKYCPending] = useState([]);

    const [alertData, setalertData] = useState({
        show: false,
        message: "",
        variant: ""
    })

    const Getkycpending = () => {

        getkycreport((response) => {
            const pendingData = response?.data?.data.filter(data => data.status !== "Approved" && data.status !== "Rejected");
            const data = pendingData?.map((row, index) => ({
                ...row,
                index: index + 1,
            }));
            setKYCPending(data);
            const getdatakyc = response?.data?.data.filter(data =>data.id_back? '' : "NAN")
            if (response?.data?.data?.status === "success") {
                console.log("response get Successfully");
            }
        }, (error) => {
            console.log(error?.response?.data);
        })
    }

    useEffect(() => {
        Getkycpending();
    }, [])

const handleImage = (id) => {
    const imageData = kycpending?.filter(data => data?.id === id);
    if (imageData) {
        const imageUrl = `http://localhost:8000/uploads/kyc/${imageData[0]?.id_front}`;
        window.open(imageUrl, '_blank');
    }
};

    const columns = [
        {
            field: "index",
            headerName: "#",
            width: 80,
        },
        {
            field: "username",
            headerName: "User Name",
            width: 200,
            editable: true,
            groupable: false,
        },
        {
            field: "firstname",
            headerName: "First Name",
            width: 200,
            editable: true,

        },
        {
            field: "lastname",
            headerName: "Last Name",
            width: 200,
            editable: true,
            groupable: false,
        },
        {
            field: "email",
            headerName: "Email",
            width: 200,
            editable: true,
            groupable: false,
        },
        {
            field: "address",
            headerName: "Address",
            width: 200,
            editable: true,
            groupable: false,
        },
        {
            field: "id_front",
            headerName: "ID Front",
            width: 200,
            editable: true,
            groupable: false,
            renderCell: (params) => (
                <ImageIcon
                    onClick={() => handleImage(params.row.id)}
                    style={{ cursor: 'pointer', color: "green" }}
                />
            ),
        },
        {
            field: "id_back",
            headerName: "ID Back",
            width: 200,
            editable: true,
            groupable: false,
            renderCell: (params) => (
                <span>
                    {params.row.id_back !== "" ? (
                        <ImageIcon
                            onClick={() => handleImage(params.row.id_back)}
                            style={{ cursor: 'pointer', color: "green" }}
                        />
                    ) : (
                        "NaN"
                    )}
                </span>
            ),
        },
        {
            field: "type",
            headerName: "Type",
            width: 200,
            editable: true,
            groupable: false,
        },
        {
            field: "date",
            headerName: "Date",
            width: 200,
            editable: true,
            groupable: false,
        },
        {
            field: "status",
            headerName: "Status",
            width: 200,
            editable: true,
            groupable: false,
        },
        {
            field: 'approved',
            headerName: 'Approved',
            width: 100,
            renderCell: (params) => (
                <RecommendIcon
                    onClick={() => handleApproved(params.row.id)}
                    style={{ cursor: 'pointer', color: "green" }}
                />
            ),
        },
        {
            field: 'rejected',
            headerName: 'Rejected',
            width: 100,
            renderCell: (params) => (
                <ThumbDownAltIcon
                    onClick={() => handleRejected(params.row.id)}
                    style={{ cursor: 'pointer', color: "red" }}
                />
            ),
        },
        // {
        //     field: 'delete',
        //     headerName: 'Delete',
        //     width: 200,
        //     renderCell: (params) => (
        //         <DeleteIcon
        //             onClick={() => handleDelete(params.row.id)}
        //             style={{ cursor: 'pointer', color: "red" }}
        //         />
        //     ),
        // },

    ]


    // const handleDelete = (id) => {
    //     let params = { id: id }
    //     deletenews(params, (response) => {
    //         if (response?.data?.status === "error") {
    //             setalertData({
    //                 show: true,
    //                 message: response?.data?.message,
    //                 variant: "error"
    //             })
    //         }
    //         else if (response?.data?.status === "success") {
    //             setalertData({
    //                 show: true,
    //                 message: response?.data?.message,
    //                 variant: "success"
    //             })
    //         }
    //         else {
    //             setalertData({
    //                 show: true,
    //                 message: 'Something went wrong please try again later',
    //                 variant: "error"
    //             })
    //         }
    //     }, (error) => {
    //         console.log(error?.response?.data);
    //     });
    //     setManageAllNews((data) => data.filter((row) => row.id !== id));
    // }ApprovekycApi

    const handleApproved = (id) => {
        console.log("hello", id);
        let params = { id: id }
        ApprovekycApi(params, (response) => {
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
                setKYCPending((data) => data.filter((row) => row.id !== id));
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
    }
    const handleRejected = (id) => {
        console.log("hello", id);
        let params = { id: id }
        RejectkycApi(params, (response) => {
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
                    title={'KYC Pending'}
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
                            rows={kycpending}

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

export default KYCPending