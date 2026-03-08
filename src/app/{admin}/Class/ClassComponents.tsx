"use client";

import React from "react";
import { useGetClassesQuery } from "@/store/queries/Class";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
} from "@heroui/react";
import CreateClassModal from "./CreateClassModal";
import { useModal } from "@/Provider/ModalProvider";

export default function ClassComponents() {
  const { openModal } = useModal();
  const { data, isLoading } = useGetClassesQuery();
  const classes = data?.data?.items ?? [];
  
  if (isLoading) {
    return (
      <div className="p-10 text-center font-bold">
        Loading classes...
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* HEADER */}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black">Class Management</h1>

        <Button
  color="primary"
  onPress={() =>
    openModal({
      content: <CreateClassModal />,
    })
  }
>
  Create Class
</Button>
      </div>

      {/* TABLE */}

      <Table aria-label="Class table">

        <TableHeader>
          <TableColumn>Code</TableColumn>
          <TableColumn>Class Name</TableColumn>
          <TableColumn>Subject</TableColumn>
          <TableColumn>Semester</TableColumn>
          <TableColumn>Teacher</TableColumn>
          <TableColumn>Members</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>

        <TableBody items={classes}>
          {(c) => (
            <TableRow key={c.classId}>

              <TableCell className="font-bold">
                {c.classCode}
              </TableCell>

              <TableCell>
                {c.className}
              </TableCell>

              <TableCell>
                {c.subject?.code} - {c.subject?.name}
              </TableCell>

              <TableCell>
                {c.semester?.code}
              </TableCell>

              <TableCell>
                {c.teacher?.displayName ?? "—"}
              </TableCell>

              <TableCell className="font-bold">
                {c.memberCount}
              </TableCell>

              <TableCell>

                {c.isActive ? (
                  <Chip color="success" size="sm">
                    Active
                  </Chip>
                ) : (
                  <Chip color="danger" size="sm">
                    Inactive
                  </Chip>
                )}

              </TableCell>
                <TableCell>
                Action
              </TableCell>
            </TableRow>
          )}
        </TableBody>

      </Table>

    </div>
  );
}