import { useState } from "react";
import SpinWheel from "./components/Wheel";

import "./App.css";
import SpinWheels from "./components/SpinWheel";
import { set1 } from "./data";

export default function App() {
  const [score, setScore] = useState(0);
  const [index, setIndex] = useState<number | null>(null);
  const [start, setStart] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)

  const handleResult = (correct : boolean)=>{
    if(correct){
      setScore(prev => prev + 10)
    }else{
      setScore(prev => prev - 5)
    }
    setIndex(prev => prev + 1)
    setShow(false)
  }
  return (
    <div className="flex">
      <SpinWheel setIndex={setIndex} index={index}/>
      <div>
        Current Score = {score}
        <br />
        {typeof index === "number" && (
          <>
            {" "}
            Question = {set1[index].question}
            <br />
            {show && (

              <>
            Answer = {set1[index].sol}
            <br />
            <button onClick={() => handleResult(true)}>Correct</button>
            <br />
            <button onClick={() => handleResult(false)}>Wrong</button>
              </>
            )
             }
            <br />
            <button onClick={() => setShow(true)}>Show Answer</button>
            <br />
            <button onClick={()=>setIndex(prev => prev as number +1)}>Skip</button>
          
          </>
        )}
        <br />
        <button onClick={()=>setIndex(0)}>Start</button>
      </div>
    </div>
  );
}
