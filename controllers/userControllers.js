import mongoose from "mongoose";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import userModal from "../models/userModal.js";
import ErrorHandler from "../utils/errorHandle.js";

export const createSelfProfile = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const parentUser = await userModal.findOne({ _id: userId });

  if (!parentUser) {
    next(
      new ErrorHandler("Unable to create profile as parent user not found", 200)
    );
  } else {
    const newSelfProfile = await userModal.create({
      name: parentUser.name,
      parentId: parentUser._id.toString(),
      infoEmail: parentUser?.email,
      profileType: "adminSelf",
      password: "123456",
    });

    let theusername = parentUser.userName + newSelfProfile._id.toString();

    let selfProfile = await userModal.findByIdAndUpdate(
      { _id: newSelfProfile._id },
      { userName: theusername, password: "" }
    );

    res.status(201).send({
      message: "New self profile created successfuly",
      success: true,
    });
  }
});

export const createTeamProfile = catchAsyncError(async (req, res, next) => {
  //   try {
  const { userName, name, email, password } = req.body;

  // validate
  if (!userName) {
    next(new ErrorHandler("Please provide user name", 200));
  }

  if (!email) {
    next(new ErrorHandler("Please provide email", 200));
  }

  if (!password) {
    next(new ErrorHandler("Please provide password", 200));
  }

  const existingUser = await userModal.findOne({ email });
  const existingUserName = await userModal.findOne({ userName });

  if (existingUser) {
    next(new ErrorHandler("User already exists", 200));
  }
  if (existingUserName) {
    next(new ErrorHandler("User name already exists", 200));
  }

  const userId = req.userId;

  const parentUser = await userModal.findOne({ _id: userId });

  if (!parentUser) {
    next(
      new ErrorHandler("Unable to create profile as parent user not found", 200)
    );
  }

  const user = await userModal.create({
    userName,
    name,
    email,
    password,
    infoEmail: email,
    parentId: parentUser._id,
    profileType: "team",
    allowLogin: true,
  });

  // token

  res.status(201).send({
    message: "New Team member profile created successfuly",
    success: true,
  });

  // if (user) {

  // }
  // }
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
});

export const getProfiles = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const parentUser = await userModal.findOne({ _id: userId });

  if (!parentUser) {
    next(
      new ErrorHandler("Unable to find profiles as parent user not found", 200)
    );
  }

  const profiles = await userModal.find({
    $or: [{ parentId: parentUser.id }, { _id: parentUser.id }],
  });

  // token

  res.status(201).send({
    // message: "",
    success: true,
    totalProfiles: profiles.length,
    profiles,
  });

  // if (user) {

  // }
  // }
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
});

export const getSingleProfile = catchAsyncError(async (req, res, next) => {
  let profileId = req.body.profileId;

  const profile = await userModal.findOne({ _id: profileId });

  if (!profile) {
    next(new ErrorHandler("profile not found", 404));
  }

  // token

  res.status(201).send({
    // message: "",
    success: true,
    profile,
  });

  // if (user) {

  // }
  // }
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
});

export const updateAbout = catchAsyncError(async (req, res, next) => {
  let { name, job, company, colorCode, bio, location } = req.body;

  let userId = req.userId;
  // console.log();

  const profile = await userModal.findOne({ _id: userId });

  if (!profile) {
    next(new ErrorHandler("profile not found", 404));
  }

  const UpdatedAbout = await userModal.findByIdAndUpdate(
    { _id: userId },
    {
      name,
      job,
      company,
      colorCode,
      bio,
      location,
      profileImg:
        req.files["profileImg"]?.length === 1
          ? `http://localhost:4000/public/Images/${req.files["profileImg"][0].filename}`
          : profile?.profileImg,

      coverImg:
        req.files["coverImg"]?.length === 1
          ? `http://localhost:4000/public/Images/${req.files["coverImg"][0].filename}`
          : profile?.coverImg,

      logoImg:
        req.files["logoImg"]?.length === 1
          ? `http://localhost:4000/public/Images/${req.files["logoImg"][0].filename}`
          : profile?.logoImg,
    }
  );

  // token

  res.status(201).send({
    message: "About information updated sucessfuly",
    success: true,
    // UpdatedAbout,
  });
});

export const updateDirect = catchAsyncError(async (req, res, next) => {
  let { direct, directMode, profileId } = req.body;

  console.log(req.body);

  const profile = await userModal.findOne({ _id: profileId });

  if (!profile) {
    return next(new ErrorHandler("profile not found", 404));
  }

  if (!direct.name || !direct.title || !direct.value) {
    return next(
      new ErrorHandler(
        "please add all the values requrire in direct object",
        500
      )
    );
  }

  if (profile.links.length < 1) {
    return next(
      new ErrorHandler(
        "Please add social link in your profile to apply direct Mode",
        500
      )
    );
  }

  if (typeof directMode === "boolean") {
    const UpdatedAbout = await userModal.findByIdAndUpdate(
      { _id: profileId },
      {
        direct,
        directMode,
      }
    );

    res.status(201).send({
      message: "Direct mode updated sucessfuly",
      success: true,
      // UpdatedAbout,
    });
  }

  // token
});

