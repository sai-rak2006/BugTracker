const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI;

        // In development, use an in-memory MongoDB to avoid Atlas IP issues
        if (process.env.NODE_ENV !== 'production') {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            mongodInstance = await MongoMemoryServer.create();
            uri = mongodInstance.getUri();
            console.log(`🗄️  Using in-memory MongoDB for development`);
        }

        const conn = await mongoose.connect(uri);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        return conn;
    } catch (error) {
        console.error(`❌ DB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
