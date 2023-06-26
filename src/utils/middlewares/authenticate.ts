import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./../../env";
import STATUS_CODES from "../enum/StatusCodesEnum";
import MessageEnum from "../enum/MessageEnum";
import { IJwtPayload } from "../interface/common";
import AuthStore from "../../service/auth/auth.Store";
import { SendResponse } from "../functions/common.functions";

export const extractBearerToken = (req): string | undefined => {
  let token;

  const raw = req.headers.authorization || "";
  if (raw.match(/Bearer /)) {
    token = raw.split("Bearer ")[1];
  }
  return token;
};

/**
 * authenticate middleware for incoming requests to validate token
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export default function authenticate(req, res, next) {
  const token = extractBearerToken(req);
  const authStore = new AuthStore();
  req.user = {};

  if (!token) {
    return SendResponse(res, {
      status: STATUS_CODES.FORBIDDEN,
      error: {
        message: MessageEnum.TOKEN_NOT_PROVIDED
      }
    });
  }

  jwt.verify(token, JWT_SECRET, async (error, data: IJwtPayload) => {
    if (error) {
      return sendUnAuthorized(res);
    } else if (data) {
      const tokenData: any = await authStore.verifyToken(data.id);
      if (!tokenData || tokenData.token_secret != data.token_secret) {
        return sendUnAuthorized(res);
      }
      req.user = data;
    }
    next();
  });
}

function sendUnAuthorized(res) {
  SendResponse(res, {
    status: STATUS_CODES.UNAUTHORIZED,
    error: {
      message: MessageEnum.TOKEN_EXPIRED
    }
  });
}