import {LAYOUT_CONTAINER_STYLES} from "@jumbo/utils/constants/layout";
import {mainTheme} from "../themes/main/dark";
import {headerTheme} from "../themes/header/dark";
import {sidebarTheme} from "../themes/sidebar/dark";
import {footerTheme} from "../themes/footer/dark";
import LAYOUT_NAMES from "../layouts/layouts";
import {createJumboTheme} from "@jumbo/utils";
import jwtAuthAxios from "../services/auth/jwtAuth";
import authServices from "app/services/auth-services";

const config = {

    defaultLayout: LAYOUT_NAMES.VERTICAL_DEFAULT,
    containerStyle: LAYOUT_CONTAINER_STYLES.FLUID,

    authSetting: {
        axiosObject: jwtAuthAxios,
        fallbackPath: "/login",
        getAuthUserService: authServices.getCurrentUser,
        redirectNotAuthenticatedPath: "/login"
    },

    theme: createJumboTheme(mainTheme, headerTheme, sidebarTheme, footerTheme),

};

export {config};
