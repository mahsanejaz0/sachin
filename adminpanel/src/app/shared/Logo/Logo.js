import React from 'react';
import Div from "@jumbo/shared/Div";
import Link from "@mui/material/Link";
import {ASSET_IMAGES} from "../../utils/constants/paths";


const Logo = ({mini, mode, sx}) => {
    return (
        <Div sx={{display: "inline-flex", ...sx}}>
            <Link href={'/dashboard'}>
                {
                    !mini ?
                        <img src={ mode === "light" ? `${ASSET_IMAGES}/logo.png` : `${ASSET_IMAGES}/logo-white.png`} style={{width:'150px'}} alt="Aura Coinex" />
                        :
                        <img src={mode === "light" ? `${ASSET_IMAGES}/logo-short.png` : `${ASSET_IMAGES}/logo-short-white.png`} style={{width:'150px'}} alt="Aura Coinex" />
                }
            </Link>
        </Div>
    );
};

Logo.defaultProps = {
    mode: "light"
};

export default Logo;
