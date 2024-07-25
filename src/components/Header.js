import Link from "next/link";

export default function Header() {
  return (
    <header className='bg-primary p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Appointment App</h1>
        <nav>
          <Link href='/' className='text-white mr-4'>
            Home
          </Link>
          <Link href='/auth/signin' className='text-white'>
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
}
