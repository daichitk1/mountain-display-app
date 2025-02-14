import { useState } from 'react'
import {useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0)
  const [mountains, setMountains] = useState([])

  useEffect(()=>{
    fetchCharacters();
  })
  const fetchCharacters = async () => {
    const apiUrl= "https://mountix.codemountains.org/api/v1/mountains?limit=20";
    const result = await axios.get(apiUrl);
    console.log(result.data.mountains);
    setMountains(result.data.mountains);

  }
  return (
    <>
    <h1 class="text-4xl">山の一覧アプリ</h1>
    <div class="grid grid-cols-4 p-10">
      {mountains.map((mountain)=> {
        return <div class="w-60 h-60 m-1 bg-blue-200">
        <div class="grid grid-cols-1">
          <div class="mt-5 text-2xl">{mountain.name}</div>
          <div>({mountain.nameKana})</div>
          <div class="m-3 text-1xl">({mountain.prefectures})</div>
          <div class="m-3">({mountain.tags})</div>
        </div>
        </div>;
      })}
    </div>
    </>
  )
}

export default App
