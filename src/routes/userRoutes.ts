import proxy from "../service/appServiceProxy";
import routes from "./routes";
const userRoute = async (app) => {

	const user = routes.USERS;

	app.post(user.createUser, proxy.user.createUser);
	app.get(user.getUserProfile, proxy.user.getUserById);
	app.get(user.getInformation, proxy.user.getInformation);
	app.get(user.getUserById, proxy.user.getUserById);
	app.put(user.updateUserProfile, proxy.user.updateUser);
	app.put(user.changePassword, proxy.user.changePassword);
	app.put(user.updateUser, proxy.user.updateUser);
	app.delete(user.deleteUser, proxy.user.deleteUser);

};

export default userRoute;