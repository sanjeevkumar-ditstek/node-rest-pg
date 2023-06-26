import { Sequelize, DataTypes } from "sequelize";
import { DATABASE_URL } from "../env";
const sequelize = new Sequelize(DATABASE_URL, { logging: false });
sequelize
	.sync()
	.then(() => {
		console.log("Database connection established");
	})
	.catch((err) => {
		console.log(err);
	});
export { sequelize, Sequelize, DataTypes };
