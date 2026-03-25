---
name: ck:databases
description: Design schemas, write queries for MongoDB and PostgreSQL. Use for database design, SQL/NoSQL queries, aggregation pipelines, indexes, migrations, replication, performance optimization, psql CLI.
license: MIT
argument-hint: "[query or schema task]"
---

# Databases Skill

Unified guide for working with MongoDB (document-oriented) and PostgreSQL (relational) databases. Choose the right database for your use case and master both systems.

## When to Use This Skill

Use when:
- Designing database schemas and data models
- Writing queries (SQL or MongoDB query language)
- Building aggregation pipelines or complex joins
- Optimizing indexes and query performance
- Implementing database migrations
- Setting up replication, sharding, or clustering
- Configuring backups and disaster recovery
- Managing database users and permissions
- Analyzing slow queries and performance issues
- Administering production database deployments

## Reference Navigation

### Database Design
- **[db-design.md](references/db-design.md)** - Activate when user requests: Database/table design for transactional (OLTP), analytics (OLAP), create or extend schema, design fact/dimension tables, analyze/review CSV/JSON/SQL files to create tables, or need advice on data storage structure.

### MongoDB References
- **[mongodb-crud.md](references/mongodb-crud.md)** - CRUD operations, query operators, atomic updates
- **[mongodb-aggregation.md](references/mongodb-aggregation.md)** - Aggregation pipeline, stages, operators, patterns
- **[mongodb-indexing.md](references/mongodb-indexing.md)** - Index types, compound indexes, performance optimization
- **[mongodb-atlas.md](references/mongodb-atlas.md)** - Atlas cloud setup, clusters, monitoring, search

### PostgreSQL References
- **[postgresql-queries.md](references/postgresql-queries.md)** - SELECT, JOINs, subqueries, CTEs, window functions
- **[postgresql-psql-cli.md](references/postgresql-psql-cli.md)** - psql commands, meta-commands, scripting
- **[postgresql-performance.md](references/postgresql-performance.md)** - EXPLAIN, query optimization, vacuum, indexes
- **[postgresql-administration.md](references/postgresql-administration.md)** - User management, backups, replication, maintenance

## Python Utilities

Database utility scripts in `scripts/`:
- **db_migrate.py** - Generate and apply migrations for both databases (MongoDB and PostgreSQL)
- **db_backup.py** - Backup and restore MongoDB and PostgreSQL
- **db_performance_check.py** - Analyze slow queries and recommend indexes

```bash
# Generate migration
python scripts/db_migrate.py --db mongodb --generate "add_user_index"

# Run backup
python scripts/db_backup.py --db postgres --output /backups/

# Check performance
python scripts/db_performance_check.py --db mongodb --threshold 100ms
```

## Best Practices

**MongoDB:**
- Use embedded documents for 1-to-few relationships
- Reference documents for 1-to-many or many-to-many
- Index frequently queried fields
- Use aggregation pipeline for complex transformations
- Enable authentication and TLS in production
- Use Atlas for managed hosting

**PostgreSQL:**
- Normalize schema to 3NF, denormalize for performance
- Use foreign keys for referential integrity
- Index foreign keys and frequently filtered columns
- Use EXPLAIN ANALYZE to optimize queries
- Regular VACUUM and ANALYZE maintenance
- Connection pooling (pgBouncer) for web apps

## Resources

- MongoDB: https://www.mongodb.com/docs/
- PostgreSQL: https://www.postgresql.org/docs/
- MongoDB University: https://learn.mongodb.com/
- PostgreSQL Tutorial: https://www.postgresqltutorial.com/


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### mongodb aggregation

# MongoDB Aggregation Pipeline

Aggregation pipeline for complex data transformations, analytics, and multi-stage processing.

## Pipeline Concept

Aggregation processes documents through multiple stages. Each stage transforms documents and passes results to next stage.

```javascript
db.collection.aggregate([
  { /* Stage 1 */ },
  { /* Stage 2 */ },
  { /* Stage 3 */ }
])
```

## Core Pipeline Stages

### $match (Filter Documents)
```javascript
// Filter early in pipeline for efficiency
db.orders.aggregate([
  { $match: { status: "completed", total: { $gte: 100 } } },
  // Subsequent stages process only matched documents
])

// Multiple conditions
db.orders.aggregate([
  { $match: {
    $and: [
      { orderDate: { $gte: startDate } },
      { status: { $in: ["completed", "shipped"] } }
    ]
  }}
])
```

### $project (Reshape Documents)
```javascript
// Select and reshape fields
db.orders.aggregate([
  { $project: {
    orderNumber: 1,
    total: 1,
    customerName: "$customer.name",
    year: { $year: "$orderDate" },
    _id: 0  // Exclude _id
  }}
])

// Computed fields
db.orders.aggregate([
  { $project: {
    total: 1,
    tax: { $multiply: ["$total", 0.1] },
    grandTotal: { $add: ["$total", { $multiply: ["$total", 0.1] }] }
  }}
])
```

### $group (Aggregate Data)
```javascript
// Group and count
db.orders.aggregate([
  { $group: {
    _id: "$status",
    count: { $sum: 1 }
  }}
])

// Multiple aggregations
db.orders.aggregate([
  { $group: {
    _id: "$customerId",
    totalSpent: { $sum: "$total" },
    orderCount: { $sum: 1 },
    avgOrderValue: { $avg: "$total" },
    maxOrder: { $max: "$total" },
    minOrder: { $min: "$total" }
  }}
])

// Group by multiple fields
db.sales.aggregate([
  { $group: {
    _id: {
      year: { $year: "$date" },
      month: { $month: "$date" },
      product: "$productId"
    },
    revenue: { $sum: "$amount" }
  }}
])
```

### $sort (Order Results)
```javascript
// Sort by field
db.orders.aggregate([
  { $sort: { total: -1 } }  // -1: descending, 1: ascending
])

// Sort by multiple fields
db.orders.aggregate([
  { $sort: { status: 1, orderDate: -1 } }
])
```

### $limit / $skip (Pagination)
```javascript
// Limit results
db.orders.aggregate([
  { $sort: { orderDate: -1 } },
  { $limit: 10 }
])

// Pagination
const page = 2;
const pageSize = 20;
db.orders.aggregate([
  { $sort: { orderDate: -1 } },
  { $skip: (page - 1) * pageSize },
  { $limit: pageSize }
])
```

### $lookup (Join Collections)
```javascript
// Simple join
db.orders.aggregate([
  { $lookup: {
    from: "customers",
    localField: "customerId",
    foreignField: "_id",
    as: "customer"
  }},
  { $unwind: "$customer" }  // Convert array to object
])

// Pipeline join (more powerful)
db.orders.aggregate([
  { $lookup: {
    from: "products",
    let: { items: "$items" },
    pipeline: [
      { $match: { $expr: { $in: ["$_id", "$$items.productId"] } } },
      { $project: { name: 1, price: 1 } }
    ],
    as: "productDetails"
  }}
])
```

### $unwind (Deconstruct Arrays)
```javascript
// Unwind array field
db.orders.aggregate([
  { $unwind: "$items" }
])

// Preserve null/empty arrays
db.orders.aggregate([
  { $unwind: {
    path: "$items",
    preserveNullAndEmptyArrays: true
  }}
])

// Include array index
db.orders.aggregate([
  { $unwind: {
    path: "$items",
    includeArrayIndex: "itemIndex"
  }}
])
```

### $addFields (Add New Fields)
```javascript
// Add computed fields
db.orders.aggregate([
  { $addFields: {
    totalWithTax: { $multiply: ["$total", 1.1] },
    year: { $year: "$orderDate" }
  }}
])
```

### $replaceRoot (Replace Document Root)
```javascript
// Promote subdocument to root
db.orders.aggregate([
  { $replaceRoot: { newRoot: "$customer" } }
])

// Merge fields
db.orders.aggregate([
  { $replaceRoot: {
    newRoot: { $mergeObjects: ["$customer", { orderId: "$_id" }] }
  }}
])
```

## Aggregation Operators

### Arithmetic Operators
```javascript
// Basic math
db.products.aggregate([
  { $project: {
    name: 1,
    profit: { $subtract: ["$price", "$cost"] },
    margin: { $multiply: [
      { $divide: [
        { $subtract: ["$price", "$cost"] },
        "$price"
      ]},
      100
    ]}
  }}
])

// Other operators: $add, $multiply, $divide, $mod, $abs, $ceil, $floor, $round
```

### String Operators
```javascript
// String manipulation
db.users.aggregate([
  { $project: {
    fullName: { $concat: ["$firstName", " ", "$lastName"] },
    email: { $toLower: "$email" },
    initials: { $concat: [
      { $substr: ["$firstName", 0, 1] },
      { $substr: ["$lastName", 0, 1] }
    ]}
  }}
])

// Other: $toUpper, $trim, $split, $substr, $regexMatch
```

### Date Operators
```javascript
// Date extraction
db.events.aggregate([
  { $project: {
    event: 1,
    year: { $year: "$timestamp" },
    month: { $month: "$timestamp" },
    day: { $dayOfMonth: "$timestamp" },
    hour: { $hour: "$timestamp" },
    dayOfWeek: { $dayOfWeek: "$timestamp" }
  }}
])

// Date math
db.events.aggregate([
  { $project: {
    event: 1,
    expiresAt: { $add: ["$createdAt", 1000 * 60 * 60 * 24 * 30] }, // +30 days
    ageInDays: { $divide: [
      { $subtract: [new Date(), "$createdAt"] },
      1000 * 60 * 60 * 24
    ]}
  }}
])
```

### Array Operators
```javascript
// Array operations
db.posts.aggregate([
  { $project: {
    title: 1,
    tagCount: { $size: "$tags" },
    firstTag: { $arrayElemAt: ["$tags", 0] },
    lastTag: { $arrayElemAt: ["$tags", -1] },
    hasMongoDBTag: { $in: ["mongodb", "$tags"] }
  }}
])

// Array filtering
db.posts.aggregate([
  { $project: {
    title: 1,
    activeTags: {
      $filter: {
        input: "$tags",
        as: "tag",
        cond: { $ne: ["$$tag.status", "deprecated"] }
      }
    }
  }}
])
```

### Conditional Operators
```javascript
// $cond (ternary)
db.products.aggregate([
  { $project: {
    name: 1,
    status: {
      $cond: {
        if: { $gte: ["$stock", 10] },
        then: "In Stock",
        else: "Low Stock"
      }
    }
  }}
])

// $switch (multiple conditions)
db.orders.aggregate([
  { $project: {
    status: 1,
    priority: {
      $switch: {
        branches: [
          { case: { $gte: ["$total", 1000] }, then: "High" },
          { case: { $gte: ["$total", 100] }, then: "Medium" }
        ],
        default: "Low"
      }
    }
  }}
])
```

## Advanced Patterns

