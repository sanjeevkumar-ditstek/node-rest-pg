import TABLE from "../utils/enum/table";
import { sequelize, DataTypes } from "../config/db";

const RoleModel = sequelize.define(
    "roles",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4(),
            primaryKey: true,
            comment: TABLE.ID
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: TABLE.ROLE.NAME
        }
    },
    {
        paranoid: true,
        comment: TABLE.ROLE.TABLE,
        timestamps: false
    }
);



export default RoleModel;
