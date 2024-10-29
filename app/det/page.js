'use client';
import {FictionChatClient} from 'fiction-chat-client';

import React, { useState, useEffect } from 'react';

export default function Home() {

  const [token, setToken] = useState('');

  useEffect(() => {
    console.log(token)
  }, [token])
  return (
    <main>
      <h1 className='text-3xl font-bold text-red-500'>Welcome to My Next.js App</h1>
      <p>This is a simple React page built with Next.js</p>
      <input className='border-2' type="text" value={token} onChange={(e) => setToken(e.target.value)} />
      <div className='flex flex-row w-full border-2 h-screen'>
        <FictionChatClient 
        authToken={token} 
        contentContainerClassName=' '
        chatServerUrl={process.env.NEXT_PUBLIC_CHAT_SERVER_URL}
        chatWsUrl={process.env.NEXT_PUBLIC_CHAT_WS_URL}
         />
      </div>
    </main>
  );
}
