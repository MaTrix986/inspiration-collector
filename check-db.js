const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function checkUserData() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    
    // 获取一个用户文档示例
    const user = await db.collection('users').findOne({});
    console.log('User document:', JSON.stringify(user, null, 2));
    
    if (user) {
      console.log('User ID type:', typeof user._id);
      console.log('User ID value:', user._id.toString());
      
      // 检查该用户的灵感数据
      const inspirations = await db.collection('inspirations').find({ userId: user._id.toString() }).toArray();
      console.log('Inspirations for this user:', inspirations.length);
      
      // 也尝试用ObjectId查询
      const inspirations2 = await db.collection('inspirations').find({ userId: user._id }).toArray();
      console.log('Inspirations with ObjectId query:', inspirations2.length);
    }
    
    // 检查灵感文档结构
    const inspiration = await db.collection('inspirations').findOne({});
    console.log('Inspiration document:', JSON.stringify(inspiration, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkUserData();