import proxy from "../service/appServiceProxy";
import routes from "./routes";

const authRoute = async (app) => {
    const auth = routes.AUTH;

    app.post(auth.login, proxy.auth.login);
    app.post(auth.refreshToken, proxy.auth.refreshToken);
};

export default authRoute;
