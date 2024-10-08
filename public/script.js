document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const generateBtn = document.getElementById('generateBtn');
    const signatureGrid = document.getElementById('signatureGrid');
    const downloadAllBtn = document.getElementById('downloadAllBtn');

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
    ];

    generateBtn.addEventListener('click', generateAllSignatures);
    downloadAllBtn.addEventListener('click', downloadAllSignatures);

    function generateAllSignatures() {
        const name = nameInput.value.trim();
        if (name) {
            signatureGrid.innerHTML = '';
            fonts.forEach((font, index) => {
                const signatureItem = document.createElement('div');
                signatureItem.className = 'signatureItem';
                
                const signatureDisplay = document.createElement('div');
                signatureDisplay.className = 'signatureDisplay';
                signatureDisplay.style.fontFamily = `'${font}', cursive`;
                signatureDisplay.textContent = name;
                
                const buttonGroup = document.createElement('div');
                buttonGroup.className = 'buttonGroup';
                
                const downloadBtn = document.createElement('button');
                downloadBtn.textContent = 'Download';
                downloadBtn.addEventListener('click', () => downloadSignature(name, font));
                
                const copyBtn = document.createElement('button');
                copyBtn.textContent = 'Copy';
                copyBtn.addEventListener('click', () => copySignature(name));
                
                buttonGroup.appendChild(downloadBtn);
                buttonGroup.appendChild(copyBtn);
                
                signatureItem.appendChild(signatureDisplay);
                signatureItem.appendChild(buttonGroup);
                signatureGrid.appendChild(signatureItem);
            });
            downloadAllBtn.style.display = 'inline-block';
        } else {
            alert('Please enter your name');
        }
    }

    function downloadSignature(name, font) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 300;
        canvas.height = 100;

        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.font = `48px '${font}', cursive`;
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(name, canvas.width / 2, canvas.height / 2);

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${name}_signature_${fonts.indexOf(font) + 1}.png`;
        link.click();
    }

    function copySignature(name) {
        navigator.clipboard.writeText(name).then(() => {
            alert('Signature copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy signature: ', err);
        });
    }

    function downloadAllSignatures() {
        const name = nameInput.value.trim();
        const zip = new JSZip();
        const promises = [];

        fonts.forEach((font, index) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 300;
            canvas.height = 100;

            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.font = `48px '${font}', cursive`;
            context.fillStyle = 'black';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(name, canvas.width / 2, canvas.height / 2);

            const promise = new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    zip.file(`${name}_signature_${index + 1}.png`, blob);
                    resolve();
                });
            });
            promises.push(promise);
        });

        Promise.all(promises).then(() => {
            zip.generateAsync({type: 'blob'}).then((content) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = 'all_signatures.zip';
                link.click();
            });
        });
    }
});