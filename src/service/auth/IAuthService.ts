import IUSER from "../../utils/interface/IUser";
import { IResponse } from "../../utils/interface/common";
import { Request, Response } from "express";

export interface IAuthServiceAPI {
    login(request: ILoginRequest, response: Response);
    refreshToken(request: IRefreshTokenRequest, response: IRefreshTokenResponse)
}

/********************************************************************************
 * Login
 ********************************************************************************/

interface LoginRequestBody {
    email: string;
    password: string;
}

export interface ILoginRequest extends Request {
    body: LoginRequestBody
}

export interface ILoginResponse extends IResponse {
    token?: string;
    refresh_token?: string
}

export interface IRefreshTokenRequest extends Request {
    body: {
        refresh_token: string
    }
}
export interface IRefreshTokenResponse extends ILoginResponse { }