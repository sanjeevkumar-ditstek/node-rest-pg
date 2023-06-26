import AccessTokenModel from '../../models/accessToken.Model'

export default class AuthStore {

    public static OPERATION_UNSUCCESSFUL = class extends Error {
        constructor() {
            super("An error occured while processing the request.");
        }
    }

    //When we do login or refresh token then we save token secrets in db to verify later
    public saveToken = async ({ userId, token_secret, refresh_token_secret }) => {
        try {
            await AccessTokenModel.destroy({
                where: {
                    userId
                }
            });
            return await AccessTokenModel.create({ userId, token_secret, refresh_token_secret });
        } catch (e) {
            console.log(e);
            return Promise.reject(new AuthStore.OPERATION_UNSUCCESSFUL());
        }
    }

    // Get token why userId to validate
    public verifyToken = async (userId) => {
        try {
            return await AccessTokenModel.findOne({
                where: {
                    userId
                }
            })
        } catch (e) {
            console.log(e);
            return Promise.reject(new AuthStore.OPERATION_UNSUCCESSFUL());
        }
    }

}