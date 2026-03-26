// // const { Sequelize } = require('sequelize');
// // const dbConfig = require('../config/database');

// // const env = process.env.NODE_ENV || 'development';
// // const config = dbConfig[env];

// // // Initialize Sequelize
// // let sequelize;

// // if (process.env.DATABASE_URL) {
// //   // Use connection string if provided
// //   sequelize = new Sequelize(process.env.DATABASE_URL, {
// //     dialect: 'postgres',
// //     dialectOptions: {
// //       ssl: {
// //         require: true,
// //         rejectUnauthorized: false
// //       }
// //     },
// //     logging: false,
// //     pool: config.pool || {
// //       max: 5,
// //       min: 0,
// //       acquire: 30000,
// //       idle: 10000
// //     }
// //   });
// // } else {
// //   // Use individual credentials
// //   sequelize = new Sequelize(
// //     config.database,
// //     config.username,
// //     config.password,
// //     {
// //       host: config.host,
// //       port: config.port,
// //       dialect: config.dialect,
// //       logging: config.logging,
// //       dialectOptions: config.dialectOptions,
// //       pool: config.pool
// //     }
// //   );
// // }

// // const db = {};

// // db. Sequelize = Sequelize;
// // db.sequelize = sequelize;

// // // Import models
// // db.User = require('./User')(sequelize, Sequelize);

// // // Define associations here
// // // Example: db.User.hasMany(db. Post);

// // module.exports = db;

// const { Sequelize } = require("sequelize");
// const dbConfig = require("../config/database");

// const env = process.env.NODE_ENV || "development";
// const config = dbConfig[env];

// // Initialize Sequelize
// let sequelize;

// if (process.env.DATABASE_URL) {
//   // Use connection string if provided
//   sequelize = new Sequelize(process.env.DATABASE_URL, {
//     dialect: "postgres",
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
//     logging: false,
//     pool: config.pool || {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000,
//     },
//   });
// } else {
//   // Use individual credentials
//   sequelize = new Sequelize(config.database, config.username, config.password, {
//     host: config.host,
//     port: config.port,
//     dialect: config.dialect,
//     logging: config.logging,
//     dialectOptions: config.dialectOptions,
//     pool: config.pool,
//   });
// }

// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// // Import models
// db.User = require("./User")(sequelize, Sequelize);
// db.Query = require("./Query")(sequelize, Sequelize);
// db.ActivityLog = require("./ActivityLog")(sequelize, Sequelize);
// db.Dataset = require("./DataSet")(sequelize, Sequelize);

// // Run associations
// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// module.exports = db;

const { Sequelize } = require("sequelize");
const dbConfig = require("../config/database");

const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];

// Initialize Sequelize
let sequelize;

if (process.env.DATABASE_URL) {
  // Use connection string if provided
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
    pool: config.pool || {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  // Use individual credentials
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      logging: config.logging,
      dialectOptions: config.dialectOptions,
      pool: config.pool,
    }
  );
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// =======================
// Import models
// =======================
db.User = require("./User")(sequelize, Sequelize);
db.Query = require("./Query")(sequelize, Sequelize);
db.ActivityLog = require("./ActivityLog")(sequelize, Sequelize);
db.Dataset = require("./DataSet")(sequelize, Sequelize);
db.Response = require("./Response")(sequelize, Sequelize);
db.History = require("./History")(sequelize, Sequelize);
db.DocumentSummary = require("./DocumentSummary")(sequelize, Sequelize);
db.DocumentSummaryHistory = require("./DocumentSummaryHistory")(sequelize, Sequelize);
db.Feedback = require("./Feedback")(sequelize, Sequelize);

// =======================
// Dataset associations
// =======================
db.Dataset.belongsTo(db.User, {
  foreignKey: "uploadedById",
  as: "uploadedBy",
});

db.Dataset.belongsTo(db.User, {
  foreignKey: "lastModifiedById",
  as: "lastModifiedBy",
});

db.User.hasMany(db.Dataset, {
  foreignKey: "uploadedById",
  as: "uploadedDatasets",
});

// =======================
// Run model-level associations (if defined)
// =======================
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
