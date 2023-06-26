import Joi from "joi";
import UserStore from "./user.Store";
import IUSER from "../../utils/interface/IUser";
import STATUS_CODES from "../../utils/enum/StatusCodesEnum";
import MessageEnum from "../../utils/enum/MessageEnum";
import * as IUserService from "./IUserService";
import bcrypt from "bcrypt";
import { Response, } from "express";
import CompanyStore from "../company/company.Store";
import WarehouseStore from "../warehouse/warehouse.Store";
import Regex from '../../utils/enum/regex';
import { sendPayloadError, SendResponse, toError } from "../../utils/functions/common.functions";

export default class UserService implements IUserService.IUserServiceAPI {
	private userStore = new UserStore();
	private companyStore = new CompanyStore();
	private warehouseStore = new WarehouseStore();

	constructor() {

	}

	/**
	 * Creating new user such as Admin,User or Super User
	 */
	public createUser = async (request: IUserService.IRegisterUserRequest, res: Response) => {

		const response: IUserService.IRegisterUserResponse = {
			status: STATUS_CODES.UNKNOWN_CODE,
		};


		const schema = Joi.object().keys({
			firstname: Joi.string().required(),
			lastname: Joi.string().optional(),
			email: Joi.string().pattern(new RegExp(Regex.EMAIL)).required(),
			password: Joi.string().pattern(new RegExp(Regex.PASSWORD)).required(),
			roleId: Joi.string().uuid().required(),
			companyId: Joi.string().uuid().required(),
			warehouseId: Joi.string().uuid().optional(),
			city: Joi.string().required(),
			province: Joi.string().required(),
			addressLine1: Joi.string().required(),
			addressLine2: Joi.string().optional(),
			postcode: Joi.string().required(),
			language: Joi.string().optional()
		});

		const params = schema.validate(request.body);

		if (params.error) {
			return sendPayloadError(params.error, res);
		}

		const {
			firstname, lastname, email, password, roleId, warehouseId, companyId,
			city, province, addressLine1, addressLine2, postcode, language
		} = params.value;

		// Check if email is already registered
		let existingUser: IUSER;

		try {

			existingUser = await this.userStore.getByEmail(email);

			//Error if email id is already exist
			if (existingUser && existingUser?.email) {
				response.status = STATUS_CODES.BAD_REQUEST;
				response.error = toError(MessageEnum.EMAIL_ALREADY_EXIST);
				return SendResponse(res, response);
			}
		} catch (e) {
			console.error(e);
			response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
			response.error = toError(e.message);
			return SendResponse(res, response);
		}

		let company = await this.companyStore.getById(companyId);
		if (!company) {
			response.status = STATUS_CODES.NOT_FOUND;
			response.error = toError(MessageEnum.COMPANY_NOT_FOUND);
			return SendResponse(res, response);
		}

		if (warehouseId) {
			let warehouse = await this.warehouseStore.getById(warehouseId);
			if (!warehouse) {
				response.status = STATUS_CODES.NOT_FOUND;
				response.error = toError(MessageEnum.WAREHOUSE_NOT_FOUND);
				return SendResponse(res, response);
			}
		}

		//Hashing password
		const hashPassword = await bcrypt.hash(password, 10);

		//Save the user to storage
		const user_attributes = {
			firstname,
			lastname,
			email: email.toLowerCase(),
			password: hashPassword,
			language,
			roleId,
			user_company_warehouse: {
				companyId,
				warehouseId,
			},
			addresses: {
				city,
				province,
				addressLine1,
				addressLine2,
				postcode,
				companyId,
				warehouseId
			}
		};

		let user: IUSER;

		try {
			user = await this.userStore.createUser(user_attributes);
		} catch (e) {
			response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
			response.error = toError(e.message);
			return SendResponse(res, response);

		}

		response.status = STATUS_CODES.OK;
		delete user.password;
		response.user = user;
		SendResponse(res, response);
	};


	public updateUser = async (req: IUserService.IUpdateUserRequest, res: Response) => {

		let body = req.body;
		let response: IUserService.IUpdateUserResponse = {
			status: STATUS_CODES.UNKNOWN_CODE
		};

		const schema = Joi.object().keys({
			firstname: Joi.string().optional(),
			lastname: Joi.string().optional(),
			email: Joi.string().pattern(new RegExp(Regex.EMAIL)).optional(),
			password: Joi.string().pattern(new RegExp(Regex.PASSWORD)).optional(),
			roleId: Joi.string().uuid().optional(),
			companyId: Joi.string().uuid().optional(),
			warehouseId: Joi.string().uuid().optional(),
			city: Joi.string().optional(),
			province: Joi.string().optional(),
			addressLine1: Joi.string().optional(),
			addressLine2: Joi.string().optional(),
			postcode: Joi.string().optional(),
			language: Joi.string().valid('english', 'dutch').optional()
		});

		const params = schema.validate(body);

		if (params.error) {
			return sendPayloadError(params.error, res);
		}

		const user_attributes: any = {
			id: req.params.id || req.user.id
		};

		body.firstname && (user_attributes.firstname = body.firstname);
		body.lastname && (user_attributes.lastname = body.lastname)
		body.email && (user_attributes.email = body.email);
		body.language && (user_attributes.language = body.language);

		const address_attributes: any = {};

		body.city && (address_attributes.city = body.city);
		body.province && (address_attributes.province = body.province);
		body.addressLine1 && (address_attributes.addressLine1 = body.addressLine1);
		body.addressLine2 && (address_attributes.addressLine2 = body.addressLine2);
		body.postcode && (address_attributes.postcode = body.postcode);


		// If user with id does not exists then send error
		if (!await this.userStore.getById(user_attributes.id)) {
			return SendResponse(res, { status: STATUS_CODES.NOT_FOUND, error: { message: MessageEnum.USER_NOT_FOUND } })
		}

		let user;

		try {
			user = await this.userStore.updateUser(user_attributes, address_attributes);
		} catch (e) {
			response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
			response.error = toError(e.message);
			return SendResponse(res, response);
		}

		user && delete user.password;
		response.user = user;
		response.status = STATUS_CODES.OK;

		SendResponse(res, response);
	}

