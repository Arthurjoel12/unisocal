import mongoose from "mongoose"

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    heading: {
        type: String
    },
    pic: {
        type: String
    },
    content: {
        type: String
    },
    tags: [String]
},
    { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;