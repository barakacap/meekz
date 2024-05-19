import {useEffect,useState} from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../../redux/blockchain/blockchainActions";
import { walletConnect } from "../../redux/blockchain/blockchainActions";

import { fetchData } from "../../redux/data/dataActions";
import { toast } from 'react-toastify';
import './WalletModal.scss'

import metamaskIcn from '../../assets/images/metamask.webp'
import coinbaseIcn from '../../assets/images/coinbase.webp'
import walletConnectIcn from '../../assets/images/walletconnect.webp'



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius:25,
  boxShadow: 24,
  outline:'none'
};

export default function WalletModal({open,setOpen}) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);


  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  useEffect(() => {
    getData();

  }, [blockchain.account]);

  const connectWallet=(wallet)=>{
    dispatch(connect(wallet));
    getData();
    handleClose();
  }
  const connectWalletConnect=()=>{
    dispatch(walletConnect());
    getData();
    handleClose();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box  sx={style} >
            <div className='wallet-modal'>
                <button onClick={()=>{connectWallet('metamask')}} className='modal-connect-button text-white font-xs weight-bold'>
                    <img src={metamaskIcn}/>
                    Metamask
                </button>
                <button onClick={()=>{connectWallet('coinbase')}} className='modal-connect-button text-white font-xs weight-bold'>
                    <img src={coinbaseIcn}/>
                    Coinbase Wallet
                </button>
                <button onClick={()=>{connectWalletConnect()}} className='modal-connect-button text-white font-xs weight-bold'>
                    <img src={walletConnectIcn}/>
                    Wallet Connect
                </button>
            </div>
        </Box>
      </Modal>
    </div>
  );
}