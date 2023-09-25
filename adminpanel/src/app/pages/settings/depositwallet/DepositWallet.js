import React, { useEffect } from 'react';
import AddDepositWallet from './AddDepositWallet';
import ManageDepositWallet from './ManageDepositWallet.js';
import { useState } from 'react';
import { postdepositwallet,deletewallet, getdepositwallets} from 'backendServices/ApiCalls';
import SweetAlert from 'app/pages/components/mui/Alerts/SweetAlert';
import Swal from 'sweetalert2';
import AddTaskIcon from '@mui/icons-material/AddTask';
import * as yup from "yup";
const useSweetAlert = (PayoutData) => {
  const [alertData, setAlertData] = useState({
    show: false,
    message: '',
    variant: '',
    confirmFunction: null,
    action: '',
  });
  const handleReject = (id) => {

    return new Promise((resolve) => {
      let params = {
        tid: id,
      };

      deletewallet(
      params,
      (response) => {
        if (response?.data?.status === 'success') {
          Swal.fire({
            title: 'Wallet deleted',
            icon: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK',
          }).then(() => {
            setAlertData((prevAlertData) => ({
              ...prevAlertData,
              show: false,
            }));
          });
          PayoutData();
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
      const hasTextField = alertData.action === 'reject';
      Swal.fire({
        title: alertData.title,
        text: alertData.message,
        icon: alertData.variant,
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return new Promise(async (resolve) => {
              await alertData.confirmFunction();
              resolve();
            
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
    handleReject,
  };
};
const DepositWallet = () => {

  const [alertData, setalertData] = useState({
    show: false,
    message: "",
    variant: ""
})
const [image, setImage] = useState(null);
const [isloading, setIsLoading] = useState(true);
const [payoutdata,setPayoutData]=useState([])
const PayoutData =()=>{
    setIsLoading(true)
    let params = {
        keynames : "'depositwallet'"
    }
    getdepositwallets(params,(response) => {
    if(response?.data?.status === "success") {
        setIsLoading(false)
        setPayoutData(response?.data)
    }
    }, (error) => {
        setIsLoading(false)
        console.log(error?.response?.data); 
    })
}
   
useEffect(()=>{
    console.log('useeffect')
    PayoutData();
},[])

const initialValues = {
  walletaddress : '',
  walletmessage : '',
  coinname : '',
  file:null
}


const validationSchema = yup.object({
  walletaddress: yup
  .mixed()
  .required('Address  is required'),
  coinname: yup
  .mixed()
  .required('coin name is required'),
    walletmessage: yup
        .mixed()
        .required('Message  is required'),
});



const handleUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
       const selectedFile = e.target.files[0];
        if (selectedFile.type.startsWith("image/")) {
            setImage(selectedFile);
          } else {
            setalertData({
                show:true,
                message:'Invalid file type. Please select an image file.',
                variant:"error"
            })
          }
    }
}

const handleSubmit = (data, setSubmitting,resetForm) => {
  
    if (!image) {
      setalertData({
        show: true,
        message: 'Invalid file type. Please select an image file.',
        variant: 'error'
      });
      setSubmitting(false);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result; // Extract base64 encoded string
      const formData = new FormData();
      formData.append('image', base64Data);
      formData.append('walletaddress', data.walletaddress);
      formData.append('walletmessage', data.walletmessage);
      formData.append('coinname', data.coinname);
  
      postdepositwallet(formData, (response) => {
        setSubmitting(false);
        if (response?.data?.status === 'error') {
          setalertData({
            show: true,
            message: response?.data?.message,
            variant: 'error'
          });
        } else if (response?.data?.status === 'success') {

          setalertData({
            show: true,
            message: response?.data?.message,
            variant: 'success'
          });
          PayoutData()
          resetForm()
          // Additional logic after successful submission
        } else {
          setalertData({
            show: true,
            message: 'Something went wrong. Please try again later.',
            variant: 'error'
          });
        }
      }, (error) => {
        setSubmitting(false);
        setalertData({
          show: true,
          message: 'Something went wrong. Please try again.',
          variant: 'error'
        });
      });
    };
  
    reader.readAsDataURL(image);
  };
  
  const { showSweetAlert, handleReject } = useSweetAlert(PayoutData);

  const handleActionClick = (id,action) => {
    let title = '';
    let description = '';
    let confirmFunction = null;
    let variant = ''

    if (action === 'reject') {
      title = 'Delete Wallet';
      description = 'Are you sure you want to delete this wallet?';
      confirmFunction = () => handleReject(id);
      variant = 'error';
    }
  
    showSweetAlert(title, description, confirmFunction,variant,action);
  };

    return (
        <>
    {
        alertData.show && (<SweetAlert alertData={alertData} setalertData={setalertData} />)
    }
          <AddDepositWallet initialValues={initialValues} validationSchema={validationSchema} handleUpload={handleUpload} handleSubmit={handleSubmit} />
          
          <ManageDepositWallet isloading={isloading} payoutdata={payoutdata} handleActionClick={handleActionClick}/>
        </>
    );
};

export default DepositWallet;