	public changePassword = async (req: IUserService.IChangePasswordRequest, res: Response) => {

		const response: IUserService.IChangePasswordResponse = {
			status: STATUS_CODES.UNKNOWN_CODE,
		};

		const schema = Joi.object().keys({
			current_password: Joi.string().pattern(new RegExp(Regex.PASSWORD)).required(),
			new_password: Joi.string().pattern(new RegExp(Regex.PASSWORD)).required()
		});

		const params = schema.validate(req.body);

		if (params.error) {
			return sendPayloadError(params.error, res);
		}

		let { new_password, current_password } = params.value;

		if (new_password == current_password) {
			response.status = STATUS_CODES.BAD_REQUEST;
			response.message = MessageEnum.PASSWORD_IDENTICAL;
			return SendResponse(res, response);
		}

		try {
			let user = await this.userStore.getById(req.user.id);

			if (user && !await bcrypt.compare(current_password, user.password)) {
				response.status = STATUS_CODES.UNAUTHORIZED;
				response.error = toError(MessageEnum.INVALID_CREDENTIALS);
				return SendResponse(res, response);
			}

		} catch (error) {
			response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
			response.error = toError(error.message);
			return SendResponse(res, response);
		}


		let hashedPassword = await bcrypt.hash(new_password, 10);

		try {
			let result = await this.userStore.changePassword(req.user.id, hashedPassword);
		} catch (e) {
			response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
			response.error = toError(e.message);
			return SendResponse(res, response);
		}

		response.status = STATUS_CODES.OK;
		response.message = MessageEnum.PASSWORD_CHANGED;
		SendResponse(res, response);
	}

	/**
	 * Get user by Id
	 */
	public getUserById = async (request: IUserService.IGetUserRequest, res: Response) => {

		const response: IUserService.IGetUserResponse = {
			status: STATUS_CODES.UNKNOWN_CODE,
		};

		const schema = Joi.object().keys({
			id: Joi.string().uuid().required(),
		});

		// If this function is called from users/id then use id from params else use if from token 
		if (!request.params.id) request.params.id = request.user.id

		const params = schema.validate(request.params);

		if (params.error) {
			return sendPayloadError(params.error, res);
		}

		const { id } = params.value;

		let user: IUSER;
		try {
			user = await this.userStore.getById(id);

			if (!user) {
				response.status = STATUS_CODES.NOT_FOUND;
				response.error = toError(MessageEnum.USER_NOT_FOUND);
				return SendResponse(res, response);
			}

			delete user.password;
		} catch (e) {
			response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
			response.error = toError(e.message);
			return SendResponse(res, response);
		}

		response.status = STATUS_CODES.OK;
		response.user = user;
		SendResponse(res, response);
	};

	// Get information like user's name,role,companyLogo and colorTheme etc
	public getInformation = async (req: IUserService.IGetInformationRequest, res: Response) => {

		const response: IUserService.IGetInformationResponse = {
			status: STATUS_CODES.UNKNOWN_CODE
		}

		const userId = req.user.id;

		try {
			let data = await this.userStore.getInformationById(userId);
			response.status = STATUS_CODES.OK;
			response.information = {
				firstname: data.firstname,
				lastname: data.lastname,
				role: data.role.name,
				language: data.language,
				companyLogo: data.user_company_warehouse.company.logoPath,
				colorTheme: data.user_company_warehouse.company.colorTheme
			};
			SendResponse(res, response);
		} catch (e) {
			response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
			response.error = toError(e.message);
			SendResponse(res, response);
		}
	}

	public deleteUser = async (req: IUserService.IDeleteUserRequest, res: Response) => {

		const response: IUserService.IDeleteUserResponse = {
			status: STATUS_CODES.UNKNOWN_CODE
		}

		const schema = Joi.object().keys({
			id: Joi.string().uuid().required()
		});

		const params = schema.validate(req.params);

		if (params.error) {
			return sendPayloadError(params.error, res);
		}

		const userId = params.value.id;

		try {
			const data = await this.userStore.deleteUserById(userId);
			response.status = STATUS_CODES.OK;
			response.message = "User deleted successfully";
			SendResponse(res, response);
		} catch (e) {
			response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
			response.error = toError(e.message);
			SendResponse(res, response);
		}

	}

}
