import * as React from 'react';
import { Html, Head, Body, Container, Heading, Text } from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

const VerificationEmail = ({ username, otp }: VerificationEmailProps) => {
  const main = {
    backgroundColor: '#f6f9fc',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  };
  
  const container = {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '0 auto'
  };
  
  const heading = {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333333'
  };
  
  const paragraph = {
    fontSize: '16px',
    marginBottom: '20px',
    color: '#666666'
  };
  
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Welcome, {username}!</Heading>
          <Text style={paragraph}>Your OTP code is: <strong>{otp}</strong></Text>
          <Text style={paragraph}>Please enter this code in the application to verify your email address.</Text>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;