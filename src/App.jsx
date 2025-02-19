import { useState } from 'react'
import {useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';
import GoogleMapAPI from './GoogleMapAPI';

function App() {
  const [mountains, setMountains] = useState([]);
  const [page, setPage] = useState(1);
  const [onemountain, setOnemountain] = useState([]);
  const [mountainState, setMountainState] = useState(0);
  const [text, setText] = useState("");
  const limit = 15
  useEffect(()=>{
    fetchMountains(page);
  }, [page, mountainState])
  useEffect(()=>{
    fetchAIdata(onemountain.name);
  }, [onemountain])
  const fetchMountains = async (page) => {
    const offset = (page - 1) * limit;
    const apiUrl= `https://mountix.codemountains.org/api/v1/mountains?limit=${limit}&offset=${offset}${mountainState === 0 ? "" : mountainState === 1 ? "&tag=1" : "&tag=2"}`;
    const result = await axios.get(apiUrl);
    console.log(result.data.mountains);
    setMountains(result.data.mountains);
  }

  const fetchAIdata = async (props) =>{
    console.log("にゃあーー");
    console.log(props);
    console.log("にゃあーー");
    if (props===undefined){
      return null;
    }
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',{
          model: "gpt-4o",
          messages: [
              { role: "system", content: "あなたは登山について詳しい専門家です" },
              {
                  role: "user",
                  content: props +"についておすすめを3つ、合計300文字以下で具体的な固有名素を踏まえ簡潔に教えて。また、根拠が明確になっている情報のみ教えて。",
              },
          ],
      },{
      headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPEN_AI_API}`,
      },
    }
    );
    setText(response.data.choices[0].message.content);
  }

  const handleNext = async() =>{
    const nextPage = page + 1;
    await fetchMountains(nextPage);
    setPage(nextPage);
    setOnemountain([]);
  }

  const handlePrev = async() =>{
    const prevPage = (page == 0 ? 0 : page - 1);
    await fetchMountains(prevPage);
    setPage(prevPage);
    setOnemountain([]);
  }

  const setOneNarrow = async()=>{
    setMountainState(1);
    setPage(1);
    setOnemountain([]);
  }

  const setTwoNarrow = async()=>{
    setMountainState(2);
    setPage(1);
    setOnemountain([]);
  }

  const resetNarrow = async()=>{
    setMountainState(0);
    setPage(1);
    setOnemountain([]);
  }


  function DisplayMountain(){
    if (onemountain.length === 0){
      return null;
    }
    window.scrollTo(0, 0)
    return(
      <div class="grid grid-cols-1 flex items-center justify-center bg-green-200 m-10">
        <div class="rounded bg-white w-20 ml-3 my-2 hover:bg-black hover:text-white" onClick = {() => {setOnemountain([]), setText("");}}>閉じる</div>
        <div class="mt-5 text-2xl font-semibold">{onemountain.name}</div>
        <div>({onemountain.nameKana})</div>
        <div class="m-3 text-1xl">({onemountain.prefectures})</div>
        <div class="m-1 text-1xl">地域: {onemountain.area}</div>
        <div class="m-1 text-1xl">標高: {onemountain.elevation}m</div>
        {(text.length !== 0) && <div class="w-200 mx-auto p-5 my-5 rounded bg-white">{text}</div>}
        <GoogleMapAPI latitude={onemountain.location.latitude} longitude={onemountain.location.longitude} name={onemountain.name}/>
      </div>
    );
  }


  return (
    <>
    <h1 class="text-4xl">山の一覧アプリ⛰️</h1>
    <div class="m-3 flex">
      <div class={`rounded w-20 m-1 ${mountainState === 1 ? "bg-blue-700 text-white" : "bg-blue-200 hover:bg-blue-700"}`} onClick={setOneNarrow}>百名山</div>
      <div class={`rounded w-20 m-1 ${mountainState === 2 ? "bg-green-700 text-white" : "bg-green-200 hover:bg-green-700"}`} onClick={setTwoNarrow}>二百名山</div>
      <div class="w-20 bg-stone-100 m-1 rounded hover:bg-black hover:text-white" onClick={resetNarrow}>リセット</div>
    </div>
    <div class={`m-4 rounded w-20 w-20 bg-red-200`}>その他</div>
    <DisplayMountain/>
    <div className="rounded bg-sky-200">
      <button disabled = { page === 1} class= {`${page === 1 ? 'bg-blue-100' : 'bg-blue-600 text-white hover:bg-blue-400'} w-10 m-5`} onClick={handlePrev}>前</button>
      <span>{page}</span>
      <button disabled = { mountains.length < limit } className={ `w-10 m-5 ${mountains.length < limit ? 'bg-blue-100' : 'bg-blue-600 text-white hover:bg-blue-400'}`} onClick={handleNext}>次</button>
    </div>
    <div class="grid grid-cols-4 p-10">
      {mountains.map((mountain)=> {
         {console.log(mountain.tags)}
        return (
        <div class={`w-70 h-70 m-1 hover:bg-sky-400 ${mountain.tags[0] === '百名山' ? 'bg-blue-200' : mountain.tags[0] === '二百名山' ? 'bg-green-200' : 'bg-red-200'}`}>
          <div class="grid grid-cols-1 flex items-center justify-center" onClick = {() => {setText([]), setOnemountain(mountain)}}>
            <div class="mt-5 text-2xl font-semibold">{mountain.name}</div>
            <div>({mountain.nameKana})</div>
            <div class="m-3 text-1xl">({mountain.prefectures})</div>
            <div class="m-1 text-1xl">地域: {mountain.area}</div>
            <div class="m-1 text-1xl">標高: {mountain.elevation}m</div>
          </div>
        </div>
        )
      })}
    </div>
    <div className="rounded bg-sky-200">
      <button disabled = { page === 1} class= {`${page === 1 ? 'bg-blue-100' : 'bg-blue-600 text-white hover:bg-blue-400'} w-10 m-5`} onClick={handlePrev}>前</button>
      <span>{page}</span>
      <button disabled = { mountains.length < limit } className={ `w-10 m-5 ${mountains.length < limit ? 'bg-blue-100' : 'bg-blue-600 text-white hover:bg-blue-400'}`} onClick={handleNext}>次</button>
    </div>
    </>
  )
}

export default App
