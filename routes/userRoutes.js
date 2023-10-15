import express from "express";
import {
  AddSocialLink,
  createTeamProfile,
  getProfiles,
  getSingleProfile,
  updateAbout,
  updateDirect,
  updateLead,
  updateLeadForm,
  updateQr,
  updateSettings,
  updateSocialLink,
} from "../controllers/userControllers.js";
import userAuth from "../middlewares/authMiddleware.js";
import { uploadFile } from "../middlewares/StorageMiddleware.js";

// router Object
const router = express.Router();

// createSelfProfile route
// router.post("/AdminDuplicateProfile", userAuth, createSelfProfile);
router.post("/createTeamProfile", userAuth, createTeamProfile);

router.get("/getmyProfiles", userAuth, getProfiles);

router.get("/getSingleProfile", userAuth, getSingleProfile);

router.post(
  "/updateAbout",
  userAuth,
  uploadFile.fields([
    { name: "profileImg", maxCount: 1 },
    { name: "logoImg", maxCount: 1 },
    { name: "coverImg", maxCount: 1 },
  ]),

  updateAbout
);
// uploadFile.single("file"),
router.post("/updateSettings", userAuth, updateSettings);
router.post("/updateDirect", userAuth, updateDirect);
router.post("/updateLead", userAuth, updateLead);
router.post("/updateQr", userAuth, uploadFile.single("qrLogo"), updateQr);
router.post("/updateLeadSettings", userAuth, updateLeadForm);
router.post("/addLink", userAuth, AddSocialLink);
router.post("/updateSocialLink", userAuth, updateSocialLink);

// Login route
// router.post("/createTeamProfile", loginController);

export default router;
