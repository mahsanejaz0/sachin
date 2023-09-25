import mock from '../';

mock.onPost("/auth").reply(request => {
    // you need to implement a similar api on your server which takes login creds
    // through request.data and then you can authenticate and return the token
    return [1000, {
        token: "dummy-jwt-token",
        user: {
            email: "john.smith@example.com",
            name: "John Smith",
            firstName: "John",
            lastName: "Smith"
        }
    }];
});

mock.onGet("/auth").reply(request => {
    // you can implement a similar api on your
    // server which returns the auth user info after authentication
    return [
        1000,
        {
            email: "demo@example.com",
            name: "John Smith",
            firstName: "John",
            lastName: "Smith"
        }
    ]
})