### Time-Based Aggregation
```javascript
// Daily sales
db.orders.aggregate([
  { $match: { orderDate: { $gte: startDate } } },
  { $group: {
    _id: {
      year: { $year: "$orderDate" },
      month: { $month: "$orderDate" },
      day: { $dayOfMonth: "$orderDate" }
    },
    revenue: { $sum: "$total" },
    orderCount: { $sum: 1 }
  }},
  { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
])
```

### Faceted Search
```javascript
// Multiple aggregations in one query
db.products.aggregate([
  { $match: { category: "electronics" } },
  { $facet: {
    priceRanges: [
      { $bucket: {
        groupBy: "$price",
        boundaries: [0, 100, 500, 1000, 5000],
        default: "5000+",
        output: { count: { $sum: 1 } }
      }}
    ],
    topBrands: [
      { $group: { _id: "$brand", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ],
    avgPrice: [
      { $group: { _id: null, avg: { $avg: "$price" } } }
    ]
  }}
])
```

### Window Functions
```javascript
// Running totals and moving averages
db.sales.aggregate([
  { $setWindowFields: {
    partitionBy: "$region",
    sortBy: { date: 1 },
    output: {
      runningTotal: {
        $sum: "$amount",
        window: { documents: ["unbounded", "current"] }
      },
      movingAvg: {
        $avg: "$amount",
        window: { documents: [-7, 0] }  // Last 7 days
      }
    }
  }}
])
```

### Text Search with Aggregation
```javascript
// Full-text search (requires text index)
db.articles.aggregate([
  { $match: { $text: { $search: "mongodb database" } } },
  { $addFields: { score: { $meta: "textScore" } } },
  { $sort: { score: -1 } },
  { $limit: 10 }
])
```

### Geospatial Aggregation
```javascript
// Find nearby locations
db.places.aggregate([
  { $geoNear: {
    near: { type: "Point", coordinates: [lon, lat] },
    distanceField: "distance",
    maxDistance: 5000,
    spherical: true
  }},
  { $limit: 10 }
])
```

## Performance Tips

1. **$match early** - Filter documents before other stages
2. **$project early** - Reduce document size
3. **Index usage** - $match and $sort can use indexes (only at start)
4. **$limit after $sort** - Reduce memory usage
5. **Avoid $lookup** - Prefer embedded documents when possible
6. **Use $facet sparingly** - Can be memory intensive
7. **allowDiskUse** - Enable for large datasets
```javascript
db.collection.aggregate(pipeline, { allowDiskUse: true })
```

## Best Practices

1. **Order stages efficiently** - $match → $project → $group → $sort → $limit
2. **Use $expr carefully** - Can prevent index usage
3. **Monitor memory** - Default limit: 100MB per stage
4. **Test with explain** - Analyze pipeline performance
```javascript
db.collection.explain("executionStats").aggregate(pipeline)
```
5. **Break complex pipelines** - Use $out/$merge for intermediate results
6. **Use $sample** - For random document selection
7. **Leverage $addFields** - Cleaner than $project for adding fields


### mongodb atlas

# MongoDB Atlas Cloud Platform

MongoDB Atlas is fully-managed cloud database service with automated backups, monitoring, and scaling.

## Quick Start

### Create Free Cluster
1. Sign up at mongodb.com/atlas
2. Create organization and project
3. Build cluster (M0 Free Tier)
   - Cloud provider: AWS/GCP/Azure
   - Region: closest to users
   - Cluster name
4. Create database user (username/password)
5. Whitelist IP address (or 0.0.0.0/0 for development)
6. Get connection string

### Connection String Format
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Connect
```javascript
// Node.js
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://...";
const client = new MongoClient(uri);

await client.connect();
const db = client.db("myDatabase");
```

```python
# Python
from pymongo import MongoClient
uri = "mongodb+srv://..."
client = MongoClient(uri)
db = client.myDatabase
```

## Cluster Tiers

### M0 (Free Tier)
- 512 MB storage
- Shared CPU/RAM
- Perfect for development/learning
- Limited to 100 connections
- No backups

### M10+ (Dedicated Clusters)
- Dedicated resources
- 2GB - 4TB+ storage
- Automated backups
- Advanced monitoring
- Performance Advisor
- Multi-region support
- VPC peering

### Serverless
- Pay per operation
- Auto-scales to zero
- Good for sporadic workloads
- 1GB+ storage
- Limited features (no full-text search)

## Database Configuration

### Create Database
```javascript
// Via Atlas UI: Database → Add Database
// Via shell
use myNewDatabase
db.createCollection("myCollection")

// Via driver
const db = client.db("myNewDatabase");
await db.createCollection("myCollection");
```

### Schema Validation
```javascript
// Set validation rules in Atlas UI or via shell
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "name"],
      properties: {
        email: { bsonType: "string", pattern: "^.+@.+$" },
        age: { bsonType: "int", minimum: 0 }
      }
    }
  }
})
```

## Security

### Network Access
```javascript
// IP Whitelist (Atlas UI → Network Access)
// - Add IP Address: specific IPs
// - 0.0.0.0/0: allow from anywhere (dev only)
// - VPC Peering: private connection

// Connection string includes options
mongodb+srv://cluster.mongodb.net/?retryWrites=true&w=majority&ssl=true
```

### Database Users
```javascript
// Create via Atlas UI → Database Access
// - Username/password authentication
// - AWS IAM authentication
// - X.509 certificates

// Roles:
// - atlasAdmin: full access
// - readWriteAnyDatabase: read/write all databases
// - readAnyDatabase: read-only all databases
// - read/readWrite: database-specific
```

### Encryption
```javascript
// Encryption at rest (automatic on M10+)
// Encryption in transit (TLS/SSL, always enabled)

// Client-Side Field Level Encryption (CSFLE)
const autoEncryptionOpts = {
  keyVaultNamespace: "encryption.__keyVault",
  kmsProviders: {
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  }
};

const client = new MongoClient(uri, { autoEncryption: autoEncryptionOpts });
```

## Backups and Snapshots

### Cloud Backups (M10+)
```javascript
// Automatic continuous backups
// - Snapshots every 6-24 hours
// - Oplog for point-in-time recovery
// - Retention: 2+ days configurable

// Restore via Atlas UI:
// 1. Clusters → cluster name → Backup tab
// 2. Select snapshot or point in time
// 3. Download or restore to cluster
```

### Manual Backups
```bash
# Export using mongodump
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/mydb" --out=/backup

# Restore using mongorestore
mongorestore --uri="mongodb+srv://..." /backup/mydb
```

## Monitoring and Alerts

### Metrics Dashboard
```javascript
// Atlas UI → Metrics
// Key metrics:
// - Operations per second
// - Query execution times
// - Connections
// - Network I/O
// - Disk usage
// - CPU utilization

// Real-time Performance panel
// - Current operations
// - Slow queries
// - Index suggestions
```

### Alerts
```javascript
// Configure via Atlas UI → Alerts
// Alert types:
// - High connections (> threshold)
// - High CPU usage (> 80%)
// - Disk usage (> 90%)
// - Replication lag
// - Backup failures

// Notification channels:
// - Email
// - SMS
// - Slack
// - PagerDuty
// - Webhook
```

### Performance Advisor
```javascript
// Automatic index recommendations
// Atlas UI → Performance Advisor

// Analyzes:
// - Slow queries
// - Missing indexes
// - Redundant indexes
// - Index usage statistics

// Provides:
// - Index creation commands
// - Expected performance improvement
// - Schema design suggestions
```

## Atlas Search (Full-Text Search)

### Create Search Index
```javascript
// Atlas UI → Search → Create Index

// JSON definition
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "title": {
        "type": "string",
        "analyzer": "lucene.standard"
      },
      "description": {
        "type": "string",
        "analyzer": "lucene.english"
      },
      "tags": {
        "type": "string"
      }
    }
  }
}
```

### Search Queries
```javascript
// Aggregation pipeline with $search
db.articles.aggregate([
  {
    $search: {
      text: {
        query: "mongodb database tutorial",
        path: ["title", "description"],
        fuzzy: { maxEdits: 1 }
      }
    }
  },
  { $limit: 10 },
  {
    $project: {
      title: 1,
      description: 1,
      score: { $meta: "searchScore" }
    }
  }
])

// Autocomplete
db.articles.aggregate([
  {
    $search: {
      autocomplete: {
        query: "mong",
        path: "title",
        tokenOrder: "sequential"
      }
    }
  }
])
```

## Atlas Vector Search (AI/ML)

### Create Vector Search Index
```javascript
// For AI similarity search (embeddings)
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,  // OpenAI embeddings
      "similarity": "cosine"
    }
  ]
}
```

### Vector Search Query
```javascript
// Search by similarity
db.products.aggregate([
  {
    $vectorSearch: {
      index: "vector_index",
      path: "embedding",
      queryVector: [0.123, 0.456, ...],  // 1536 dimensions
      numCandidates: 100,
      limit: 10
    }
  },
  {
    $project: {
      name: 1,
      description: 1,
      score: { $meta: "vectorSearchScore" }
    }
  }
])
```

## Data Federation

### Query Across Sources
```javascript
// Federated database instance
// Query data from:
// - Atlas clusters
// - AWS S3
// - HTTP endpoints

// Create virtual collection
{
  "databases": [{
    "name": "federated",
    "collections": [{
      "name": "sales",
      "dataSources": [{
        "storeName": "s3Store",
        "path": "/sales/*.json"
      }]
    }]
  }]
}

// Query like normal collection
use federated
db.sales.find({ region: "US" })
```

## Atlas Charts (Embedded Analytics)

### Create Dashboard
```javascript
// Atlas UI → Charts → New Dashboard
// Data source: Atlas cluster
// Chart types: bar, line, pie, scatter, etc.

// Embed in application
<iframe
  src="https://charts.mongodb.com/charts-project/embed/charts?id=..."
  width="800"
  height="600"
/>
```

## Atlas CLI

```bash
# Install
npm install -g mongodb-atlas-cli

# Login
atlas auth login

# List clusters
atlas clusters list

# Create cluster
atlas clusters create myCluster --provider AWS --region US_EAST_1 --tier M10

# Manage users
atlas dbusers create --username myuser --password mypass

# Backups
atlas backups snapshots list --clusterName myCluster
```

## Best Practices

1. **Use connection pooling** - Reuse connections
```javascript
const client = new MongoClient(uri, {
  maxPoolSize: 50,
  minPoolSize: 10
});
```

2. **Enable authentication** - Always use database users, not Atlas users

3. **Restrict network access** - IP whitelist or VPC peering

4. **Monitor regularly** - Set up alerts for key metrics

5. **Index optimization** - Use Performance Advisor recommendations

6. **Backup verification** - Regularly test restores

7. **Right-size clusters** - Start small, scale as needed

8. **Multi-region** - For global applications (M10+)

9. **Read preferences** - Use secondaries for read-heavy workloads
```javascript
const client = new MongoClient(uri, {
  readPreference: "secondaryPreferred"
});
```

