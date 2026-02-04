const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  balance: {
    type: Number,
    required: true,
    min: 0
  },
  cardType: {
    type: String,
    enum: ['virtual', 'physical'],
    default: 'virtual'
  },
  status: {
    type: String,
    enum: ['active', 'used', 'expired', 'cancelled'],
    default: 'active'
  },
  // Purchaser Information
  purchaserName: {
    type: String,
    required: true
  },
  purchaserEmail: {
    type: String,
    required: true
  },
  // Recipient Information
  recipientName: {
    type: String,
    required: true
  },
  recipientEmail: {
    type: String,
    required: true
  },
  personalMessage: {
    type: String
  },
  // Physical card delivery address (if applicable)
  deliveryAddress: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  // Validity
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  // Usage tracking
  usageHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    amountUsed: {
      type: Number,
      required: true
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    location: String
  }],
  // Payment details
  paymentIntentId: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Generate unique gift card code
giftCardSchema.statics.generateCode = function() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar characters
  let code = '';
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code; // Format: XXXX-XXXX-XXXX-XXXX
};

// Check if gift card is valid
giftCardSchema.methods.isValid = function() {
  return (
    this.status === 'active' &&
    this.balance > 0 &&
    this.expiryDate > new Date() &&
    this.paymentStatus === 'paid'
  );
};

// Use gift card for a booking
giftCardSchema.methods.use = function(amount, bookingId, location) {
  if (!this.isValid()) {
    throw new Error('Gift card is not valid');
  }
  if (this.balance < amount) {
    throw new Error('Insufficient gift card balance');
  }
  
  this.balance -= amount;
  this.usageHistory.push({
    amountUsed: amount,
    bookingId,
    location
  });
  
  if (this.balance === 0) {
    this.status = 'used';
  }
  
  return this.save();
};

module.exports = mongoose.model('GiftCard', giftCardSchema);
