const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");

const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});
describe("when there is initally some blogs saved", () => {
  test("all blogs are returned as a JSON", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("every blog posts have a unique identifier(id)", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toBeDefined();
  });
});
describe("addition of a new blog", () => {
  test("blog is saved successfully", async () => {
    const newBlog = {
      title: "The Rust Programming Book",
      author: "Rust FOundation",
      url: "https://doc.rust-lang.org/stable/book/",
      likes: 70,
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    const urls = response.body.map((res) => res.url);

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
    expect(urls).toContain("https://doc.rust-lang.org/stable/book/");
  });
});
describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const urls = blogsAtEnd.map((res) => res.url);

    expect(urls).not.toContain(blogToDelete.url);
  });
});

describe("updating the information of an individual blog post", () => {
  test("likes updated successfully", async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToUpdate = blogsAtStart[0];

    const blog = {
      likes: 500,
    };

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blog)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(updatedBlog.body).toMatchObject({ likes: 500 });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
