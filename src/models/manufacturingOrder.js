import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ManufacturingOrder = sequelize.define('ManufacturingOrder', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    vendor_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    input_product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    input_qty: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false
    },
    output_expected: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: true
    },
    output_actual: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: true
    },
    stage: {
      type: DataTypes.ENUM('received', 'processing', 'converted', 'packaged', 'completed'),
      allowNull: false,
      defaultValue: 'received'
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'manufacturing_orders'
  });

  return ManufacturingOrder;
};