10. **Connection string security** - Use environment variables
```javascript
const uri = process.env.MONGODB_URI;
```

## Troubleshooting

### Connection Issues
```javascript
// Check IP whitelist
// Verify credentials
// Test connection string

// Verbose logging
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  loggerLevel: "debug"
});
```

### Performance Issues
```javascript
// Check Performance Advisor
// Review slow query logs
// Analyze index usage
db.collection.aggregate([{ $indexStats: {} }])

// Check connection count
db.serverStatus().connections
```

### Common Errors
```javascript
// MongoNetworkError: IP not whitelisted
// → Add IP to Network Access

// Authentication failed: wrong credentials
// → Verify username/password in Database Access

// Timeout: connection string or network issue
// → Check connection string format, DNS resolution
```


### mongodb crud

# MongoDB CRUD Operations

CRUD operations (Create, Read, Update, Delete) in MongoDB with query operators and atomic updates.

## Create Operations

### insertOne
```javascript
// Insert single document
db.users.insertOne({
  name: "Alice",
  email: "alice@example.com",
  age: 30,
  createdAt: new Date()
})

// Returns: { acknowledged: true, insertedId: ObjectId("...") }
```

### insertMany
```javascript
// Insert multiple documents
db.users.insertMany([
  { name: "Bob", age: 25 },
  { name: "Charlie", age: 35 },
  { name: "Diana", age: 28 }
])

// With ordered: false (continue on error)
db.users.insertMany(docs, { ordered: false })
```

## Read Operations

### find
```javascript
// Find all documents
db.users.find()

// Find with filter
db.users.find({ age: { $gte: 18 } })

// Projection (select fields)
db.users.find({ status: "active" }, { name: 1, email: 1, _id: 0 })

// Cursor operations
db.users.find()
  .sort({ createdAt: -1 })
  .limit(10)
  .skip(20)
```

### findOne
```javascript
// Get single document
db.users.findOne({ email: "alice@example.com" })

// With projection
db.users.findOne({ _id: ObjectId("...") }, { name: 1, email: 1 })
```

### count/estimatedDocumentCount
```javascript
// Count matching documents
db.users.countDocuments({ status: "active" })

// Fast estimate (uses metadata)
db.users.estimatedDocumentCount()
```

### distinct
```javascript
// Get unique values
db.users.distinct("status")
db.users.distinct("city", { country: "USA" })
```

## Update Operations

### updateOne
```javascript
// Update first matching document
db.users.updateOne(
  { email: "alice@example.com" },
  { $set: { status: "verified" } }
)

// Upsert (insert if not exists)
db.users.updateOne(
  { email: "new@example.com" },
  { $set: { name: "New User" } },
  { upsert: true }
)
```

### updateMany
```javascript
// Update all matching documents
db.users.updateMany(
  { lastLogin: { $lt: cutoffDate } },
  { $set: { status: "inactive" } }
)

// Multiple updates
db.users.updateMany(
  { status: "pending" },
  {
    $set: { status: "active" },
    $currentDate: { updatedAt: true }
  }
)
```

### replaceOne
```javascript
// Replace entire document (except _id)
db.users.replaceOne(
  { _id: ObjectId("...") },
  { name: "Alice", email: "alice@example.com", age: 31 }
)
```

## Delete Operations

### deleteOne
```javascript
// Delete first matching document
db.users.deleteOne({ email: "alice@example.com" })
```

### deleteMany
```javascript
// Delete all matching documents
db.users.deleteMany({ status: "deleted" })

// Delete all documents in collection
db.users.deleteMany({})
```

## Query Operators

### Comparison Operators
```javascript
// $eq (equals)
db.users.find({ age: { $eq: 30 } })
db.users.find({ age: 30 })  // Implicit $eq

// $ne (not equals)
db.users.find({ status: { $ne: "deleted" } })

// $gt, $gte, $lt, $lte
db.users.find({ age: { $gt: 18, $lte: 65 } })

// $in (in array)
db.users.find({ status: { $in: ["active", "pending"] } })

// $nin (not in array)
db.users.find({ status: { $nin: ["deleted", "banned"] } })
```

### Logical Operators
```javascript
// $and (implicit for multiple conditions)
db.users.find({ age: { $gte: 18 }, status: "active" })

// $and (explicit)
db.users.find({
  $and: [
    { age: { $gte: 18 } },
    { status: "active" }
  ]
})

// $or
db.users.find({
  $or: [
    { status: "active" },
    { verified: true }
  ]
})

// $not
db.users.find({ age: { $not: { $lt: 18 } } })

// $nor (not any condition)
db.users.find({
  $nor: [
    { status: "deleted" },
    { status: "banned" }
  ]
})
```

### Element Operators
```javascript
// $exists
db.users.find({ phoneNumber: { $exists: true } })
db.users.find({ deletedAt: { $exists: false } })

// $type
db.users.find({ age: { $type: "int" } })
db.users.find({ age: { $type: ["int", "double"] } })
```

### Array Operators
```javascript
// $all (contains all elements)
db.posts.find({ tags: { $all: ["mongodb", "database"] } })

// $elemMatch (array element matches all conditions)
db.products.find({
  reviews: {
    $elemMatch: { rating: { $gte: 4 }, verified: true }
  }
})

// $size (array length)
db.posts.find({ tags: { $size: 3 } })
```

### String Operators
```javascript
// $regex (regular expression)
db.users.find({ name: { $regex: /^A/i } })
db.users.find({ email: { $regex: "@example\\.com$" } })

// Text search (requires text index)
db.articles.find({ $text: { $search: "mongodb database" } })
```

## Update Operators

### Field Update Operators
```javascript
// $set (set field value)
db.users.updateOne(
  { _id: userId },
  { $set: { status: "active", updatedAt: new Date() } }
)

// $unset (remove field)
db.users.updateOne(
  { _id: userId },
  { $unset: { tempField: "" } }
)

// $rename (rename field)
db.users.updateMany(
  {},
  { $rename: { "oldName": "newName" } }
)

// $currentDate (set to current date)
db.users.updateOne(
  { _id: userId },
  { $currentDate: { lastModified: true } }
)
```

### Numeric Update Operators
```javascript
// $inc (increment)
db.posts.updateOne(
  { _id: postId },
  { $inc: { views: 1, likes: 5 } }
)

// $mul (multiply)
db.products.updateOne(
  { _id: productId },
  { $mul: { price: 1.1 } }  // 10% increase
)

// $min (update if new value is less)
db.scores.updateOne(
  { _id: scoreId },
  { $min: { lowestScore: 50 } }
)

// $max (update if new value is greater)
db.scores.updateOne(
  { _id: scoreId },
  { $max: { highestScore: 100 } }
)
```

### Array Update Operators
```javascript
// $push (add to array)
db.posts.updateOne(
  { _id: postId },
  { $push: { comments: { author: "Alice", text: "Great!" } } }
)

// $push with $each (multiple elements)
db.posts.updateOne(
  { _id: postId },
  { $push: { tags: { $each: ["mongodb", "database"] } } }
)

// $addToSet (add if not exists)
db.users.updateOne(
  { _id: userId },
  { $addToSet: { interests: "coding" } }
)

// $pull (remove matching elements)
db.users.updateOne(
  { _id: userId },
  { $pull: { tags: "deprecated" } }
)

// $pop (remove first/last element)
db.users.updateOne(
  { _id: userId },
  { $pop: { notifications: -1 } }  // -1: first, 1: last
)

// $ (update first matching array element)
db.posts.updateOne(
  { _id: postId, "comments.author": "Alice" },
  { $set: { "comments.$.text": "Updated comment" } }
)

// $[] (update all array elements)
db.posts.updateOne(
  { _id: postId },
  { $set: { "comments.$[].verified": true } }
)

// $[<identifier>] (filtered positional)
db.posts.updateOne(
  { _id: postId },
  { $set: { "comments.$[elem].flagged": true } },
  { arrayFilters: [{ "elem.rating": { $lt: 2 } }] }
)
```

## Atomic Operations

### findAndModify / findOneAndUpdate
```javascript
// Find and update (returns old document by default)
db.users.findOneAndUpdate(
  { email: "alice@example.com" },
  { $set: { status: "active" } }
)

// Return new document
db.users.findOneAndUpdate(
  { email: "alice@example.com" },
  { $set: { status: "active" } },
  { returnNewDocument: true }
)

// Upsert and return new
db.counters.findOneAndUpdate(
  { _id: "sequence" },
  { $inc: { value: 1 } },
  { upsert: true, returnNewDocument: true }
)
```

### findOneAndReplace
```javascript
// Find and replace entire document
db.users.findOneAndReplace(
  { _id: ObjectId("...") },
  { name: "Alice", email: "alice@example.com" },
  { returnNewDocument: true }
)
```

### findOneAndDelete
```javascript
// Find and delete (returns deleted document)
const deletedUser = db.users.findOneAndDelete(
  { email: "alice@example.com" }
)
```

## Bulk Operations

```javascript
// Ordered bulk write (stops on first error)
db.users.bulkWrite([
  { insertOne: { document: { name: "Alice" } } },
  { updateOne: {
    filter: { name: "Bob" },
    update: { $set: { age: 25 } }
  }},
  { deleteOne: { filter: { name: "Charlie" } } }
])

// Unordered (continues on errors)
db.users.bulkWrite(operations, { ordered: false })
```

## Best Practices

1. **Use projection** to return only needed fields
2. **Create indexes** on frequently queried fields
3. **Use updateMany** carefully (can affect many documents)
4. **Use upsert** for "create or update" patterns
5. **Use atomic operators** ($inc, $push) for concurrent updates
6. **Avoid large arrays** in documents (embed vs reference)
7. **Use findAndModify** for atomic read-modify-write
8. **Batch operations** with insertMany/bulkWrite for efficiency


### mongodb indexing

# MongoDB Indexing and Performance

Index types, strategies, and performance optimization techniques for MongoDB.

## Index Fundamentals

Indexes improve query performance by allowing MongoDB to scan fewer documents. Without indexes, MongoDB performs collection scans (reads every document).

```javascript
// Check if query uses index
db.users.find({ email: "user@example.com" }).explain("executionStats")

// Key metrics:
// - executionTimeMillis: query duration
// - totalDocsExamined: documents scanned
// - nReturned: documents returned
// - stage: IXSCAN (index) vs COLLSCAN (full scan)
```

## Index Types

### Single Field Index
```javascript
// Create index on single field
db.users.createIndex({ email: 1 })  // 1: ascending, -1: descending

// Use case: queries filtering by email
db.users.find({ email: "user@example.com" })

// Drop index
db.users.dropIndex({ email: 1 })
db.users.dropIndex("email_1")  // By name
```

