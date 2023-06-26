import * as IUserService from "./user/IUserService";
import * as IAuthService from './auth/IAuthService';

import UserService from "./user/user.Service";
import AuthService from './auth/authService';

export interface IAppServiceProxy {
  user: IUserService.IUserServiceAPI;
  auth: IAuthService.IAuthServiceAPI;
}

class AppServiceProxy implements IAppServiceProxy {
  public user: IUserService.IUserServiceAPI;
  public auth: IAuthService.IAuthServiceAPI;

  constructor() {
    this.user = new UserService();
    this.auth = new AuthService();
  }
}

export default new AppServiceProxy();
