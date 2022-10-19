import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { FC, useEffect } from 'react';
import { MODAL_TYPE, RegisterModal } from './typer-modal-context';

export const TyperLobbyQuitModal: FC<{ registerModal: RegisterModal }> = ({
  registerModal,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    registerModal(MODAL_TYPE.LOBBY_LEADER_LEFT, onOpen);
  }, []);

  return (
    <Modal
      closeOnOverlayClick={false}
      closeOnEsc={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered={true}
      size="sm"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome to FuSTU Typer</ModalHeader>
        <ModalBody pb={4}>The leader has closed the lobby.</ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
