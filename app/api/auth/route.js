import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../../../lib/supabaseClient';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTPEmail(email, otp) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@kryzenlabs.com',
      to: [email],
      subject: 'Verify your email - School Directory',
      html: `
        <h2>Email Verification</h2>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `,
    });

    if (error) {
      console.error('Email send error:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

// Sign Up
export async function POST(request) {
  try {
    const { action, email, password, otp } = await request.json();

    if (action === 'signup') {
      // Validate input
      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email and password are required' },
          { status: 400 }
        );
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 409 }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate OTP
      const otpCode = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Create user
      const { data: user, error } = await supabase
        .from('users')
        .insert([
          {
            email,
            password: hashedPassword,
            verified: false,
            extra: {
              otp: otpCode,
              otpExpiry: otpExpiry.toISOString()
            }
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        return NextResponse.json(
          { error: 'Failed to create user. Please check if email already exists.' },
          { status: 500 }
        );
      }

      // Send OTP email (skip in development if no API key)
      if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here') {
        const emailSent = await sendOTPEmail(email, otpCode);
        
        if (!emailSent) {
          // Delete user if email failed
          await supabase.from('users').delete().eq('id', user.id);
          return NextResponse.json(
            { error: 'Failed to send verification email' },
            { status: 500 }
          );
        }
      } else {
        console.log('Development mode: OTP code is:', otpCode);
      }

      return NextResponse.json(
        { 
          message: process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here' 
            ? 'User created successfully. Please check your email for verification code.'
            : `User created successfully. Development OTP: ${otpCode}`,
          userId: user.id
        },
        { status: 201 }
      );
    }

    if (action === 'verify') {
      if (!email || !otp) {
        return NextResponse.json(
          { error: 'Email and OTP are required' },
          { status: 400 }
        );
      }

      // Get user
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      if (user.verified) {
        return NextResponse.json(
          { error: 'User already verified' },
          { status: 400 }
        );
      }

      // Check OTP
      const storedOtp = user.extra?.otp;
      const otpExpiry = user.extra?.otpExpiry;

      if (!storedOtp || !otpExpiry) {
        return NextResponse.json(
          { error: 'No OTP found. Please request a new one.' },
          { status: 400 }
        );
      }

      if (new Date() > new Date(otpExpiry)) {
        return NextResponse.json(
          { error: 'OTP has expired. Please request a new one.' },
          { status: 400 }
        );
      }

      if (storedOtp !== otp) {
        return NextResponse.json(
          { error: 'Invalid OTP' },
          { status: 400 }
        );
      }

      // Verify user
      const { error: updateError } = await supabase
        .from('users')
        .update({
          verified: true,
          extra: {
            ...user.extra,
            otp: null,
            otpExpiry: null
          }
        })
        .eq('id', user.id);

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to verify user' },
          { status: 500 }
        );
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return NextResponse.json(
        { 
          message: 'Email verified successfully',
          token,
          user: { id: user.id, email: user.email, verified: true }
        },
        { status: 200 }
      );
    }

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email and password are required' },
          { status: 400 }
        );
      }

      // Get user
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      if (!user.verified) {
        return NextResponse.json(
          { error: 'Please verify your email first' },
          { status: 401 }
        );
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return NextResponse.json(
        { 
          message: 'Login successful',
          token,
          user: { id: user.id, email: user.email, verified: user.verified }
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}