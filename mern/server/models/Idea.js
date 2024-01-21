import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    addOns: [{
        text: String,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    }],
});

const Idea = mongoose.model('Idea', ideaSchema);

export default Idea;
