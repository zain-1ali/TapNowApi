import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
// Schemas

//------------------------------------------------Lead Form Schema(child)-------------------------------------------------

const leadFormSchema = new mongoose.Schema({
  name: {
    type: Boolean,
    default: true,
  },
  company: {
    type: Boolean,
    default: true,
  },
  email: {
    type: Boolean,
    default: true,
  },
  job: {
    type: Boolean,
    default: true,
  },
  note: {
    type: Boolean,
    default: true,
  },
  phone: {
    type: Boolean,
    default: true,
  },

  // Other profile fields
});

//------------------------------------------------Social Link Schema(child)-------------------------------------------------

const socialLinkSchema = new mongoose.Schema({
  description: {
    type: String,
  },
  isHide: {
    type: Boolean,
    default: false,
  },
  isHighlighted: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: [true, "Link name is required"],
  },
  title: {
    type: String,
    required: [true, "Link title is required"],
  },
  value: {
    type: String,
    required: [true, "Link value is required"],
  },

  // Other profile fields
});

//------------------------------------------------Direct  Schema(child)-------------------------------------------------

const directSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Link name is required"],
  },
  title: {
    type: String,
    required: [true, "Link title is required"],
  },
  value: {
    type: String,
    required: [true, "Link value is required"],
  },
});

//------------------------------------------------Connected with Schema(child of Contact Leads Schema)-------------------------------------------------
const connectedWithSechema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Link name is required"],
  },
  img: {
    type: String,
    // required: [true, "Link title is required"],
    // unique: true,
  },
  connectedWithId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },

  // Other profile fields
});
//------------------------------------------------Contact Leads Schema(child)-------------------------------------------------

const contactLeadsSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    job: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: [true, "Link name is required"],
    },
    email: {
      type: String,
      // required: [true, "Link title is required"],
      // unique: true,
    },
    phone: {
      type: String,
      required: [true, "Link value is required"],
    },
    connectedWith: connectedWithSechema,
    // Other profile fields
  },
  { timestamps: true }
);

//------------------------------------------------User Schema(Parent)----------------------------------------------------------

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "User Name Is Required"],
      unique: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, " Email is Required"],
      unique: true,
      validate: validator.isEmail,
    },

    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "Password length should be greater than 6 character"],
      select: true,
    },
    profileType: {
      type: String,
      required: [true, "profile type is required"],
      enum: ["admin", "adminSelf", "team"],
    },
    location: {
      type: String,
      default: "",
    },
    profileImg: {
      type: String,
      default: "",
    },
    coverImg: {
      type: String,
      default: "",
    },
    logoImg: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    job: {
      type: String,
      default: "",
    },
    colorCode: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    },
    organizationName: {
      type: String,
      default: "",
    },
    allowTeamLogin: {
      type: Boolean,
      default: true,
    },
    parentId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    directMode: {
      type: Boolean,
      default: false,
    },
    direct: directSchema,
    leadmode: {
      type: Boolean,
      default: false,
    },

    leadForm: leadFormSchema,
    formHeader: {
      type: String,
      default: "",
    },
    qrColor: {
      type: String,
      default: "",
    },
    qrLogo: {
      type: String,
      default: "",
    },
    links: [socialLinkSchema],
    contactRequests: [contactLeadsSchema],
  },
  { timestamps: true }
);

// middlewares

userSchema.pre("save", async function () {
  if (!this.isModified) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// JSON web token

userSchema.methods.createJwt = function () {
  return Jwt.sign({ userId: this._id }, process.env.secretkey, {
    expiresIn: "1y",
  });
};

// compare password
userSchema.methods.comparePassword = async function (userPassword) {
  let isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

export default mongoose.model("User", userSchema);
