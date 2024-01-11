module.exports = (sequelize, Sequelize) => {
  const token = sequelize.define('token', {
    userId: {
      type: Sequelize.NUMBER,
      allowNull: false,
    },
    refreshToken: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  token.associate = function (models) {
    models.token.belongsTo(models.user, {
      foreignKeyConstraint: true,
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return token;
};
