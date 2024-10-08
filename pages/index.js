import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import JSZip from 'jszip'

export default function Home() {
  const [name, setName] = useState('')
  const [signatures, setSignatures] = useState([])

  const fonts = [
    'Julee', 'Kalam', 'Caveat', 'Alex Brush', 'Petit Formal Script', 'Italianno',
    'Rock Salt', 'Tangerine', 'Homemade Apple', 'Reenie Beanie', 'Marck Script',
    'Parisienne', 'Rochester', 'Cookie', 'Calligraffitti', 'Shadows Into Light Two',
    'Nanum Pen Script', 'Seaweed Script', 'Mr Dafoe', 'Allison', 'Sacramento',
    'Niconne', 'Dancing Script', 'Permanent Marker', 'Playball', 'Architects Daughter',
    'Indie Flower', 'Merienda', 'Kaushan Script', 'Delius', 'Gloria Hallelujah',
    'Ms Madi', 'Bad Script', 'Handlee', 'Courgette', 'Satisfy',
    'Covered By Your Grace', 'Monsieur La Doulaise', 'Sriracha', 'Rancho', 'Charm',
    'Great Vibes', 'Arizonia', 'Sofia', 'Pacifico', 'Qwigley', 'Yellowtail',
    'Nanum Brush Script', 'Pinyon Script', 'Cedarville Cursive', 'Klee One',
    'Yesteryear', 'Kristi', 'Macondo', 'Norican', 'Mrs Saint Delafield',
    'Herr Von Muellerhoff'
  ]

  const generateAllSignatures = () => {
    if (name.trim()) {
      setSignatures(fonts.map(font => ({ font, name: name.trim() })))
    } else {
      alert('Please enter your name')
    }
  }

  const downloadSignature = (name, font) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = 300
    canvas.height = 100

    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.font = `48px '${font}', cursive`
    context.fillStyle = 'black'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(name, canvas.width / 2, canvas.height / 2)

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `${name}_signature_${fonts.indexOf(font) + 1}.png`
    link.click()
  }

  const copySignature = (name) => {
    navigator.clipboard.writeText(name).then(() => {
      alert('Signature copied to clipboard')
    }).catch(err => {
      console.error('Failed to copy signature: ', err)
    })
  }

  const downloadAllSignatures = () => {
    const zip = new JSZip()
    const promises = []

    signatures.forEach((sig, index) => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = 300
      canvas.height = 100

      context.fillStyle = 'white'
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.font = `48px '${sig.font}', cursive`
      context.fillStyle = 'black'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText(sig.name, canvas.width / 2, canvas.height / 2)

      const promise = new Promise((resolve) => {
        canvas.toBlob((blob) => {
          zip.file(`${sig.name}_signature_${index + 1}.png`, blob)
          resolve()
        })
      })
      promises.push(promise)
    })

    Promise.all(promises).then(() => {
      zip.generateAsync({type: 'blob'}).then((content) => {
        const link = document.createElement('a')
        link.href = URL.createObjectURL(content)
        link.download = 'all_signatures.zip'
        link.click()
      })
    })
  }

  return (
    <>
      <Head>
        <title>Signature Generator - Create Your Personalized Signature</title>
        <meta name="description" content="Use our online signature generator to easily create unique, personalized signatures. Multiple font choices, simple, fast, and free!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="navbar">
        <div className="container">
          <div className="logo">
            <Image src="/logo.png" alt="Signature Generator Logo" width={40} height={40} className="logo-img" />
            <span className="logo-text">Signature Generator</span>
          </div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      <div className="content">
        <div className="container">
          <header>
            <h1>Signature Generator</h1>
          </header>
          <main>
            <section id="generator">
              <input
                type="text"
                id="nameInput"
                placeholder="Enter your name"
                aria-label="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button onClick={generateAllSignatures}>Generate Signatures</button>
            </section>
            <section id="result">
              <div id="signatureGrid">
                {signatures.map((sig, index) => (
                  <div key={index} className="signatureItem">
                    <div
                      className="signatureDisplay"
                      style={{ fontFamily: `'${sig.font}', cursive` }}
                    >
                      {sig.name}
                    </div>
                    <div className="buttonGroup">
                      <button onClick={() => downloadSignature(sig.name, sig.font)}>Download</button>
                      <button onClick={() => copySignature(sig.name)}>Copy</button>
                    </div>
                  </div>
                ))}
              </div>
              {signatures.length > 0 && (
                <button id="downloadAllBtn" onClick={downloadAllSignatures}>Download All Signatures</button>
              )}
            </section>
          </main>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2023 Signature Generator. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}