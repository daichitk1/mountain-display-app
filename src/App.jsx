import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    山の一覧アプリ
    <div class="flex flex-row">
      <div class='w-50 h-50 m-10 bg-red-600'>
        Hello world!
      </div>
      <div class='w-50 h-50 m-10 bg-red-600'>
        Hello world
      </div>
      <div class='w-50 h-50 m-10 bg-red-600'>
        Hello world
      </div>
      <div class='w-50 h-50 m-10 bg-red-600'>
        Hello world
      </div>
      <div class='w-50 h-50 m-10 bg-red-600'>
        Hello world
      </div>
    </div>
    </>
  )
}

export default App
