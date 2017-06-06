
module.exports = function(sequelize, DataTypes) {
    var Record = sequelize.define(
        // modelName
        'record',

        // attributes
        {
            id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            roomID: {
                type: DataTypes.STRING(6),
                allowNull: false,
                field: 'roomID'
            },
            data: {
                type: "LONGBLOB",
                allowNull: false,
                field: 'data'
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },

        // options
        {
            tableName: 'records',
            timestamps: false
        }
    );

    return Record;
};
