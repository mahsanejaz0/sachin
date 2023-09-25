import React from "react";
import Crypto from "app/pages/dashboard/Crypto/Crypto";
import Page from "@jumbo/shared/Page";
import ViewReferrals from "app/pages/referrals/viewreferrals";
import Investment from "app/pages/investment/investment";
import Signup from "app/pages/auth-pages/signup/signup";

import UserProfile from "app/pages/users/user-profile/UserProfile";
import UnilevelReport from "app/pages/reports/unilevel/UnilevelReport";
import ReferralBonusReport from "app/pages/reports/refferal/ReferralBonusReport";
import DepositReport from "app/pages/reports/deposit/DepositReport";
import Logout from "app/pages/auth-pages/logout/Logout";
import Payout from "app/pages/payout/payout";
import RoiReport from "app/pages/reports/roi/roi";
import ForgotPassword from "app/pages/auth-pages/forgot-password/ForgotPassword";
import ResetPassword from "app/pages/auth-pages/reset-password/ResetPassword";
import BinaryTree from "app/pages/treeview/BinaryTree";
import Test from "app/pages/Test";
import faq from "app/pages/faq/faq";
import NonDisclosure from "app/pages/nondisclosure/NonDisclosure";
import Login from "app/pages/auth-pages/login/Login";
import OrderHistory from "app/pages/Order/OrderHistory";
import BuyPackage from "app/pages/package/BuyPackage";
import PackageSummary from "app/pages/reports/package/PackageSummary";
import UnilevelTreeView from "app/pages/treeview/UnilevelTreeView";
import PayoutReports from "app/pages/reports/payout/PayoutReports";
import News from "app/news/news";
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
        path: "/buypackage",
        element: <Page component={BuyPackage} />
    },
    {
        path: "/deposit",
        element: <Page component={Investment} />
    },
    {
        path: "/package-summary",
        element: <Page component={PackageSummary} />
    },
    {
        path: "/referrals",
        element: <Page component={ViewReferrals} />
    },    
    {
        path: "/profile",
        element: <Page component={UserProfile} />
    },
    {
        path: "/unilevel-summary",
        element: <Page component={UnilevelReport} />
    },
    {
        path: "/referral-bonus",
        element: <Page component={ReferralBonusReport} />
    },
    {
        path: "/orderhistory",
        element: <Page component={OrderHistory} />
    },
    {
        path: "/deposit-summary",
        element: <Page component={DepositReport} />
    },
    {
        path: "/daily-income",
        element: <Page component={RoiReport} />
    },
    {
        path: "/treeview",
        element: <Page component={UnilevelTreeView} />
    },
    {
        path: "/binary-tree/:randomcode",
        element: <Page component={BinaryTree} />
    },
    {
        path: "/payout",
        element: <Page component={Payout} />
    },
    {
        path: "/payout-summary",
        element: <Page component={PayoutReports} />
    },
    {
        path: "/faq",
        element: <Page component={faq} />
    },
    {
        path: "/news",
        element: <Page component={News} />
    },
    {
        path: "/non-disclosure",
        element: <Page component={NonDisclosure}  />
    },
    {
        path: "/logout",
        element: <Page component={Logout} />
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
        path: "/test",
        element: <Page component={Test}  />
    },
    {
        path: "/signup/:referralid",
        element: <Page component={Signup}  />
    },
    {
        path: "/signup",
        element: <Page component={Signup}  />
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