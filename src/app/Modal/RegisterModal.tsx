// File: app/Modal/RegisterModal.tsx
'use client';

import { Button, Input } from '@heroui/react';
import React from 'react';



export default function RegisterModal() {

  return (
    <form className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-center">Sign up</h2>

      <Input placeholder="Họ tên" autoFocus />
    <p className="text-red-500 text-sm"></p>
      <Input type="email" placeholder="Email"/>
       <p className="text-red-500 text-sm"></p>

      <Input type="password" placeholder="Mật khẩu"  />

      <Input type="number" placeholder="Tuổi" />
     <p className="text-red-500 text-sm"></p>

      <Input placeholder="Link ảnh đại diện (tùy chọn)" />
     <p className="text-red-500 text-sm"></p>

      <div className="flex flex-row gap-2 py-4 justify-end">
       <Button type="submit" color="danger" >
          Sign up now
        </Button>
      </div>
      
    </form>
  );
}