const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkUserStructure() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    
    console.log('Connected to database');
    
    // 获取一个用户文档示例
    const user = await db.collection('users').findOne({});
    console.log('User document from DB:', JSON.stringify(user, null, 2));
    
    if (user) {
      console.log('User _id type:', typeof user._id);
      console.log('User _id value:', user._id.toString());
      console.log('User has id field:', user.id);
      console.log('User has _id field:', user._id);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkUserStructure();