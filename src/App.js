import './App.css';
import { useEffect,useRef, useState } from 'react';
import Switch from "react-switch";
import { AiFillCaretUp } from "react-icons/ai";
import { AiFillCaretDown } from "react-icons/ai";
import  io from "socket.io-client";
const URL="http://localhost:5000/";
 function App() {
  const [STATE,setState]=useState({
    state:0,
    hOff:0,
    mOff:0
  })
  const [time,setTime]=useState(new Date())
  const socket=useRef()
  useEffect(()=>{
    socket.current=io(URL)
    socket.current.on('server-send-state',data=>{
      setState(STATE=>({...STATE,state:data}))
    })
    socket.current.on('server-send-hOff',data=>{
      setState(STATE=>({...STATE,hOff:data}))
    })
    socket.current.on('server-send-mOff',data=>{
      setState(STATE=>({...STATE,mOff:data}))
    })
    setInterval(
      () => tick(),
      1000
    );
  },[])
 const tick=()=> {
    setTime(new Date());
  }
  const toggleState=()=>{
    const data={}
    if(STATE.state==1){
      data.state=0
    }else{
      data.state=1
    }
    socket.current.emit('client-send-state',data)
  }

  const increaseHours=()=>{
    console.log('in gio')

    if(STATE.hOff==23){
      socket.current.emit('client-send-hOff',{hOff:0})
    }else{
      socket.current.emit('client-send-hOff',{hOff:STATE.hOff+1
    })
    }
  }

  const decreaseHours=()=>{
    console.log('de gio')

    if(STATE.hOff==0){
      socket.current.emit('client-send-hOff',{hOff:0})
    }else{
      socket.current.emit('client-send-hOff',{hOff:STATE.hOff-1
    })
    }
  }

  const increaseMinutes=()=>{
    if(STATE.mOff==59){
      socket.current.emit('client-send-mOff',{mOff:0})
    }else{
      socket.current.emit('client-send-mOff',{mOff:STATE.mOff+1})
    }
  }

  const decreaseMinutes=()=>{
    console.log('de phut')
    if(STATE.mOff==0){
      socket.current.emit('client-send-mOff',{mOff:0})
    }else{
      socket.current.emit('client-send-mOff',{mOff:STATE.mOff-1})
    }
  }
  
  return (
    <div className="App">
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',alignContent:'center',marginTop:'60px',fontSize:'20px',fontWeight:'500'}}>
        <span style={{marginRight:'30px'}}>Trạng thái:</span>
        <Switch onChange={toggleState} checked={!!STATE.state} />
      </div>
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',alignContent:'center',marginTop:'60px',fontSize:'20px',fontWeight:'500'}}>
        <span style={{marginRight:'30px'}}>Time Off:</span>
        <div style={{display:'flex',flexDirection:'column'}}>
          <AiFillCaretUp onClick={increaseHours}/>
          <span>{STATE.hOff}</span>
          <AiFillCaretDown onClick={decreaseHours}/>
        </div>
        <span style={{margin:'0 18px'}}>:</span>
        <div style={{display:'flex',flexDirection:'column'}}>
          <AiFillCaretUp onClick={increaseMinutes}/>
          <span>{STATE.mOff}</span>
          <AiFillCaretDown onClick={decreaseMinutes}/>
        </div>
      </div>

      <div style={{display:'flex',justifyContent:'center',alignItems:'center',alignContent:'center',marginTop:'60px',fontSize:'20px',fontWeight:'500'}}>
        <span>Bây giờ là:</span>
        <span style={{margin:'0 10px'}}>:</span>
        <span>{time.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}

export default App;
