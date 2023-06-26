import StatusCodeEnum from "../enum/StatusCodesEnum";
import MessageEnum from "../enum/MessageEnum";

export interface IResponse {
	status: StatusCodeEnum;
	error?: IError;
	message?: string
}

export interface IError {
	message?: string;
	status?: MessageEnum;
}

export interface IJwtPayload {
	id: string
	role: string
	isSuperAdmin: boolean
	iat: number
	exp: number
	warehouseId: string
	companyId: string
	token_secret: string
	refresh_token_secret: string
}

export interface IRequestUser {
	id: string
	role: string
	isSuperAdmin: boolean
	iat: number
	exp: number
}

