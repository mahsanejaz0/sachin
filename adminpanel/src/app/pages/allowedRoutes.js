import {useNavigate,useLocation} from "react-router-dom";

export default function AllowedRoutes(testarr) {
    const navigate = useNavigate();
    const location =  useLocation();
    const url = location.pathname;
  
const urlExistsInTestArr = testarr?.includes(url);
if (urlExistsInTestArr) {
  console.log("URL exists in testarr");
} else {
  console.log("URL does not exist in testarr");
  navigate('/404')
}
   
}


