const { User, Thoughts } = require('../models');

module.exports = {
    //Get all thoughts
    getThoughts(req, res) {
        Thoughts.find()
        .then(async (thoughts) => {
            const thoughtsObj = {
                thoughts,
            };
            return res.json(thoughtsObj);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    //Get single thought
    getSingleThought(req, res) {
        Thoughts.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .then(async (thought) => 
        !thought
        ? res.status(404).json({ message: 'No thought was found with that id' })
        : res.json({
            thought,
        })
        )
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    //Create new thought
    createThought(req, res) {
        Thoughts.create(req.body)
        .then((thought) => res.json(thought))
        .catch((err) => res.status(500).json(err));
    },

    //Delete thought
    deleteThought(req, res) {
        Thoughts.findOneAndRemove({ _id: req.params.thoughtId })
        .then((thought) =>
        !thought
        ? res.status(404).json({ message: 'The thought does not exist' })
        : res.json({
            thought,
        })
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    // Update thought
};