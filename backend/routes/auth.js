const express = require('express');
const router = express.Router();

// Import middleware
const {
  validateRegistration,
  validateEmailVerification,
  validateEmailCheck,
  validatePasswordResetRequest,
  validatePasswordReset,
  handleValidationErrors
} = require('../middleware/validation');

const {
  registrationLimiter,
  emailVerificationLimiter,
  passwordResetLimiter,
  emailCheckLimiter
} = require('../middleware/rateLimiting');

// Import controllers
const {
  register,
  verifyEmail,
  checkEmailAvailability,
  resendVerificationEmail,
  login,
  requestPasswordReset,
  resetPassword
} = require('../controllers/authController');

// Registration routes
router.post(
  '/register',
  registrationLimiter,
  validateRegistration,
  handleValidationErrors,
  register
);

// Email verification routes
router.post(
  '/verify-email',
  emailVerificationLimiter,
  validateEmailVerification,
  handleValidationErrors,
  verifyEmail
);

router.post(
  '/resend-verification',
  emailVerificationLimiter,
  validateEmailCheck,
  handleValidationErrors,
  resendVerificationEmail
);

// Email availability check
router.post(
  '/check-email',
  emailCheckLimiter,
  validateEmailCheck,
  handleValidationErrors,
  checkEmailAvailability
);

// Login route
router.post(
  '/login',
  [
    require('express-validator').body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    require('express-validator').body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  handleValidationErrors,
  login
);

// Password reset routes
router.post(
  '/forgot-password',
  passwordResetLimiter,
  validatePasswordResetRequest,
  handleValidationErrors,
  requestPasswordReset
);

router.post(
  '/reset-password',
  passwordResetLimiter,
  validatePasswordReset,
  handleValidationErrors,
  resetPassword
);

module.exports = router;