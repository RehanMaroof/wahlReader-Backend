const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ReportModel extends Model {
        static associate(model) {
        }
    }

    ReportModel.init({
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        prescription_id:{
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        patient_name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        patient_id:{
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        patient_object:{
            type: DataTypes.JSON,
            allowNull: false,
        },
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
        },
        created_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        created_by: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
        updated_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updated_by: {
            type: DataTypes.NUMBER,
            allowNull: true,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        deleted_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        deleted_by: {
            type: DataTypes.NUMBER,
            allowNull: true,
        },

    },
    {
        sequelize,
        modelName: ReportModel.name,
        tableName: 'reports_test',
        timestamps: false
    }
);
return ReportModel;
}