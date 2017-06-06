
module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define(
        // modelName
        'user',

        // attributes
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            uuid: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4
            },
            jti: {
                type: DataTypes.UUID,
                allowNull: true,
                comment: "json-web-token-uuid"
            },
            // 认证相关控制【 account+password(后台认证) / openid(微信登录) / udid(游客模式) 】
            account: {
                type: DataTypes.STRING(50),
                allowNull: true,
                defaultValue: ""
            },
            password: {
                type: DataTypes.STRING(50),
                allowNull: true,
                defaultValue: ""
            },
            // 设备唯一编号
            udid: {
                type: DataTypes.STRING(36),
                allowNull: false,
                defaultValue: ""
            },
            // 微信开放平台UnionID
            unionid: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: ""
            },
            // 游戏数据【昵称、头像、性别、代币(房卡)】
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            gender: {
                type: DataTypes.INTEGER(1),
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
            tokens: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            // 商业标识 【 parentID-父ID(0表示总公司)  agent-代理商(0/1) 】
            parentID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            agent: {
                type: DataTypes.INTEGER(1),
                allowNull: false,
                defaultValue: 0
            },
            system: {
                type: DataTypes.INTEGER(1),
                allowNull: false,
                defaultValue: 0,
                comment: "管理员 1-普通 2-高级 3-超级"
            },
            // 游戏数据
            data: {
                type: "LONGBLOB",
                allowNull: true,
                get: function() {
                    var d = this.getDataValue('data');
                    if (d == null) {
                        return {};
                    }
                    return JSON.parse(this.getDataValue('data'))
                }
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
            tableName: 'users',
            timestamps: false,

            getterMethods: {
                avatar: function() {
                    return "http://h5.glfun.cn/users/" + this.uuid + "/avatar";
                },
                player: function() {
                    return {
                        id:     this.id,
                        name:   this.name || "游客" + this.id,
                        avatar: this.avatar,
                        gender: this.gender,
                        data:   this.data
                    }
                },
                scope: function() {
                    var scope = 0;

                    if (this.system === 3) {
                        scope = 4;   // 超级管理员
                    } else if (this.system === 2) {
                        scope = 3;   // 高级管理员
                    } else if (this.system == 1) {
                        scope = 2;   // 普通管理员
                    } else if (this.agent) {
                        scope = 1;   // 代理商
                    } else {
                        scope = 0;   // 普通会员
                    }

                    return scope;
                }
            },

            setterMethods: {

            }
        }
    );

    return User;
};
