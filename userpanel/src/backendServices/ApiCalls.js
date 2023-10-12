import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8000/user/api';
const API_BASE_URL = 'https://nodeapp.mytether.co/user/api';

function updateAuthorizationHeader() {
  const token = localStorage.getItem('token');
  axios.defaults.headers.common['authorization'] = 'Bearer ' + token;
}
export function registerUser(params, callback, errorCallback) {
  updateAuthorizationHeader()

  axios.post(API_BASE_URL + '/register', params)
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

//update withdrawal get api getsettingsdata

export function getsettingsdata(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/getsettingsdata"}`, params)
    .then((response) => {
      if (callback) {
        callback(response);
      }
    })
    .catch((error) => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

export function submitManualPayment(params, callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL + '/submitmanualpayment', params, {



  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

export function authenticate(service, callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL, service)
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

export function getproduct(callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post( API_BASE_URL+ '/getproduct',)
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

export function authUserData(callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL + '/userdata', {
  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}


export function roidata(callback, errorCallback) {
  updateAuthorizationHeader()

  axios.post(API_BASE_URL + '/roidata', {


  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}



export function lasttransactions(callback, errorCallback) {
  updateAuthorizationHeader()

  axios.post(API_BASE_URL + '/lastweektransactions', {


  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}


export function dashBoardApi(callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL + '/dashboard', {
  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}


export function referralusers(callback, errorCallback) {
  updateAuthorizationHeader()

  axios.post(API_BASE_URL + '/referralusers', {

  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}




export function referralbonusreport(callback, errorCallback) {
  updateAuthorizationHeader()

  axios.post(API_BASE_URL + '/referralbonussummary', {

  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}



export function userpayouts(callback, errorCallback) {
  updateAuthorizationHeader()

  axios.post(API_BASE_URL + '/userpayouts', {

  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}


export function unilevelbonusreport(callback, errorCallback) {
  updateAuthorizationHeader()

  axios.post(API_BASE_URL + '/unilevelbonussummary', {

  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

export function faqdata(callback, errorCallback) {
  updateAuthorizationHeader()

  axios.post(API_BASE_URL + '/getfaqs', {

  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}


export function transaction(params, callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL + '/transaction', params)
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

export function depositApi(params, callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL + '/deposit', params)
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

export function buyContractApi(params, callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL + '/buycontract', params)
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

export function getContractsApi(callback, errorCallback) {
  updateAuthorizationHeader()

  axios.post(API_BASE_URL + '/getcontracts', {

  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}


export function getDepositApi(callback, errorCallback) {
  updateAuthorizationHeader()

  axios.post(API_BASE_URL + '/depositreport', {

  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

export function payoutrequest(params, callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL + '/payoutrequest', params, {})
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}




export function submitnda(params, callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL + '/submitnda', params, {


  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

export function invitation(params, callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL + '/sendinvitationlink', params, {


  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

export function adminwallet(params,callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL + '/getadminwallet', params)
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}



export function deployuser(investmentamount, callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL + '/deployuser ',
    {
      investmentamount: investmentamount
    }
    , {

    })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}


export function getHierarchyData(callback, errorCallback) {
  updateAuthorizationHeader()

  axios.post(API_BASE_URL + '/gethierarchy ', {

  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

export function getBinaryTreeData(userrandomcode, callback, errorCallback) {
  axios.post(API_BASE_URL + '/getbinarytree', {
    userrandomcode: userrandomcode
  }, {

  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

export function updateProfileData(formdata,callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL + '/updateprofiledata', formdata)
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}


export function updateProfilePicture(formdata, callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL + '/updateprofilepicture', formdata)
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}


export function updateProfilePassword(oldpassword, newpassword, callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL + '/updatepassword',  {
    oldpassword,
    newpassword
  }, {

  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}


export function requestPasswordReset(email, callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL + '/forgetpassword', {
    email
  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

export function investandeearning(callback, errorCallback) {
  updateAuthorizationHeader()

  axios.post(API_BASE_URL + ' /monthlyinvestandeearning', {


  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

export function getnotifications(callback, errorCallback) {
  updateAuthorizationHeader()

  axios.post(API_BASE_URL + '/getnotifications', {


  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}



export function updatenotificationstatus(callback, errorCallback) {
  updateAuthorizationHeader()

  axios.post(API_BASE_URL + '/updatenotificationstatus', {


  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}



export function passwordReset(email, password, callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL + '/resetpassword', {
    email,
    password
  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}



export function validateEmailToken(token, email, callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL + '/validateemailtoken', {
    token,
    email
  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}



export function verifyemailaccount(token, email, callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL + '/verifyemailaccount',  {
    token,
    email
  })
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}





export  function getsingledepositwallet(params,callback, errorCallback) {
  updateAuthorizationHeader()

  axios.post(`${API_BASE_URL}/${'getsingledepositwallet'}`, params)
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}



export function postRequest(url, params, callback, errorCallback) {
  updateAuthorizationHeader()
  axios.post(API_BASE_URL + url, params)
    .then(response => {
      if (callback) {
        callback(response);
      }
    })
    .catch(error => {
      if (errorCallback) {
        errorCallback(error);
      }
    });
}



