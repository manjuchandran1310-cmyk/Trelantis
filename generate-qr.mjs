import QRCode from 'qrcode'
import { writeFileSync } from 'fs'

const url = 'https://trelantis.netlify.app/'

const svgStr = await QRCode.toString(url, {
  type: 'svg',
  width: 1024,
  margin: 2,
  color: { dark: '#2A2B7C', light: '#FFFFFF' },
  errorCorrectionLevel: 'H',
})
writeFileSync('trelantis-qr.svg', svgStr)

await QRCode.toFile('trelantis-qr.png', url, {
  width: 1024,
  margin: 2,
  color: { dark: '#2A2B7C', light: '#FFFFFF' },
  errorCorrectionLevel: 'H',
})

console.log('Generated trelantis-qr.svg and trelantis-qr.png')
