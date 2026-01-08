import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/common/Button/Button';
import { Input } from '../../components/common/Input/Input';
import { Card } from '../../components/common/Card/Card';
import toast from 'react-hot-toast';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, verifyOtp, isLoading, error, clearError } = useAuthStore();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({ phone });
      setStep('otp');
      toast.success('OTP sent successfully');
    } catch (error) {
      toast.error('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await verifyOtp({ phone, otp });
      toast.success('Login successful');
      navigate('/feed');
    } catch (error) {
      toast.error('Invalid OTP');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome to Locrave</h1>
          <p className={styles.subtitle}>Connect with your local community</p>
        </div>

        <Card variant="elevated" padding="lg" className={styles.card}>
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className={styles.form}>
              <h2 className={styles.formTitle}>Sign In</h2>
              <p className={styles.formDescription}>
                Enter your phone number to receive an OTP
              </p>

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                fullWidth
                error={error || undefined}
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isLoading}
                disabled={!phone}
              >
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className={styles.form}>
              <h2 className={styles.formTitle}>Verify OTP</h2>
              <p className={styles.formDescription}>
                Enter the OTP sent to {phone}
              </p>

              <Input
                label="OTP"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                fullWidth
                maxLength={6}
                error={error || undefined}
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isLoading}
                disabled={!otp}
              >
                Verify & Login
              </Button>

              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  clearError();
                }}
              >
                Change Phone Number
              </Button>
            </form>
          )}
        </Card>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📰</span>
            <span className={styles.featureText}>Community Feed</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🛠️</span>
            <span className={styles.featureText}>Local Services</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🛒</span>
            <span className={styles.featureText}>Marketplace</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🚨</span>
            <span className={styles.featureText}>Emergency Alerts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
