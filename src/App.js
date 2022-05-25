
import './App.css'
import FormData from 'form-data'
import Axios from 'axios'
import {useLoader as loader, Canvas} from "@react-three/fiber"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import {useGLTF as loadgltf, useFBX as loadfbx, OrbitControls} from "@react-three/drei"
import React, { useEffect, useState } from 'react'

const uuid = require('uuid')
const api_url = 'https://fabrik-backend-2.herokuapp.com'

function reloadcomp() {
  window.location.reload(false)
}

function FileUpload() {
  const [file, setFile] = React.useState("");

  const upload = (e) => {
    e.preventDefault()
    let formd = new FormData()
    formd.append("model", file)
    Axios.post(`${api_url}/storeamodel`, formd)
    .then(() => {      reloadcomp()})
  }

  return (
    <div>
      <input type="file" onChange={(e) => {setFile(e.target.files[0])}}/>
        <button onClick={(e) => upload(e)} className='nameplate2'>
          Upload
        </button>
    </div>
  );
}

function App() {

  //let [Dubba, setDubba] = React.useState(() => (Tismodel("Suzane.gltf")))
  let [model, setmodel] = useState([])
  let [curr,setcurr] = useState(["Suzane.gltf"])

  const listmodels = async () => {
    const res = await fetch(`${api_url}/listall`)
    const data = await res.json()
    
    setmodel(data["Models"])
  }

  function Selector() {
    return (
      <div className='oopshuns'>
        <h3>Models</h3>
          {model.map((fname) => (
            // <div key={uuid.v4()} className='Modelselector'>
              <button  onClick={() => type(fname)} className="nameplate">
                {fname}
              </button>
            // </div>
        ))}
      </div>
    )
  }

  function Tismodel() {
    const li = `${api_url}/${curr}`
    const tmp = (`${curr}`).slice((`${curr}`).indexOf('.'))
    if (tmp === ".fbx") {
      // const { scene } = loadfbx(li)
      // console.log(`this is fbx scene: ${scene}`)
      const scene = loader(FBXLoader, li)
      return (
        <group dispose={null}>
          <primitive key={uuid.v4()} object={scene}  />
        </group>
      )}

    else {
      const { scene } = loadgltf(li)
      return (
        <group dispose={null}>
          <primitive key={uuid.v4()} object={scene}  />
        </group>
      )}
  }
  const type = async (t) => {
    setcurr(t)
  }

  useEffect(() => {
    const tmp = listmodels()
  },[])  

  return (
    <>
    <div className='titlenav'>
      <h2>FABRIK-ASSIGNMENT</h2>
    </div>
    <div className="App">
      Upload your model
      <FileUpload/>
    </div>
      <div className='eldestchild'>
        <Selector/>

        <div className='canvas'>
          <Canvas className='rcan'>
            <OrbitControls enableZoom={true}/>
            <ambientLight intensity={0.5}/>
            <directionalLight position={[-2,5,2]} intensity={1}/>
            <Tismodel />
          </Canvas>
        </div>
      </div>
    </>
    
  );
}

export default App;
