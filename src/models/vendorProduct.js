import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const VendorProduct = sequelize.define('VendorProduct', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    vendor_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    qty: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('available', 'reserved', 'depleted'),
      allowNull: false,
      defaultValue: 'available'
    }
  }, {
    tableName: 'vendor_products',
    indexes: [
      { fields: ['vendor_id'] },
      { fields: ['product_id'] },
      { unique: true, fields: ['vendor_id', 'product_id'] }
    ]
  });

  return VendorProduct;
};
