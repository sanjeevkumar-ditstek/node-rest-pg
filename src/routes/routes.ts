// All routes will be prepened with "api/v1" in them

const BASE_URL = "/api/v1/"
const ROUTES = {
    USERS: {
        getUserProfile: BASE_URL + 'users/profile',
        getUserById: BASE_URL + 'users/:id',
        createUser: BASE_URL + 'users',
        updateUserProfile: BASE_URL + 'users/profile',
        changePassword: BASE_URL + 'users/password',
        updateUser: BASE_URL + 'users/:id',
        getInformation: BASE_URL + 'users/information',
        deleteUser: BASE_URL + 'users/:id'
    },
    AUTH: {
        login: BASE_URL + 'auth/login',
        refreshToken: BASE_URL + 'auth/refresh_token'
    }
}

export default ROUTES