import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { FC, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import {
  CreateGameDto,
  CreateGameDtoDifficutly,
  CreateGameDtoGameLength,
  GameControllerQuery,
} from '../api/axios-client';
import { MODAL_TYPE, RegisterModal } from './typer-modal-context';

const TyperCreateGameModal: FC<{ registerModal: RegisterModal }> = ({
  registerModal,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();

  useEffect(() => {
    registerModal(MODAL_TYPE.CREATE_GAME, onOpen);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true} size="sm">
      <ModalOverlay />
      <Formik
        initialValues={{ title: '', difficulty: '', length: '' }}
        onSubmit={async (values, actions) => {
          if (!values.title || !values.difficulty || !values.length) {
            actions.setSubmitting(false);
            return;
          }
          Object.entries(CreateGameDtoDifficutly).find(
            (e) => e[1] == values.difficulty,
          )?.[0];
          await GameControllerQuery.Client.createGame(
            new CreateGameDto({
              title: values.title,
              difficutly: Object.entries(CreateGameDtoDifficutly).find(
                (e) => e[1] == values.difficulty,
              )![1],
              gameLength: Object.entries(CreateGameDtoGameLength).find(
                (e) => e[1] == values.length,
              )![1],
            }),
          );
          queryClient.invalidateQueries(
            GameControllerQuery.getCurrentGameQueryKey(),
          );

          actions.setSubmitting(false);
          onClose();
        }}
      >
        {(props) => (
          <Form>
            <ModalContent>
              <ModalBody pb={4}>
                <Field name="title">
                  {({ field, form }: any) => (
                    <FormControl paddingY={2}>
                      <FormLabel>Title</FormLabel>
                      <Input {...field} placeholder="Your lobby title" />
                    </FormControl>
                  )}
                </Field>
                <Field name="difficulty">
                  {({ field, form }: any) => (
                    <FormControl paddingY={2}>
                      <FormLabel>Difficulty</FormLabel>
                      <Select {...field} placeholder="Select a difficulty">
                        {Object.values(CreateGameDtoDifficutly).map(
                          (difficulty) => (
                            <option key={difficulty}>{difficulty}</option>
                          ),
                        )}
                      </Select>
                    </FormControl>
                  )}
                </Field>
                <Field name="length">
                  {({ field, form }: any) => (
                    <FormControl paddingY={2}>
                      <FormLabel>Game Length</FormLabel>
                      <Select {...field} placeholder="Select a length">
                        {Object.values(CreateGameDtoGameLength).map(
                          (length) => (
                            <option key={length}>{length}</option>
                          ),
                        )}
                      </Select>
                    </FormControl>
                  )}
                </Field>
              </ModalBody>
              <ModalFooter>
                <Button
                  mt={4}
                  colorScheme="teal"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  Create
                </Button>
              </ModalFooter>
            </ModalContent>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default TyperCreateGameModal;
