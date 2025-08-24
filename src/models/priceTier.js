import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PriceTier = sequelize.define('PriceTier', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('cost', 'selling', 'wholesale', 'retail'),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'INR'
    }
  }, {
    tableName: 'price_tiers',
    indexes: [
      { fields: ['product_id'] },
      { unique: true, fields: ['product_id', 'type'] }
    ]
  });

  return PriceTier;
};
