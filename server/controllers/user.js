import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";

// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, pic, college } = req.body;

    if (!name || !email || !password || !college) {
      res.status(400);
      throw new Error("Please enter all the fields.");
    }

    const isUserExists = await User.findOne({ email });

    if (isUserExists) {
      res.status(400);
      throw new Error("User already exists!");
    }

    // Regular expression to enforce college complexity
    const collegeRegex = /^[a-zA-Z]{25,}|.{1,24}$/;

    // Check if college meets complexity requirements
    if (!collegeRegex.test(college)) {
      res.status(400);
      throw new Error(
        "College should be only alphabetic characters and have a minimum length of 25 characters."
      );
    }

    // Regular expression to enforce name complexity
    const nameRegex = /^(?=(?:\S+\s*){3,20}$)[A-Za-z\s]{3,20}$/;

    // Check if name meets complexity requirements
    if (!nameRegex.test(name)) {
      res.status(400);
      throw new Error(
        "Name should be only alphabetic characters and length between 3 and 20 characters"
      );
    }

    // Regular expression to enforce password complexity
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,15}$/;

    // Check if password meets complexity requirements
    if (!passwordRegex.test(password)) {
      res.status(400);
      throw new Error(
        "Password must contain at least 8 characters, including at least 1 uppercase letter, 1 lowercase letter, 1 number and at least 1 special character."
      );
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: passwordHash,
      pic,
      college: college,
    });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      user.password = undefined;

      res.status(200).json({ token, user, msg: "Registration Successful!" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//Login
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400);
      throw new Error({ msg: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400);
      throw new Error({ msg: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    user.password = undefined;

    res
      .status(200)
      .json({ token: token, user: user, msg: "Login Successful!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// /api/user?search=tushar
export const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          // regex provides regular expression capabilities for pattern matching strings in queries
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

  const filteredUser = [
    {
      user: null,
      userInRequestList: null,
      isTrue: null,
    },
  ];

  if (users !== null) {
    const checkUser = (user) => {
      if (user.friends.includes(req.user._id)) {
        const val = {
          user: user,
          userInRequestList: false,
          isTrue: true,
        };
        filteredUser.push(val);
      } else if (req.user.friendRequestList.includes(user._id)) {
        const val = {
          user: user,
          userInRequestList: true,
          isTrue: false,
        };
        filteredUser.push(val);
      } else {
        const val = {
          user: user,
          userInRequestList: false,
          isTrue: false,
        };
        filteredUser.push(val);
      }
    };

    users.map((user) => checkUser(user));
  }
  filteredUser.shift();
  res.send(filteredUser);
};

//update
export const update = async (req, res) => {
  try {
    const userId = req.user._id;
    const { pic, bio, headline } = req.body;

    if (!bio && !headline && !pic) {
      res.status(400);
      throw new Error("Please enter what to update");
    }

    let updatedUser;

    if (bio && !headline && !pic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          bio,
        },
        {
          new: true,
        }
      );
    } else if (headline && !bio && !pic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          headline,
        },
        {
          new: true,
        }
      );
    } else if (pic && !bio && !headline) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          pic: pic,
        },
        {
          new: true,
        }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          pic,
          headline,
          bio,
        },
        {
          new: true,
        }
      );
    }

    if (!updatedUser) {
      res.status(404);
      throw new Error("User not found");
    } else {
      res.json({ user: updatedUser, msg: "Profile Updated!", val: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
