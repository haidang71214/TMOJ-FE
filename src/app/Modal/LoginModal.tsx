import { useLoginMutation } from "@/store/queries/auth";
import { addToast, Button, Checkbox, Divider, Input } from "@heroui/react";
// import { GoogleLogin } from "@react-oauth/google";
import { ArrowRight, Mail, X } from "lucide-react";
import { useState } from "react";
import { useModal } from "../../Provider/ModalProvider";
import PasswordInput from "../components/PasswordInput";
import ForgotPasswordModal from "./ForgotPasswordModal";
import RegisterModal from "./RegisterModal";
import { ErrorForm } from "@/types";

export default function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  // const [googleLogin] = useGoogleLoginMutation();
  const { closeModal, openModal } = useModal();

  const handleOpenForgotPass = ()=>{
      openModal({ content: <ForgotPasswordModal /> })
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await login({ email, password }).unwrap();
    console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",res);
    
    if (res) {
      console.log(res);

      addToast({ title: "Welcome back!", color: "success" });

      closeModal();

      // reload sau khi login thành công
      window.location.reload();
    }
  } catch (err: unknown) {
    const error = err as ErrorForm;

    addToast({
      title: error?.data?.data?.message ?? "Login failed!",
      color: "danger",
    });
  }
};

  return (
    <div className="relative flex flex-col gap-5 py-10 px-8 bg-white dark:bg-[#282E3A] transition-colors duration-500 rounded-[2.5rem] shadow-2xl max-w-[420px] w-full border-none outline-none">
      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
      >
        <X size={20} />
      </button>

      {/* Header */}
      <div className="flex flex-col gap-1 items-center justify-center text-center mt-2 mb-8">
        <h2 className="text-4xl font-black text-[#3F4755] dark:text-white tracking-tighter uppercase leading-none">
          Sign in<span className="text-[#3F4755] dark:text-[#FFB800]">.</span>
        </h2>
        <p className="text-[12px] font-bold text-gray-400 dark:text-[#E3C39D] tracking-wide mt-2 uppercase">
          Welcome to TMOJ
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            startContent={
              <Mail
                size={18}
                className="text-[#3F4755] dark:text-[#FFB800] shrink-0"
              />
            }
            classNames={{
              inputWrapper:
                "bg-gray-100 dark:bg-[#333A45] border border-transparent dark:border-[#474F5D] focus-within:!border-[#FFB800] h-12 rounded-2xl border-1 transition-all",
              input:
                "font-bold ml-2 text-sm text-[#3F4755] dark:text-white placeholder:text-gray-500",
            }}
            autoFocus
          />
          <div className="flex flex-col gap-2">
            <PasswordInput
  value={password}
  onChange={setPassword}
  required
/>

            <div className="justify-between items-center px-1 flex">
              <Checkbox
                size="sm"
                classNames={{
                  wrapper: "after:bg-[#FFB800]",
                  label: "text-[12px] font-bold text-gray-500",
                }}
              >
                Remember me
              </Checkbox>
              <span onClick={()=>{handleOpenForgotPass()}} className="text-[12px] font-bold text-[#3F4755] dark:text-[#E3C39D] cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          endContent={!isLoading && <ArrowRight size={18} />}
          className="bg-[#3F4755] dark:bg-[#FFB800] text-white dark:text-[#071739] font-black rounded-2xl h-14 mt-4 shadow-lg dark:shadow-[0_8px_20px_rgba(255,184,0,0.3)] uppercase tracking-widest text-sm transition-transform active:scale-95"
        >
          Sign in
        </Button>
      </form>

      {/* Social Login */}
      <div className="flex flex-col gap-4 mt-2">
        <Divider className="dark:bg-[#474F5D] opacity-50" />
        <div className="flex flex-col items-center justify-center gap-3">
            {/* <div className="w-full relative">
              <div className="opacity-0 absolute inset-0 z-10 overflow-hidden pointer-events-auto">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      if (credentialResponse.credential) {
                        const res = await googleLogin({ tokenId: credentialResponse.credential }).unwrap();
                        if (res.result) {
                          addToast({ title: "Welcome back!", color: "success" });
                          closeModal();
                        }
                      }
                    } catch (error: unknown) {
                      addToast({ title: "Google Login Failed", color: "danger" });
                      console.error("Google login error detail:", error);
                    }
                  }}
                  onError={() => {
                    addToast({ title: "Google Login Failed", color: "danger" });
                  }}
                  useOneTap={false}
                  theme="outline"
                  shape="pill"
                  width="100%"
                />
              </div>
              <Button
                variant="bordered"
                className="w-full h-[45px] rounded-full border-gray-200 dark:border-[#474F5D] text-[#3F4755] dark:text-white font-bold flex items-center justify-center gap-3 transition-all hover:bg-gray-50 dark:hover:bg-[#333A45]"
                startContent={
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                }
              >
                Continue with Google
              </Button>
            </div> */}
            
            <div className="w-full flex justify-center mt-1">
              <Button
                variant="bordered"
                className="w-full h-[45px] rounded-full border-gray-200 dark:border-[#474F5D] text-[#3F4755] dark:text-white font-bold flex items-center justify-center gap-3 transition-all hover:bg-gray-50 dark:hover:bg-[#333A45]"
                startContent={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                }
              >
                Continue with GitHub
              </Button>
            </div>
        </div>
        <p className="text-center text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-2">
          New to TMOJ?{" "}
          <span
            className="text-[#3F4755] dark:text-[#FFB800] cursor-pointer hover:underline font-black"
            onClick={() => openModal({ content: <RegisterModal /> })}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
