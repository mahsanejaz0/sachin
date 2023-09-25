import React from 'react'
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";
import { useTheme } from '@emotion/react';

const Alerts = ({variant, errormessage}) => {
   
    const Swal = useSwalWrapper();
    const theme = useTheme();
    const sweetAlerts = (variant, errormessage) => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            onOpen: toast => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
        });
    
        Toast.fire({
            icon: variant,
            title: errormessage,
            background: theme.palette.background.paper,
        });
    
    };
    sweetAlerts(variant, errormessage)
  return (
    <div>Alerts</div>
  )
}

export default Alerts