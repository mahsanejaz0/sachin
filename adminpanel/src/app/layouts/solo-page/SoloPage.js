import React from "react";
import JumboLayout from "@jumbo/components/JumboLayout";
import useJumboLayout from "@jumbo/hooks/useJumboLayout";
import layoutConfig from "./layoutConfig";

const SoloPage = ({children}) => {
    const {setJumboLayoutOptions} = useJumboLayout();

    React.useEffect(() => {
        setJumboLayoutOptions(layoutConfig);
        
    }, []);

    return (
        <JumboLayout
        header='<h1>Hello</h1>'
        sidebar=""
        footer=""
    >
        {children} 
    </JumboLayout>
    );
};

export default SoloPage;
