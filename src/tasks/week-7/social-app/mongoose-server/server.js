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
    const user = await User.findOne({ email }).select('+password')
    const authToken = await user.signIn(password);
    res.send({ authToken, user })
});

app.get('/api/users', requireAuth, async (req, res) => {
    const users = await User.find({});
    res.send(users);
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

app.post('/api/posts/:id', requireAuth, async (req, res) => {
    const like = new Like();
    like.likeBy = req.userId;
    const post = await Post.findById(req.params.id);
    post.likes.push(like);
    post.likesNumber += 1;
    await like.save();
    console.log(`res: ${res}, post: ${post}`);
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
    const comments = await Comment.find({ entityId: req.params.id }).populate('author')
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
