import {alpha} from "@mui/material/styles";
import {darken} from "@mui/material";

export const sidebarTheme = {
    type: "light",
    palette: {
        primary: {
            main: '#173754',
            light: '#A67FFB',
            dark: '#173754',
            contrastText: '#FFF'
        },
        secondary: {
            main: '#E44A77',
            light: '#FF7EA6',
            dark: '#DF295E',
            contrastText: '#FFF'
        },
        error: {
            main: '#E73145',
            light: '#FF6A70',
            dark: '#AD001E',
            contrastText: '#FFF'
        },
        warning: {
            main: '#F39711',
            light: '#FFC84C',
            dark: '#BB6900',
            contrastText: '#FFF'
        },
        info: {
            main: '#2EB5C9',
            light: '#6FE7FC',
            dark: '#008598',
            contrastText: '#FFF'
        },
        success: {
            main: '#3BD2A2',
            light: '#78FFD3',
            dark: '#00A073',
            contrastText: '#FFF'
        },
        text: {
            primary: '#C5CDE6',
            secondary: '#8595A6',
            disabled: '#A2B2C3',
        },
        nav: {
            action: {
                active: '#FFFFFF',
                hover: '#FFFFFF',
            },
            background: {
                active: '#173754',
                hover: alpha('#FFFFFF', .15),
            },
            tick: {
                active: darken('#173754', .25),
                hover: alpha('#FFFFFF', .25),
            }
        },
        divider : '#DEE2E6',
        background: {
            paper: '#000435',
            default: '#000435',
        },
        action: {
            active: '#475259',
            hover: '#F5F7FA',
        },
    }
};