'use client';

import React, { useState } from 'react';
import { Input, Button, addToast, ModalFooter } from '@heroui/react';
import { useLoginMutation } from '@/store/queries/auth';
import { useModal } from '../../Provider/ModalProvider';

export default function LoginModal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginMutation();
  const { closeModal } = useModal();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // NGĂN reload page

    try {
      const res = await login({ email, password }).unwrap();

      if (!res.result) {
        addToast({
          title: "Đăng nhập thất bại",
          description: "Email hoặc mật khẩu không đúng",
        });
        return;
      }

      const token = res.result;
      console.log("Login thành công, token:", token);

      addToast({
        title: "Đăng nhập thành công",
      });
      closeModal();
    } catch {
      addToast({
  title: "Đăng nhập thất bại",
  description: "Email hoặc mật khẩu không đúng",
});

    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold">Đăng nhập</h2>

      <div className="flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Nhập email"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password">Mật khẩu</label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Nhập mật khẩu"
        />
      </div>
    <ModalFooter>
      <Button type="submit" color="danger" variant="solid">
        Login
      </Button>
      </ModalFooter>
    </form>
  );
}
