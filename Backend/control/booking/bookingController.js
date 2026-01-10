import Booking from '../../model/booking/Booking.js';

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

export { createBooking };