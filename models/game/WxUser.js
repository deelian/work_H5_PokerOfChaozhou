
module.exports = function(sequelize, DataTypes) {
    var WxUser = sequelize.define(
        // modelName
        'wx_user',

        // attributes
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            unionid: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            appid: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            openid: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            nickname: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            headimgurl: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            sex: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            language: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            province: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            access_token: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            expires_in: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            refresh_token: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            privilege: {
                type: DataTypes.STRING,
                allowNull: true
            },
            expiredAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
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
            timestamps: true,
            getterMethods: {
            },
            setterMethods: {
            }
        }
    );

    return WxUser;
};
