import React, { useEffect, useState } from 'react'
import './MintSection.scss';
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../../redux/blockchain/blockchainActions";
import { fetchData } from "../../redux/data/dataActions";
import { toast } from 'react-toastify';
import loading from '../../assets/images/loading.svg'

// import Web3EthContract from "web3-eth-contract";
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import { ethers } from "ethers";
import logoImg from '../../assets/images/logo.webp'

import Abi from '../../abi.json'

function MintSection() {

  const truncate = (input, len) =>
    input.length > len ? `${input.substring(0, len)}...` : input;
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const [claimingNft, setClaimingNft] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);
  const [paused, setPaused] = useState('')
  const [cost, setCost] = useState('')
  const [maxPerWallet, setMaxPerWallet] = useState('');
  const [limit, setLimit] = useState('')
  const [totalSupply, setTotalSupply] = useState('')
  const [refresh, setRefresh] = useState(0)
  const [balance, setBalance] = useState('')
  const [addressWhitelisted, setAddressWhitelisted] = useState(true)
  const [presaleActive, setPresaleActive] = useState('')

  const [initPrice, setInitPrice] = useState(null)
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = async () => {
    try {
      if (paused === true) {
        toast.error('Mint coming soon')
        return;
      }
      if (claimingNft || cost === '') return;

      let cost2 = cost;
      let gasLimit = CONFIG.GAS_LIMIT;
      let totalCostWei = String(cost * mintAmount);
      let totalGasLimit = String(gasLimit * mintAmount);

      toast.success(`Minting your ${mintAmount > 1 ? 'NFTs' : 'NFT'}...`);
      setClaimingNft(true);
      const options = {
        gasLimit: String(totalGasLimit),
        // to: CONFIG.CONTRACT_ADDRESS,
        // from: blockchain.account,
        value: totalCostWei,
      }
      const transaction = await blockchain.smartContract.mint(mintAmount, options)
      const receipt = await transaction.wait()
      toast.success(() =>
        <span>
          Mint Successful!
        </span>
      );
      setClaimingNft(false);
      dispatch(fetchData(blockchain.account));
      setRefresh(refresh + 1)
      setMintAmount(1)



    }
    catch (err) {
      console.log(err)
      toast.error("Sorry, something went wrong please try again later.");
      setClaimingNft(false);
    }

  }

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();

  }, []);

  useEffect(() => {
    getData();

  }, [blockchain.account]);

  const mint = () => {
    claimNFTs();
    getData();
  }

  const connectWallet = () => {
    // if(paused===''&&ethereum===null)return;
    dispatch(connect());
    getData();
  }

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > limit) {
      newMintAmount = limit;
    }
    if (limit === '') {
      newMintAmount = 1
    }
    if (limit === 0) {
      newMintAmount = 1

    }
    setMintAmount(newMintAmount);
  };



  const setAmountInput = (amount) => {
    amount = Number(amount)
    if (isNaN(amount)) return;
    if (amount > limit) {
      setMintAmount(limit)
    }
    else {
      setMintAmount(amount)
    }
  }

  const initConnect = async () => {
    // const { ethereum } = window;
    let ethereum = window?.ethereum?.providers !== undefined ? window?.ethereum?.providers?.find((x) => x?.isMetaMask) : window.ethereum
    // let walletProvider = window.ethereum.providers.find((x) => x.isCoinbaseWallet) // isCoinbaseWallet is part of the injected provider



    const address = CONFIG.CONTRACT_ADDRESS
    const abiResponse = await fetch("/config/abi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi = await abiResponse.json();

    let web3 = new ethers.providers.Web3Provider(ethereum);

    const contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, abi, web3);

    if (ethereum) {
      ethereum.on("accountsChanged", (accounts) => {
        setRefresh(refresh + 1)
      });
      ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      try {
        const cost = await contract.cost();


        const paused = await contract.paused();
        const totalSupply = await contract.totalSupply();
        const maxPerWallet = await contract.maxMintAmountPerPublicAccount();

        setCost(cost)
        setTotalSupply(Number(totalSupply))
        setMaxPerWallet(Number(maxPerWallet))
        // console.log(maxPerWallet)
        setPaused(paused)

      }
      catch (err) {
        console.log(err)
      }

      // setEthereum(ethereum)
    }
    else {
      // toast.error('Install metamask!')
    }

  }

  const getPrice = async () => {

    const provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/GUlWxL5lHbhRHXusgsbLWjTWZqFCXVF5');
    const contract = new ethers.Contract(CONFIG.CONTRACT_ADDRESS, Abi, provider);

    const price = await contract.cost()
    setInitPrice(ethers.utils.formatEther(String(price)))

  }
  useEffect(() => {
    if (CONFIG.CONTRACT_ADDRESS === '') return;
    getPrice()

    initConnect()

  }, [refresh, CONFIG])

  const getLimit = async () => {
    try {
      const balance = await blockchain.smartContract.balanceOf(blockchain.account)

      const nftsOwned = Number(balance)
      let limit = Number(maxPerWallet) - nftsOwned;
      if (limit <= 0) {
        setLimit(0)

      }
      else {
        setLimit(limit)
      }
    }
    catch (err) {
      console.log(err)
    }

    // blockchain.contract.balanceOf(blockchain.account).then((result)=>{
    //   console.log(maxPerWallet,result)
    //   setBalance(Number(result));
    //   let limit=Number(maxPerWallet)-result;
    //   if(limit<=0){
    //     setLimit(0)

    //   }
    //   else{
    //     setLimit(limit)

    //   }

    // })
  }
  useEffect(() => {
    if (blockchain.account === null || maxPerWallet === '') return;

    getLimit()
  }, [refresh, blockchain.account, maxPerWallet])


  return (
    <div className='MintSection'>
      <div className='mint-inner'>
        {/* <img className='warrior-img' src={warriorImg}></img> */}

        {blockchain.account &&
          <div className='ffam-urbanist connected-address fc-white'>
            <span className='fc-white fs-xs weight-bold'>Connected As</span>
            <span className='fc-white fs-xxs'> {truncate(blockchain.account, 15)}</span>
          </div>}
        <div className='mint-section-container'>
          <img className='mint-section-logo' src={logoImg}></img>
          {/* <p className='mint-info fs-xs ffam-urbanist fc-white'>Limit: {maxPerWallet} per wallet</p> */}

          {blockchain.account &&
            <center style={{ width: '100%' }}>
              <p className='mint-info fs-xs ffam-urbanist fc-white'>{cost && (cost / 1000000000000000000)} ETH per NFT + gas fee</p>
              <p className='mint-info fs-xs ffam-urbanist fc-white'>{totalSupply}/10000</p>
            </center>
          }
          <div className='mint-section-inner-bottom '>
            {
              (blockchain.account !== null) &&
              <div className='mint-input-div'>
                <button onClick={() => { decrementMintAmount() }} className='amount-button fs-m ffam-urbanist fc-white'>
                  -
                </button>
                <input className='fs-m ffam-urbanist fc-white' value={mintAmount} onChange={(e) => { setAmountInput(e.target.value) }} />
                <button onClick={() => { incrementMintAmount() }} className='amount-button fs-m ffam-urbanist fc-white'>
                  +
                </button>
              </div>
            }
            {
              (blockchain.account == null) &&
              (<button onClick={() => { connectWallet() }} className='fs-s mint-button ffam-urbanist fc-white fw-bold'>
                Connect Wallet
              </button>)
            }

            {
              blockchain.account !== null && addressWhitelisted === true && limit > 0 ?
                (

                  <button onClick={() => claimNFTs()} className=' fs-s mint-button ffam-urbanist fc-white fw-bold'>
                    {claimingNft === true ? (<img src={loading} />) : 'MINT NOW'}
                  </button>

                )
                : addressWhitelisted === false ?
                  <div className='fc-red fs-m ffam-urbanist weight-bold'>
                    {blockchain.account !== null &&
                      <div style={{ fcAlign: 'center', paddingTop: '25px' }}>
                        <div>
                          Not Whitelisted!
                        </div>
                      </div>
                    }



                  </div>
                  : limit === 0 ?
                    <div className='fc-red fs-s ffam-urbanist weight-bold'>
                      {blockchain.account !== null &&
                        <div style={{ fcAlign: 'center', paddingTop: '25px' }}>
                          <div>
                            Mint Limit Exceeded
                          </div>
                        </div>

                      }
                    </div>
                    : blockchain.account !== null ?
                      <button className='fs-xs mint-button ffam-urbanist'>
                        <img src={loading} />
                      </button> : null
            }
            
            {initPrice === null ?
              <button className='fs-xs mint-button ffam-orb'>
                <img src={loading} />
              </button>
              :
              <CrossmintPayButton
                collectionId="25ce3caf-370b-4465-add3-8d1ec7c0ce5e"
                projectId="d5a04c53-feff-4b70-8e08-6c34dd714b9a"
                mintConfig={{ "totalPrice": initPrice }}
                // environment='staging'
                style={{ fsFamily: 'Orbitron' }}
                className='mint-section-crossmint-btn fs-s'
              />
            }
            
          </div>
        </div>



      </div>


    </div>
  )
}

export default MintSection
