import { ActionIcon, Button, Card, Center, Flex, Popover, Stack, Text, TextInput } from '@mantine/core'
import './App.css'
import { TOTP } from 'totp-generator'
import { FaFile, FaQrcode } from 'react-icons/fa'
import { FaBarsStaggered } from 'react-icons/fa6'

function App() {
  const qr = <FaQrcode className='qr-icon' onClick={() => {

  }} />

  return (
    <>
      <main>
        <Center className='app'>
          <Stack className='app-stack'>
            <Text className='title'>WebOTP</Text>
            <Text className='subtitle'>Sleek and Secure TOTP Generator</Text>
            <TextInput required placeholder='Secret Key' rightSection={qr} />
            <TextInput placeholder='Label' />
            <TextInput placeholder='Issuer' />
            <Button>Generate</Button>
            <Flex justify='center'>

            </Flex>
            <Popover position="top" opened withArrow>
              <Popover.Target>
                <ActionIcon variant="outline" color="rgba(0,0,0,1)" size="xl" radius="xl" aria-label="Settings" className='acb'>
                  <FaBarsStaggered />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown style={{ cursor: 'default', userSelect: 'none' }}>
                Add Example Items
              </Popover.Dropdown>
            </Popover>
          </Stack>
        </Center>

      </main >
    </>
  )
}

export default App
