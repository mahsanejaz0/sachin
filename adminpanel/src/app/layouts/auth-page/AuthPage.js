import React, {useEffect} from "react";
import JumboLayout from "@jumbo/components/JumboLayout";
import useJumboLayout from "@jumbo/hooks/useJumboLayout";
import layoutConfig from "./layoutConfig";

const AuthPage = ({children}) => {
    const {setJumboLayoutOptions} = useJumboLayout(layoutConfig);

    useEffect(() => {
        setJumboLayoutOptions(layoutConfig);
        setTimeout(() => {
        setJumboLayoutOptions(layoutConfig);
        }, 1);
    }, []);
    
    return (
        <JumboLayout>
            {children} 
        </JumboLayout>
    );
}
export default AuthPage;
