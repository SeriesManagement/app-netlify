import { authenticator } from 'otplib';

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { otpCode } = req.body;

    // Basic validation
    if (!otpCode || otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    // Get the secret from environment variable
    const secret = process.env.SECRET_OTP;
    
    if (!secret) {
      console.error('SECRET_OTP environment variable is not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Configure authenticator
    authenticator.options = {
      window: 1, // Allow 1 step before and after current step (30 seconds window)
    };

    // Verify the OTP code
    const isValid = authenticator.verify({
      token: otpCode,
      secret: secret
    });

    if (isValid) {
      return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'An error occurred' });
  }
}
