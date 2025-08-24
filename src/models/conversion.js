import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Conversion = sequelize.define('Conversion', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    from_product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    to_product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    input_qty: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false
    },
    output_qty: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false
    },
    waste_qty: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('draft', 'in_progress', 'completed'),
      allowNull: false,
      defaultValue: 'draft'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'conversions'
  });

  return Conversion;
};
