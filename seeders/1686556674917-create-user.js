'use strict';

const id = '331009de-6b02-4e15-a077-463b6e960b19';
const companyId = "f0845fb1-676f-40fc-916a-2c64a3305aca";
const addressId = "e45fde97-9aa4-496a-8c87-a8cccb422e6a";

module.exports = {
    up: async (queryInterface) => {
        const now = new Date();

        let user = await queryInterface.bulkInsert('users', [{
            id,
            firstname: 'Test',
            lastname: 'test',
            email: 'test@gmail.com',
            password: '$2a$10$W.Wy6p/lRPxoSff2jjg2duGVbt1egXeAjCIHKq.9sRIjbwngTlDlu',
            language: 'english',
            roleId: '94a6bbcf-a9b0-4505-8d1e-6e8d3e518017',
            createdAt: now,
            updatedAt: now,
        }]);

        queryInterface.bulkInsert('addresses', [{
            id: addressId,
            city: 'City',
            province: 'Province',
            addressLine1: "line 1",
            addressLine2: 'line 2',
            postcode: '12001AB',
            userId: id,
            companyId,
        }])

        return user;

    },

    down: async (queryInterface) => {
        return queryInterface.bulkDelete('users', { id });
    },
};
