const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "History of Yesterday",
    author: "Mark Manson",
    url: "https://historyofyesterday.com/",
    likes: 1,
  },
  {
    title: "History of the Ancient World",
    author: "Poppy Blumen",
    url: "https://www.historyoftheancientworld.com/",
    likes: 20,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
};
