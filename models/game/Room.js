
module.exports = function(sequelize, DataTypes) {
    var Room = sequelize.define(
        // modelName
        'room',

        // attributes
        {
            id: {
                type: DataTypes.STRING(6),
                allowNull: false,
                primaryKey: true,
                field: 'id'
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
            tableName: 'rooms',
            timestamps: false
        }
    );

    return Room;
};
