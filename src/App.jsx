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
  const [mountainOne, setMountainOne] = useState([]);
  const [mountainState, setMountainState] = useState(0);
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const limit = 15;

  useEffect(()=>{
    fetchMountains(page);
  }, [page, mountainState, query])

  useEffect(()=>{
    fetchAIdata(mountainOne);
  }, [mountainOne])

  const fetchMountains = async (page) => {
    const offset = (page - 1) * limit;
    const apiUrl= `https://mountix.codemountains.org/api/v1/mountains?limit=${limit}&offset=${offset}${mountainState === 0 ? "" : mountainState === 1 ? "&tag=1" : "&tag=2"}&name=${query}`;
    const result = await axios.get(apiUrl);
    setMountains(result.data.mountains);
  }

  const fetchAIdata = async (props) =>{
    if (props.name===undefined){
      return null;
    }

    const prompt = `
    次の山に登ろうと考えています。おすすめを知りたいです。
    山の詳細
    山の名前: ${props.name}、
    山のエリア: ${props.area}、
    山の標高: ${props.elevation}、

    出力形式は以下の要件を満たし200語程度で。
    行ごとに改行文字(¥n)をつけてください。

    例:

    1文での紹介文
    一つ目の魅力ポイント
    二つ目の魅力ポイント
    この山の難易度(かかる時間、登れる季節など)
    この山の注意点
    最後に締めの文

    事実ではないことをは話さないように最大限注意してください。また、山の情報は生死に関わる可能性があるので情報はより厳密にしてください。
    `;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',{
          model: "gpt-4o",
          messages: [
              { role: "system", content: "あなたは登山について詳しい専門家です。初めて山に登る人を想定して答えてください。" },
              {
                  role: "user",
                  content: prompt,
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
    setMountainOne([]);
  }

  const handlePrev = async() =>{
    const prevPage = (page == 0 || page - 1);
    await fetchMountains(prevPage);
    setPage(prevPage);
    setMountainOne([]);
  }

  const setOneNarrow = async()=>{
    setMountainState(1);
    resetPage;
  }

  const setTwoNarrow = async()=>{
    setMountainState(2);
    resetPage;
  }

  const resetNarrow = async()=>{
    setMountainState(0);
    resetPage;
  }

  const resetPage = async()=>{
    setPage(1);
    setMountainOne([]);
    setQuery("");
  }


  const DisplayMountain = (props) => {
    if (mountainOne.length === 0){
      return null;
    }
    window.scrollTo(0, 0)
    return(
      <div class="grid grid-cols-1 flex items-center justify-center bg-green-200 m-5">
        <div class="rounded bg-white w-20 ml-3 my-2 hover:bg-black hover:text-white" onClick = {() => {setMountainOne([]), setText("");}}>閉じる</div>
        <div class="mt-5 text-2xl font-semibold">{props.name}</div>
        <div>({props.nameKana})</div>
        <div class="m-3 text-1xl">({props.prefectures})</div>
        <div class="m-1 text-1xl">地域: {props.area}</div>
        <div class="m-1 text-1xl">標高: {props.elevation}m</div>
        <div class="my-4">
          {(text.length !== 0) &&
          text.split("¥n").map((line)=>{
            return (
            <div class="w-100 mx-auto my-3 text-left">
              {line}
            </div>)
          })}
        </div>
        <GoogleMapAPI latitude={mountainOne.location.latitude} longitude={mountainOne.location.longitude} name={mountainOne.name}/>
      </div>
    );
  }


  return (
    <>
    <div>
    <h1 class="text-4xl">山の一覧アプリ⛰️</h1>
    <div class="m-3 flex">
      <div class={`rounded w-20 m-1 ${mountainState === 1 ? "bg-blue-700 text-white" : "bg-blue-200 hover:bg-blue-700"}`} onClick={setOneNarrow}>百名山</div>
      <div class={`rounded w-20 m-1 ${mountainState === 2 ? "bg-green-700 text-white" : "bg-green-200 hover:bg-green-700"}`} onClick={setTwoNarrow}>二百名山</div>
      <div class="w-20 bg-stone-100 m-1 rounded hover:bg-black hover:text-white" onClick={resetNarrow}>リセット</div>
    </div>
    <div class="flex justify-between">
      <div class="m-3 flex">
        <div class={`m-1 rounded w-20 w-20 bg-red-200`}>その他</div>
      </div>
      <div class="m-3">
        <input value={input} onChange={(e)=> setInput(e.target.value)} name="myInput" class="m-1 rounded border-2 border-black-500" defaultValue="Some initial value"/>
        <button type="submit" class="rounded hover:bg-black hover:text-white m-1" onClick={()=> {setQuery(input), setInput(""), setMountainOne("")}}>検索</button>
      </div>
    </div>
    <DisplayMountain name = {mountainOne.name} nameKana={mountainOne.nameKana} prefectures = {mountainOne.prefectures} area ={mountainOne.area} elevation = {mountainOne.elevation}/>
    <div className="rounded bg-sky-200">
      <button disabled = { page === 1} class= {`${page === 1 ? 'bg-blue-100' : 'bg-blue-600 text-white hover:bg-blue-400'} w-10 m-5`} onClick={handlePrev}>前</button>
      <span>{page}</span>
      <button disabled = { mountains.length < limit } className={ `w-10 m-5 ${mountains.length < limit ? 'bg-blue-100' : 'bg-blue-600 text-white hover:bg-blue-400'}`} onClick={handleNext}>次</button>
    </div>
    <div class="grid grid-cols-4 p-1">
      {mountains.map((mountain)=> {
         {console.log(mountain.tags)}
        return (
        <div class={`w-70 h-70 m-1 hover:bg-sky-400 ${mountain.tags[0] === '百名山' ? 'bg-blue-200' : mountain.tags[0] === '二百名山' ? 'bg-green-200' : 'bg-red-200'}`}>
          <div class="grid grid-cols-1 flex items-center justify-center" onClick = {() => {setText(""), setMountainOne(mountain)}}>
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
    </div>
    </>
  )
}

export default App
