const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      default: "Admin",
      trim: true,
    },

    category: {
      type: String,
      default: "Beauty",
      trim: true,
    },

    // Tags
    tags: {
      type: [String],
      default: [],
    },

    // Featured Blog
    featured: {
      type: Boolean,
      default: false,
    },

    // Analytics
    views: {
      type: Number,
      default: 0,
    },

    readingTime: {
      type: Number,
      default: 0,
    },

    publishDate: {
      type: Date,
      default: Date.now,
    },

    comments: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },

    // SEO
    seoTitle: {
      type: String,
      default: "",
      trim: true,
    },

    metaDescription: {
      type: String,
      default: "",
      trim: true,
    },

    metaKeywords: {
      type: String,
      default: "",
      trim: true,
    },

    altTag: {
      type: String,
      default: "",
      trim: true,
    },

    canonicalUrl: {
      type: String,
      default: "",
      trim: true,
    },

    ogTitle: {
      type: String,
      default: "",
      trim: true,
    },

    ogDescription: {
      type: String,
      default: "",
      trim: true,
    },

    ogImage: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto Generate Slug + SEO
blogSchema.pre("save", function () {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-");
  }

  // SEO Defaults
  if (!this.seoTitle) {
    this.seoTitle = this.title;
  }

  if (!this.metaDescription && this.content) {
    const plainText = this.content
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();
    this.metaDescription = plainText.substring(0, 160);
  }

  if (!this.altTag) {
    this.altTag = this.title;
  }

  if (!this.ogTitle) {
    this.ogTitle = this.seoTitle || this.title;
  }

  if (!this.ogDescription) {
    this.ogDescription = this.metaDescription;
  }

  if (!this.ogImage) {
    this.ogImage = this.image;
  }

  // Reading Time Calculation
  if (this.content) {
    const plainText = this.content
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();
    const words = plainText.split(/\s+/).length;

    this.readingTime = Math.max(
      1,
      Math.ceil(words / 200)
    );
  }
});

module.exports = mongoose.model("Blog", blogSchema);