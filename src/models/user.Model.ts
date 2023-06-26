import { sequelize, DataTypes } from "../config/db";
import RoleModel from './role.Model';
import TABLE from "../utils/enum/table";

const UserModel = sequelize.define(
	"users",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
			comment: TABLE.ID,
		},
		firstname: {
			type: DataTypes.STRING(25),
			allowNull: false,
			comment: TABLE.USERS.FIRSTNAME
		},
		lastname: {
			type: DataTypes.STRING(25),
			comment: TABLE.USERS.LANGUAGE
		},
		email: {
			comment: TABLE.USERS.EMAIL,
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
			comment: TABLE.USERS.PASSWORD
		},
		language: {
			comment: TABLE.USERS.LANGUAGE,
			type: DataTypes.ENUM('english', 'dutch'),
		},
		roleId: {
			type: DataTypes.UUID,
			comment: TABLE.USERS.ROLE_ID
		},
		createdAt: {
			type: DataTypes.DATE,
			comment: TABLE.CREATED_AT
		},
		updatedAt: {
			type: DataTypes.DATE,
			comment: TABLE.UPDATED_AT
		},
		deletedAt: {
			type: DataTypes.DATE,
			comment: TABLE.DELETE_AT
		}
	},
	{
		paranoid: true,
		comment: TABLE.USERS.TABLE
	}
)

UserModel.belongsTo(RoleModel);
RoleModel.hasMany(UserModel);

export default UserModel;