import mongoose from "mongoose";
import User from "../models/userSchema";
import Booking from "../models/BookingSchema";
import Doctor from "../models/DoctorSchema";

export const updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    const updateUser = await UserActivation.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updateUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Successfully Updated",
      data: updateUser,
    });
  } catch (error) {
    console.log("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "failed to update",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    await UserActivation.findById(id);
    res.status(200).json({
      success: true,
      message: "Successfully Deleted",
      data: deleteUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete",
    });
  }
};


export const getSingleUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).select("-password");
    res.status(200).json({
      success: true,
      message: "User Found",
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Failed to find user",
    });
  }
};

export const getAllUsers = async (req, res) => {
  const id = req.params.id;
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({
      success: true,
      message: "Users Found",
      data: users,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "No users found",
    });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { password, ...rest } = user._doc;

    res.status(200).json({
      success: true,
      message: "Profile info is getting",
      data: { ...rest },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Someting went wrong, cannot get this",
    });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    // step - 1 : retrieve appointments from booking specific user
    const bookings = await Booking.find({ user: req.userId });
    // step - 2 : extract doctor ids from appointments bookings
    const doctorIds = bookings.map((el) => el.doctor.id);
    // step - 3 : retrieve doctors using doctor ids
    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
      "-password"
    );
    res.status(200).json({
      success: true,
      message: "Appointments are getting",
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Someting went wrong, cannot get this",
    });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { doctorId, ...appointmentData } = req.body;
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: "This Doctor is not available now",
      });
    }
    const appointment = {
      patientName: appointmentData.patientName,
      patientGender: appointmentData.patientGender,
      payment: appointmentData.payment,
      price: appointmentData.price,
      bookedOn: appointmentData.bookedOn,
      testName: appointmentData.testName,
      testResult: appointmentData.testResult,
    };
    doctor.appointments.push(appointment);

    await doctor.save();
    return res.status(200).json({
      success: true,
      data: doctor,
      message: "Appoint booking done",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
