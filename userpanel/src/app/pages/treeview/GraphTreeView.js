import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import JumboDemoCard from "@jumbo/components/JumboDemoCard/JumboDemoCard";
import TreeContainer from "./TreeContainer";

const GraphTreeView = () => {

  let json = {
    timestamp: "25/10/2022 12:00",
    name: "Colour",
    children: [
      {
        name: "Black",
      },
      {
        name: "Blue",
        children: [
          {
            name: "Aquamarine",
          },
          {
            name: "Cyan",
          },
          {
            name: "Navy",
          },
          {
            name: "Turquoise",
          },
        ],
      },
      {
        name: "Green",
      },
      {
        name: "Purple",
        children: [
          {
            name: "Indigo",
          },
          {
            name: "Violet",
          },
        ],
      },
      {
        name: "Red",
        children: [
          {
            name: "Crimson",
          },
          {
            name: "Maroon",
          },
          {
            name: "Scarlet",
          },
        ],
      },
      {
        name: "White",
      },
      {
        name: "Yellow",
      },
    ],
  };
  let height = window.innerHeight - 42;
  let width = window.innerWidth - 416;
  //const state = useSelector((state) => state);
  const [activeNode, setActiveNode] = useState(0)
  const [treeHeight, setTreeHeight] = useState(height)
  const [treeWidth, setTreeWidth] = useState(width)
  const buttonClickAction = () =>{
    setActiveNode(0) 
  }
  const resizeTree = () => { 
    const height = window.innerHeight - document.getElementById('header').offsetHeight - 16;
    const width =  window.innerWidth - 16;
    setTreeHeight(height)
    setTreeWidth(width)
  }

  window.onresize = resizeTree;

  return (
    <JumboDemoCard
      title="Tree View"
      showButton={true}
      buttonText="Reset Tree"
      handleButtonClick={buttonClickAction}
      wrapperSx={{ backgroundColor: "background.paper", pt: 0, overFlow:'scroll' }}
      sx={{overflow:'scroll'}}
    >
      <Box sx={{ height: 400, width: 1 }}>
        <header id="header"></header>
          <TreeContainer
            activeNode={activeNode}
            setActiveNode={setActiveNode}
            data={json}
            height={treeHeight}
            width={treeWidth}
          />
      </Box>
    </JumboDemoCard>
  );
};

export default GraphTreeView;
