const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  const sumLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0);
  return sumLikes;
};

const favoriteBlog = (blogs) => {
  const mostLikes = blogs.reduce(
    (maxLikes, blog) => Math.max(maxLikes, blog.likes),
    -Infinity
  );

  const mostLikedBlog = blogs.find(({ likes }) => likes === mostLikes);

  const favBlog = ({ title, author, likes }) => ({ title, author, likes });

  return favBlog(mostLikedBlog);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
