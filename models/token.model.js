module.exports = (sequelize, Sequelize) => {
    const Token = sequelize.define("token", {
      userId: {
        type: Sequelize.NUMBER,
        allowNull: false
      },
      refreshToken: {
        type: Sequelize.STRING,
        allowNull: false
      },
    });

    Token.associate = function (models) {
        models.userPermissionsNew.belongsTo(models.user, {
          foreignKeyConstraint: true,
          foreignKey: "userId",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        });
      };
  
    return Token;
  };