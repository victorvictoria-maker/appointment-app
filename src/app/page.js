import Link from "next/link";
import "./globals.css";

export default function Home() {
  return (
    <main className='flex-grow flex flex-col items-center justify-center'>
      <p className='mt-4 text-center text-xl'>
        Easily book appointments with your Head of Department
      </p>
      <div className='mt-8'>
        <Link href='/auth/signin'>
          <button className='bg-primary hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-4'>
            Sign In
          </button>
        </Link>
        <Link href='/auth/signup'>
          <button className='bg-primary hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'>
            Sign Up
          </button>
        </Link>
      </div>
    </main>
  );
}
