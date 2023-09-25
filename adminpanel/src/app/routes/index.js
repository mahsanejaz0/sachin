import React from "react";
import Crypto from "app/pages/dashboard/Crypto/Crypto";
import Page from "@jumbo/shared/Page";
import Login from "app/pages/auth-pages/login/Login";
import UserProfile from "app/pages/users/user-profile/UserProfile";
import UnilevelReport from "app/pages/reports/unilevel/UnilevelReport";
import ReferralBonusReport from "app/pages/reports/refferal/ReferralBonusReport";
import Logout from "app/pages/auth-pages/logout/Logout";
import RoiReport from "app/pages/reports/roi/roi";
import ForgotPassword from "app/pages/auth-pages/forgot-password/ForgotPassword";
import ResetPassword from "app/pages/auth-pages/reset-password/ResetPassword";
import Test from "app/pages/Test";
import faq from "app/pages/faq/faq";
import PaymentMethod from "app/pages/paymentmethod/method";
import Active from "app/pages/users/active";
import Inactive from "app/pages/users/inactive";
import CreateAdmin from "app/pages/mini-admin/create/createadmin";
import ManageAdmin from "app/pages/mini-admin/manage/manageadmin";
import Error404 from "app/pages/Error404/Error404";
import UpdateSponsor from "app/pages/updatesponsor/updatesponsor";
import ManualPayments from "app/pages/payments/manualPayments";
import ApprovedManualPayments from "app/pages/payments/approvedManualPayments";
import RejectedManualPayments from "app/pages/payments/rejectedManualPayments";
import Updatewithdrawal from "app/pages/settings/updatewithdrawal/Updatewithdrawal";
import Managezoom from "app/pages/settings/managezoom/Managezoom";
import Managecommission from "app/pages/settings/managecommission/Managecommission";
import Manageunilevelbonus from "app/pages/settings/manageunilevelbonus/Manageunilevelbonus";
import Managetransactionpassword from "app/pages/managetransactionpassword/Managetransactionpassword";
import Addnews from "app/pages/news/addnews/Addnews";
import Managenews from "app/pages/news/managenews/Managenews";
import Updateuserbalance from "app/pages/updateuserbalance/Updateuserbalance";
import ListofAlluser from "app/pages/userlist/listofalluser/ListofAlluser";
import Updateuserlist from "app/pages/userlist/updateuserlist/Updateuserlist";
import KYCPending from "app/pages/kycreports/pending/KYCPending";
import Approvedkyc from "app/pages/kycreports/approved/Approvedkyc";
import Rejected from "app/pages/kycreports/rejected/Rejectedkyc";
import Subscriptionreport from "app/pages/reports/subscriptionsreport/Subscriptionreport";
import Affiliatereport from "app/pages/reports/affiliatereport/Affiliatereport";
import Updateloginpassword from "app/pages/userlist/updateloginpassword/Updateloginpassword";
import Updatetransactionpassword from "app/pages/userlist/updatetransactionpassword/Updatetransactionpassword";
import Updateuserpassword from "app/pages/userlist/updateuserpassword/Updateuserpassword";
import Userlisttable from "app/pages/userlist/getuserslist/Userlisttable";
import Rankreport from "app/pages/reports/rankreport/Rankreport";
import AddProduct from "app/pages/products/addproduct/addproduct";
import Manageproduct from "app/pages/products/manageproduct/Manageproduct";
import DepositWallet from "app/pages/settings/depositwallet/DepositWallet";
import Packages from "app/pages/settings/packages/Packages";
import DepositReport from "../pages/reports/deposit/DepositReport";
import ApprovedDeposit from "app/pages/reports/deposit/ApprovedDeposit";
import PendingDeposit from "app/pages/reports/deposit/PendingDeposit";
import RejectedDeposit from "app/pages/reports/deposit/RejectedDeposit";
import UnilevelTreeView from "../pages/treeview/UnilevelTreeView";
import PendingPayout from "app/pages/reports/payout/PendingPayout";
import ApprovedPayout from "app/pages/reports/payout/ApprovedPayout";
import RejectedPayout from "app/pages/reports/payout/RejectedPayout";
/**
 routes which you want to make accessible to both authenticated and anonymous users
 **/
const routesForPublic = [



];

/**
 routes only accessible to authenticated users
 **/

