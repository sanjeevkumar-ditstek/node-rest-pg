import userRoute from "../routes/userRoutes";
import companyRoute from '../routes/companyRoutes';
import warehouseRoute from '../routes/warehouseRoutes';
import authRoute from '../routes/authRoutes';
import orderRoute from './orderRoutes';
import authenticate from "../utils/middlewares/authenticate";

const routes = async (app) => {
	authRoute(app);
	app.use(authenticate);
	userRoute(app);
	companyRoute(app);
	warehouseRoute(app);
	orderRoute(app);
};
export default routes;