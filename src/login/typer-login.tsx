import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import {
  AuthControllerQuery,
  GoogleTokenDto,
  UsersControllerQuery,
} from '../api/axios-client';

declare global {
  const google: typeof import('google-one-tap');
}

export const TyperLogin: FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, refetch } = UsersControllerQuery.useMeQuery();
  const queryClient = useQueryClient();

  const [googleRef, setGoogleRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (data?.email == null || data?.email == undefined) {
      if (!isOpen) onOpen();
    } else if (isOpen) {
      onClose();
    }
  }, [data]);

  useEffect(() => {
    // @ts-ignore
    if (!window.google) return;
    if (!googleRef) return;
    google.accounts.id.initialize({
      client_id:
        '1001740339512-uq8ofj3bap5qlu79hnkoci149ep7lq1b.apps.googleusercontent.com',
      callback: (response) => {
        AuthControllerQuery.Client.googleLogin(
          new GoogleTokenDto({ token: response.credential }),
        ).then((result) => {
          localStorage.setItem('accessToken', result.accessToken);
          refetch();
        });
      },
    });
    google.accounts.id.renderButton(
      document.getElementById('googleButtonDiv')!,
      { theme: 'outline', size: 'large', width: 336 }, // customization attributes
    );
    // @ts-ignore
  }, [window.google, googleRef, data?.email]);

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
        <ModalHeader textAlign={'center'}>Welcome to FuSTU Typer</ModalHeader>
        <ModalBody pb={4} ref={setGoogleRef}>
          <div id="googleButtonDiv" style={{ width: '100%' }}></div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
