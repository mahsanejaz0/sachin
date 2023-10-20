import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import { depositSummaryApi } from 'backendServices/ApiCalls';
import { CheckCircleOutline } from '@mui/icons-material';
import { Button, CircularProgress } from '@mui/material';
import Div from '@jumbo/shared/Div';

const VISIBLE_FIELDS = ['sr', 'sender', 'amount', 'final_amount', 'date'];
const DepositReport = () => {

  const [donationdata, setDonationData] = useState([])
  const [loader, setLoader] = useState(false)
  const DonationData = () => {
    setLoader(true)
    depositSummaryApi((response) => {
      if (response?.data?.status === "success") {
        setDonationData(response?.data?.data)
      }
      setLoader(false)
    }, (error) => {
      setLoader(false)
      console.log(error?.response?.data);
    })
  }

  useEffect(() => {
    DonationData();
  }, [])

  const initialState = {
    initialState: {
      columns: {
        columnVisibilityModel: {
          id: false,
          avatar: false,
          website: false,
          email: false,
          phone: false,
          username: false,
          city: false,
          company: false,
          position: false,
          lastUpdated: false,
          salary: false,
        }
      }
    }
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
  // Otherwise filter will be applied on fields such as the hidden column id
  const columns = [

    {
      field: "senderusername",
      headerName: "Username",
      dataGeneratorUniquenessEnabled: true,
      width: 200,
      editable: false,
      groupable: false,
      aggregable: false,
      aggregable: false,
      renderCell: (params) => {
        const senderUsername = params.row.senderusername;
        return <span>{senderUsername}</span>;
      }
    },
    {
      field: "amount",
      headerName: "Amount",
      dataGeneratorUniquenessEnabled: true,
      width: 100,
      editable: true,
      groupable: false,
      aggregable: false,
    },
    {
      field: "address",
      headerName: "Wallet Address",
      dataGeneratorUniquenessEnabled: true,
      width: 300,
      editable: true,
      groupable: false,
      aggregable: false,
    },
    {
      field: "coin",
      headerName: "Coin",
      dataGeneratorUniquenessEnabled: true,
      width: 150,
      editable: true,
      groupable: false,
      aggregable: false,
    },
    {
      field: "txid",
      headerName: "Transaction ID",
      dataGeneratorUniquenessEnabled: true,
      width: 250,
      editable: true,
      groupable: false,
      aggregable: false,
    },
    {
      field: "dat",
      headerName: "Date",
      dataGeneratorUniquenessEnabled: true,
      width: 200,
      editable: true,
      groupable: false,
      aggregable: false,
    }

  ]

  const rows = donationdata


  if (loader) {
    return <Div
      sx={{
        display: 'flex',
        minWidth: 0,
        alignItems: 'center',
        alignContent: 'center',
        height: '100%',
      }}
    >
      <CircularProgress sx={{ m: '-40px auto 0' }} />
    </Div>
  }

  return (
    <JumboDemoCard
      title={"Deposit Summary"}
      wrapperSx={{ backgroundColor: 'background.paper', pt: 0 }}
    >
      <Box sx={{ height: 1020, width: 1 }}>

        <DataGrid
          initialState={{
            initialState,
            pagination: { paginationModel: { pageSize: 24 } },
          }}
          rows={rows}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          sx={gridDesign}
          pageSizeOptions={[24, 48, 96]}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}

        />
      </Box>
    </JumboDemoCard>
  )
}

export default DepositReport