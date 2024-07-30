const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserModel extends Model {
        static associate(model) {
        }
    }
    UserModel.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.BIGINT,
            },
            // first_name: {
            //     type: DataTypes.STRING,
            //     allowNull: false,
            // },
            // last_name: {
            //     type: DataTypes.STRING,
            //     allowNull: false,
            // },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            // phone_number: {
            //     type: DataTypes.STRING,
            //     unique: true,
            //     allowNull: false,
            // },
            // dial_code: {
            //     type: DataTypes.STRING,
            //     allowNull: false,
            // },
            // country_code: {
            //     type: DataTypes.STRING,
            //     allowNull: false,
            // },
            // status: {
            //     type: DataTypes.BOOLEAN,
            //     defaultValue: true,
            //     allowNull: false,
            // },
            // profile_image: {
            //     type: DataTypes.STRING,
            // },
            // user_type: {
            //     type: DataTypes.ENUM('1', '2'), //1-Admin, 2-User
            //     defaultValue: 2,
            //     allowNull: false,
            // },
            // is_verified: {
            //     type: DataTypes.BOOLEAN,
            //     defaultValue: true,
            //     allowNull: false,
            // },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            otp: {
                type: DataTypes.NUMBER,
            },
        },
        {
            sequelize,
            modelName: UserModel.name,
            tableName: 'users',
            timestamps: false,
        }
    );

    return UserModel;
};
