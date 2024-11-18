import { ActionIcon, Button, Card, Center, Flex, Popover, Stack, Text, TextInput } from '@mantine/core'
import './App.css'
import { TOTP } from 'totp-generator'
import { FaFile, FaQrcode } from 'react-icons/fa'
import { FaBarsStaggered } from 'react-icons/fa6'

function qrF() {
  console.log('qr')
}

function generate() {
  console.log('generate')
}

function example() {
  console.log('example')
}

function App() {
  const qr = <FaQrcode className='qr-icon' onClick={qrF} />

  return (
    <>
      <main>
        <Center className='app'>
          <Stack className='app-stack'>
            <Text className='title'>WebOTP</Text>
            <Text className='subtitle'>Sleek and Secure TOTP Generator</Text>
            <TextInput required type='password' placeholder='Secret Key' rightSection={qr} />
            <TextInput placeholder='Label' />
            <TextInput placeholder='Issuer' />
            <Button onClick={generate}>Generate</Button>
          </Stack>
          <Popover position="top" opened withArrow>
            <Popover.Target>
              <ActionIcon variant="outline" color="rgba(0,0,0,1)" size="xl" radius="xl" aria-label="Settings" className='acb' onClick={example}>
                <FaBarsStaggered />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown style={{ cursor: 'default', userSelect: 'none' }}>
              Add Example Item
            </Popover.Dropdown>
          </Popover>
        </Center>
      </main >
    </>
  )
}



export default App
