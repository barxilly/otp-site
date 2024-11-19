import { ActionIcon, Button, Card, Center, Flex, Image, MantineProvider, Popover, Progress, Stack, Text, TextInput, Tooltip } from '@mantine/core'
import ReactDOM from 'react-dom'
import './App.css'
import { FaMicrosoft, FaQrcode } from 'react-icons/fa'
import { TOTP } from 'totp-generator'
import { FaBarsStaggered } from 'react-icons/fa6'
import jsQR from 'jsqr'
import { CgNametag } from 'react-icons/cg'


function App() {
  return (
    <>
      <main>
        <Center className='app'>
          <Stack className='app-stack'>
            <Text className='title'>WebOTP</Text>
            <Text className='subtitle'>Sleek and Secure TOTP Generator</Text>
            <Tooltip label='Base32 encoded string used to generate the TOTP' position='top' withArrow>
              <TextInput id='s' required type='password' placeholder='Secret Key' rightSection={<FaQrcode className='qr-icon' onClick={() => qrF()} />} />
            </Tooltip>
            <Tooltip label='A label for you to distinguish between codes' position='top' withArrow>
              <TextInput id='l' placeholder='Label' />
            </Tooltip>
            <Tooltip label='The company that is issuing the code i.e. Google, Microsoft' position='top' withArrow>
              <TextInput id='i' placeholder='Issuer' />
            </Tooltip>
            <Button onClick={generate}>Generate</Button>
            <Stack className='otp-container' id="otpc">
              {/*<Card className='otp-saved' shadow="sm" padding="md" radius="md" withBorder>
                <Stack>
                  <Flex>
                    <img className='saved-icon' src='SRC' />
                    <Text className='saved-label'>Secret Key</Text>
                  </Flex>
                  <Text className='otp'>123456</Text>
                </Stack>
              </Card>*/}
            </Stack>
          </Stack>
          <Popover position="top" opened withArrow>
            <Popover.Target>
              <ActionIcon variant="outline" size="xl" radius="xl" aria-label="Settings" className='acb' onClick={example}>
                <FaBarsStaggered />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown style={{ cursor: 'default', userSelect: 'none' }}>
              Add Example Item
            </Popover.Dropdown>
          </Popover>
        </Center>
      </main >
      <img alt="google" width={0} src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" onLoad={loaded} />
    </>
  )
}


function qrF() {
  // Open file picker
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.style.display = 'none'
  document.body.appendChild(input)
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement)?.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = async () => {
      const data = reader.result
      const image = new Image()
      image.src = data as string
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')
        if (context) {
          context.drawImage(image, 0, 0, image.width, image.height)
          const imageData = context.getImageData(0, 0, image.width, image.height)
          const ret = jsQR(imageData.data, imageData.width, imageData.height)
          const sec = ret?.data.split('secret=')[1]?.split('&')[0]
          const label = ret?.data.split('totp/')[1]?.split('?')[0]
          const issuer = ret?.data.split('issuer=')[1]?.split('&')[0]
          const s = document.getElementById('s') as HTMLInputElement
          s.value = sec || ''
          const l = document.getElementById('l') as HTMLInputElement
          l.value = label || ''
          const i = document.getElementById('i') as HTMLInputElement
          i.value = issuer || ''
        }
      }
    }
  }
  input.click()
  // Close file picker
  document.body.removeChild(input)
  return
}

function generate() {
  if (!document.getElementById('s')?.value) {
    const secretInput = document.getElementById('s') as HTMLInputElement;
    if (secretInput) {
      secretInput.style.border = '1px solid red';
      secretInput.focus();
    }
    return
  }

  const otpc = document.getElementById('otpc') as HTMLElement
  const key = document.getElementById('s') as HTMLInputElement
  const label = document.getElementById('l') as HTMLInputElement
  const issuer = document.getElementById('i') as HTMLInputElement
  const issuerIcons = {
    "microsoft": "https://cdn.pixabay.com/photo/2021/08/10/15/36/microsoft-6536268_1280.png",
    "google": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png",
    "amazon": "https://static.wikia.nocookie.net/logopedia/images/f/fc/Amazon.com_Favicon_2.svg/revision/latest?cb=20160808095346",
    "apple": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Apple_logo_black.svg/1200px-Apple_logo_black.svg.png",
    "twitch": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Twitch_logo.svg/1200px-Twitch_logo.svg.png",
  }
  const card = <MantineProvider><Card className='otp-saved' id={"otp-c-" + key?.value} shadow="sm" padding="md" radius="md" withBorder>
    <Stack>
      <Flex>
        <img className='saved-icon' src={issuerIcons[issuer?.value as keyof typeof issuerIcons] || 'https://static-00.iconduck.com/assets.00/key-icon-512x510-f5hzglej.png'} />
        <Text className='saved-label'>{label?.value}</Text>
      </Flex>
      <Text className='otp'>123456</Text>
      <Progress value={50} />
    </Stack>
  </Card></MantineProvider>
  const container = document.createElement('div')
  otpc.appendChild(container)
  ReactDOM.render(card, container)

  // Save to localStorage
  const saved = JSON.parse(localStorage.getItem('saved') || '{}')
  saved[key.value] = { label: label.value, issuer: issuer.value }
  localStorage.setItem('saved', JSON.stringify(saved))
}

function example() {
  console.log('example')
}

function loaded() {
  // Load saved OTPs
  const saved = JSON.parse(localStorage.getItem('saved') || '{}')

  const otpc = document.getElementById('otpc')
  for (const key in saved) {
    if (!saved.hasOwnProperty(key)) continue;
    const issuerIcons = {
      "microsoft": "https://cdn.pixabay.com/photo/2021/08/10/15/36/microsoft-6536268_1280.png",
      "google": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png",
      "amazon": "https://static.wikia.nocookie.net/logopedia/images/f/fc/Amazon.com_Favicon_2.svg/revision/latest?cb=20160808095346",
      "apple": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Apple_logo_black.svg/1200px-Apple_logo_black.svg.png",
      "twitch": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Twitch_logo.svg/1200px-Twitch_logo.svg.png",
    }
    const src = issuerIcons[saved[key].issuer.toLowerCase() as keyof typeof issuerIcons] || 'https://static-00.iconduck.com/assets.00/key-icon-512x510-f5hzglej.png'
    const card = <MantineProvider><Card className='otp-saved' id={"otp-c-" + key} shadow="sm" padding="md" radius="md" withBorder>
      <Stack>
        <Flex>
          <img className='saved-icon' src={src} />
          <Text className='saved-label'>{saved[key].label}</Text>
        </Flex>
        <Text className='otp'>123456</Text>
        <Progress value={50} />
      </Stack>
    </Card></MantineProvider>
    const container = document.createElement('div')
    otpc?.appendChild(container)
    ReactDOM.render(card, container)
  }

  setInterval(() => {
    // Update OTPs
    const otpc = document.getElementById('otpc')
    const divs = otpc?.children as HTMLCollectionOf<HTMLElement>
    for (let i = 0; i < divs.length; i++) {
      const card = divs[i].children[1] as HTMLElement
      const otp = divs[i].getElementsByClassName('otp')[0] as HTMLElement
      const key = card.id.split('otp-c-')[1]
      const secret = key
      const otpValue = TOTP.generate(secret).otp
      otp.innerText = otpValue
    }
  }, 80)
}

export default App
