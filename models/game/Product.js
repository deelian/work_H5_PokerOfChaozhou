
module.exports = function(sequelize, DataTypes) {
    var Product = sequelize.define(
        // modelName
        'product',

        // attributes
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false,
                defaultValue: "",
                comment: "商品名称"
            },
            desc: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: "",
                comment: "商品描述"
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: "商品价格 单位精确到：分"
            },
            tokens: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                comment: "代币数量"
            },
            upShelf: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                comment: "是否上架"
            }
        },

        // options
        {
            timestamps: false
        }
    );

    return Product;
};
