import React from 'react'
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import {useTheme} from "@mui/material";

const SweetAlert = (props) => {
    const Swal = useSwalWrapper();
    const theme = useTheme();

    const Toast = Swal.mixin({
            toast: props.alertData.show,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            onOpen: toast => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
            onClose:
                props.setalertData({
                show:false,
                message:'',
                variant:''
               })
        
        });

        Toast.fire({
            icon: props.alertData.variant,
            title: props.alertData.message,
            background: theme.palette.background.paper,
        });

        return(
            
            <>
            </>
        )

}

export default SweetAlert