### Compound Index
```javascript
// Index on multiple fields (order matters!)
db.orders.createIndex({ status: 1, createdAt: -1 })

// Supports queries on:
// 1. { status: "..." }
// 2. { status: "...", createdAt: ... }
// Does NOT efficiently support: { createdAt: ... } alone

// Left-to-right prefix rule
db.orders.createIndex({ a: 1, b: 1, c: 1 })
// Supports: {a}, {a,b}, {a,b,c}
// Not: {b}, {c}, {b,c}
```

### Text Index (Full-Text Search)
```javascript
// Create text index
db.articles.createIndex({ title: "text", body: "text" })

// Only one text index per collection
db.articles.createIndex({
  title: "text",
  body: "text",
  tags: "text"
}, {
  weights: {
    title: 10,    // Title matches weighted higher
    body: 5,
    tags: 3
  }
})

// Search
db.articles.find({ $text: { $search: "mongodb database" } })

// Search with score
db.articles.find(
  { $text: { $search: "mongodb" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } })
```

### Geospatial Indexes
```javascript
// 2dsphere index (spherical geometry)
db.places.createIndex({ location: "2dsphere" })

// Document format
db.places.insertOne({
  name: "Coffee Shop",
  location: {
    type: "Point",
    coordinates: [-73.97, 40.77]  // [longitude, latitude]
  }
})

// Find nearby
db.places.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [-73.97, 40.77] },
      $maxDistance: 5000  // meters
    }
  }
})

// Within polygon
db.places.find({
  location: {
    $geoWithin: {
      $geometry: {
        type: "Polygon",
        coordinates: [[
          [lon1, lat1], [lon2, lat2], [lon3, lat3], [lon1, lat1]
        ]]
      }
    }
  }
})
```

### Wildcard Index
```javascript
// Index all fields in subdocuments
db.products.createIndex({ "attributes.$**": 1 })

// Supports queries on any nested field
db.products.find({ "attributes.color": "red" })
db.products.find({ "attributes.size": "large" })

// Specific paths only
db.products.createIndex(
  { "$**": 1 },
  { wildcardProjection: { "attributes.color": 1, "attributes.size": 1 } }
)
```

### Hashed Index
```javascript
// Hashed index (for even distribution in sharding)
db.users.createIndex({ userId: "hashed" })

// Use case: shard key
sh.shardCollection("mydb.users", { userId: "hashed" })
```

### TTL Index (Auto-Expiration)
```javascript
// Delete documents after specified time
db.sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }  // 1 hour
)

// Documents automatically deleted after createdAt + 3600 seconds
// Background task runs every 60 seconds
```

### Partial Index
```javascript
// Index only documents matching filter
db.orders.createIndex(
  { customerId: 1 },
  { partialFilterExpression: { status: "active" } }
)

// Index only used when query includes filter
db.orders.find({ customerId: "123", status: "active" })  // Uses index
db.orders.find({ customerId: "123" })  // Does not use index
```

### Unique Index
```javascript
// Enforce uniqueness
db.users.createIndex({ email: 1 }, { unique: true })

// Compound unique index
db.users.createIndex({ firstName: 1, lastName: 1 }, { unique: true })

// Sparse unique index (null values not indexed)
db.users.createIndex({ email: 1 }, { unique: true, sparse: true })
```

### Sparse Index
```javascript
// Index only documents with field present
db.users.createIndex({ phoneNumber: 1 }, { sparse: true })

// Useful for optional fields
// Documents without phoneNumber not in index
```

## Index Management

### List Indexes
```javascript
// Show all indexes
db.collection.getIndexes()

// Index statistics
db.collection.aggregate([{ $indexStats: {} }])
```

### Create Index Options
```javascript
// Background index (doesn't block operations)
db.collection.createIndex({ field: 1 }, { background: true })

// Index name
db.collection.createIndex({ field: 1 }, { name: "custom_index_name" })

// Case-insensitive index (collation)
db.collection.createIndex(
  { name: 1 },
  { collation: { locale: "en", strength: 2 } }
)
```

### Hide/Unhide Index
```javascript
// Hide index (test before dropping)
db.collection.hideIndex("index_name")

// Check performance without index
// ...

// Unhide or drop
db.collection.unhideIndex("index_name")
db.collection.dropIndex("index_name")
```

### Rebuild Indexes
```javascript
// Rebuild all indexes (after data changes)
db.collection.reIndex()

// Useful after bulk deletions to reclaim space
```

## Query Optimization

### Covered Queries
```javascript
// Query covered by index (no document fetch)
db.users.createIndex({ email: 1, name: 1 })

// Covered query (all fields in index)
db.users.find(
  { email: "user@example.com" },
  { email: 1, name: 1, _id: 0 }  // Must exclude _id
)

// Check with explain: stage should be "IXSCAN" with no "FETCH"
```

### Index Intersection
```javascript
// MongoDB can use multiple indexes
db.collection.createIndex({ a: 1 })
db.collection.createIndex({ b: 1 })

// Query may use both indexes
db.collection.find({ a: 1, b: 1 })

// Usually compound index is better
db.collection.createIndex({ a: 1, b: 1 })
```

### Index Hints
```javascript
// Force specific index
db.orders.find({ status: "active", city: "NYC" })
  .hint({ status: 1, createdAt: -1 })

// Force no index (for testing)
db.orders.find({ status: "active" }).hint({ $natural: 1 })
```

### ESR Rule (Equality, Sort, Range)
```javascript
// Optimal compound index order: Equality → Sort → Range

// Query
db.orders.find({
  status: "completed",        // Equality
  category: "electronics"     // Equality
}).sort({
  orderDate: -1               // Sort
}).limit(10)

// Optimal index
db.orders.createIndex({
  status: 1,      // Equality first
  category: 1,    // Equality
  orderDate: -1   // Sort last
})

// With range
db.orders.find({
  status: "completed",        // Equality
  total: { $gte: 100 }       // Range
}).sort({
  orderDate: -1               // Sort
})

// Optimal index
db.orders.createIndex({
  status: 1,      // Equality
  orderDate: -1,  // Sort
  total: 1        // Range last
})
```

## Performance Analysis

### explain() Modes
```javascript
// Query planner (default)
db.collection.find({ field: value }).explain()

// Execution stats
db.collection.find({ field: value }).explain("executionStats")

// All execution stats
db.collection.find({ field: value }).explain("allPlansExecution")
```

### Key Metrics
```javascript
// Good performance indicators:
// - executionTimeMillis < 100ms
// - totalDocsExamined ≈ nReturned (examine only what's needed)
// - stage: "IXSCAN" (using index)
// - totalKeysExamined ≈ nReturned (index selectivity)

// Bad indicators:
// - stage: "COLLSCAN" (full collection scan)
// - totalDocsExamined >> nReturned (scanning too many docs)
// - executionTimeMillis > 1000ms
```

### Index Selectivity
```javascript
// High selectivity = good (returns few documents)
// Low selectivity = bad (returns many documents)

// Check selectivity
db.collection.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])

// Good for indexing: email, userId, orderId
// Bad for indexing: gender, status (few unique values)
```

## Index Strategies

### Multi-Tenant Applications
```javascript
// Always filter by tenant first
db.data.createIndex({ tenantId: 1, createdAt: -1 })

// All queries include tenantId
db.data.find({ tenantId: "tenant1", createdAt: { $gte: date } })
```

### Time-Series Data
```javascript
// Index on timestamp descending (recent data accessed more)
db.events.createIndex({ timestamp: -1 })

// Compound with filter fields
db.events.createIndex({ userId: 1, timestamp: -1 })
```

### Lookup Optimization
```javascript
// Index foreign key fields
db.orders.createIndex({ customerId: 1 })
db.customers.createIndex({ _id: 1 })  // Default _id index

// Aggregation $lookup uses these indexes
```

## Best Practices

1. **Create indexes for frequent queries** - Analyze slow query logs
2. **Limit number of indexes** - Each index adds write overhead
3. **Use compound indexes** - More efficient than multiple single indexes
4. **Follow ESR rule** - Equality, Sort, Range order
5. **Use covered queries** - When possible, avoid document fetches
6. **Monitor index usage** - Drop unused indexes
```javascript
db.collection.aggregate([{ $indexStats: {} }])
```
7. **Partial indexes for filtered queries** - Reduce index size
8. **Consider index size** - Should fit in RAM
```javascript
db.collection.stats().indexSizes
```
9. **Background index creation** - Don't block operations (deprecated in 4.2+)
10. **Test with explain** - Verify query plan before production

## Common Pitfalls

1. **Over-indexing** - Too many indexes slow writes
2. **Unused indexes** - Waste space and write performance
3. **Regex without prefix** - `/pattern/` can't use index, `/^pattern/` can
4. **$ne, $nin queries** - Often scan entire collection
5. **$or with multiple branches** - May not use indexes efficiently
6. **Sort without index** - In-memory sort limited to 32MB
7. **Compound index order** - Wrong order makes index useless
8. **Case-sensitive queries** - Use collation for case-insensitive

## Monitoring

```javascript
// Current operations
db.currentOp()

// Slow queries (enable profiling)
db.setProfilingLevel(1, { slowms: 100 })
db.system.profile.find().sort({ ts: -1 }).limit(10)

// Index statistics
db.collection.aggregate([
  { $indexStats: {} },
  { $sort: { "accesses.ops": -1 } }
])

// Collection statistics
db.collection.stats()
```

## Index Size Calculation

```javascript
// Check index sizes
db.collection.stats().indexSizes

// Total index size
db.collection.totalIndexSize()

// Recommend: indexes fit in RAM
// Monitor: db.serverStatus().mem
```


### postgresql administration

# PostgreSQL Administration

User management, backups, replication, maintenance, and production database administration.

## User and Role Management

### Create Users
```sql
-- Create user with password
CREATE USER appuser WITH PASSWORD 'secure_password';

-- Create superuser
CREATE USER admin WITH SUPERUSER PASSWORD 'admin_password';

-- Create role without login
CREATE ROLE readonly;

-- Create user with attributes
CREATE USER developer WITH
  PASSWORD 'dev_pass'
  CREATEDB
  VALID UNTIL '2025-12-31';
```

### Alter Users
```sql
-- Change password
ALTER USER appuser WITH PASSWORD 'new_password';

-- Add attributes
ALTER USER appuser WITH CREATEDB CREATEROLE;

-- Remove attributes
ALTER USER appuser WITH NOSUPERUSER;

-- Rename user
ALTER USER oldname RENAME TO newname;

-- Set connection limit
ALTER USER appuser CONNECTION LIMIT 10;
```

### Roles and Inheritance
```sql
-- Create role hierarchy
CREATE ROLE readonly;
CREATE ROLE readwrite;

-- Grant role to user
GRANT readonly TO appuser;
GRANT readwrite TO developer;

-- Revoke role
REVOKE readonly FROM appuser;

-- Role membership
\du
```

### Permissions

