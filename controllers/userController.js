const { User, Thoughts } = require('../models');

// Function to get the number of users
const userCount = async () =>
    User.aggregate()
    .count('userCount')
    .then((numberOfUsers) => numberOfUsers);

module.exports = {
    //Get all users
    getUsers(req, res) {
        User.find()
        .then(async (users) => {
            const usersObj = {
                users,
                userCount: await userCount(),
            };
            return res.json(usersObj);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    //Get a single user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .select('-__v')
        .then(async (user) =>
        !user
        ? res.status(404).json({ message: 'No user was found with that ID' })
        : res.json({
            user,
        })
        )
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    //Create new user
    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },

    //Delete user
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
        .then((user) =>
        !user
        ? res.status(404).json({ message: 'The users does not exist' })
        : res.json({
            user,
        })
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    //Update user

    //Remove friend
};