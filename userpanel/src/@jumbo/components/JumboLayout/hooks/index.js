import React from "react";
import JumboLayoutContentContext from "../components/JumboLayoutContent/JumboLayoutContentContext";
import JumboLayoutFooterContext
    from "../components/JumboLayoutFooter/JumboLayoutFooterContext";
import JumboLayoutHeaderContext
    from "../components/JumboLayoutHeader/JumboLayoutHeaderContext";
import JumboLayoutRootContext from "../components/JumboLayoutRoot/JumboLayoutRootContext";
import JumboLayoutSidebarContext
    from "../components/JumboLayoutSidebar/JumboLayoutSidebarContext";
import JumboLayoutContext from "@jumbo/components/JumboLayout/JumboLayoutContext";

const useJumboLayoutContent = () => {
    return React.useContext(JumboLayoutContentContext);
};

const useJumboLayoutFooter = () => {
    return React.useContext(JumboLayoutFooterContext);
};

const useJumboLayoutHeader = () => {
    return React.useContext(JumboLayoutHeaderContext);
};

const useJumboLayoutRoot = () => {
    return React.useContext(JumboLayoutRootContext);
};

const useJumboLayoutSidebar = () => {
    return React.useContext(JumboLayoutSidebarContext);
};

const useJumboLayout = () => {
    return React.useContext(JumboLayoutContext);
}

export {
    useJumboLayoutFooter,
    useJumboLayoutContent,
    useJumboLayoutHeader,
    useJumboLayoutRoot,
    useJumboLayoutSidebar,
    useJumboLayout,
}