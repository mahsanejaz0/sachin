import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { alpha, styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import Collapse from '@mui/material/Collapse';
import { useSpring, animated } from '@react-spring/web';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import PersonIcon from '@mui/icons-material/Person';
import { getHierarchyData } from 'backendServices/ApiCalls';

function MinusSquare(props: SvgIconProps) {
  return <GroupRemoveIcon />;
}

function PlusSquare(props: SvgIconProps) {
  return <GroupAddIcon />;
}

function CloseSquare(props: SvgIconProps) {
  return <PersonIcon />;
}

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: 'translate3d(20px,0,0)',
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const StyledTreeItem = styled((props: TreeItemProps) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

const TreeViewTeam = () => {

  
  const [userHierarchyData,setUserHierarchyData]=useState()
  const HierArchyData =()=>{
    getHierarchyData((response) => {
      console.log('tresss', response?.data?.data)
      setUserHierarchyData(response?.data?.data)
      }, (error) => {
          console.log(error?.response?.data);
      })
  }
  
  useEffect(()=>{
      HierArchyData();
  },[])
  

    // Parse the JSON data when it is available
    const hierarchyData = Array.isArray(userHierarchyData)
    ? userHierarchyData
    : [];


  const renderTreeItems = (data) => {
    return data.map((node) => (
      <StyledTreeItem key={node.id} nodeId={node.id.toString()} label={node.label}>
        {node.children && renderTreeItems(node.children)}
      </StyledTreeItem>
    ));
  };

  return (
    <JumboDemoCard
      title="Tree View"
      wrapperSx={{ backgroundColor: 'background.paper', pt: 0 }}
    >
      <Box sx={{ height: 400, width: 1 }}>
        <TreeView
          aria-label="customized"
          defaultExpanded={['1']}
          defaultCollapseIcon={<MinusSquare />}
          defaultExpandIcon={<PlusSquare />}
          defaultEndIcon={<CloseSquare />}
          sx={{ height:500, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
          {renderTreeItems(hierarchyData)}
        </TreeView>
      </Box>
    </JumboDemoCard>
  );
};

export default TreeViewTeam;
