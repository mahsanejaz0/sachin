import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import JumboDemoCard from '@jumbo/components/JumboDemoCard/JumboDemoCard';
import TreeView from '@mui/lab/TreeView';
import { getHierarchyData, postRequest } from 'backendServices/ApiCalls';
import "./unileveltree.css";
import Div from '@jumbo/shared/Div/Div';
import { CircularProgress } from '@mui/material';
import { Id } from 'react-flags-select';

const TreeArr = [
  {
    id: 1,
    title: "Seven Samurai",
    img: "https://clipart-library.com/images/kTKo7BB8c.png",
    children: [
      {
        id: 2,
        title: "Child 1",
        img: "https://clipart-library.com/images/kTKo7BB8c.png",

        children: [
          {
            id: 3,
            title: "Child 1.1",
            img: "https://clipart-library.com/images/kTKo7BB8c.png",

            children: [
              {
                id: 9,
                title: "heheh",
                img: "https://clipart-library.com/images/kTKo7BB8c.png",
              },
            ],
          },
        ],
      },
      {
        id: 4,
        title: "Child 1",
        img: "https://clipart-library.com/images/kTKo7BB8c.png",

        children: [
          {
            id: 5,
            title: "Child 1.1",
            img: "https://clipart-library.com/images/kTKo7BB8c.png",
          },
          {
            id: 6,
            title: "Child 1.1",
            img: "https://clipart-library.com/images/kTKo7BB8c.png",
          },
          {
            id: 7,
            title: "Child 1.1",
            img: "https://clipart-library.com/images/kTKo7BB8c.png",
          },

          {
            id: 8,
            title: "Child 1.1",
            img: "https://clipart-library.com/images/kTKo7BB8c.png",
          },
          {
            id: 9,
            title: "Child 1.1",
            img: "https://clipart-library.com/images/kTKo7BB8c.png",
          },
          {
            id: 10,
            title: "Child 1.1",
            img: "https://clipart-library.com/images/kTKo7BB8c.png",
          },
        ],
      },
      {
        id: 11,
        title: "Child 2",
        img: "https://clipart-library.com/images/kTKo7BB8c.png",

        children: [
          {
            id: 12,
            title: "Child 1.1",
            img: "https://clipart-library.com/images/kTKo7BB8c.png",
          },
          {
            id: 13,
            title: "Child 1.1",
            img: "https://clipart-library.com/images/kTKo7BB8c.png",
          },
          {
            id: 14,
            title: "Child 1.1",
            img: "https://clipart-library.com/images/kTKo7BB8c.png",
          },
        ],
      },
    ],
  },
];

const handleClick = (id) => {
  // alert(id)
}

const TreeNode = ({ data }) => (
  <ul>
    {data.map((item) => (
      <li key={item.id}>
        <img src={item.img} style={{ width: 50 }} />
        <br></br>
        <a onClick={() => handleClick(item.id)} href="#" className="targaryen">
          {item.title}
        </a>
        {item.children && <TreeNode data={item.children} />}
      </li>
    ))}
  </ul>
);


const UnilevelTreeView = () => {


  const [userHierarchyData, setUserHierarchyData] = useState([])
  const [isLoading, setisLoading] = useState(true);

  const HierArchyData = () => {
    setisLoading(true);
    postRequest('/gethierarchy', '', (response) => {
      setisLoading(false);
      console.log('tresss', response?.data?.data)
      setUserHierarchyData(response?.data?.data)
    }, (error) => {
      setisLoading(false);
      console.log(error?.response?.data);
    })
  }

  useEffect(() => {
    HierArchyData();
  }, [])

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
      wrapperSx={{ backgroundColor: 'background.paper', pt: 0, display: 'block', overflowX: 'scroll' }}
    >
      <div id="container" className="tree-container">
        {userHierarchyData?.map((data) => (
          <div className="tree" key={data.id}>
            <TreeNode data={[data]} />
          </div>
        ))}
      </div>

    </JumboDemoCard>
  );
};

export default UnilevelTreeView;
