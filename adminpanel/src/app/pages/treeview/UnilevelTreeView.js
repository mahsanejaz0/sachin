import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import TreeView from '@mui/lab/TreeView';
import { getHierarchyData, postRequest } from 'backendServices/ApiCalls';
import "./unileveltree.css";
import Div from '@jumbo/shared/Div/Div';
import { CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';



  const TreeNode = ({ data }) => (
    <ul>
      {data.map((item) => (
        <li key={item.id}>
          <img src={item.img} style={{ width: 80 }} />
          <br></br>
          <a href="#" className="targaryen">
            {item.title}
          </a>
          {item.children && <TreeNode data={item.children} />}
        </li>
      ))}
    </ul>
  );
  

const UnilevelTreeView = () => {


  const [userHierarchyData,setUserHierarchyData]=useState([])
  const [isLoading, setisLoading] = useState(true);
  const {randomcode} = useParams();

  const HierArchyData =()=>{
    setisLoading(true);
    let params ={
      randomcode
    }
    postRequest('/gethierarchy',params,(response) => {
        setisLoading(false);
      console.log('tresss', response?.data?.data)
      setUserHierarchyData(response?.data?.data)
      }, (error) => {
        setisLoading(false);
          console.log(error?.response?.data);
      })
  }
  
  useEffect(()=>{
      HierArchyData();
  },[])
  
  if (isLoading) {
    return (
      <Div
        sx={{
          display: "flex",
          minWidth: 0,
          alignItems: "center",
          alignContent: "center",
          height: "100%",
        }}
      >
        <CircularProgress sx={{ m: "-40px auto 0" }} />
      </Div>
    );
  }
  return (
    <JumboDemoCard
      title="Tree View"
      wrapperSx={{ backgroundColor: 'background.paper', pt: 0 }}
    >
      <div id="container">
        {userHierarchyData.map((data) => (
          <div className="tree" key={data.id}>
            <TreeNode data={[data]} />
          </div>
        ))}
      </div>

    </JumboDemoCard>
  );
};

export default UnilevelTreeView;
