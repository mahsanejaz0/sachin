import jwtAuthAxios from "./auth/jwtAuth";

const authServices = {};

authServices.getCurrentUser = async () => {
    try{
        const response = await jwtAuthAxios.post("/userdata");
        return response.data
    } catch (e) {
        return {
            hasError: true,
            error: "Some error received from the api",
        };
    }
};

//loginCreds must be {email: "abc@example.com", password: "ABC123DEF"}
authServices.signIn = async (loginCreds) => {
    try {
        return await jwtAuthAxios.post('/login', loginCreds);
    } catch (e) {
        return e.response;
    }

};

export default authServices;