#### Database Level
```sql
-- Grant database access
GRANT CONNECT ON DATABASE mydb TO appuser;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO appuser;

-- Revoke access
REVOKE CONNECT ON DATABASE mydb FROM appuser;
```

#### Table Level
```sql
-- Grant table permissions
GRANT SELECT ON users TO appuser;
GRANT SELECT, INSERT, UPDATE ON orders TO appuser;
GRANT ALL PRIVILEGES ON products TO appuser;

-- Grant on all tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;

-- Revoke permissions
REVOKE INSERT ON users FROM appuser;
```

#### Column Level
```sql
-- Grant specific columns
GRANT SELECT (id, name, email) ON users TO appuser;
GRANT UPDATE (status) ON orders TO appuser;
```

#### Sequence Permissions
```sql
-- Grant sequence usage (for SERIAL/auto-increment)
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO appuser;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO appuser;
```

#### Function Permissions
```sql
-- Grant execute on function
GRANT EXECUTE ON FUNCTION get_user(integer) TO appuser;
```

### Default Privileges
```sql
-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO readonly;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO readwrite;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE ON SEQUENCES TO readwrite;
```

### View Permissions
```sql
-- Show table permissions
\dp users

-- Show role memberships
\du

-- Query permissions
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'users';
```

## Backup and Restore

### pg_dump (Logical Backup)
```bash
# Dump database to SQL file
pg_dump mydb > mydb.sql

# Custom format (compressed, allows selective restore)
pg_dump -Fc mydb > mydb.dump

# Directory format (parallel dump)
pg_dump -Fd mydb -j 4 -f mydb_dir

# Specific table
pg_dump -t users mydb > users.sql

# Multiple tables
pg_dump -t users -t orders mydb > tables.sql

# Schema only
pg_dump -s mydb > schema.sql

# Data only
pg_dump -a mydb > data.sql

# Exclude table
pg_dump --exclude-table=logs mydb > mydb.sql

# With compression
pg_dump -Fc -Z 9 mydb > mydb.dump
```

### pg_dumpall (All Databases)
```bash
# Dump all databases
pg_dumpall > all_databases.sql

# Only globals (roles, tablespaces)
pg_dumpall --globals-only > globals.sql
```

### pg_restore
```bash
# Restore from custom format
pg_restore -d mydb mydb.dump

# Restore specific table
pg_restore -d mydb -t users mydb.dump

# List contents
pg_restore -l mydb.dump

# Parallel restore
pg_restore -d mydb -j 4 mydb.dump

# Clean database first
pg_restore -d mydb --clean mydb.dump

# Create database if not exists
pg_restore -C -d postgres mydb.dump
```

### Restore from SQL
```bash
# Restore SQL dump
psql mydb < mydb.sql

# Create database and restore
createdb mydb
psql mydb < mydb.sql

# Single transaction
psql -1 mydb < mydb.sql

# Stop on error
psql --set ON_ERROR_STOP=on mydb < mydb.sql
```

### Automated Backup Script
```bash
#!/bin/bash
# backup.sh

# Configuration
DB_NAME="mydb"
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Create backup
pg_dump -Fc "$DB_NAME" > "$BACKUP_DIR/${DB_NAME}_${DATE}.dump"

# Remove old backups
find "$BACKUP_DIR" -name "${DB_NAME}_*.dump" -mtime +$RETENTION_DAYS -delete

# Log
echo "Backup completed: ${DB_NAME}_${DATE}.dump"
```

### Point-in-Time Recovery (PITR)
```bash
# Enable WAL archiving (postgresql.conf)
wal_level = replica
archive_mode = on
archive_command = 'cp %p /archive/%f'
max_wal_senders = 3

# Base backup
pg_basebackup -D /backup/base -Ft -z -P

# Restore to point in time
# 1. Stop PostgreSQL
# 2. Restore base backup
# 3. Create recovery.conf with recovery_target_time
# 4. Start PostgreSQL
```

## Replication

### Streaming Replication (Primary-Replica)

#### Primary Setup
```sql
-- Create replication user
CREATE USER replicator WITH REPLICATION PASSWORD 'replica_pass';

-- Configure postgresql.conf
wal_level = replica
max_wal_senders = 3
wal_keep_size = 64MB

-- Configure pg_hba.conf
host replication replicator replica_ip/32 md5
```

#### Replica Setup
```bash
# Stop replica PostgreSQL
systemctl stop postgresql

# Remove data directory
rm -rf /var/lib/postgresql/data/*

# Clone from primary
pg_basebackup -h primary_host -D /var/lib/postgresql/data -U replicator -P -R

# Start replica
systemctl start postgresql

# Check replication status
SELECT * FROM pg_stat_replication;  -- On primary
```

### Logical Replication

#### Publisher (Primary)
```sql
-- Create publication
CREATE PUBLICATION my_publication FOR ALL TABLES;

-- Or specific tables
CREATE PUBLICATION my_publication FOR TABLE users, orders;

-- Check publications
\dRp
SELECT * FROM pg_publication;
```

#### Subscriber (Replica)
```sql
-- Create subscription
CREATE SUBSCRIPTION my_subscription
CONNECTION 'host=primary_host dbname=mydb user=replicator password=replica_pass'
PUBLICATION my_publication;

-- Check subscriptions
\dRs
SELECT * FROM pg_subscription;

-- Monitor replication
SELECT * FROM pg_stat_subscription;
```

## Monitoring

### Database Size
```sql
-- Database size
SELECT pg_size_pretty(pg_database_size('mydb'));

-- Table sizes
SELECT schemaname, tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index sizes
SELECT schemaname, tablename, indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC;
```

### Connections
```sql
-- Current connections
SELECT count(*) FROM pg_stat_activity;

-- Connections by database
SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;

-- Connection limit
SHOW max_connections;

-- Kill connection
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid = 12345;
```

### Activity
```sql
-- Active queries
SELECT pid, usename, state, query, query_start
FROM pg_stat_activity
WHERE state != 'idle';

-- Long-running queries
SELECT pid, now() - query_start AS duration, query
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC;

-- Blocking queries
SELECT blocked.pid AS blocked_pid,
       blocked.query AS blocked_query,
       blocking.pid AS blocking_pid,
       blocking.query AS blocking_query
FROM pg_stat_activity blocked
JOIN pg_stat_activity blocking
  ON blocking.pid = ANY(pg_blocking_pids(blocked.pid));
```

### Cache Hit Ratio
```sql
-- Should be > 0.99 for good performance
SELECT
  sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) AS cache_hit_ratio
FROM pg_statio_user_tables;
```

### Table Bloat
```sql
-- Check for table bloat (requires pgstattuple extension)
CREATE EXTENSION pgstattuple;

SELECT schemaname, tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  pgstattuple(schemaname||'.'||tablename) AS stats
FROM pg_tables
WHERE schemaname = 'public';
```

## Maintenance

### VACUUM
```sql
-- Reclaim storage
VACUUM users;

-- Verbose
VACUUM VERBOSE users;

-- Full (locks table, rewrites)
VACUUM FULL users;

-- With analyze
VACUUM ANALYZE users;

-- All tables
VACUUM;
```

### Auto-Vacuum
```sql
-- Check last vacuum
SELECT schemaname, tablename, last_vacuum, last_autovacuum
FROM pg_stat_user_tables;

-- Configure postgresql.conf
autovacuum = on
autovacuum_vacuum_threshold = 50
autovacuum_vacuum_scale_factor = 0.2
autovacuum_analyze_threshold = 50
autovacuum_analyze_scale_factor = 0.1
```

### REINDEX
```sql
-- Rebuild index
REINDEX INDEX idx_users_email;

-- Rebuild all indexes on table
REINDEX TABLE users;

-- Rebuild database indexes
REINDEX DATABASE mydb;

-- Concurrently (doesn't lock)
REINDEX INDEX CONCURRENTLY idx_users_email;
```

### ANALYZE
```sql
-- Update statistics
ANALYZE users;

-- Specific columns
ANALYZE users(email, status);

-- All tables
ANALYZE;

-- Verbose
ANALYZE VERBOSE users;
```

## Configuration

### postgresql.conf Location
```sql
SHOW config_file;
```

### Key Settings
```conf
# Memory
shared_buffers = 4GB                 # 25% of RAM
work_mem = 64MB                      # Per operation
maintenance_work_mem = 512MB         # VACUUM, CREATE INDEX
effective_cache_size = 12GB          # OS cache estimate

# Query Planner
random_page_cost = 1.1               # Lower for SSD
effective_io_concurrency = 200       # Concurrent disk ops

# Connections
max_connections = 100
superuser_reserved_connections = 3

# Logging
log_destination = 'stderr'
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d.log'
log_rotation_age = 1d
log_min_duration_statement = 100     # Log slow queries

# Replication
wal_level = replica
max_wal_senders = 3
wal_keep_size = 64MB

# Autovacuum
autovacuum = on
autovacuum_vacuum_scale_factor = 0.2
autovacuum_analyze_scale_factor = 0.1
```

### Reload Configuration
```sql
-- Reload config without restart
SELECT pg_reload_conf();

-- Or from shell
pg_ctl reload
```

## Security

### SSL/TLS
```conf
# postgresql.conf
ssl = on
ssl_cert_file = '/path/to/server.crt'
ssl_key_file = '/path/to/server.key'
ssl_ca_file = '/path/to/ca.crt'
```

### pg_hba.conf (Host-Based Authentication)
```conf
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# Local connections
local   all             postgres                                peer
local   all             all                                     md5

# Remote connections
host    all             all             0.0.0.0/0               md5
host    all             all             ::0/0                   md5

# Replication
host    replication     replicator      replica_ip/32           md5

# SSL required
hostssl all             all             0.0.0.0/0               md5
```

### Row Level Security
```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY user_policy ON users
  USING (user_id = current_user_id());

-- Drop policy
DROP POLICY user_policy ON users;

-- View policies
\d+ users
```

## Best Practices

1. **Backups**
   - Daily automated backups
   - Test restores regularly
   - Store backups off-site
   - Use pg_dump custom format for flexibility

2. **Monitoring**
   - Monitor connections, queries, cache hit ratio
   - Set up alerts for critical metrics
   - Log slow queries
   - Use pg_stat_statements

3. **Security**
   - Use strong passwords
   - Restrict network access (pg_hba.conf)
   - Enable SSL/TLS
   - Regular security updates
   - Principle of least privilege

4. **Maintenance**
   - Regular VACUUM and ANALYZE
   - Monitor autovacuum
   - REINDEX periodically
   - Check for table bloat

5. **Configuration**
   - Tune for workload
   - Use connection pooling (pgBouncer)
   - Monitor and adjust memory settings
   - Keep PostgreSQL updated

6. **Replication**
   - At least one replica for HA
   - Monitor replication lag
   - Test failover procedures
   - Use logical replication for selective replication


### postgresql performance

# PostgreSQL Performance Optimization

Query optimization, indexing strategies, EXPLAIN analysis, and performance tuning for PostgreSQL.

