'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable('tokens', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        refreshToken: {
          allowNull: false,
          type: Sequelize.STRING,
        }
      }, {
        transaction
      });
      return queryInterface.addConstraint("tokens", {
        fields: ["userId"], 
        type: "FOREIGN KEY",
        references: {
          table: "users",
          field: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    } catch(error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tokens');
  }
};
