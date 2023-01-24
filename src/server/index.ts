import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { today, thisWeek, thisMonth, Post } from './../posts';
import { User, NewUser } from '../users';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const allPosts = [today, thisWeek, thisMonth];
const allUsers: User[] = [];

app.get('/api/posts', (req, res) => {
  res.json(allPosts);
});

app.post<{}, {}, Post>('/api/posts', (req, res) => {
  const post = { ...req.body, id: (Math.random() * 1000000).toFixed() };
  allPosts.push(post);
  res.json(post);
});

app.post<{}, {}, NewUser>('/api/users', (req, res) => {
  const user: User = { ...req.body, id: (Math.random() * 1000000).toFixed() };
  allUsers.push(user);
  const { password, ...rest } = user;
  res.json(rest);
});

app.listen(8000, () => console.log(`Server running on port 8000`));
