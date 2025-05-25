const rateLimit = require('express-rate-limit');

// Rate limiting for registration endpoints
const registrationLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5, // limit each IP to 5 registration attempts per windowMs
  message: {
    success: false,
    message: 'Too many registration attempts from this IP. Please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many registration attempts from this IP. Please try again later.',
      retryAfter: Math.ceil(req.rateLimit.msBeforeNext / 1000)
    });
  }
});

// Rate limiting for email verification endpoints
const emailVerificationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // limit each IP to 10 verification attempts per windowMs
  message: {
    success: false,
    message: 'Too many email verification attempts. Please try again later.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many email verification attempts from this IP. Please try again later.',
      retryAfter: Math.ceil(req.rateLimit.msBeforeNext / 1000)
    });
  }
});

// Rate limiting for password reset requests
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset requests. Please try again later.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many password reset requests from this IP. Please try again later.',
      retryAfter: Math.ceil(req.rateLimit.msBeforeNext / 1000)
    });
  }
});

// Rate limiting for email availability checks
const emailCheckLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 email checks per minute
  message: {
    success: false,
    message: 'Too many email availability checks. Please try again later.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many email availability checks from this IP. Please try again later.',
      retryAfter: Math.ceil(req.rateLimit.msBeforeNext / 1000)
    });
  }
});

// General API rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP. Please try again later.',
      retryAfter: Math.ceil(req.rateLimit.msBeforeNext / 1000)
    });
  }
});

module.exports = {
  registrationLimiter,
  emailVerificationLimiter,
  passwordResetLimiter,
  emailCheckLimiter,
  generalLimiter
};