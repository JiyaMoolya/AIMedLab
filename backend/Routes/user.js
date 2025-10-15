import express from "express";
import {
  updateUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  getUserProfile,
  getMyappointments,
  createaAppointment,
} from "../Controllers/userController";
import { authenticate, restrict } from "../auth/verifyToken";

const router = express.Router();

router.get("/:id", authenticate, restrict(["patient"]), getSingleUser);
router.get("/", authenticate, restrict(["admin"]), getAllUsers);
router.delete(":/id", authenticate, restrict(["patient"]), deleteUser);
router.put("/:id", authenticate, restrict(["patient"]), updateUser);
router.get("/profile/me", authenticate, restrict(["patient"]), getUserProfile);
router.get(
  "/appointments/my-appointments",
  authenticate,
  restrict(["patient"]),
  getMyappointments
);
router.post(
  "/appointments/create-appointment",
  authenticate,
  restrict(["patient"]),
  createaAppointment
);

export default router;