## EXPLAIN Command

### Basic EXPLAIN
```sql
-- Show query plan
EXPLAIN SELECT * FROM users WHERE id = 1;

-- Output shows:
-- - Execution plan nodes
-- - Estimated costs
-- - Estimated rows
```

### EXPLAIN ANALYZE
```sql
-- Execute query and show actual performance
EXPLAIN ANALYZE SELECT * FROM users WHERE age > 18;

-- Shows:
-- - Actual execution time
-- - Actual rows returned
-- - Planning time
-- - Execution time
```

### EXPLAIN Options
```sql
-- Verbose output
EXPLAIN (VERBOSE) SELECT * FROM users;

-- Show buffer usage
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM users WHERE active = true;

-- JSON format
EXPLAIN (FORMAT JSON, ANALYZE) SELECT * FROM users;

-- All options
EXPLAIN (ANALYZE, BUFFERS, VERBOSE, TIMING, COSTS)
SELECT * FROM users WHERE id = 1;
```

## Understanding Query Plans

### Scan Methods

#### Sequential Scan
```sql
-- Full table scan (reads all rows)
EXPLAIN SELECT * FROM users WHERE name = 'Alice';

-- Output: Seq Scan on users
-- Indicates: no suitable index or small table
```

#### Index Scan
```sql
-- Uses index to find rows
EXPLAIN SELECT * FROM users WHERE id = 1;

-- Output: Index Scan using users_pkey on users
-- Best for: selective queries, small result sets
```

#### Index Only Scan
```sql
-- Query covered by index (no table access)
CREATE INDEX idx_users_email_name ON users(email, name);
EXPLAIN SELECT email, name FROM users WHERE email = 'alice@example.com';

-- Output: Index Only Scan using idx_users_email_name
-- Best performance: no heap fetch needed
```

#### Bitmap Scan
```sql
-- Combines multiple indexes or handles large result sets
EXPLAIN SELECT * FROM users WHERE age > 18 AND status = 'active';

-- Output:
-- Bitmap Heap Scan on users
--   Recheck Cond: ...
--   -> Bitmap Index Scan on idx_age

-- Good for: moderate selectivity
```

### Join Methods

#### Nested Loop
```sql
-- For each row in outer table, scan inner table
EXPLAIN SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE c.id = 1;

-- Output: Nested Loop
-- Best for: small outer table, indexed inner table
```

#### Hash Join
```sql
-- Build hash table from smaller table
EXPLAIN SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id;

-- Output: Hash Join
-- Best for: large tables, equality conditions
```

#### Merge Join
```sql
-- Both inputs sorted on join key
EXPLAIN SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id
ORDER BY o.customer_id;

-- Output: Merge Join
-- Best for: pre-sorted data, large sorted inputs
```

## Indexing Strategies

### B-tree Index (Default)
```sql
-- General purpose index
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_date ON orders(order_date);

-- Supports: =, <, <=, >, >=, BETWEEN, IN, IS NULL
-- Supports: ORDER BY, MIN/MAX
```

### Composite Index
```sql
-- Multiple columns (order matters!)
CREATE INDEX idx_users_status_created ON users(status, created_at);

-- Supports queries on:
-- - status
-- - status, created_at
-- Does NOT support: created_at alone

-- Column order: most selective first
-- Exception: match query WHERE/ORDER BY patterns
```

### Partial Index
```sql
-- Index subset of rows
CREATE INDEX idx_active_users ON users(email)
WHERE status = 'active';

-- Smaller index, faster queries with matching WHERE clause
-- Query must include WHERE status = 'active' to use index
```

### Expression Index
```sql
-- Index on computed value
CREATE INDEX idx_users_lower_email ON users(LOWER(email));

-- Query must use same expression
SELECT * FROM users WHERE LOWER(email) = 'alice@example.com';
```

### GIN Index (Generalized Inverted Index)
```sql
-- For array, JSONB, full-text search
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_documents_data ON documents USING GIN(data);

-- Array queries
SELECT * FROM products WHERE tags @> ARRAY['featured'];

-- JSONB queries
SELECT * FROM documents WHERE data @> '{"status": "active"}';
```

### GiST Index (Generalized Search Tree)
```sql
-- For geometric data, range types, full-text
CREATE INDEX idx_locations_geom ON locations USING GiST(geom);

-- Geometric queries
SELECT * FROM locations WHERE geom && ST_MakeEnvelope(...);
```

### Hash Index
```sql
-- Equality comparisons only
CREATE INDEX idx_users_hash_email ON users USING HASH(email);

-- Only supports: =
-- Rarely used (B-tree usually better)
```

### BRIN Index (Block Range Index)
```sql
-- For very large tables with natural clustering
CREATE INDEX idx_logs_brin_created ON logs USING BRIN(created_at);

-- Tiny index size, good for append-only data
-- Best for: time-series, logging, large tables
```

## Query Optimization Techniques

### Avoid SELECT *
```sql
-- Bad
SELECT * FROM users WHERE id = 1;

-- Good (only needed columns)
SELECT id, name, email FROM users WHERE id = 1;
```

### Use LIMIT
```sql
-- Limit result set
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;

-- PostgreSQL can stop early with LIMIT
```

### Index for ORDER BY
```sql
-- Create index matching sort order
CREATE INDEX idx_users_created_desc ON users(created_at DESC);

-- Query uses index for sorting
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;
```

### Covering Index
```sql
-- Include all queried columns in index
CREATE INDEX idx_users_email_name_status ON users(email, name, status);

-- Query covered by index (no table access)
SELECT name, status FROM users WHERE email = 'alice@example.com';
```

### EXISTS vs IN
```sql
-- Prefer EXISTS for large subqueries
-- Bad
SELECT * FROM customers
WHERE id IN (SELECT customer_id FROM orders WHERE total > 1000);

-- Good
SELECT * FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.total > 1000);
```

### JOIN Order
```sql
-- Filter before joining
-- Bad
SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.status = 'completed' AND c.country = 'USA';

-- Good (filter in subquery)
SELECT * FROM (
  SELECT * FROM orders WHERE status = 'completed'
) o
JOIN (
  SELECT * FROM customers WHERE country = 'USA'
) c ON o.customer_id = c.id;

-- Or use CTE
WITH filtered_orders AS (
  SELECT * FROM orders WHERE status = 'completed'
),
filtered_customers AS (
  SELECT * FROM customers WHERE country = 'USA'
)
SELECT * FROM filtered_orders o
JOIN filtered_customers c ON o.customer_id = c.id;
```

### Avoid Functions in WHERE
```sql
-- Bad (index not used)
SELECT * FROM users WHERE LOWER(email) = 'alice@example.com';

-- Good (create expression index)
CREATE INDEX idx_users_lower_email ON users(LOWER(email));
-- Then query uses index

-- Or store lowercase separately
ALTER TABLE users ADD COLUMN email_lower TEXT;
UPDATE users SET email_lower = LOWER(email);
CREATE INDEX idx_users_email_lower ON users(email_lower);
```

## Statistics and ANALYZE

### Update Statistics
```sql
-- Analyze table (update statistics)
ANALYZE users;

-- Analyze specific columns
ANALYZE users(email, status);

-- Analyze all tables
ANALYZE;

-- Auto-analyze (configured in postgresql.conf)
autovacuum_analyze_threshold = 50
autovacuum_analyze_scale_factor = 0.1
```

### Check Statistics
```sql
-- Last analyze time
SELECT schemaname, tablename, last_analyze, last_autoanalyze
FROM pg_stat_user_tables;

-- Statistics targets (adjust for important columns)
ALTER TABLE users ALTER COLUMN email SET STATISTICS 1000;
```

## VACUUM and Maintenance

### VACUUM
```sql
-- Reclaim storage, update statistics
VACUUM users;

-- Verbose output
VACUUM VERBOSE users;

-- Full vacuum (rewrites table, locks table)
VACUUM FULL users;

-- Analyze after vacuum
VACUUM ANALYZE users;
```

### Auto-Vacuum
```sql
-- Check autovacuum status
SELECT schemaname, tablename, last_vacuum, last_autovacuum
FROM pg_stat_user_tables;

-- Configure in postgresql.conf
autovacuum = on
autovacuum_vacuum_threshold = 50
autovacuum_vacuum_scale_factor = 0.2
```

### REINDEX
```sql
-- Rebuild index
REINDEX INDEX idx_users_email;

-- Rebuild all indexes on table
REINDEX TABLE users;

-- Rebuild all indexes in schema
REINDEX SCHEMA public;
```

## Monitoring Queries

### Active Queries
```sql
-- Current queries
SELECT pid, usename, state, query, query_start
FROM pg_stat_activity
WHERE state != 'idle';

-- Long-running queries
SELECT pid, now() - query_start AS duration, query
FROM pg_stat_activity
WHERE state != 'idle' AND now() - query_start > interval '5 minutes'
ORDER BY duration DESC;
```

### Slow Query Log
```sql
-- Enable slow query logging (postgresql.conf)
log_min_duration_statement = 100  -- milliseconds

-- Or per session
SET log_min_duration_statement = 100;

-- Logs appear in PostgreSQL log files
```

### pg_stat_statements Extension
```sql
-- Enable extension
CREATE EXTENSION pg_stat_statements;

-- View query statistics
SELECT query, calls, total_exec_time, mean_exec_time, rows
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Reset statistics
SELECT pg_stat_statements_reset();
```

## Index Usage Analysis

### Check Index Usage
```sql
-- Index usage statistics
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan;

-- Unused indexes (idx_scan = 0)
SELECT schemaname, tablename, indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND indexname NOT LIKE '%_pkey';
```

### Index Size
```sql
-- Index sizes
SELECT schemaname, tablename, indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC;
```

### Missing Indexes
```sql
-- Tables with sequential scans
SELECT schemaname, tablename, seq_scan, seq_tup_read
FROM pg_stat_user_tables
WHERE seq_scan > 0
ORDER BY seq_tup_read DESC;

-- Consider adding indexes to high seq_scan tables
```

## Configuration Tuning

### Memory Settings (postgresql.conf)
```conf
# Shared buffers (25% of RAM)
shared_buffers = 4GB

# Work memory (per operation)
work_mem = 64MB

# Maintenance work memory (VACUUM, CREATE INDEX)
maintenance_work_mem = 512MB

# Effective cache size (estimate of OS cache)
effective_cache_size = 12GB
```

### Query Planner Settings
```conf
# Random page cost (lower for SSD)
random_page_cost = 1.1

# Effective IO concurrency (number of concurrent disk operations)
effective_io_concurrency = 200

# Cost of parallel query startup
parallel_setup_cost = 1000
parallel_tuple_cost = 0.1
```

### Connection Settings
```conf
# Max connections
max_connections = 100

# Connection pooling recommended (pgBouncer)
```

## Best Practices

