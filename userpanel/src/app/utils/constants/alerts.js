import React from 'react'
import useSwalWrapper from "@jumbo/vendors/sweetalert2/hooks";

export default function Alerts() {
    
  const Swal = useSwalWrapper();
  const theme = useTheme();
  const sweetAlerts = variant => {
      const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          onOpen: toast => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
      });

      Toast.fire({
          icon: variant,
          title: error,
          background: theme.palette.background.paper,
      });
  };
  

  return (
    <div>
      
    </div>
  )
}