const routesForAuthenticatedOnly = [
    {
        path: "/",
        element: <Page component={Crypto} />
    },
    {
        path: "/dashboard",
        element: <Page component={Crypto} />
    },
    {
        path: "/create-admin",
        element: <Page component={CreateAdmin} />
    }, 
    {
        path: "/manage-admin",
        element: <Page component={ManageAdmin} />
    },  
    {
        path: "/add-product",
        element: <Page component={AddProduct} />
    },  
    {
        path: "/manage-products",
        element: <Page component={Manageproduct} />
    },  
    {
        path: "/active-users",
        element: <Page component={Active} />
    },  
    {
        path: "/inactive-users",
        element: <Page component={Inactive} />
    },
    {
        path: "/change-sponsor",
        element: <Page component={UpdateSponsor} />
    },    
    {
        path: "/profile",
        element: <Page component={UserProfile} />
    },
    {
        path: "/unilevel-bonus",
        element: <Page component={UnilevelReport} />
    },
    {
        path: "/referral-bonus",
        element: <Page component={ReferralBonusReport} />
    },
    {
        path: "/payment-method",
        element: <Page component={PaymentMethod} />
    },
    {
        path: "/deposit-report",
        element: <Page component={DepositReport} />
    },
    {
        path: "/approved-deposits",
        element: <Page component={ApprovedDeposit} />
    }, 
    {
        path: "/rejected-deposits",
        element: <Page component={RejectedDeposit} />
    },    
    {
        path: "/pending-deposits",
        element: <Page component={PendingDeposit} />
    },
    {
        path: "/update-admin-wallet",
        element: <Page component={DepositWallet}  />
    },
    {
        path: "/pending-manual-payments",
        element: <Page component={ManualPayments} />
    },

    {
        path: "/approved-manual-payments",
        element: <Page component={ApprovedManualPayments} />
    },
    {
        path: "/rejected-manual-payments",
        element: <Page component={RejectedManualPayments} />
    },
    {
        path: "/roi-summary",
        element: <Page component={RoiReport} />
    },
    {
        path: "/treeview/:randomcode",
        element: <Page component={UnilevelTreeView} />
    },
    {
        path: "/faq",
        element: <Page component={faq} />
    },
    {
        path: "/logout",
        element: <Page component={Logout} />
    },
    {
        path: "/test",
        element: <Page component={Test}  />
    },
    {
        path: "/updatewithdrawal",
        element: <Page component={Updatewithdrawal}  />
    },
    {
        path: "/kycpending",
        element: <Page component={KYCPending}  />
    },
    {
        path: "/approvedkyc",
        element: <Page component={Approvedkyc}  />
    },
    {
        path: "/rejectedkyc",
        element: <Page component={Rejected}  />
    },
    {
        path: "/pending-payout",
        element: <Page component={PendingPayout}  />
    },
    {
        path: "/approved-payout",
        element: <Page component={ApprovedPayout}  />
    },
    {
        path: "/rejected-payout",
        element: <Page component={RejectedPayout}  />
    },
    {
        path: "/subscriptionreport",
        element: <Page component={Subscriptionreport}  />
    },
    {
        path: "/affiliatereport",
        element: <Page component={Affiliatereport}  />
    },

    {
        path: "/updateloginpassword",
        element: <Page component={Updateloginpassword}  />
    },
    {
        path: "/updatetransactionpassword",
        element: <Page component={Updatetransactionpassword}  />
    },
    {
        path: "/updateuserpassword",
        element: <Page component={Updateuserpassword}  />
    },

    {
        path: "/userlisttable",
        element: <Page component={Userlisttable}  />
    },
    {
        path: "/rankreport",
        element: <Page component={Rankreport}  />
    },
    {
        path: "/managezoom",
        element: <Page component={Managezoom}  />
    },
    {
        path: "/managecommission",
        element: <Page component={Managecommission}  />
    },
    {
        path: "/manage-packages",
        element: <Page component={Packages}  />
    },
    {
        path: "/manageunilevelbonus",
        element: <Page component={Manageunilevelbonus}  />
    },
    {
        path: "/managetransactionpassword",
        element: <Page component={Managetransactionpassword}  />
    },
    {
        path: "/addnews",
        element: <Page component={Addnews}  />
    },
    {
        path: "/managenews",
        element: <Page component={Managenews}  />
    },
    {
        path: "/updateuserbalance",
        element: <Page component={Updateuserbalance}  />
    },
    {
        path: "/listofAlluser",
        element: <Page component={ListofAlluser}  />
    },
    {
        path: "/updateuserlist",
        element: <Page component={Updateuserlist}  />
    },
    
    {
        path: "/404",
        element: <Page component={Error404}  />
    },
];

/**
 routes only accessible when user is anonymous
 **/
 const routesForNotAuthenticatedOnly = [
    {
        path: "/login",
        element: <Page component={Login}  />
    },
    {
        path: "/login/:token/:email",
        element: <Page component={Login}  />
    },
    
    {
        path: "/forget-password",
        element: <Page component={ForgotPassword}  />
    },
    {
        path: "/reset-password/:token/:email",
        element: <Page component={ResetPassword}  />
    },
 ];


const routes = [
    ...routesForPublic,
    ...routesForAuthenticatedOnly,
    ...routesForNotAuthenticatedOnly,
];

export {routes as default, routesForPublic, routesForNotAuthenticatedOnly, routesForAuthenticatedOnly};