1. **Index strategy**
   - Index foreign keys
   - Index WHERE clause columns
   - Index ORDER BY columns
   - Use composite indexes for multi-column queries
   - Keep index count reasonable (5-10 per table)

2. **Query optimization**
   - Use EXPLAIN ANALYZE
   - Avoid SELECT *
   - Use LIMIT when possible
   - Filter before joining
   - Use appropriate join type

3. **Statistics**
   - Regular ANALYZE
   - Increase statistics target for skewed distributions
   - Monitor autovacuum

4. **Monitoring**
   - Enable pg_stat_statements
   - Log slow queries
   - Monitor index usage
   - Check table bloat

5. **Maintenance**
   - Regular VACUUM
   - REINDEX periodically
   - Update PostgreSQL version
   - Monitor disk space

6. **Configuration**
   - Tune memory settings
   - Adjust for workload (OLTP vs OLAP)
   - Use connection pooling
   - Enable query logging

7. **Testing**
   - Test queries with production-like data volume
   - Benchmark before/after changes
   - Monitor production metrics


### postgresql psql cli

# PostgreSQL psql CLI

Command-line interface for PostgreSQL: connection, meta-commands, scripting, and interactive usage.

## Connection

### Basic Connection
```bash
# Connect to database
psql -U username -d database -h hostname -p 5432

# Connect using URI
psql postgresql://username:password@hostname:5432/database

# Environment variables
export PGUSER=postgres
export PGPASSWORD=mypassword
export PGHOST=localhost
export PGPORT=5432
export PGDATABASE=mydb
psql
```

### Password File (~/.pgpass)
```bash
# Format: hostname:port:database:username:password
# chmod 600 ~/.pgpass
localhost:5432:mydb:postgres:mypassword
*.example.com:5432:*:appuser:apppass
```

### SSL Connection
```bash
# Require SSL
psql "host=hostname sslmode=require user=username dbname=database"

# Verify certificate
psql "host=hostname sslmode=verify-full \
  sslcert=/path/to/client.crt \
  sslkey=/path/to/client.key \
  sslrootcert=/path/to/ca.crt"
```

## Essential Meta-Commands

### Database Navigation
```bash
\l or \list                    # List databases
\l+                            # List with sizes
\c database                    # Connect to database
\c database username           # Connect as user
\conninfo                      # Connection info
```

### Schema Inspection
```bash
\dn                            # List schemas
\dt                            # List tables
\dt+                           # Tables with sizes
\dt *.*                        # All tables, all schemas
\di                            # List indexes
\dv                            # List views
\dm                            # List materialized views
\ds                            # List sequences
\df                            # List functions
```

### Object Description
```bash
\d tablename                   # Describe table
\d+ tablename                  # Detailed description
\d indexname                   # Describe index
\df functionname               # Describe function
\du                            # List users/roles
\dp tablename                  # Show permissions
```

### Output Formatting
```bash
\x                             # Toggle expanded output
\x on                          # Enable expanded
\x off                         # Disable expanded
\a                             # Toggle aligned output
\t                             # Toggle tuples only
\H                             # HTML output
\pset format csv               # CSV format
\pset null '[NULL]'            # Show NULL values
```

### Execution Commands
```bash
\i filename.sql                # Execute SQL file
\o output.txt                  # Redirect output to file
\o                             # Stop redirecting
\! command                     # Execute shell command
\timing                        # Toggle timing
\q                             # Quit
```

## psql Command-Line Options

```bash
# Connection
-h hostname                    # Host
-p port                        # Port (default 5432)
-U username                    # Username
-d database                    # Database
-W                             # Prompt for password

# Execution
-c "SQL"                       # Execute command and exit
-f file.sql                    # Execute file
--command="SQL"                # Execute command

# Output
-t                             # Tuples only (no headers)
-A                             # Unaligned output
-F ","                         # Field separator
-o output.txt                  # Output to file
-q                             # Quiet mode
-x                             # Expanded output

# Script options
-1                             # Execute as transaction
--on-error-stop                # Stop on error
-v variable=value              # Set variable
-L logfile.log                 # Log session
```

## Running SQL

### Interactive Queries
```sql
-- Simple query
SELECT * FROM users;

-- Multi-line (ends with semicolon)
SELECT id, name, email
FROM users
WHERE active = true;

-- Edit in editor
\e

-- Repeat last query
\g

-- Send to file
\g output.txt
```

### Variables
```bash
# Set variable
\set myvar 'value'
\set limit 10

# Use variable
SELECT * FROM users LIMIT :limit;

# String variable (quoted)
\set username 'alice'
SELECT * FROM users WHERE name = :'username';

# Show all variables
\set

# Unset variable
\unset myvar
```

### Scripts
```sql
-- script.sql
\set ON_ERROR_STOP on

BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE
);

INSERT INTO users (name, email) VALUES
  ('Alice', 'alice@example.com'),
  ('Bob', 'bob@example.com');

COMMIT;

\echo 'Script completed!'
```

```bash
# Execute script
psql -d mydb -f script.sql

# With error stopping
psql -d mydb -f script.sql --on-error-stop

# In single transaction
psql -d mydb -1 -f script.sql
```

## Data Import/Export

### COPY (Server-side)
```sql
-- Export to CSV
COPY users TO '/tmp/users.csv' WITH (FORMAT CSV, HEADER);

-- Import from CSV
COPY users FROM '/tmp/users.csv' WITH (FORMAT CSV, HEADER);

-- Query to file
COPY (SELECT * FROM users WHERE active = true)
TO '/tmp/active_users.csv' WITH (FORMAT CSV, HEADER);
```

### \copy (Client-side)
```bash
# Export (from psql)
\copy users TO 'users.csv' WITH (FORMAT CSV, HEADER)

# Export query results
\copy (SELECT * FROM users WHERE active = true) TO 'active.csv' CSV HEADER

# Import
\copy users FROM 'users.csv' WITH (FORMAT CSV, HEADER)

# To stdout
\copy users TO STDOUT CSV HEADER > users.csv
```

### pg_dump / pg_restore
```bash
# Dump database
pg_dump mydb > mydb.sql
pg_dump -d mydb -Fc > mydb.dump  # Custom format

# Dump specific table
pg_dump -t users mydb > users.sql

# Schema only
pg_dump -s mydb > schema.sql

# Data only
pg_dump -a mydb > data.sql

# Restore
psql mydb < mydb.sql
pg_restore -d mydb mydb.dump
```

## Configuration

### ~/.psqlrc
```bash
# Auto-loaded on psql startup
\set QUIET ON

-- Prompt customization
\set PROMPT1 '%n@%m:%>/%/%R%# '

-- Output settings
\pset null '[NULL]'
\pset border 2
\pset linestyle unicode
\pset expanded auto

-- Timing
\timing ON

-- Pager
\pset pager always

-- History
\set HISTSIZE 10000

-- Custom shortcuts
\set active_users 'SELECT * FROM users WHERE status = ''active'';'
\set dbsize 'SELECT pg_size_pretty(pg_database_size(current_database()));'

\set QUIET OFF
```

### Useful Aliases
```bash
# Add to ~/.psqlrc
\set locks 'SELECT pid, usename, pg_blocking_pids(pid) as blocked_by, query FROM pg_stat_activity WHERE cardinality(pg_blocking_pids(pid)) > 0;'

\set activity 'SELECT pid, usename, state, query FROM pg_stat_activity WHERE state != ''idle'';'

\set table_sizes 'SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||''.''||tablename)) FROM pg_tables ORDER BY pg_total_relation_size(schemaname||''.''||tablename) DESC;'

\set index_usage 'SELECT schemaname, tablename, indexname, idx_scan FROM pg_stat_user_indexes ORDER BY idx_scan;'

# Usage: :locks, :activity, :table_sizes
```

## Transactions

```sql
-- Begin transaction
BEGIN;

-- Or
START TRANSACTION;

-- Savepoint
SAVEPOINT sp1;

-- Rollback to savepoint
ROLLBACK TO sp1;

-- Commit
COMMIT;

-- Rollback
ROLLBACK;
```

## Performance Analysis

### EXPLAIN
```sql
-- Show query plan
EXPLAIN SELECT * FROM users WHERE id = 1;

-- With execution
EXPLAIN ANALYZE SELECT * FROM users WHERE age > 18;

-- Verbose
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT * FROM users WHERE active = true;
```

### Current Activity
```sql
-- Active queries
SELECT pid, usename, state, query
FROM pg_stat_activity;

-- Long-running queries
SELECT pid, now() - query_start AS duration, query
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC;

-- Blocking queries
SELECT blocked.pid, blocking.pid AS blocking_pid,
       blocked.query AS blocked_query,
       blocking.query AS blocking_query
FROM pg_stat_activity blocked
JOIN pg_stat_activity blocking
  ON blocking.pid = ANY(pg_blocking_pids(blocked.pid));
```

### Statistics
```sql
-- Database size
SELECT pg_size_pretty(pg_database_size(current_database()));

-- Table sizes
SELECT schemaname, tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan;
```

## User Management

```sql
-- Create user
CREATE USER appuser WITH PASSWORD 'secure_password';

-- Create superuser
CREATE USER admin WITH PASSWORD 'password' SUPERUSER;

-- Alter user
ALTER USER appuser WITH PASSWORD 'new_password';

-- Grant permissions
GRANT CONNECT ON DATABASE mydb TO appuser;
GRANT USAGE ON SCHEMA public TO appuser;
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO appuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO appuser;

-- Default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO appuser;

-- View permissions
\dp users

-- Drop user
DROP USER appuser;
```

## Backup Patterns

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump -Fc mydb > /backups/mydb_$DATE.dump

# Restore latest
pg_restore -d mydb /backups/mydb_latest.dump

# Backup all databases
pg_dumpall > /backups/all_databases.sql

# Backup specific schema
pg_dump -n public mydb > public_schema.sql
```

## Troubleshooting

### Connection Issues
```bash
# Test connection
psql -h hostname -U username -d postgres -c "SELECT 1;"

# Check pg_hba.conf
# /var/lib/postgresql/data/pg_hba.conf

# Verbose connection
psql -h hostname -d mydb --echo-all
```

### Performance Issues
```sql
-- Enable slow query logging
ALTER DATABASE mydb SET log_min_duration_statement = 100;

-- Check cache hit ratio
SELECT
  sum(heap_blks_read) as heap_read,
  sum(heap_blks_hit) as heap_hit,
  sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) AS ratio
FROM pg_statio_user_tables;

-- Find slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## Best Practices

1. **Use .pgpass** for credential management
2. **Set ON_ERROR_STOP** in scripts
3. **Use transactions** for multi-statement changes
4. **Test with EXPLAIN** before running expensive queries
5. **Use \timing** to measure query performance
6. **Configure ~/.psqlrc** for productivity
7. **Use variables** for dynamic queries
8. **Log sessions** with -L for auditing
9. **Use \copy** instead of COPY for client operations
10. **Regular backups** with pg_dump


