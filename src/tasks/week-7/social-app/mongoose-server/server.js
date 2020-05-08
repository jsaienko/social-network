const express = require('express');
require('express-async-errors');
require('./db');
const cors = require('cors');
const { errorHandler, requireAuth } = require('./middlewares');
const bodyParser = require('body-parser');
const User = require('./models/user');
const Post = require('./models/post');
const Like = require('./models/like');
const Comment = require('./models/comment');
const Friends = require('./models/friends');
const PORT = 5000;

const app = express();
app.use(bodyParser.json());
app.use(errorHandler);
app.use(express.static(`${__dirname}/public`));
app.use(cors());

app.post('/signup', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
    } catch (err) {
        if (err.code === 11000) {
            return res.sendHTTPError(400, `User with ${user.email} already exists`)
        }
        throw err;
    }
    res.send(user)
});

app.post('/auth', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    const authToken = await user.signIn(password);
    res.send({ authToken, user })
});

app.get('/api/users', requireAuth, async (req, res) => {
    const users = await User.find({}).populate('friends', '-friends');
    res.send(users);
});

app.post('/api/users/:id/add', requireAuth, async (req, res) => {
    const currentUser = await User.findOne({_id: req.userId}).populate('friends', '-friends');

    const existingFriend = currentUser.friends.find(el =>  el.recipient["_id"].toString() === req.params.id);

    if(!existingFriend) {
        const docA = await Friends.findOneAndUpdate(
            { requester: req.userId, recipient: req.params.id },
            { $set: { status: 1 }},
            { upsert: true, new: true });

        const docB = await Friends.findOneAndUpdate(
            { recipient: req.userId, requester: req.params.id },
            { $set: { status: 2 }},
            { upsert: true, new: true }
        );

        await User.findOneAndUpdate(
            { _id:  req.userId },
            { $push: { friends: docA._id }}
        );

        await User.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { friends: docB._id }}
        );

        return res.send({message: 'Friends request sent'});
     }

     return res.send({message: 'User already in your friends list'});

});

app.post('/api/friends/:id/confirm', requireAuth, async (req, res) => {
    const user = await User.findById(req.userId).populate({ path: 'friends',
        populate: [{
            path: 'requester',
            populate: 'requester'
        },{
            path: 'recipient',
            populate: 'recipient'
        }],
    });
    await Friends.findOneAndUpdate(
        { requester: req.userId, recipient: req.params.id },
        { $set: { status: 3 }}
    );

    await Friends.findOneAndUpdate(
        { recipient: req.userId, requester: req.params.id },
        { $set: { status: 3 }}
    );

    res.send(user.friends)
});

app.post('/api/friends/:id/reject', requireAuth, async (req, res) => {
    const user = await User.findById(req.userId).populate({ path: 'friends',
        populate: [{
            path: 'requester',
            populate: 'requester'
        },{
            path: 'recipient',
            populate: 'recipient'
        }],
    });

    const docA = await Friends.findOneAndRemove(
        { requester: req.params.id, recipient: req.userId }
    );

    const docB = await Friends.findOneAndRemove(
        { recipient: req.params.id, requester: req.userId }
    );

    await User.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { friends: docA._id }}
    );

    await User.findOneAndUpdate(
        { _id: req.userId },
        { $pull: { friends: docB._id }}
    );

    res.send(user.friends)
});

app.get('/api/friends', requireAuth, async (req, res) => {
    const user = await User.findById(req.userId).populate({ path: 'friends',
        populate: [{
            path: 'requester',
            populate: 'requester'
        },{
            path: 'recipient',
            populate: 'recipient'
        }],
    });
    res.send(user.friends)
});

app.get('/api/me', requireAuth, async (req, res) => {
    const user = await User.findById(req.userId);
    res.send(user)
});

app.get('/api/posts', requireAuth, async (req, res) => {
    const posts = await Post.find({}).populate('author');
    res.send(posts);
});

app.get('/api/posts/:id', requireAuth, async (req, res) => {
    const posts = await Post.findById(req.params.id).populate('author');
    res.send(posts);
});

app.post('/api/posts/:id/like', requireAuth, async (req, res) => {
    const like = new Like();
    like.likeBy = req.userId;
    let post = await Post.findById(req.params.id);
    post.likes.push(like);
    post.likesNumber += 1;
    await like.save();
    console.log('post:', post);
    res.send(post);
});

app.post('/api/posts', requireAuth, async (req, res) => {
    const newPost = new Post(req.body);
    newPost.author = req.userId;
    await newPost.save();
    res.send(newPost);
});

app.put('/api/posts/:id', requireAuth, async (req, res) => {
    const result = await Post.findByIdAndUpdate(req.params.id, req.body);
    res.send(result);
});

app.post('/api/posts/:id/comments', requireAuth, async (req, res) => {
    const newComment = new Comment({
        ...req.body,
        author: req.userId,
        entityId: req.params.id,
        entityModel: 'Post'
    });
    await newComment.save();
    res.send(newComment);
});

app.get('/api/posts/:id/comments', requireAuth, async (req, res) => {
    const comments = await Comment.find({ entityId: req.params.id }).populate('author');
    res.send(comments)
});

app.delete('/api/comments/:id', requireAuth, async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
        return res.sendHTTPError(404, 'Comment not found')
    }
    if (comment.author.toString() !== req.userId) {
        return res.sendHTTPError(403, 'You cannot delete other people\'s  comments')
    }
    await comment.remove();
    res.send({ deleted: true })
});

app.use((req, res, next) => {
    res.status(404).send({ message: 'Not Found' })
});

app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message })
});

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`Server is running on ${PORT} port`)
});
