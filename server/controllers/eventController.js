const Event = require('../models/Event');
const Vehicle = require('../models/Vehicle');
const AIMetadata = require('../models/AIMetadata');
const { generateVehicleSummary } = require('../services/aiService');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Insurance/Admin)
exports.createEvent = async (req, res) => {
  const { vin, plateNumber, eventType, description, dateOccurred } = req.body;

  try {
    // 1. Find or Create Vehicle
    let vehicle = await Vehicle.findOne({ 
      $or: [
        { vin: vin ? vin.toUpperCase() : null }, 
        { plateNumber: plateNumber ? plateNumber.toUpperCase() : null }
      ] 
    });

    if (!vehicle) {
      vehicle = await Vehicle.create({
        vin: vin ? vin.toUpperCase() : undefined,
        plateNumber: plateNumber ? plateNumber.toUpperCase() : undefined
      });
    }

    // 2. Create Event (Append Only)
    const event = await Event.create({
      vehicleId: vehicle._id,
      reporterId: req.user.id,
      eventType,
      description,
      dateOccurred
    });

    // 3. Update Vehicle Last Event Date
    vehicle.lastEventDate = dateOccurred;
    await vehicle.save();

    // 4. Invalidate AI Metadata (to force regeneration on next view)
    // Alternatively, we could regenerate it now, but lazy loading is better for MVP.
    await AIMetadata.findOneAndDelete({ vehicleId: vehicle._id });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get events for a vehicle (and AI summary)
// @route   GET /api/events/vehicle/:identifier
// @access  Public
exports.getVehicleEvents = async (req, res) => {
  const { identifier } = req.params; // VIN or Plate

  try {
    const vehicle = await Vehicle.findOne({
      $or: [
        { vin: identifier.toUpperCase() },
        { plateNumber: identifier.toUpperCase() }
      ]
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const events = await Event.find({ vehicleId: vehicle._id })
      .populate('reporterId', 'name companyName')
      .sort({ dateOccurred: -1 }); // Newest first

    // Check for AI Metadata
    let aiMetadata = await AIMetadata.findOne({ vehicleId: vehicle._id });

    // If no metadata or it's old (optional logic), generate it
    if (!aiMetadata && events.length > 0) {
      const aiResult = await generateVehicleSummary(events);
      aiMetadata = await AIMetadata.create({
        vehicleId: vehicle._id,
        summary: aiResult.summary,
        tags: aiResult.tags,
        modelUsed: 'gemini-1.5-pro'
      });
    }

    res.json({
      vehicle,
      events,
      aiSummary: aiMetadata || { summary: "No sufficient data for summary.", tags: [] }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
