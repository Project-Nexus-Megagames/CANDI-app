import React, { useEffect, useState } from 'react';
import { Button, FormControl, FormLabel, FormErrorMessage, Input, Stack, HStack, Textarea } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';


export const ArticleForm = ({ attachment, edit, onEdit, onDelete }) => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm(
    {
      mode: 'onChange',
      reValidateMode: 'onChange',
      defaultValues: attachment,
      criteriaMode: "firstError",
      shouldFocusError: true,
      shouldUnregister: false,
      delayError: undefined
    }
  );
  const onSubmit = (data, e) => {
    e.preventDefault();
    if (onEdit) onEdit(data);
    console.log(data)
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <FormControl isRequired isInvalid={errors.title}>
          <HStack>
            <FormLabel htmlFor='title'>Title</FormLabel>
            <FormErrorMessage>
              {errors.title && errors.title.message}
            </FormErrorMessage>
          </HStack>
          <Input id='title' placeholder="title" {...register("title", {
            required: 'Required',
            minLength: { value: 1, message: 'Title must be must be more then 1 character' },
            maxLength: { value: 100, message: 'Title cannot be over 100 characters' }
          })}/>
        </FormControl>
        <FormControl isRequired isInvalid={errors.body}>
          <HStack>
            <FormLabel htmlFor='body'>Body</FormLabel>
            <FormErrorMessage>
              {errors.body && errors.body.message}
            </FormErrorMessage>
          </HStack>
          <Textarea isRequired id='body' placeholder="Body" {...register("body", {
            required: 'Required',
            minLength: { value: 20, message: 'Body must be must be more then 20 characters' },
            maxLength: { value: 10000, message: 'Title cannot be over 3000 characters' }
          })}/>
        </FormControl>
        <Stack>
          <Button colorScheme='green' disabled={!isValid} onClick={handleSubmit(onSubmit)}>{`${edit ? 'Edit' : 'Add'} Attachment`}</Button>
          <Button colorScheme='red' onClick={() => onDelete()}>{`Delete Attachment`}</Button>
        </Stack>
      </Stack>
    </form>
  );
}