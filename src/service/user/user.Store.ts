import IUSER from "../../utils/interface/IUser";
import UserModel from "../../models/user.Model";
import UserCompanyWarehouseModel from '../../models/user_company_warehouse.Model'
import AddressModel from "../../models/address.Model";
import RoleModel from "../../models/role.Model";
import CompanyModel from "../../models/company.Model";

export default class UserStore {
	public static OPERATION_UNSUCCESSFUL = class extends Error {
		constructor() {
			super("An error occured while processing the request.");
		}
	};

	/**
	 * creating new user and saving in Database
	 */
	async createUser(userInput): Promise<IUSER> {
		let savedUser;

		try {
			savedUser = await UserModel.create(userInput, {
				include: [UserCompanyWarehouseModel, AddressModel]
			});
		} catch (error) {
			console.log(error);
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
		}

		return savedUser.toJSON();
	}

	/**
	 * update user in Database
	 */

	async updateUser(userInput, addressInput): Promise<IUSER> {
		let userToReturn: any;

		try {

			let user = UserModel.update(userInput, { where: { id: userInput.id } });
			let address = AddressModel.update(addressInput, { where: { userId: userInput.id } });

			let result = await Promise.allSettled([user, address]);

			userToReturn = await this.getById(userInput.id);

		} catch (error) {
			console.log(error);
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
		}

		return userToReturn;
	}

	/**
	 *Get by email
	 */
	public async getByEmail(email: string): Promise<IUSER> {
		try {

			let user: any = await UserModel.findOne({ where: { email }, include: [RoleModel, UserCompanyWarehouseModel] });
			return user && user.toJSON();

		} catch (e) {
			console.log(e);
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
		}
	}


	/**
	 *Get by id
	 */
	public async getById(id: string): Promise<IUSER> {
		try {
			let user: any = await UserModel.findByPk(id, { raw: true });
			return user;
		} catch (e) {
			console.log(e);
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
		}
	}


	public async changePassword(id: string, new_password: string) {


		try {
			let result = await UserModel.update({ password: new_password }, { where: { id } });
		} catch (e) {
			console.log(e);
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
		}
	}

	public async getInformationById(userId: string) {
		let information;

		try {

			information = await UserModel.findOne({
				where: {
					id: userId
				},
				attributes: ['firstname', 'lastname', 'language'],
				include: [
					{
						model: RoleModel,
						attributes: ['name']
					},
					{
						model: UserCompanyWarehouseModel,
						attributes: ['companyId'],
						include: [{
							model: CompanyModel,
							attributes: ['logoPath', 'colorTheme']
						}]
					}
				]
			});

		} catch (e) {
			console.log(e);
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL())
		}

		return information;
	}

	public async deleteUserById(userId: string) {
		try {
			let data = await UserModel.destroy({
				where: {
					id: userId
				}
			});
		} catch (e) {
			console.log(e);
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
		}
	}

}
