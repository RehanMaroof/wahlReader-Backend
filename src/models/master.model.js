const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MasterModel extends Model {
        static associate(model) {
        }
    }

    MasterModel.init(
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.BIGINT,
            },
            main_category: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            icd_code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
           
            icd_description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            rxcc_cc: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            clinical_category: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            comorbidity_description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            impact_snf_care_plan: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            created_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            created_by:{
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            status: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            updated_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            updated_by: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            preferred_code:{
                type: DataTypes.TINYINT,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: MasterModel.name,
            tableName: 'master_table',
            timestamps: false
        }
    );
    return MasterModel;
}