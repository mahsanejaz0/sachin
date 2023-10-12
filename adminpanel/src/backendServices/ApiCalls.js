import axios from "axios";

// const API_BASE_URL = "http://localhost:8000/admin/api";
const API_BASE_URL = "https://nodeapp.mytether.co/admin/api";

function updateAuthorizationHeader() {
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["authorization"] = "Bearer " + token;
}

//react admin routes

export function authUserData(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/userdata"}`, "")
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


export function getcontractsdata(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/getcontractsdata"}`, params)
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

export function uploadProduct(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/uploadproduct"}`, params)
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

// Get Manage all product
export function getproduct(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/getproduct"}`, "")
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

export function deleteproduct(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/deleteproduct", params)
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

// Update Product
export function updateproduct(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/updateproduct", params)
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

export function updatesettingdata(data, callback, errorCallback) {
  updateAuthorizationHeader();
  axios
    .post(`${API_BASE_URL}${"/updatesettingsdata"}`, data)
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

export function updatecontractsdata(data, callback, errorCallback) {
  updateAuthorizationHeader();
  axios
    .post(`${API_BASE_URL}${"/updatecontractsdata"}`, data)
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

export function dashboard(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/dashboard"}`, "")
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
// dashboard transactions
export function dashboardtransactions(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/lasttransactions"}`, "")
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
//donation summary
export function donationsummary(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/report"}`, "")
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


export function depositSummaryApi(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/depositsummary"}`, "")
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

export function levelBonusSummaryApi(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/levelbonussummary"}`, "")
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

//create user session
export function createusersession(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/createusersession"}`, params)
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

//payout summary

export function payoutsummary(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/payoutsummary"}`, "")
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

export function deployuser(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/deployuser"}`, params)
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
export function updatetransactionpassword(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/updatetransactionpassword"}`, params)
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

export function addnews(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/addnews"}`, params)
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

export function deploymanualpaymentuser(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/deploymanualpaymentuser"}`, params)
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

export function rejectmanualpaymentuser(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/rejectmanualpaymentuser"}`, params)
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

//Get Users List

export function getusers(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/getuserslist", params)
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

//get manual payments data

export function getmanualpayments(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/getmanualpayments", params)
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

//Delete Pending user

export function deleteuser(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/deleteuser", params)
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

//Create Admin

export function createadmin(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/makeadmin", params)
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

//Get Admins



export function getPayoutApi(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/payoutreport", params)
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

export function getadmins(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/getadminslist"}`, "")
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
// get getuserslist api

export function getuserslist(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/getuserslist"}`, "")
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


export function getuserssetting(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/getusers"}`, "")
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

// Get Manage all news

export function getnews(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/getnews"}`, "")
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

// Get KYC Pending

export function getkycreport(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/kycreport"}`, "")
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

// Get payout details update report

export function GetPayoutDetailsUpdateReport(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/payoutdetailsupdatereport"}`, "")
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

// Get payout details update report

export function SubScriptionReportApi(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/subscriptionreport"}`, "")
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

// affilate report

export function AffilateReportApi(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/affilatereport"}`, "")
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

// payout report

export function PayoutReportApi(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/payoutreport"}`, "")
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

// get users list

export function GetUsersListApi(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/getuserslist"}`, "")
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

// rank report

export function RankReportApi(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/rankreport"}`, "")
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

// pending payout

export function PendingPayoutApi(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/pendingpayout"}`, "")
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
//Remove  Mini Admin
export function removeadmin(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/removeadmin", params)
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
//approvesinglepayout
export function ApproveSinglePayoutApi(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/approvesinglepayout", params)
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
//approveall payout
export function ApproveAllPayoutApi(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/approveallpayout", "")
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

//approved payout
export function ApprovedPayoutApi(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/approvedpayout", "")
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

//updatepassword
export function UpdatepasswordApi(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/updatepassword", params)
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

//update transaction password
export function UpdatetransactionPasswordApi(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/updatetransactionpassword", params)
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

//update user password
export function UpdateUserPasswordApi(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/updateuserpassword", params)
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
//approvekyc
export function ApprovekycApi(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/approvekyc", params)
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
//approve payout update request
export function ApprovePayoutUpdateRequestApi(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/approvepayoutupdaterequest", params)
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
//rejectkyc
export function RejectkycApi(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/rejectkyc", params)
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
//reject payout update request
export function RejectPayoutUpdateRequestApi(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/rejectpayoutupdaterequest", params)
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
// delete news api

export function deletenews(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/deletenews", params)
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
// Update the User Balance

export function UpdateCurrentBalance(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/updatecurrentbalance", params)
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

//Update Sponsor
export function updatesponsor(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/updatesponsor", params)
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

export function registerUser(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/user/register", params)
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

export function authenticate(service, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL, service)
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

export function roidata(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/roidata"}`, "")
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

export function lasttransactions(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/lastweektransactions"}`, "")
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

export function referralusers(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/user/referralusers"}`, "")
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

export function investmentreport(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/user/depositsummary"}`, "")
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

export function referralbonusreport(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/report"}`, "")
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

export function unilevelbonusreport(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/report"}`, "")
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

export function faqdata(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/getfaqs"}`, "")
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

export function transaction(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/transaction", params)
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

export function invitation(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(API_BASE_URL + "/sendinvitationlink", params)
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

export function adminwallet(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/getadminwallet"}`, "")
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

export function getHierarchyData(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/gethierarchy"}`, "")
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

export function getBinaryTreeData(userrandomcode, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/getbinarytree"}`, {
      userrandomcode: userrandomcode,
    })
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

export function updateProfileData(formdata, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/updateprofiledata"}`, formdata)
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

export function verifyUserEmailManual(params, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/verifyuseremailmanual"}`, params)
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

export function updateProfilePicture(formdata, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/updateprofilepicture"}`, formdata)
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

export function updateProfilePassword(
  oldpassword,
  newpassword,
  callback,
  errorCallback
) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/updatepassword"}`, {
      oldpassword,
      newpassword,
    })
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

export function requestPasswordReset(email, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/forgetpassword"}`, {
      email,
    })
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

export function investandeearning(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/monthlyinvestandeearning"}`, "")
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

export function getnotifications(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/getnotifications"}`, "")
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

export function updatenotificationstatus(callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/updatenotificationstatus"}`, "")
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

//add new deposit wallet
export function postdepositwallet(params, callback, errorCallback) {
  updateAuthorizationHeader();
  axios
    .post(API_BASE_URL + "/postdepositwallet", params)
    .then((response) => {
      console.log(response);
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

// get unilevel bonus api
export function deletewallet(params, callback, errorCallback) {
  updateAuthorizationHeader();
  axios
    .post(`${API_BASE_URL}${"/deletewallet"}`, params)
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

export function getdepositwallets(params, callback, errorCallback) {
  updateAuthorizationHeader();
  axios
    .post(`${API_BASE_URL}${"/getdepositwallets"}`, params)
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

export function passwordReset(email, password, callback, errorCallback) {
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${"/resetpassword"}`, {
      email,
      password,
    })
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

export function validateEmailToken(token, email, callback, errorCallback) {
  updateAuthorizationHeader();
  axios
    .post(`${API_BASE_URL}${"/validateemailtoken"}`, {
      token,
      email,
    })
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

export function verifyemailaccount(token, email, callback, errorCallback) {
  updateAuthorizationHeader();
  axios
    .post(`${API_BASE_URL}${"/verifyemailaccount"}`, {
      token,
      email,
    })
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
export  function getdepositlist(params, callback, errorCallback) {
  updateAuthorizationHeader();
  axios.post(API_BASE_URL+'/getdepositlist', params)
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

export  function rejectpayment(params,callback, errorCallback) {
  axios.post(`${API_BASE_URL}/${'rejectdeposit'}`, params
  , {
      headers : {
        'AUTHORIZATION' : 'Bearer '+localStorage.getItem('token')
      }
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


export  function payoutSummaryApi(params, callback, errorCallback) {
  updateAuthorizationHeader();
  axios.post(API_BASE_URL+'/payoutsummary', params)
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
  updateAuthorizationHeader();

  axios
    .post(`${API_BASE_URL}${url}`, params)
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
