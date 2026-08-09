const Blog = require("../model/Blog");

// Create Blog
exports.createBlog = async (req, res) => {
try {
const blog = await Blog.create(req.body);

res.status(201).json({
  success: true,
  data: blog,
});

} catch (error) {
console.log("BLOG ERROR =>", error);

res.status(500).json({
  success: false,
  message: error.message,
});

}
};

// Get All Blogs
exports.getBlogs = async (req, res) => {
try {
const blogs = await Blog.find().sort({ publishDate: -1 });

res.status(200).json({
  success: true,
  data: blogs,
});


} catch (error) {
console.log("BLOG ERROR =>", error);

res.status(500).json({
  success: false,
  message: error.message,
});


}
};

// Get Single Blog By ID
exports.getBlog = async (req, res) => {
try {
const blog = await Blog.findById(req.params.id);


if (!blog) {
  return res.status(404).json({
    success: false,
    message: "Blog not found",
  });
}

res.status(200).json({
  success: true,
  data: blog,
});


} catch (error) {
console.log("BLOG ERROR =>", error);


res.status(500).json({
  success: false,
  message: error.message,
});
}
};

// Get Blog By Slug
exports.getBlogBySlug = async (req, res) => {
try {
const blog = await Blog.findOne({
slug: req.params.slug,
});


if (!blog) {
  return res.status(404).json({
    success: false,
    message: "Blog not found",
  });
}

res.status(200).json({
  success: true,
  data: blog,
});


} catch (error) {
console.log("BLOG ERROR =>", error);


res.status(500).json({
  success: false,
  message: error.message,
});


}
};

// Update Blog
exports.updateBlog = async (req, res) => {
try {
const blog = await Blog.findByIdAndUpdate(
req.params.id,
req.body,
{
new: true,
runValidators: true,
}
);


if (!blog) {
  return res.status(404).json({
    success: false,
    message: "Blog not found",
  });
}

res.status(200).json({
  success: true,
  data: blog,
});


} catch (error) {
console.log("BLOG ERROR =>", error);


res.status(500).json({
  success: false,
  message: error.message,
});


}
};

// Delete Blog
exports.deleteBlog = async (req, res) => {
try {
const blog = await Blog.findByIdAndDelete(req.params.id);


if (!blog) {
  return res.status(404).json({
    success: false,
    message: "Blog not found",
  });
}

res.status(200).json({
  success: true,
  message: "Blog deleted successfully",
});


} catch (error) {
console.log("BLOG ERROR =>", error);


res.status(500).json({
  success: false,
  message: error.message,
});


}
};


exports.getBlogNavigation = async (req, res) => {
  try {
    const current = await Blog.findOne({
      slug: req.params.slug,
    });

    if (!current) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Previous Blog
    const previous = await Blog.findOne({
      publishDate: { $lt: current.publishDate },
    }).sort({ publishDate: -1 });

    // Next Blog
    const next = await Blog.findOne({
      publishDate: { $gt: current.publishDate },
    }).sort({ publishDate: 1 });

    res.status(200).json({
      success: true,
      current,
      previous,
      next,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.increaseBlogView = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { views: 1 },
      },
      {
        new: true,
      }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      views: blog.views,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};