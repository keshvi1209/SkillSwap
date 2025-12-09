import Booking from "../model/Booking.js";

export const getReceivedRequests = async (req, res) => {
  try {
    console.log("bookings api called");

    const teacherId = req.params.teacherId;
    const bookings = await Booking.find({ teacherId }).sort({ createdAt: -1 });
    console.log("Fetched bookings:", bookings);
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests", error: err.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
};
