import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { today, thisWeek, thisMonth, Post } from './../posts';
import { User, NewUser } from '../users';

const SECRET = 'my-secret';
const COOKIE = 'vuejs-jwt';

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

const allPosts = [today, thisWeek, thisMonth];
const allUsers: User[] = [];

app.get('/current-user', (req, res) => {
  try {
    const token = req.cookies[COOKIE];
    const result = jwt.verify(token, SECRET) as { id: string };
    res.json({ id: result.id });
  } catch (error) {
    console.log('/current-user - error', error);
    res.status(404).end();
  }
});

app.post<{}, {}, NewUser>('/login', (req, res) => {
  const targetUser = allUsers.find((x) => x.username === req.body.username);

  if (!targetUser || targetUser.password !== req.body.password) {
    res.status(401).end();
  } else {
    authenticate(targetUser.id, req, res);
    res.status(200).end();
  }
});

app.post('/logout', (req, res) => {
  res.cookie(COOKIE, '', { httpOnly: true });
  res.status(200).end();
});

app.get('/posts', (req, res) => {
  res.json(allPosts);
});

app.post<{}, {}, Post>('/posts', (req, res) => {
  const post = { ...req.body, id: (Math.random() * 1000000).toFixed() };
  allPosts.push(post);
  res.json(post);
});

app.post<{}, {}, NewUser>('/users', (req, res) => {
  const user: User = { ...req.body, id: (Math.random() * 1000000).toFixed() };
  allUsers.push(user);
  authenticate(user.id, req, res);
  const { password, ...rest } = user;
  res.json(rest);
});

app.listen(8000, () => console.log(`Server running on port 8000`));

function authenticate(id: string, req: Request, res: Response) {
  const token = jwt.sign({ id }, SECRET, {
    issuer: 'vuejs-blog',
    expiresIn: '30 days',
  });

  res.cookie(COOKIE, token, { httpOnly: true });
}
