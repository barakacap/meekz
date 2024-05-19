import './App.scss';
import { ToastContainer } from 'react-toastify';

import "react-toastify/dist/ReactToastify.css";

import MintSection from './components/mint-section/MintSection'


function App(){
 

  return (
    <div className="App">
      <ToastContainer style={{top:'75px'}}  position="top-right" autoClose={5000} closeOnClick />
      <div className='app-bg'></div>
      <MintSection/>
      

    </div>

  );
}

export default App;
