'use strict';


module.exports = {
    up: async (queryInterface) => {

        return queryInterface.bulkInsert('roles', [
            { id: "94a6bbcf-a9b0-4505-8d1e-6e8d3e518017", name: 'superAdmin', },
            { id: "a2ee5fcb-180b-4650-918d-1f33a0d933b3", name: 'admin', },
            { id: "429689a1-297d-4e86-8ae0-6822976f739c", name: 'user' },
        ]);
    },

    down: async (queryInterface) => {
        return queryInterface.bulkDelete('roles', null, {});
    }
};
