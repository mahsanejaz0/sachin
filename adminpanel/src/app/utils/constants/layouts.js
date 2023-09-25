import AuthPage from "app/layouts/auth-page/AuthPage";
import VerticalDefault from "../../layouts/vertical-default/VerticalDefault";
import SoloPage from "app/layouts/solo-page/SoloPage";

const LAYOUT_NAMES = {
    VERTICAL_DEFAULT: "vertical-default",
    SOLO_PAGE: "solo-page",
    AUTH_PAGE: "auth-page",
};

const LAYOUTS = [
    {
        name: LAYOUT_NAMES.VERTICAL_DEFAULT,
        label: "Vertical Default",
        component: VerticalDefault,
    },
    {
        name: LAYOUT_NAMES.SOLO_PAGE,
        label: "Solo Page",
        component: SoloPage
    },
    {
        name: LAYOUT_NAMES.AUTH_PAGE,
        label: "Auth Page",
        component: AuthPage
    }
];

export {LAYOUTS, LAYOUT_NAMES};