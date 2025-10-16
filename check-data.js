require('dotenv').config();
const { MongoClient } = require('mongodb');

async function checkData() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    
    console.log('Connected to database');
    
    // 检查灵感数据
    const inspirations = await db.collection('inspirations').find({}).limit(10).toArray();
    console.log('Total inspirations:', await db.collection('inspirations').countDocuments());
    console.log('Sample inspirations:', inspirations.slice(0, 3));
    
    // 检查用户数据
    const users = await db.collection('users').find({}).limit(10).toArray();
    console.log('Total users:', await db.collection('users').countDocuments());
    console.log('Sample users:', users.slice(0, 3));
    
    // 检查特定用户的灵感
    if (users.length > 0) {
      const userId = users[0]._id.toString();
      console.log('Checking inspirations for user:', userId);
      const userInspirations = await db.collection('inspirations').find({ userId }).toArray();
      console.log('User inspirations count:', userInspirations.length);
      console.log('Sample user inspirations:', userInspirations.slice(0, 3));
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

checkData();