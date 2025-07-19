'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function RegisterSuccessPage() {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffffff] px-4">
      <div className="relative w-full max-w-sm pt-12 p-6 border border-[#649566] rounded-lg shadow-md bg-[#ffffff] text-center">

        {/* ✅ 슬저씨 이미지 박스 위 좌측에 걸치게 */}
        <div className="absolute top-0 left-0 -translate-x-[-30%] -translate-y-[60%]">
          <Image
            src="/seuljeossi.png"
            alt="Seuljeossi Character"
            width={90}
            height={90}
            className=""
          />
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-[#649566]">
          Password reset Successful
        </h2>
        <p className="text-[#4b6656] mb-6">
          Your password reset is complete.<br />
          Please log in.
        </p>
        <button
          onClick={goToLogin}
          className="w-full bg-[#98c195] hover:bg-[#649566] text-white font-semibold py-2 rounded-md transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
