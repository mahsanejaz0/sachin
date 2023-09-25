import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import { SubScriptionReportApi } from 'backendServices/ApiCalls';
import { Grid, TableCell } from "@mui/material";
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import EuroIcon from '@mui/icons-material/Euro';

const Subscriptionreport = () => {
    const [subScriptionReport, setSubScriptionReport] = useState([]);

    const [alertData, setalertData] = useState({
        show: false,
        message: "",
        variant: ""
    })

    const SubScriptionReport = () => {

        SubScriptionReportApi((response) => {
            setSubScriptionReport(response?.data?.data?.entries);
            if (response?.data?.data?.status === "success") {
                console.log("response get Successfully");
            }
        }, (error) => {
            console.log(error?.response?.data);
        })
    }

    useEffect(() => {
        SubScriptionReport();
    }, [])

    const rowsWithIndex = subScriptionReport?.map((row, index) => ({ ...row, id: index + 1 }));

    const columns = [
        {
            field: "index",
            headerName: "#",  
            width: 80,
            valueGetter: (params) => params.row.id,
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
            groupable: false,
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
            field: "pkg_name",
            headerName: "Package Name",
            width: 200,
            editable: true,
            groupable: false,
        },
        {
            field: "amount",
            headerName: "Amount",
            width: 200,
            editable: true,
            renderCell: (params) => {
                const { value } = params;
                return (
                    <TableCell>
                    €{value}
                    </TableCell>
                );
            },
        },
        {
            field: "activatedAt",
            headerName: "ActivatedAt",
            width: 215,
            editable: true,
            groupable: false,
            renderCell: (params) => {
                const { value } = params;
                const date = new Date(value * 1000); // Convert UNIX timestamp to milliseconds
                const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
                return (
                    <TableCell>
                        {new Intl.DateTimeFormat('default', options).format(date)}
                    </TableCell>
                );
            },
        },
        {
            field: "nextBillingAt",
            headerName: "Next BillingAt",
            width: 215,
            editable: true,
            groupable: false,
            renderCell: (params) => {
                const { value } = params;
                const date = new Date(value * 1000); // Convert UNIX timestamp to milliseconds
                const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
                return (
                    <TableCell>
                        {new Intl.DateTimeFormat('default', options).format(date)}
                    </TableCell>
                );
            },
        },
        {
            field: "status",
            headerName: "Status",
            width: 200,
            editable: true,
            groupable: false,
        },
        {
            field: 'sub_type',
            headerName: 'Priod',
            width: 200,
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
                    title={'Subscription Report'}
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
                            rows={rowsWithIndex}

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

export default Subscriptionreport