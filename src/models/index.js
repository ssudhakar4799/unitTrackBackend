import { sequelize } from '../setup/database.js';
import UserModel from './user.js';
import VendorModel from './vendor.js';
import ProductModel from './product.js';
import PriceTierModel from './priceTier.js';
import VendorProductModel from './vendorProduct.js';
import ConversionModel from './conversion.js';
import ManufacturingOrderModel from './manufacturingOrder.js';

const User = UserModel(sequelize);
const Vendor = VendorModel(sequelize);
const Product = ProductModel(sequelize);
const PriceTier = PriceTierModel(sequelize);
const VendorProduct = VendorProductModel(sequelize);
const Conversion = ConversionModel(sequelize);
const ManufacturingOrder = ManufacturingOrderModel(sequelize);

// Associations
PriceTier.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(PriceTier, { foreignKey: 'product_id', as: 'prices' });

VendorProduct.belongsTo(Vendor, { foreignKey: 'vendor_id' });
Vendor.hasMany(VendorProduct, { foreignKey: 'vendor_id', as: 'inventory' });
VendorProduct.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(VendorProduct, { foreignKey: 'product_id' });

Conversion.belongsTo(Product, { as: 'fromProduct', foreignKey: 'from_product_id' });
Conversion.belongsTo(Product, { as: 'toProduct', foreignKey: 'to_product_id' });

ManufacturingOrder.belongsTo(Product, { as: 'product', foreignKey: 'product_id' });
ManufacturingOrder.belongsTo(Product, { as: 'inputProduct', foreignKey: 'input_product_id' });
ManufacturingOrder.belongsTo(Vendor, { foreignKey: 'vendor_id' });

export {
  sequelize,
  User,
  Vendor,
  Product,
  PriceTier,
  VendorProduct,
  Conversion,
  ManufacturingOrder
};
