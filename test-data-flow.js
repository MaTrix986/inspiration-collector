const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testDataFlow() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    
    console.log('Connected to database');
    
    // 创建一个测试用户（如果不存在）
    const testUser = {
      email: 'test@example.com',
      name: 'Test User',
    };
    
    // 查找或创建测试用户
    let user = await db.collection('users').findOne({ email: testUser.email });
    if (!user) {
      const userResult = await db.collection('users').insertOne({
        ...testUser,
        createdAt: new Date(),
      });
      user = { _id: userResult.insertedId, ...testUser };
      console.log('Created test user:', user._id.toString());
    } else {
      console.log('Found test user:', user._id.toString());
    }
    
    // 创建一个测试灵感
    const testInspiration = {
      userId: user._id.toString(), // 确保使用字符串格式
      title: 'Test Inspiration',
      content: 'This is a test inspiration',
      isPublic: false,
      viewCount: 0,
      tags: ['test', 'debug'],
      category: 'Testing',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const inspirationResult = await db.collection('inspirations').insertOne(testInspiration);
    console.log('Created test inspiration with ID:', inspirationResult.insertedId.toString());
    
    // 尝试检索这个灵感
    const query = { userId: user._id.toString() };
    console.log('Query object:', query);
    
    const foundInspirations = await db.collection('inspirations').find(query).toArray();
    console.log('Found inspirations for user:', foundInspirations.length);
    console.log('Sample inspiration:', foundInspirations[0]);
    
    // 清理测试数据
    await db.collection('inspirations').deleteOne({ _id: inspirationResult.insertedId });
    console.log('Cleaned up test inspiration');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testDataFlow();