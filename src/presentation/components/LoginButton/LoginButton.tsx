import React from 'react';
import './LoginButton.css';

interface LoginButtonProps {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick, label, disabled = false }) => {
  return (
    <button 
      className="login-button" 
      onClick={onClick} 
      disabled={disabled}
    >
      <img src="https://www.citypng.com/public/uploads/preview/google-logo-icon-gsuite-hd-701751694791470gzbayltphh.png" alt="Google" className="google-icon" />
      {label}
    </button>
  );
};

export default LoginButton;