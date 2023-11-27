import React from 'react';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface TrashButtonProps {
  onClick: () => void;
}

const TrashButton: React.FC<TrashButtonProps> = ({ onClick }) => {
  //   const [isHovered, setHovered] = useState(false);

  //   const handleMouseEnter = () => {
  //     setHovered(true);
  //   };

  //   const handleMouseLeave = () => {
  //     setHovered(false);
  //   };

  return (
    <IconButton onClick={onClick} color='error' style={{ color: '#ff4900', padding: '0.4em' }} aria-label='delete'>
      <DeleteIcon />
    </IconButton>
  );
};

export default TrashButton;
