const { Model, } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class S3UploadModel extends Model {
        static associate(model) {
        }
    }
    S3UploadModel.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.BIGINT,
            },
            file_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            file_size: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            file_type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            data_url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            e_tag: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            created_by: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: sequelize.fn('NOW'),
                allowNull: false,
            },
            category_type:{
                type: DataTypes.STRING,
                allowNull: true,
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: S3UploadModel.name,
            tableName: 's3_uploads',
            timestamps: false,
        }
    );

    return S3UploadModel;
};
