const { User, Thoughts } = require('../models');

module.exports = {
    //Get all users
    getUsers(req, res) {
        User.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json(err));
    },

    //Get a single user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .select('-__v')
        .then((user) =>
        !user
            ? res.status(404).json({ message: 'No user with that ID was found' })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },

    //Create new user
    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },

    //Delete user
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
        .then((user) =>
        !user
        ? res.status(404).json({ message: 'The users does not exist' })
        : res.Thoughts.deleteMany({ _id: { $in: user.thoughts } })
        )
        .then(() => res.json({ message: 'User and associated thoughts were deleted' }))
        .catch((err) => res.status(500).json(err));
    },

    //Update user
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((user) =>
        !user
            ? res.status(404).json({ message: 'No user with that ID was found' })
            : res.json(user)
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    //Add friend
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.body } },
            {runValidators: true, new: true }
        )
        .then((user) =>
        !user
            ? res.status(404).json({ message: 'No user with that ID was found' })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },

    //Remove friend
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: { friendId: req.params.friendId } } },
            { runValidators: true, new: true }
        )
        .then((user) => 
        !user
            ? res.status(404).json({ message: 'No user with that ID was found' })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    }
};