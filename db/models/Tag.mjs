import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
});

let Tag;
if (mongoose.models.Tag) {
    Tag = mongoose.model('Tag');
} else {
    Tag = mongoose.model('Tag', tagSchema);
}

export default Tag;