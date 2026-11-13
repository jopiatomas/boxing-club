// Genera versiones livianas (WebP redimensionadas, favicon, imagen para compartir)
// de las fotos originales que viven en /public. Los originales no se modifican.
// Uso: npm run images  (correr de nuevo solo si cambia alguna foto)
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const outDir = path.join(publicDir, 'img')

const photos = [
  { src: 'gimnasio.jpeg', name: 'gimnasio', widths: [640, 1024, 1600] },
  { src: 'Gimnasio-Afuera.jpeg', name: 'fachada', widths: [640, 1024, 1600] },
  { src: 'Foto Piki.jpeg', name: 'piki', widths: [480, 800, 1200] },
]

async function run() {
  await mkdir(outDir, { recursive: true })

  for (const photo of photos) {
    const input = path.join(publicDir, photo.src)
    for (const width of photo.widths) {
      const out = path.join(outDir, `${photo.name}-${width}.webp`)
      await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 74 }).toFile(out)
      console.log('✓', path.relative(root, out))
    }
    // JPEG mediano como respaldo para navegadores sin WebP
    const fallback = path.join(outDir, `${photo.name}-${photo.widths[1]}.jpg`)
    await sharp(input).resize({ width: photo.widths[1] }).jpeg({ quality: 78, mozjpeg: true }).toFile(fallback)
    console.log('✓', path.relative(root, fallback))
  }

  const logo = path.join(publicDir, 'logo.png')
  for (const size of [96, 192]) {
    await sharp(logo).resize({ height: size }).webp({ quality: 85 }).toFile(path.join(outDir, `logo-${size}.webp`))
    await sharp(logo).resize({ height: size }).png({ compressionLevel: 9 }).toFile(path.join(outDir, `logo-${size}.png`))
  }
  await sharp(logo).resize(32, 32, { fit: 'contain', background: '#ffffff' }).png().toFile(path.join(outDir, 'favicon-32.png'))
  await sharp(logo).resize(180, 180, { fit: 'contain', background: '#ffffff' }).png().toFile(path.join(outDir, 'apple-touch-icon.png'))
  console.log('✓ logos y favicons')

  await sharp(path.join(publicDir, 'gimnasio.jpeg'))
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(outDir, 'og-gimnasio.jpg'))
  console.log('✓ imagen para compartir')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
