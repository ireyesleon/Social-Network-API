const { User, Thoughts } = require('../models');

module.exports = {
    //Get all thoughts
    getThoughts(req, res) {
        Thoughts.find()
        .select('-__v')
        .populate('reactions')
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err));
    },

    //Get single thought
    getSingleThought(req, res) {
        Thoughts.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .populate('reactions')
        .then((thought) => 
        !thought
        ? res.status(404).json({ message: 'No thought was found with that id' })
        : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

    //Create new thought
    createThought(req, res) {
        Thoughts.create(req.body)
        .then((thought) => {
           return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: thought._id } },
                { new: true }
            );
        })
        .then((user) =>
        !user
            ? res.status(404).json({ message: 'Thought created but no user was found with that id' })
            : res.json('Thought created!')
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    //Delete thought
    deleteThought(req, res) {
        Thoughts.findOneAndRemove({ _id: req.params.thoughtId })
        .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'The thought does not exist' })
        : User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
        )
        )
        .then((user) =>
        !user
        ? res.status(400).json({ message: "The thought was deleted but the user was not found" })
        : res.json({ message: 'Thought was deleted' })
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    // Update thought
    updateThought(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((thought) =>
        !thought
            ? res.status(400).json({ message: 'The thought does not exist' })
            : res.json(thought)
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // Add reaction
    addReaction(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
        .then((thought) => 
        !thought
            ? res.status(404).json({ message: 'The thought does not exist '})
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

    // Remove reaction
    removeReaction(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
        .then((thought) =>
        !thought
            ? res.status(404).json({ message: 'The thought does not exist '})
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
};