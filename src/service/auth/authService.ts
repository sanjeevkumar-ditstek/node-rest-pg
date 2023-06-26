import Joi from "joi";
import UserStore from "../user/user.Store";
import AuthStore from "./auth.Store";
import IUSER from "../../utils/interface/IUser";
import STATUS_CODES from "../../utils/enum/StatusCodesEnum";
import MessageEnum from "../../utils/enum/MessageEnum";
import * as IAuthService from "./IAuthService"
import { IJwtPayload } from "../../utils/interface/common";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../env";
import { Response } from "express";
import Regex from '../../utils/enum/regex';
import { v4 as uuidv4 } from 'uuid';
import { SendResponse, sendPayloadError, toError } from "../../utils/functions/common.functions";

export default class AuthService implements IAuthService.IAuthServiceAPI {

    private userStore = new UserStore();
    private authStore = new AuthStore();

    constructor() {

    }

    public login = async (request: IAuthService.ILoginRequest, res: Response) => {

        const response: IAuthService.ILoginResponse = {
            status: STATUS_CODES.UNKNOWN_CODE,
        }

        const schema = Joi.object().keys({
            email: Joi.string().pattern(new RegExp(Regex.EMAIL)).required(),
            password: Joi.string().pattern(new RegExp(Regex.PASSWORD)).required(),
        })

        const params = schema.validate(request.body);

        if (params.error) {
            return this.sendInvalidResponse(res);
        }

        const { email, password } = params.value;
        let user: IUSER

        try {
            //get user by email id to check it exist or not
            user = await this.userStore.getByEmail(email);
            //if credentials are incorrect
            if (!user) {
                return this.sendInvalidResponse(res);
            }
        } catch (e) {
            response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
            response.error = toError(e.message);
            return SendResponse(res, response);
        }

        //comparing password to insure that password is correct
        const isValid = await bcrypt.compare(password, user.password);

        //if not isValid or user.password is null
        if (!isValid || !user?.password) {
            return this.sendInvalidResponse(res);
        }

        const secrets = {
            token_secret: uuidv4(),
            refresh_token_secret: uuidv4()
        }

        // Store the token secrets to database so that we can use it to verify later
        this.authStore.saveToken({
            userId: user.id,
            token_secret: secrets.token_secret,
            refresh_token_secret: secrets.refresh_token_secret
        })
            .then(() => {
                response.status = STATUS_CODES.OK;
                response.token = this.generateJWT(user, secrets, '30m');
                response.refresh_token = this.generateJWT(user, secrets, '7d');
                SendResponse(res, response);
            }).catch(err => {
                response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
                response.error = toError(err.message);
                SendResponse(res, response);
            })

    };

    private sendInvalidResponse = (res) => {
        const response: any = {};
        response.status = STATUS_CODES.UNAUTHORIZED;
        response.error = toError(MessageEnum.INVALID_CREDENTIALS);
        SendResponse(res, response);
    }

    /*****Generate a Token*****/
    private generateJWT = (user: IUSER, secrets, time: string): string => {

        const payLoad = {
            id: user.id,
            role: user.role.name,
            warehouseId: user.user_company_warehouse && user.user_company_warehouse.warehouseId,
            companyId: user.user_company_warehouse && user.user_company_warehouse.companyId,
            isSuperAdmin: user.role.name == "superAdmin",
            ...secrets
        };

        return jwt.sign(payLoad, JWT_SECRET, { expiresIn: time });
    };

    // Refresh token to get new token
    public refreshToken = async (request: IAuthService.IRefreshTokenRequest, res) => {
        let refresh_token = request.body.refresh_token;

        let response: IAuthService.IRefreshTokenResponse = {
            status: STATUS_CODES.UNKNOWN_CODE
        }

        if (!refresh_token) {
            return SendResponse(res, {
                status: STATUS_CODES.FORBIDDEN,
                error: toError(MessageEnum.TOKEN_NOT_PROVIDED)
            })
        }

        jwt.verify(refresh_token, JWT_SECRET, async (error, data: IJwtPayload) => {
            if (error) {
                response.status = STATUS_CODES.UNAUTHORIZED;
                response.error = toError(MessageEnum.TOKEN_EXPIRED);

                return SendResponse(res, response);
            } else if (data) {
                const tokenData: any = await this.authStore.verifyToken(data.id);

                if (tokenData.refresh_token_secret != data.refresh_token_secret) {
                    response.status = STATUS_CODES.UNAUTHORIZED;
                    response.error = toError(MessageEnum.TOKEN_EXPIRED);
                    return SendResponse(res, response);
                }

                // Create user object to pass to generateJWT
                const user: any = {
                    id: data.id,
                    role: {
                        name: data.role,
                    },
                    user_company_warehouse: {
                        companyId: data.companyId,
                        warehouseId: data.warehouseId
                    }
                };

                const secrets = {
                    token_secret: uuidv4(),
                    refresh_token_secret: data.refresh_token_secret
                }

                // Generate new token
                const token = this.generateJWT(user, secrets, '30m');

                // Store tokens in Database
                this.authStore.saveToken({
                    userId: data.id,
                    token_secret: secrets.token_secret,
                    refresh_token_secret: data.refresh_token_secret
                })
                    .then(() => {
                        response.status = STATUS_CODES.OK;
                        response.token = token;
                        SendResponse(res, response);
                    })
                    .catch(err => {
                        response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
                        response.error = toError(err.message);
                        SendResponse(res, response);
                    });
            }

        });
    }

}