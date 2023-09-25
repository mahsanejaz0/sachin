import React from "react";
import routes from "./routes";
import useJumboRoutes from "@jumbo/hooks/useJumboRoutes";
import useJumboAuth from "@jumbo/hooks/useJumboAuth";

const AppRoutes = () => {
    const appRoutes = useJumboRoutes(routes);
    const {isLoading} = useJumboAuth();
    return (
        <React.Fragment>
            {
                isLoading ? "Loading" : appRoutes
            }
        </React.Fragment>
    );
};
export default AppRoutes;
