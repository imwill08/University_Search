// Create src/components/CustomAlertIcon.jsx
import { Icon } from '@chakra-ui/react';
import { MdWarning } from 'react-icons/md';

export const AlertIcon = (props) => (
  <Icon as={MdWarning} color="yellow.500" {...props} />
);