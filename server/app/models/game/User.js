
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
                autoIncrement: true,
                field: 'id'
            },
            
            // 认证相关控制【 account+password(后台认证) / openid(微信登录) / udid(游客模式) 】
            account: {
                type: DataTypes.STRING(50),
                allowNull: true,
                field: 'account',
                defaultValue: ""
            },
            password: {
                type: DataTypes.STRING(50),
                allowNull: true,
                field: 'password',
                defaultValue: ""
            },

            // 设备唯一编号
            udid: {
                type: DataTypes.STRING(36),
                allowNull: false,
                field: 'udid',
                defaultValue: ""
            },

            // 开放平台唯一编号
            openid: {
                type: DataTypes.STRING(255),
                allowNull: false,
                field: 'openid',
                defaultValue: ""
            },

            // 游戏数据【昵称、头像、性别、代币(房卡)】
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'name',
                defaultValue: ""
            },
            avatar: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'avatar',
                defaultValue: ""
            },
            gender: {
                type: DataTypes.INTEGER(1),
                allowNull: false,
                field: 'gender',
                defaultValue: 0
            },
            tokens: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'tokens',
                defaultValue: 0
            },

            // 商业标识 【 parentID-父ID(0表示总公司)  agent-代理商(0/1) 】
            parentID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'parentID',
                defaultValue: 0
            },
            agent: {
                type: DataTypes.INTEGER(1),
                allowNull: false,
                field: 'agent',
                defaultValue: 0
            },

            // 统计数据
            createTime: {
                type: DataTypes.DATE,
                allowNull: false,
                field: 'createTime',
                defaultValue: DataTypes.NOW
            },
            lastLogin: {
                type: DataTypes.DATE,
                allowNull: false,
                field: 'lastLogin',
                defaultValue: DataTypes.NOW
            },
            lastLogout: {
                type: DataTypes.DATE,
                allowNull: false,
                field: 'lastLogout',
                defaultValue: DataTypes.NOW
            },

            // 游戏数据
            data: {
                type: "LONGBLOB",
                allowNull: false,
                field: 'data'
            }
        },

        // options
        {
            tableName: 'users',
            timestamps: false,

            getterMethods: {
                player: function() {
                    return {
                        id:     this.id,
                        name:   this.name,
                        avatar: this.avatar,
                        gender: this.gender
                    }
                }
            },

            setterMethods: {

            }
        }
    );

    return User;
};
