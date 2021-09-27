import React, { useState } from "react"
import logo from "./logo.svg"
import "./App.css"
import { getHeroDetail } from "./api"
import { count } from "console"

interface IResponse {
  id: number
  name: string
  avatar: string
  description: string
}

function App() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<IResponse | null>(null)
  const handleGetHeroDetail = async () => {
    try {
      setLoading(true)
      const response = await getHeroDetail(text)
      setData(response)
      setLoading(false)
    } catch (error) {}
  }

  return (
    <div className="App">
      <label htmlFor="search">Search</label>
      <input
        id="search"
        type="text"
        placeholder="Hero name"
        value={text}
        onChange={(e) => {
          setText(e.target.value)
        }}
      />
      <button onClick={() => handleGetHeroDetail()}>Submit</button>

      {loading && <div>loading</div>}

      {data && <div>{data.name}</div>}
    </div>
  )
}

export default App
