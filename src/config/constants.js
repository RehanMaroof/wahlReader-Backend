module.exports = {
    APP: {
        port: process.env.PORT,
        env: process.env.NODE_ENV,
    },
    USER: {
        ROLES: {
            ADMIN: 'ADMIN',
            USER: 'USER',
        },
        STATUS: {
            VERIFIED: 'verified',
            UNVERIFIED: 'unverified',
        },
        PASSWORD: {
            DEFAULT: 'test@default',
        },
    },
    JWT: {},
};
