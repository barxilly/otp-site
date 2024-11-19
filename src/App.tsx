import { ActionIcon, Button, Card, Center, Flex, MantineProvider, Popover, Progress, Stack, Text, TextInput, Tooltip } from '@mantine/core'
import ReactDOM from 'react-dom'
import './App.css'
import { FaEye, FaEyeSlash, FaQrcode, FaTrash } from 'react-icons/fa'
import { TOTP } from 'totp-generator'
import { FaBarsStaggered } from 'react-icons/fa6'
import jsQR from 'jsqr'

const issuerIcons = {
  "microsoft": "https://cdn.pixabay.com/photo/2021/08/10/15/36/microsoft-6536268_1280.png",
  "google": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png",
  "amazon": "https://static.wikia.nocookie.net/logopedia/images/f/fc/Amazon.com_Favicon_2.svg/revision/latest?cb=20160808095346",
  "apple": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Apple_logo_grey.svg/505px-Apple_logo_grey.svg.png",
  "twitch": "https://images.seeklogo.com/logo-png/27/2/twitch-logo-png_seeklogo-274042.png?v=638663246940000000",
}
function App() {
  const qr = <FaQrcode className='qr-icon' onClick={() => qrF()} />
  function toggleSee() {
    const passwordInput = document.getElementById('s') as HTMLInputElement;
    const eyeSlashIcon = document.querySelector('.sl') as HTMLElement;
    const eyeIcon = document.querySelector('.op') as HTMLElement;

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeSlashIcon.classList.add('hidden');
      eyeIcon.classList.remove('hidden');
    } else {
      passwordInput.type = 'password';
      eyeSlashIcon.classList.remove('hidden');
      eyeIcon.classList.add('hidden');
    }
  }
  return (
    <>
      <main>
        <Center className='app'>
          <Stack className='app-stack'>
            <Text className='title'>WebOTP</Text>
            <Text className='subtitle'>Sleek TOTP Generator</Text>
            <Tooltip label='Base32 encoded string used to generate the TOTP' position='top' withArrow>
              <div style={{ position: 'relative' }}>
                <TextInput id='s' required type='password' placeholder='Secret Key' rightSection={qr} />
                <FaEyeSlash className='eye sl' onClick={toggleSee} />
                <FaEye className='eye hidden op' onClick={toggleSee} />
              </div>
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
    // Check if file is a png or jpg
    if (!file.name.endsWith('.png') && !file.name.endsWith('.jpg')) {
      alert('Invalid file type. Please upload a PNG or JPG file.')
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = async () => {
      const data = reader.result
      const image = document.createElement('img')
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
          const label = ret?.data.split('otp/')[1]?.split('?')[0]
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
  const secretInput = document.getElementById('s') as HTMLInputElement;
  if (!secretInput?.value) {
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
  const card = <MantineProvider><Card className='otp-saved' id={"otp-c-" + key?.value} shadow="sm" padding="md" radius="md" withBorder>
    <Stack>
      <Flex>
        <img className='saved-icon' src={issuerIcons[issuer?.value as keyof typeof issuerIcons] || 'https://static-00.iconduck.com/assets.00/key-icon-512x510-f5hzglej.png'} />
        <Text className='saved-label'>{label?.value}</Text>
        <FaTrash className='delete' onClick={deleteOTP(key?.value)} />
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
  const otpc = document.getElementById('otpc') as HTMLElement
  // Generate random base32 key (only characters A-Z and 2-7)
  const key = Math.random().toString(36).replace(/[^a-z2-7]/g, '').substr(2, 16)
  console.log(key)
  const label = ["Key", "OTP", "Code"][Math.floor(Math.random() * 3)]
  const issuer = ["microsoft", "google", "amazon", "apple", "twitch"][Math.floor(Math.random() * 5)]
  const card = <MantineProvider><Card className='otp-saved' id={"otp-c-" + key} shadow="sm" padding="md" radius="md" withBorder>
    <Stack>
      <Flex>
        <img className='saved-icon' src={issuerIcons[issuer as keyof typeof issuerIcons] || 'https://static-00.iconduck.com/assets.00/key-icon-512x510-f5hzglej.png'} />
        <Text className='saved-label'>{label}</Text>
        <FaTrash className='delete' onClick={deleteOTP(key)} />
      </Flex>
      <Text className='otp'>123456</Text>
      <Progress value={50} />
    </Stack>
  </Card></MantineProvider>
  const container = document.createElement('div')
  otpc.appendChild(container)
  ReactDOM.render(card, container)
}

function loaded() {
  // Load saved OTPs
  const saved = JSON.parse(localStorage.getItem('saved') || '{}')

  const otpc = document.getElementById('otpc')
  for (const key in saved) {
    if (!saved.hasOwnProperty(key)) continue;
    const src = issuerIcons[saved[key].issuer.toLowerCase() as keyof typeof issuerIcons] || 'https://static-00.iconduck.com/assets.00/key-icon-512x510-f5hzglej.png'
    const card = <MantineProvider><Card className='otp-saved' id={"otp-c-" + key} shadow="sm" padding="md" radius="md" withBorder>
      <Stack>
        <Flex>
          <img className='saved-icon' src={src} />
          <Text className='saved-label'>{saved[key].label}</Text>
          <FaTrash className='delete' onClick={deleteOTP(key)} />
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
      try {
        const card = divs[i].children[1] as HTMLElement
        const otp = divs[i].getElementsByClassName('otp')[0] as HTMLElement
        const key = card.id.split('otp-c-')[1]
        const secret = key
        const otpValue = TOTP.generate(secret).otp
        otp.innerText = otpValue
        const prog = divs[i].getElementsByClassName('mantine-Progress-section')[0] as HTMLElement
        const expiry = TOTP.generate(secret).expires
        const current = new Date().getTime()
        const thirtybeforeexpiry = expiry - 30000
        const timeleft = thirtybeforeexpiry - current
        const percentage = (((timeleft / 30000) * 100) * -1).toFixed(0)
        // Flip percentage to positive if negative
        prog.style.width = percentage + '%'
      } catch (e) {
        console.error(e)
        continue;
      }
    }
  }, 250)
}

function deleteOTP(key: string) {
  return () => {
    const card = document.getElementById('otp-c-' + key)
    card?.remove();
    const saved = JSON.parse(localStorage.getItem('saved') || '{}')
    delete saved[key]
    localStorage.setItem('saved', JSON.stringify(saved))
    window.location.reload()
  }
}

export default App
