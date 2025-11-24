// import mongoose from "mongoose";
// import slugify from "slugify";

// const postSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: [true, "Please add a title"],
//       trim: true,
//       maxlength: 200,
//     },
//     slug: {
//       type: String,
//       unique: true,
//       lowercase: true,
//     },
//     body: {
//       type: String,
//       required: [true, "Please add content"],
//     },
//     author: {
//       type: String,
//       required: [true, "Author name is required"],
//     },
//     tags: {
//       type: [String],
//       default: [],
//     },
//     featuredImage: {
//       url: { type: String },
//       publicId: { type: String },
//     },
//     images: [
//       {
//         url: { type: String },
//         publicId: { type: String },
//       },
//     ],
//     image: {
//       type: String, // legacy single image field
//     },
//     imagePublicId: {
//       type: String, // legacy single image ID
//     },
//     popularity: {
//       type: Number,
//       default: 0, // starts at 0
//     },
//   },
//   { timestamps: true }
// );-

// // Auto-generate slug before saving
// postSchema.pre("save", function (next) {
//   if (!this.slug) {
//     this.slug = slugify(this.title, { lower: true, strict: true });
//   }
//   next();
// });

// const Post = mongoose.model("Post", postSchema);
// export default Post;


import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    body: {
      type: String,
      required: [true, "Please add content"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // <-- reference User model
      required: true,
    },
    // profileImage: {
    //   type: String,
    //   default: null, // optional author image
    // },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    featuredImage: {
      url: { type: String },
      publicId: { type: String },
    },
    images: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
    image: {
      type: String, // legacy single image field
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    
      
    imagePublicId: {
      type: String, // legacy single image ID
    },
    popularity: {
      type: Number,
      default: 0, // starts at 0
    },
    archived: {
        type: Boolean,
        default: false,
      },
      
  },
  { timestamps: true }
);

// Auto-generate slug before saving
postSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});



export default mongoose.models.Post || mongoose.model("Post", postSchema);
