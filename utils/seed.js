const connection = require('../config/connection');
const { User, Thoughts } = require('../models');


connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');

    await User.deleteMany({});
    await Thoughts.deleteMany({});

    const users = [];
    const thoughts = [];

    await User.collection.insertMany(users);
    await Thoughts.collection.insertMany(thoughts);

    console.table(users);
    console.table(thoughts);
    console.info('Seeding complete!');
    process.exit(0);
});