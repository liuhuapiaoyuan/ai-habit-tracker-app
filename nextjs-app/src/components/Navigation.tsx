'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-around mb-8">
      <Link 
        href="/" 
        className={`p-2 ${pathname === '/' ? 'text-primary' : 'hover:text-primary'}`}
      >
        今日待办
      </Link>
      <Link 
        href="/history" 
        className={`p-2 ${pathname === '/history' ? 'text-primary' : 'hover:text-primary'}`}
      >
        完成记录
      </Link>
      <Link 
        href="/manage" 
        className={`p-2 ${pathname === '/manage' ? 'text-primary' : 'hover:text-primary'}`}
      >
        管理任务
      </Link>
      <Link 
        href="/achievements" 
        className={`p-2 ${pathname === '/achievements' ? 'text-primary' : 'hover:text-primary'}`}
      >
        成就
      </Link>
      <Link
        href="/settings"
        className={`p-2 rounded-lg ${
          pathname === '/settings' 
            ? 'bg-gray-100 dark:bg-gray-800' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        } transition-colors duration-200`}
      >
        <svg 
          className="w-6 h-6 text-gray-600 dark:text-gray-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </Link>
    </nav>
  );
}