export const updateLead = catchAsyncError(async (req, res, next) => {
  let { profileId } = req.body;

  const profile = await userModal.findOne({ _id: profileId });

  if (!profile) {
    return next(new ErrorHandler("profile not found", 404));
  }

  let leadMode = profile.leadmode;
  // if (!direct.name || !direct.title || direct.value) {
  //   return next(
  //     new ErrorHandler(
  //       "please add all the values requrire in direct object",
  //       500
  //     )
  //   );
  // }

  const UpdatedLead = await userModal.findByIdAndUpdate(
    { _id: profileId },
    {
      leadmode: !leadMode,
    }
  );

  res.status(201).send({
    message: "lead mode updated sucessfuly",
    success: true,
    // UpdatedAbout,
  });

  // token
});

export const updateQr = catchAsyncError(async (req, res, next) => {
  let { qrColor } = req.body;

  let userId = req.userId;
  // console.log();

  const profile = await userModal.findOne({ _id: userId });

  if (!profile) {
    next(new ErrorHandler("profile not found", 404));
  }

  const updatedQr = await userModal.findByIdAndUpdate(
    { _id: userId },
    {
      qrColor,
      qrLogo: req.file
        ? `http://localhost:4000/public/Images/${req.file.filename}`
        : profile?.qrLogo,
    }
  );

  // token

  res.status(201).send({
    message: "Qr information updated sucessfuly",
    success: true,
    // UpdatedAbout,
  });
});
export const updateSettings = catchAsyncError(async (req, res, next) => {
  let { allowTeamLogin, organizationName } = req.body;

  let userId = req.userId;
  // console.log();

  const profile = await userModal.findOne({ _id: userId });

  if (!profile) {
    next(new ErrorHandler("profile not found", 404));
  }

  const updatedSetting = await userModal.findByIdAndUpdate(
    { _id: userId },
    {
      allowTeamLogin,
      organizationName,
    }
  );

  const updatedTeam = await userModal.updateMany(
    { parentId: userId, profileType: "team" },
    {
      allowLogin: allowTeamLogin,
    }
  );

  // token

  res.status(201).send({
    message: "Settings updated sucessfuly",
    success: true,
    // UpdatedAbout,
  });
});

export const updateLeadForm = catchAsyncError(async (req, res, next) => {
  let { profileId, formHeader, leadForm } = req.body;

  const profile = await userModal.findOne({ _id: profileId });

  if (!profile) {
    return next(new ErrorHandler("profile not found", 404));
  }

  if (
    typeof leadForm.name != "boolean" ||
    typeof leadForm.email != "boolean" ||
    typeof leadForm.phone != "boolean" ||
    typeof leadForm.company != "boolean" ||
    typeof leadForm.note != "boolean" ||
    typeof leadForm.job != "boolean"
  ) {
    return next(new ErrorHandler("Values of lead form should be boolean", 500));
  }

  if (
    !leadForm.name &&
    !leadForm.email &&
    !leadForm.phone &&
    !leadForm.company &&
    !leadForm.note &&
    !leadForm.job
  ) {
    return next(new ErrorHandler("Lead form should not be empty", 500));
  }

  const UpdatedLead = await userModal.findByIdAndUpdate(
    { _id: profileId },
    {
      formHeader,
      leadForm,
    }
  );

  res.status(201).send({
    message: "lead mode settings updated sucessfuly",
    success: true,
    // UpdatedAbout,
  });

  // token
});

export const AddSocialLink = catchAsyncError(async (req, res, next) => {
  let { name, title, value, description, isHighlighted, isHide, profileId } =
    req.body;

  const profile = await userModal.findOne({ _id: profileId });

  if (!profile) {
    return next(new ErrorHandler("profile not found", 404));
  }

  if (!name || !title || !value) {
    return next(
      new ErrorHandler("name, title and link value should not be empty", 500)
    );
  }

  const addLink = await userModal.findByIdAndUpdate(
    { _id: profileId },
    {
      links: { name, title, value, description, isHighlighted, isHide },
    }
  );

  res.status(201).send({
    message: "Link added sucessfuly",
    success: true,
    // UpdatedAbout,
  });

  // token
});

export const updateSocialLink = catchAsyncError(async (req, res, next) => {
  let {
    name,
    title,
    value,
    description,
    isHighlighted,
    isHide,
    profileId,
    linkId,
  } = req.body;

  const profile = await userModal.findOne({ _id: profileId });

  if (!profile) {
    return next(new ErrorHandler("profile not found", 404));
  }
  if (!name || !title || !value) {
    return next(
      new ErrorHandler("name, title and link value should not be empty", 500)
    );
  }

  let allLinks = profile?.links;

  let ifAdded = allLinks?.find((elm) => {
    return elm?.title === title;
  });

  if (ifAdded) {
    const updatedLink = await userModal.updateOne(
      { _id: profile?._id, "links._id": linkId },
      {
        $set: {
          "links.$.name": name,
          "links.$.title": title,
          "links.$.value": value,
          "links.$.description": description,
          "links.$.isHighlighted": isHighlighted,
          "links.$.isHide": isHide,
        },
      }
    );
  } else {
    const addLink = await userModal.findByIdAndUpdate(
      { _id: profileId },
      {
        links: [
          ...allLinks,
          { name, title, value, description, isHighlighted, isHide },
        ],
      }
    );
  }

  // console.log()

  res.status(201).send({
    message: "Link updated sucessfuly",
    success: true,
    // UpdatedAbout,
  });

  // token
});
