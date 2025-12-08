'use client';
import React, { useState, useEffect } from "react";
import { Input, Button, Avatar, addToast, ModalBody, ModalFooter } from "@heroui/react";
import { useGetUserInformationQuery, useUpdateUserProfileMutation } from "@/store/queries/usersProfile";
import { UpdateUserDto } from "@/types";

export default function ProfileUser() {
  const { data: user, isLoading } = useGetUserInformationQuery();
  const [updateUserProfile, { isLoading: updating }] = useUpdateUserProfileMutation();

  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    imagesUrl: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        age: user.age?.toString() || "",
        email: user.email || "",
        imagesUrl: user.imagesUrl || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getChangedFields = (): Partial<UpdateUserDto> => {
    if (!user) return {};
    const changed: Partial<UpdateUserDto> = {};

    if (form.name !== user.name) changed.name = form.name;
    if (form.age && Number(form.age) !== user.age) changed.age = Number(form.age);
    if (form.email !== user.email) changed.email = form.email;
    if (form.imagesUrl !== user.imagesUrl) changed.imagesUrl = form.imagesUrl;

    return changed;
  };

  const handleUpdate = async () => {
    try {
      const changedFields = getChangedFields();
      if (Object.keys(changedFields).length === 0) {
        addToast({
          title: "Warning!",
          description: "Nothing has changed",
          color: "warning",
        });
        return;
      }
      await updateUserProfile(changedFields);
      addToast({
        title: "Complete!",
        description: "Update successful",
        color: "success",
      });
    } catch (err) {
      console.error(err);
      addToast({
        title: "Update failed",
        description: "Update not successful",
        color: "danger",
      });
    }
  };

  if (isLoading) return <p className="text-center">Loading...</p>;

  return (
    <>
      <ModalBody className="flex flex-col items-center gap-4">
        <Avatar
          src={form.imagesUrl || ""}
          className="w-24 h-24"
          isBordered
        />

        <h1 className="text-2xl font-bold">{user?.name}</h1>

        <Input
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          variant="bordered"
          className="w-full"
        />

        <Input
          label="Age"
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          variant="bordered"
          className="w-full"
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          variant="bordered"
          className="w-full"
        />

        <Input
          label="Avatar URL"
          name="imagesUrl"
          value={form.imagesUrl}
          onChange={handleChange}
          variant="bordered"
          className="w-full"
        />
      </ModalBody>

      <ModalFooter>
        <Button
          color="danger"
          className="w-full"
          variant="shadow"
          isLoading={updating}
          onPress={handleUpdate}
        >
          Update Profile
        </Button>
      </ModalFooter>
    </>
  );
}
