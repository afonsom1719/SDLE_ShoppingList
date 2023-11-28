import React from 'react';
import Modal from 'react-modal';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  level: string;
};

const getIcon = (level: string) => {
  switch (level) {
    case 'warning':
      return '⚠️'; // Replace with your warning icon component
    case 'error':
      return '❌'; // Replace with your error icon component
    default:
      return 'ℹ️'; // Replace with your info icon component
  }
};

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '300px',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ff9900',
    position: 'relative' as 'relative', // Explicit type
  },
  closeBtn: {
    position: 'absolute' as 'absolute', // Explicit type
    top: '10px',
    right: '10px',
    cursor: 'pointer',
    color: '#ff9900',
  },
  icon: {
    fontSize: '24px',
    marginBottom: '10px',
  },
};

const WarningModal: React.FC<ModalProps> = ({ isOpen, onClose, message, level }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      className={`modal`}
      contentLabel="Warning Modal"
    >
      <div>
        <div style={customStyles.closeBtn} onClick={onClose}>
          &#10006;
        </div>
        <div style={customStyles.icon}>{getIcon(level)}</div>
        <p>{message}</p>
      </div>
    </Modal>
  );
};

export default WarningModal;
