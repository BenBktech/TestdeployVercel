import Head from 'next/head'
import { Flex, Text, Input, Button } from '@chakra-ui/react'
import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useProvider, useSigner, useAccount } from 'wagmi'
import { useEffect, useState } from 'react';
import Contract from "../SimpleStorage.json"
import { ethers } from 'ethers';

export default function Home() {

  const provider = useProvider()
  const { data: signer } = useSigner()
  const { account, isConnected } = useAccount()
  const contractAddress = "0xf6e91a0559F710BBA470047443A71f2Df44A8c7A";

  const [number, setNumber] = useState(null)
  const [getNumber, setGetNumber] = useState(null)

  useEffect(() => {
    if(isConnected) {
      getDatas()
    }
  }, [isConnected])

  const getDatas = async() => {
    const contract = new ethers.Contract(contractAddress, Contract.abi, provider);
    const favoriteNumber = await contract.getNumber()
    setGetNumber(favoriteNumber.toString())
    console.log(favoriteNumber)
  }

  const setFavoriteNumber = async() => {
    console.log(number)
    const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
    let transaction = await contract.setNumber(number)
    await transaction.wait(1)
    getDatas()
  }

  return (
    <>
      {isConnected ? (
        <>
          <Flex p="2rem" justifyContent="space-between" alignItems="center">
            <Text>Logo</Text>
            <ConnectButton />
          </Flex>
          
          <Flex direction="column" p="2rem">
            <Input onChange={e => setNumber(e.target.value)} placeholder='Your favorite number' />
            <Button mt="1rem" onClick={() => setFavoriteNumber()} colorScheme='purple'>Set Favorite Number</Button>
          </Flex>

          <Flex p="2rem" alignItems="center" justifyContent="center">
            <Text>Your favorite number : {getNumber}</Text>
          </Flex>
        </>
      ) : (
        <>
          <Flex p="2rem" justifyContent="space-between" alignItems="center" h="15vh">
            <Text>Logo</Text>
            <ConnectButton />
          </Flex>
          <Flex p="2rem" justifyContent="center" alignItems="center" h="85vh">
            <Text>Please connect your Wallet</Text>
          </Flex>
        </>
      )}
    </>
  )
}