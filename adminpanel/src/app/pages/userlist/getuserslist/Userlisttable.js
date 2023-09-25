import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import { GetUsersListApi, SubScriptionReportApi } from 'backendServices/ApiCalls';
import { Grid } from "@mui/material";
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';

const Userlisttable = () => {
    const [getUsersList, setGetUsersList] = useState([]);

    const [alertData, setalertData] = useState({
        show: false,
        message: "",
        variant: ""
    })

    const GetUsersList = () => {

        GetUsersListApi((response) => {
            console.log("response", response)
            setGetUsersList(response?.data?.userdata);
            if (response?.data?.data?.status === "success") {
                console.log("response get Successfully");
            }
        }, (error) => {
            console.log(error?.response?.data);
        })
    }

    useEffect(() => {
        GetUsersList();
    }, [])
    const rowsWithIndex = getUsersList?.map((row, index) => ({ ...row, id: index + 1 }));


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

        },
       
        {
            field: "lastname",
            headerName: "Last Name",
            width: 200,
            editable: true,
            groupable: false,
        },
        // {
        //     field: "subscriptionid",
        //     headerName: "Subscription Id",
        //     width: 200,
        //     editable: true,
        //     groupable: false,
        // },
        {
            field: "email",
            headerName: "Email",
            width: 200,
            editable: true,
            groupable: false,
        },
        {
            field: "createdat",
            headerName: "CreatedAt",
            width: 200,
            editable: true,
            groupable: false,
        },
        // {
        //     field: "activatedAt",
        //     headerName: "ActivatedAt",
        //     width: 200,
        //     editable: true,
        //     groupable: false,

        // },
        {
            field: "mobile",
            headerName: "Mobile ",
            width: 200,
            editable: true,
            groupable: false,
        },
        {
            field: "bank_account_title",
            headerName: "Bank Account Title",
            width: 200,
            editable: true,
            groupable: false,
            valueGetter: (params) => {
                const { value } = params;
                return value ? value : "N/A";
            },
        },
        {
            field: "bank_account_iban",
            headerName: "Bank Account IBAN",
            width: 200,
            editable: true,
            groupable: false,
            valueGetter: (params) => {
                const { value } = params;
                return value ? value : "N/A";
            },
        },
        {
            field: 'bank_account_bic',
            headerName: 'Bank Account BIC',
            width: 200,
            valueGetter: (params) => {
                const { value } = params;
                return value ? value : "N/A";
            },
        },
        {
            field: 'bank_account_country',
            headerName: 'Bank Account Country',
            width: 200,
            valueGetter: (params) => {
                const { value } = params;
                return value ? value : "N/A";
            },
        },
        {
            field: 'wallet_address',
            headerName: 'Address',
            width: 200,
            valueGetter: (params) => {
                const { value } = params;
                return value ? value : "N/A";
            },
        },
        {
            field: 'subscription_status',
            headerName: 'Subscription Status',
            width: 200,
        },
        {
            field: 'loginstatus',
            headerName: ' Login Status',
            width: 200,
        },
        {
            field: 'rank_name',
            headerName: 'Current Rank',
            width: 200,
        },
        {
            field: 'life_time_rank_name',
            headerName: 'Life Time Rank',
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
                    title={'User List'}
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

export default Userlisttable