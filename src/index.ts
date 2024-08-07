import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = "mysecret";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.get("/", (req, res) => {
  res.send("hello world");
});

// For signing in
app.post("/signin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const token = jwt.sign(
    {
      email,
      password,
    },
    JWT_SECRET
  );
  res.cookie("token", token);
  res.send("Logged in");
});

// For signing out
app.post("/logout", (req, res) => {
  res.cookie("token", "");
  res.send("Logged out");
});

// Adding a protected route
app.get("/user", (req, res) => {
  try {
    const token = req.cookies.token;
    const decodedData = jwt.verify(token, JWT_SECRET) as JwtPayload;
    res.json({
      message: decodedData.email,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.toString() });
  }
});

app.listen(3000, () => {
  console.log("server is running on 3000");
});