### postgresql queries

# PostgreSQL SQL Queries

SQL queries in PostgreSQL: SELECT, JOINs, subqueries, CTEs, window functions, and advanced patterns.

## Basic SELECT

### Simple Queries
```sql
-- Select all columns
SELECT * FROM users;

-- Select specific columns
SELECT id, name, email FROM users;

-- With alias
SELECT name AS full_name, email AS contact_email FROM users;

-- Distinct values
SELECT DISTINCT status FROM orders;

-- Count rows
SELECT COUNT(*) FROM users;
SELECT COUNT(DISTINCT status) FROM orders;
```

### WHERE Clause
```sql
-- Equality
SELECT * FROM users WHERE status = 'active';

-- Comparison
SELECT * FROM products WHERE price > 100;
SELECT * FROM orders WHERE total BETWEEN 100 AND 500;

-- Pattern matching
SELECT * FROM users WHERE email LIKE '%@example.com';
SELECT * FROM users WHERE name ILIKE 'john%';  -- case-insensitive

-- IN operator
SELECT * FROM orders WHERE status IN ('pending', 'processing');

-- NULL checks
SELECT * FROM users WHERE deleted_at IS NULL;
SELECT * FROM users WHERE phone_number IS NOT NULL;

-- Logical operators
SELECT * FROM products WHERE price > 100 AND stock > 0;
SELECT * FROM users WHERE status = 'active' OR verified = true;
SELECT * FROM products WHERE NOT (price > 1000);
```

### ORDER BY
```sql
-- Ascending (default)
SELECT * FROM users ORDER BY created_at;

-- Descending
SELECT * FROM users ORDER BY created_at DESC;

-- Multiple columns
SELECT * FROM orders ORDER BY status ASC, created_at DESC;

-- NULL handling
SELECT * FROM users ORDER BY last_login NULLS FIRST;
SELECT * FROM users ORDER BY last_login NULLS LAST;
```

### LIMIT and OFFSET
```sql
-- Limit results
SELECT * FROM users LIMIT 10;

-- Pagination
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 20;

-- Alternative: FETCH
SELECT * FROM users OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;
```

## JOINs

### INNER JOIN
```sql
-- Match rows from both tables
SELECT orders.id, orders.total, customers.name
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id;

-- Short syntax
SELECT o.id, o.total, c.name
FROM orders o
JOIN customers c ON o.customer_id = c.id;

-- Multiple joins
SELECT o.id, c.name, p.name AS product
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON oi.product_id = p.id;
```

### LEFT JOIN (LEFT OUTER JOIN)
```sql
-- All rows from left table, matching rows from right
SELECT c.name, o.id AS order_id
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;

-- Find customers without orders
SELECT c.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;
```

### RIGHT JOIN (RIGHT OUTER JOIN)
```sql
-- All rows from right table, matching rows from left
SELECT c.name, o.id AS order_id
FROM orders o
RIGHT JOIN customers c ON o.customer_id = c.id;
```

### FULL OUTER JOIN
```sql
-- All rows from both tables
SELECT c.name, o.id AS order_id
FROM customers c
FULL OUTER JOIN orders o ON c.id = o.customer_id;
```

### CROSS JOIN
```sql
-- Cartesian product (all combinations)
SELECT c.name, p.name
FROM colors c
CROSS JOIN products p;
```

### Self Join
```sql
-- Join table to itself
SELECT e1.name AS employee, e2.name AS manager
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.id;
```

## Subqueries

### Scalar Subquery
```sql
-- Return single value
SELECT name, salary,
  (SELECT AVG(salary) FROM employees) AS avg_salary
FROM employees;
```

### IN Subquery
```sql
-- Match against set of values
SELECT name FROM customers
WHERE id IN (
  SELECT customer_id FROM orders WHERE total > 1000
);
```

### EXISTS Subquery
```sql
-- Check if subquery returns any rows
SELECT name FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);

-- NOT EXISTS
SELECT name FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);
```

### Correlated Subquery
```sql
-- Subquery references outer query
SELECT name, salary FROM employees e1
WHERE salary > (
  SELECT AVG(salary) FROM employees e2
  WHERE e2.department_id = e1.department_id
);
```

## Common Table Expressions (CTEs)

### Simple CTE
```sql
-- Named temporary result set
WITH active_users AS (
  SELECT id, name, email FROM users WHERE status = 'active'
)
SELECT * FROM active_users WHERE created_at > '2024-01-01';
```

### Multiple CTEs
```sql
WITH
  active_customers AS (
    SELECT id, name FROM customers WHERE active = true
  ),
  recent_orders AS (
    SELECT customer_id, SUM(total) AS total_spent
    FROM orders
    WHERE order_date > CURRENT_DATE - INTERVAL '30 days'
    GROUP BY customer_id
  )
SELECT c.name, COALESCE(o.total_spent, 0) AS spent
FROM active_customers c
LEFT JOIN recent_orders o ON c.id = o.customer_id;
```

### Recursive CTE
```sql
-- Tree traversal, hierarchical data
WITH RECURSIVE category_tree AS (
  -- Base case: root categories
  SELECT id, name, parent_id, 0 AS level
  FROM categories
  WHERE parent_id IS NULL

  UNION ALL

  -- Recursive case: child categories
  SELECT c.id, c.name, c.parent_id, ct.level + 1
  FROM categories c
  JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree ORDER BY level, name;

-- Employee hierarchy
WITH RECURSIVE org_chart AS (
  SELECT id, name, manager_id, 1 AS level
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  SELECT e.id, e.name, e.manager_id, oc.level + 1
  FROM employees e
  JOIN org_chart oc ON e.manager_id = oc.id
)
SELECT * FROM org_chart;
```

## Aggregate Functions

### Basic Aggregates
```sql
-- COUNT, SUM, AVG, MIN, MAX
SELECT
  COUNT(*) AS total_orders,
  SUM(total) AS total_revenue,
  AVG(total) AS avg_order_value,
  MIN(total) AS min_order,
  MAX(total) AS max_order
FROM orders;

-- COUNT variations
SELECT COUNT(*) FROM users;              -- All rows
SELECT COUNT(phone_number) FROM users;   -- Non-NULL values
SELECT COUNT(DISTINCT status) FROM orders; -- Unique values
```

### GROUP BY
```sql
-- Aggregate by groups
SELECT status, COUNT(*) AS count
FROM orders
GROUP BY status;

-- Multiple grouping columns
SELECT customer_id, status, COUNT(*) AS count
FROM orders
GROUP BY customer_id, status;

-- With aggregate functions
SELECT customer_id,
  COUNT(*) AS order_count,
  SUM(total) AS total_spent,
  AVG(total) AS avg_order
FROM orders
GROUP BY customer_id;
```

### HAVING
```sql
-- Filter after aggregation
SELECT customer_id, SUM(total) AS total_spent
FROM orders
GROUP BY customer_id
HAVING SUM(total) > 1000;

-- Multiple conditions
SELECT status, COUNT(*) AS count
FROM orders
GROUP BY status
HAVING COUNT(*) > 10;
```

## Window Functions

### ROW_NUMBER
```sql
-- Assign unique number to each row
SELECT id, name, salary,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank
FROM employees;

-- Partition by group
SELECT id, department, salary,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank
FROM employees;
```

### RANK / DENSE_RANK
```sql
-- RANK: gaps in ranking for ties
-- DENSE_RANK: no gaps
SELECT id, name, salary,
  RANK() OVER (ORDER BY salary DESC) AS rank,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank
FROM employees;
```

### LAG / LEAD
```sql
-- Access previous/next row
SELECT date, revenue,
  LAG(revenue) OVER (ORDER BY date) AS prev_revenue,
  LEAD(revenue) OVER (ORDER BY date) AS next_revenue,
  revenue - LAG(revenue) OVER (ORDER BY date) AS change
FROM daily_sales;
```

### Running Totals
```sql
-- Cumulative sum
SELECT date, amount,
  SUM(amount) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM transactions;

-- Simpler syntax
SELECT date, amount,
  SUM(amount) OVER (ORDER BY date) AS running_total
FROM transactions;
```

### Moving Averages
```sql
-- 7-day moving average
SELECT date, value,
  AVG(value) OVER (
    ORDER BY date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS moving_avg_7d
FROM metrics;
```

## Advanced Patterns

### CASE Expressions
```sql
-- Simple CASE
SELECT name,
  CASE status
    WHEN 'active' THEN 'Active User'
    WHEN 'pending' THEN 'Pending Verification'
    ELSE 'Inactive'
  END AS status_label
FROM users;

-- Searched CASE
SELECT name, age,
  CASE
    WHEN age < 18 THEN 'Minor'
    WHEN age BETWEEN 18 AND 65 THEN 'Adult'
    ELSE 'Senior'
  END AS age_group
FROM users;
```

### COALESCE
```sql
-- Return first non-NULL value
SELECT name, COALESCE(phone_number, email, 'No contact') AS contact
FROM users;
```

### NULLIF
```sql
-- Return NULL if values equal
SELECT name, NULLIF(status, 'deleted') AS active_status
FROM users;
```

### Array Operations
```sql
-- Array aggregate
SELECT customer_id, ARRAY_AGG(product_id) AS products
FROM order_items
GROUP BY customer_id;

-- Unnest array
SELECT unnest(ARRAY[1, 2, 3, 4, 5]);

-- Array contains
SELECT * FROM products WHERE tags @> ARRAY['featured'];
```

### JSON Operations
```sql
-- Query JSON/JSONB
SELECT data->>'name' AS name FROM documents;
SELECT data->'address'->>'city' AS city FROM documents;

-- Check key exists
SELECT * FROM documents WHERE data ? 'email';

-- JSONB operators
SELECT * FROM documents WHERE data @> '{"status": "active"}';

-- JSON aggregation
SELECT json_agg(name) FROM users;
SELECT json_object_agg(id, name) FROM users;
```

## Set Operations

### UNION
```sql
-- Combine results (removes duplicates)
SELECT name FROM customers
UNION
SELECT name FROM suppliers;

-- Keep duplicates
SELECT name FROM customers
UNION ALL
SELECT name FROM suppliers;
```

### INTERSECT
```sql
-- Common rows
SELECT email FROM users
INTERSECT
SELECT email FROM subscribers;
```

### EXCEPT
```sql
-- Rows in first query but not second
SELECT email FROM users
EXCEPT
SELECT email FROM unsubscribed;
```

## Best Practices

1. **Use indexes** on WHERE, JOIN, ORDER BY columns
2. **Avoid SELECT *** - specify needed columns
3. **Use EXISTS** instead of IN for large subqueries
4. **Filter early** - WHERE before JOIN when possible
5. **Use CTEs** for readability over nested subqueries
6. **Parameterize queries** - prevent SQL injection
7. **Use window functions** instead of self-joins
8. **Test with EXPLAIN** - analyze query plans




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
