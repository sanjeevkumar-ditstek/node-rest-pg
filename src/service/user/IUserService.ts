import IUSER from "../../utils/interface/IUser";
import { IResponse, IRequestUser } from "../../utils/interface/common";
import { Request, Response } from "express";

export interface IUserServiceAPI {
	createUser(request: IRegisterUserRequest, response: Response);
	getUserById(request: IGetUserRequest, response: Response);
	updateUser(req: IUpdateUserRequest, res: Response);
	changePassword(req: IChangePasswordRequest, res: Response);
	getInformation(req: IGetInformationRequest, res: Response);
	deleteUser(req: IDeleteUserRequest, res: Response);
}

interface IRegisterUserRequestBody {
	firstname: string
	lastname: string
	email: string
	password: string
	roleId: string
	city?: string
	province?: string
	addressline1?: string
	addressLine2?: string
	postcode?: string
	companyId?: string
	warehouseId?: string
	language?: string
}

/********************************************************************************
 *  Create user
 ********************************************************************************/
export interface IRegisterUserRequest extends Request {
	body: IRegisterUserRequestBody
	user: IRequestUser
}

export interface IRegisterUserResponse extends IResponse {
	user?: IUSER;
}


export interface IChangePasswordRequest extends Request {
	user?: IUSER,
	body: {
		current_password: string
		new_password: string
	}
}

export interface IChangePasswordResponse extends IResponse {

}


export interface IGetInformationRequest extends Request {
	user?: IUSER
}
export interface IGetInformationResponse extends IResponse {
	information?: {
		firstname: string
		lastname: string
		role: string
		language: string
		companyLogo?: string
		workFlow?: string
		colorTheme?: string
	}
}

interface IUpdateUserRequestBody {
	firstname?: string
	lastname?: string
	email?: string
	city?: string
	province?: string
	addressLine1?: string
	addressLine2?: string
	postcode?: string
	companyId?: string
	warehouseId?: string
	language?: string
}

export interface IUpdateUserRequest extends Request {
	body: IUpdateUserRequestBody
	user: IRequestUser
}

export interface IUpdateUserResponse extends IRegisterUserResponse {

}

interface LoginRequestBody {
	email: string;
	password: string;
}

export interface ILoginUserRequest extends Request {
	body: LoginRequestBody
}

export interface ILoginUserResponse extends IResponse {
	user?: IUSER;
	token?: string;
}

interface GetUserRequestBody {
	id: string;
}

export interface IGetUserRequest extends Request {
	body: GetUserRequestBody
	user: IRequestUser
}
export interface IGetUserResponse extends IResponse {
	user?: IUSER;
}

export interface IDeleteUserRequest extends Request {
	user?: IUSER
	params: {
		id: string
	}
}

export interface IDeleteUserResponse extends IResponse {

}