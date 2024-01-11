module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING, 
        allowNull: false,
        unique: true
      },
      nickName: {
        type: Sequelize.STRING, 
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING, 
        allowNull: false
      }
    });

    User.associate = function(models){
        models.User.hasOne(models.Token, {
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        })
    }
  
    return User;
  };