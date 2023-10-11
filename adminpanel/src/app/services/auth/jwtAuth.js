import jwtAxios from "axios";

const jwtAuthAxios = jwtAxios.create({
    baseURL: "http://localhost:8000/admin/api",
    // baseURL: "https://aura.threearrowstech.com/admin/api",
    headers: {
        'Content-Type': 'application/json'
    }
});

jwtAuthAxios.interceptors.response.use(
    res => res,
    err => {
        if(err.response && err.response.data.type === "token-invalid") {
            //todo logout the user
        }
        return Promise.reject(err);
    }
);


//todo: define interceptors and other configuration like baseURL, headers etc. here
export default jwtAuthAxios;