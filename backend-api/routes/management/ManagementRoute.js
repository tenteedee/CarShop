import express from "express";
import { verifyStaffToken } from "../../middleware/Auth.js";
import { validateLogin } from "../../helper/ValidationHelper.js";
import {
  login,
  loginWithGoogle,
  verify_token,
} from "../../controllers/management/AuthController.js";
import { query } from "../../controllers/management/UserController.js";
import {
  queryStaff,
  deleteStaff,
  getStaff,
  updateStaff,
  createStaff,
  updateStaffAvatar,
} from "../../controllers/management/StaffController.js";
import { queryRoles } from "../../controllers/management/RoleController.js";
import { queryShowrooms } from "../../controllers/management/ShowroomController.js";
import {
  querySettings,
  updateSettings,
} from "../../controllers/management/SettingController.js";
import {
  queryCategories,
  deleteCategories,
  getCategory,
  updateCategory,
  createCategory,
} from "../../controllers/management/CategoryController.js";
import {
  queryNews,
  deleteNews,
  getNews,
  updateNews,
  createNews,
} from "../../controllers/management/NewsController.js";
import { updateState } from "../../controllers/management/HomeController.js";

import {
  createStaffValidation,
  updateStaffValidation,
} from "../../helper/ValidationHelper.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), "uploads/images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const date = new Date().getTime();
    const filename = file.originalname.replace(/\s+/g, "-");
    const ext = path.extname(file.originalname);

    const newFilename = `${date}-${filename}`;
    //const newFilename = `${uuidv4()}${ext}`;

    cb(null, newFilename);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    req.fileValidationError = "Chỉ có thể upload hình ảnh";
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
});
const router = express.Router();

router.get("/", (req, res) => {
  res.send("worked management api");
});

const homeRouter = express.Router();
homeRouter.post("/update-state", verifyStaffToken([]), updateState);
router.use("/home", homeRouter);

const authRouter = express.Router();
authRouter.post("/login", validateLogin, login);
authRouter.post("/login-google", loginWithGoogle);
authRouter.post("/verify_token", verifyStaffToken([]), verify_token);
router.use("/auth", authRouter);

const userRouter = express.Router();
userRouter.get("/query", query);
router.use("/users", verifyStaffToken(["Director"]), userRouter);

const staffRoute = express.Router();
staffRoute.get("/query", queryStaff);
staffRoute.delete("/delete", deleteStaff);
staffRoute.post("/create", createStaffValidation, createStaff);
staffRoute.get("/:id", getStaff);
staffRoute.post("/:id", updateStaffValidation, updateStaff);
staffRoute.post("/:id/avatar", upload.single("avatar_url"), updateStaffAvatar);
router.use("/staffs", verifyStaffToken(["Director"]), staffRoute);

const roleRoute = express.Router();
roleRoute.get("/", queryRoles);
router.use("/roles", verifyStaffToken(["Director"]), roleRoute);

const showroomRoute = express.Router();
showroomRoute.get("/", queryShowrooms);
router.use("/showrooms", verifyStaffToken(["Director"]), showroomRoute);

const settingsRoute = express.Router();
settingsRoute.get("/", querySettings);
settingsRoute.post("/", upload.any(), updateSettings);
router.use("/settings", verifyStaffToken(["Director"]), settingsRoute);

const categoriesRoute = express.Router();
categoriesRoute.get("/", queryCategories);
categoriesRoute.delete("/delete", deleteCategories);
categoriesRoute.post("/create", createCategory);
categoriesRoute.get("/:id", getCategory);
categoriesRoute.post("/:id", updateCategory);
router.use("/categories", verifyStaffToken(["Director"]), categoriesRoute);

const newsRoute = express.Router();
newsRoute.get("/query", queryNews);
newsRoute.delete("/delete", deleteNews);
newsRoute.post("/create", createNews);
newsRoute.get("/:id", getNews);
newsRoute.post("/:id", updateNews);
router.use("/news", verifyStaffToken(["Director"]), newsRoute);

export default router;
