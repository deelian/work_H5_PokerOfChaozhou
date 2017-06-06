
module.exports = function(sequelize, DataTypes) {
    var Bulletin = sequelize.define(
        // modelName
        'bulletin',

        // attributes
        {
            id: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: DataTypes.STRING(32),
                allowNull: false,
                defaultValue: ""
            },
            summary: {
                type: DataTypes.STRING(64),
                allowNull: false,
                defaultValue: ""
            },
            content: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            startTime: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            endTime: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            priority: {
                type: DataTypes.STRING(2),
                allowNull: false,
                defaultValue: 0
            }
        },

        // options
        {
            timestamps: false
        }
    );

    return Bulletin;
};
