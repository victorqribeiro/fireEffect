const s = 1 /* size - the bigger the faster (lower quality) */
const canvas = document.getElementById("canvas")
canvas.width = w = Math.floor(innerWidth/s)
canvas.height = h = Math.floor(innerHeight/s)
canvas.style.width = '100%'
canvas.style.height = '100%'
const c = canvas.getContext("2d")

let buffer1 = Array(w).fill().map(_=>Array(h).fill(0))
let buffer2 = Array(w).fill().map(_=>Array(h).fill(0))

let tmpCanvas = canvas.cloneNode(true),
    tmpC = tmpCanvas.getContext('2d'),
    coolmap, textData, scroll = 0, d = []

const img = new Image()
img.src = './img/coolmap.png'
img.onload = _ => {
	
	tmpC.drawImage(img,0,0,w,h)
	let _coolmap = tmpC.getImageData(0,0,w,h);
	coolmap = Array(w).fill().map(_=>Array(h).fill(0));
	for(let i = 0; i < coolmap.length; i++){
		for(let j = 0; j < coolmap[0].length; j++){
			let index = (j * buffer1.length + i) * 4
			coolmap[i][j] = _coolmap.data[index] * 0.2126 +
						    _coolmap.data[index+1] * 0.7152 +
						    _coolmap.data[index+2] * 0.0722
		}
	}
	let text = getMessage() || "Hello World!"
	let fontSize = w / (text.length > 1 ? text.length : 2 )
	tmpC.font = fontSize+"px Verdana";
	tmpC.textAlign = "center"
	tmpC.fillRect(0,0,w,h)
	tmpC.fillStyle = "white"
	tmpC.fillText(text, w/2, h/2 + fontSize/3)
	textData = tmpC.getImageData(0,0,w,h)
	for(let i = 0; i < buffer1.length; i++){
		for(let j = 0; j < buffer1[0].length; j++){
			if(textData.data[(j * buffer1.length + i) * 4] > 240)
				d.push(i,j)
		}
	}
	animation()
}

const getMessage = () => {
	return (new URL(document.location)).searchParams.get('message')
}

const animation = () => {
	
	for(let i = 1; i < w-2; i++){
		for(let j = 1; j < h-2; j++){
			let n1 = buffer1[i+1][j],
				n2 = buffer1[i-1][j],
				n3 = buffer1[i][j+1],
				n4 = buffer1[i][j-1]
			buffer2[i][j-1] = Math.max(((n1+n2+n3+n4)/4)-(coolmap[i][(j+scroll)%h]*0.1),0)
		}
	}
	
	scroll += 2
	
	let _img = new ImageData(w, h)
	
	for(let i = 0; i < buffer1.length; i++){
		for(let j = 0; j < buffer1[0].length; j++){
			let index = (j * buffer1.length + i) * 4
			_img.data[index] = buffer2[i][j] ** 2 * 0.1
			_img.data[index+1] = buffer2[i][j] * 0.8
			_img.data[index+2] = buffer2[i][j] ** 0.5 * 0.3
			_img.data[index+3] = 255
		}
	}
	
	c.putImageData(_img,0,0)
	
	let temp = buffer2
	buffer2 = buffer1
	buffer1 = temp
	requestAnimationFrame(animation)
	ignite()
}

const ignite = () => {
    for(let i = 0; i < d.length; i+=2)
        buffer1[d[i]][d[i+1]+Math.floor(Math.random()*10-20)] += 12
}

window.addEventListener("resize", ()=>{ location.reload() })
