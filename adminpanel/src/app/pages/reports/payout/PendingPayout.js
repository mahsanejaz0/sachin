import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import { payoutSummaryApi, getpayoutlist, postRequest, rejectpayment } from 'backendServices/ApiCalls';
import { Chip, IconButton, Tooltip, Grid } from '@mui/material';
import Swal from 'sweetalert2';
import AddTaskIcon from '@mui/icons-material/AddTask';
import CancelIcon from '@mui/icons-material/Cancel';
import { FileCopy as FileCopyIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const VISIBLE_FIELDS = ['sr', 'receiverusername', 'amount', 'final_amount', 'payoutaccount1', 'payoutaccount2', 'createdat'];


const useSweetAlert = (UsersData) => {
  const [alertData, setAlertData] = useState({
    show: false,
    message: '',
    variant: '',
    confirmFunction: null,
    action: '',
  });

  const handleApprove = (id, amount) => {

    return new Promise((resolve) => {
      let params = {
        action: 'approved',
        tid: id,
        investmentamount: amount,
      };

      postRequest(
        '/payoutaction',
        params,
        (response) => {
          if (response?.data?.status === 'success') {
            Swal.fire({
              title: 'payout Approved',
              text: 'payout approved successfully',
              icon: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK',
            }).then(() => {
              setAlertData((prevAlertData) => ({
                ...prevAlertData,
                show: false,
              }));
            });
            UsersData();
            resolve()
          }
        },
        (error) => {
          console.log(error?.response?.data);
          resolve()
        }
      );
    })
  };

  const handleReject = (id, amount, reason) => {

    return new Promise((resolve) => {
      let params = {
        action: 'rejected',
        tid: id,
        reason: reason,
      };

      postRequest(
        '/payoutaction',
        params,
        (response) => {
          if (response?.data?.status === 'success') {
            Swal.fire({
              title: 'payout Rejected',
              text: 'with reason "' + reason + '"',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'OK',
            }).then(() => {
              setAlertData((prevAlertData) => ({
                ...prevAlertData,
                show: false,
              }));
            });
            UsersData();
            resolve()
          }
        },
        (error) => {
          console.log(error?.response?.data);
          resolve()
        }
      );
    })
  };

  const showSweetAlert = (title, description, confirmFunction, variant, action) => {
    setAlertData({
      show: true,
      message: description,
      variant: variant,
      confirmFunction: confirmFunction,
      action: action,
    });
  };

  useEffect(() => {
    if (alertData.show) {
      const hasTextField = alertData.action === 'rejected';
      Swal.fire({
        title: alertData.title,
        html: `<div>${alertData.message}</div>${hasTextField ? '<input type="text" id="reason-input" class="swal2-input" placeholder="Reason for rejection" required="">' : ''}`,
        text: alertData.message,
        icon: alertData.variant,
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return new Promise(async (resolve) => {
            if (hasTextField) {
              const reason = document.getElementById('reason-input').value;
              if (!reason) {
                Swal.showValidationMessage('Please enter a reason for rejection');
                resolve(false);
              } else {
                await alertData.confirmFunction(reason);
                resolve();
              }
            } else {
              await alertData.confirmFunction();
              resolve();
            }
          });
        },
        allowOutsideClick: () => !Swal.isLoading(),
        didOpen: () => {
          if (hasTextField) {
            const input = document.getElementById('reason-input');
            if (input) {
              input.focus();
            }
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // Handle the case when "Yes" is clicked
        } else {
          // Handle the case when "No" is clicked
        }
      });
    }
  }, [alertData]);

  return {
    showSweetAlert,
    handleApprove,
    handleReject,
  };
};

const PendingPayout = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [copiedRows, setCopiedRows] = useState([]);
  const [usersData, setUsersData] = useState([]);

  let params = {
    status: 'pending',
  };


  const UsersData = () => {
    payoutSummaryApi(params, (response) => {
      if (response?.data?.status === 'success') {
        setUsersData(response?.data?.data);
      }
    },
      (error) => {
        console.log(error?.response?.data);
      }
    );
  };

  useEffect(() => {
    UsersData();
  }, []);

  const generateRowId = () => {
    return `row-${Math.random().toString(36).substr(2, 9)}`;
  };


  const { showSweetAlert, handleApprove, handleReject } = useSweetAlert(UsersData);

  const handleActionClick = (id, amount, action) => {
    setSelectedUserId(id);
    let title = '';
    let description = '';
    let confirmFunction = null;
    let variant = ''

    if (action === 'approved') {
      title = 'Approve payout';
      description = `Are you sure you want to approve this payout of amount $${amount} ?`;
      confirmFunction = () => handleApprove(id, amount);
      variant = 'warning';
    } else if (action === 'rejected') {
      title = 'Reject payout';
      description = `Are you sure you want to reject this payout of amount $${amount} ?`;
      confirmFunction = (reason) => handleReject(id, amount, reason);
      variant = 'error';
    }

    showSweetAlert(title, description, confirmFunction, variant, action);
  };


  const rows = usersData;

  let idCounter = 1;

  const rowsWithId = rows.map((row) => ({
    ...row,
    id: idCounter++,
  }));

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
    },
  };



  return (
    <JumboDemoCard title={'Pending payouts'} wrapperSx={{ backgroundColor: 'background.paper', pt: 0 }}>

      <Box sx={{ height: 400, width: 1 }}>
        <DataGrid
          initialState={{
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
                },
              },
            },
            pagination: { paginationModel: { pageSize: 6 } },
          }}
          rows={rowsWithId}
          getRowId={(row) => generateRowId()}
          columns={[
            ...VISIBLE_FIELDS.map((field) => {
              if (field === 'sr') {
                return {
                  field,
                  headerName: 'Sr',
                  width: 150,
                  renderCell: (params) => <strong>{params.row.id}</strong>,
                };
              } else if (field === 'receiverusername') {
                return {
                  field,
                  headerName: 'Username',
                  width: 150,
                };
              } else if (field === 'payoutaccount1') {
                return {
                  field,
                  headerName: 'Payout Method',
                  width: 150,
                };
              } else if (field === 'amount') {
                return {
                  field,
                  headerName: 'Amount',
                  width: 150,
                  renderCell: (params) => <strong>{'$' + params.row.amount}</strong>,

                };
              } else if (field === 'final_amount') {
                return {
                  field,
                  headerName: 'Final Amount',
                  width: 150,
                  renderCell: (params) => <strong>{'$' + params.row.final_amount}</strong>,

                };
              } else if (field === 'createdat') {
                return {
                  field,
                  headerName: 'Date',
                  width: 150,
                };
              }
              else if (field === 'payoutaccount2') {
                return {
                  field,
                  headerName: 'Payout Address',
                  width: 150,
                  renderCell: (params) => {
                    const isCopied = copiedRows.includes(params.row.id);

                    const handleCopyClick = () => {
                      navigator.clipboard.writeText(params.value)
                        .then(() => {
                          setCopiedRows((prevCopiedRows) => [...prevCopiedRows, params.row.id]);
                        })
                        .catch((error) => {
                          console.error('Copy failed:', error);
                        });
                    };

                    return (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {isCopied ? (
                          <CheckCircleIcon style={{ marginRight: '4px', color: 'green' }} />
                        ) : (
                          <Tooltip title="Copy Hash" placement="top">
                            <IconButton
                              onClick={handleCopyClick}
                              size="small"
                              style={{ marginRight: '4px' }}
                            >
                              <FileCopyIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <span>{params.value}</span>
                      </div>
                    );
                  },
                };
              }
              return {
                field,
                headerName: field,
                width: 150,
              };;
            }),
            {
              field: 'actions',
              headerName: 'Actions',
              width: 120,
              renderCell: (params) => (
                <>
                  <Tooltip title="Approve" placement="top">
                    <IconButton
                      onClick={() => handleActionClick(params.row.tid, params.row.amount, 'approved')}
                      sx={{ color: 'success.main' }}
                    >
                      <AddTaskIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reject" placement="top">
                    <IconButton
                      onClick={() => handleActionClick(params.row.tid, params.row.amount, 'rejected')}
                      sx={{ color: 'error.main' }}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                </>
              ),
            },
          ]}
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
    </JumboDemoCard>
  );
};

export default PendingPayout;
