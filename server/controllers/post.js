import Comment from "../models/Comment.js";
import Like from "../models/Like.js";
import Post from "../models/Post.js";

export const createPost = async (req, res) => {
    try {
        const { info } = req.body;
        const userId = info.userId;
        const heading = info.heading;
        const pic = info.pic;
        const content = info.content;
        const tags = info.tags;

        if (!content || tags.length === 0) {
            res.status(400)
            throw new Error("content or tag is missing")
        }

        const newPost = await Post.create({
            userId,
            heading,
            pic,
            content,
            tags
        });

        await Post.findOne({ _id: newPost._id }).populate("userId", "-password");
        
        const posts = await Post.find().sort('-createdAt').populate("userId", "-password");

        res.status(200).json({ post: posts, msg: "Post Created" })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort('-createdAt').populate("userId", "-password");
        res.status(200).json(posts); 
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.body;
        const userPosts = await Post.find({ userId }).sort("-createdAt").populate("userId", "-password");
        res.status(200).json({posts: userPosts, totalPosts: userPosts.length}); 
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const allLikes = async (req, res) => {
    try {
        const { postId } = req.body;

        const totalLikes = await Like.find({ postId: postId.id }).count()
        const likedUser = await Like.find({ postId: postId.id }).sort('-createdAt').populate("userId", "-password");

        res.status(200).json({ likes: totalLikes, likedUser: likedUser});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const allComments = async (req, res) => {
    try {
        const { postId } = req.body;

        const totalComments = await Comment.find({ postId: postId.id }).count();
        const commentedUser = await Comment.find({ postId: postId.id }).sort('-createdAt').populate("userId", "-password");

        res.status(200).json({comments: totalComments, commentedUser: commentedUser});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const likePost = async (req, res) => {
    try {
        let msg;

        const { ids } = req.body;
        const postId = ids.postId
        const userId = ids.userId

        const post = await Like.findOne({ postId: postId, userId: userId })

        if (post) { 
            await Like.deleteOne(post);
            msg = "Like Removed"
        }
        else {
            await Like.create({
                userId,
                postId
            });
            msg = "Liked"
        }

        res.status(200).json({ msg: msg });
    } catch (err) { 
        res.status(400).json({msg: err.message});
    }
}

export const commentPost = async (req, res) => {
    try {
        const { info } = req.body;
        const postId = info.postId;
        const commentText = info.comment;
        const userId = info.userId;

        await Comment.create({
            userId,
            postId,
            commentText
        })

        res.status(200).json({ msg: "Comment Added" });
    } catch (err) { 
        res.status(400).json({msg: err.message});
    }
}

export const postDetail = async (req, res) => {
    try {
        const { postId } = req.body;
        
        const post = await Post.findById(postId.id).populate("userId", "-password");
        
        res.status(200).json({post: post});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}

export const searchByTags = async (req, res) => {
    const tags = req.query.tags.split(',');
    try {
        const posts = await Post.find({ tags: { $in: tags } }).populate("userId");
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
}