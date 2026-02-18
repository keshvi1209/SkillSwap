import Booking from '../../model/booking/Booking.js';
import User from '../../model/user/user.js'; // Import User model

const getBookingHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    // Find bookings where the user is either the student or the teacher
    const bookings = await Booking.find({
      $or: [{ studentId: userId }, { teacherId: userId }]
    }).sort({ createdAt: -1 }).lean();

    // Extract unique user IDs involved in these bookings to fetch their details
    const userIds = new Set();
    bookings.forEach(booking => {
      if (booking.studentId) userIds.add(booking.studentId);
      if (booking.teacherId) userIds.add(booking.teacherId);
    });

    const users = await User.find({ _id: { $in: Array.from(userIds) } }).select('name email');
    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user;
    });

    // Enrich bookings with user details
    const enrichedBookings = bookings.map(booking => ({
      ...booking,
      student: userMap[booking.studentId] || { name: 'Unknown', email: '' },
      teacher: userMap[booking.teacherId] || { name: 'Unknown', email: '' }
    }));

    res.status(200).json({
      success: true,
      data: enrichedBookings
    });
  } catch (error) {
    console.error('Error fetching booking history:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

const createBooking = async (req, res) => {
  try {
    console.log('Received booking request:', req.body);

    const {
      studentId,
      userName,
      userEmail,
      skillName,
      selectedSlots,
      message,
      teacherId
    } = req.body;

    // Optional: Basic required field validation
    if (!studentId || !teacherId || !selectedSlots || selectedSlots.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'studentId, teacherId, and selectedSlots are required'
      });
    }

    // Create booking directly — no checks on availability
    const booking = await Booking.create({
      studentId,
      studentName: userName,
      studentEmail: userEmail,
      teacherId,
      skillName,
      selectedSlots,   // store exactly as received
      message,
      status: 'pending' // or whatever default you want
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully'
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export { createBooking, getBookingHistory };