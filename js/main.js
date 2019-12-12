const s = 1; /* size - the bigger the faster (lower quality) */
const canvas = document.getElementById("canvas");
canvas.width = w = Math.floor(innerWidth/s);
canvas.height = h = Math.floor(innerHeight/s);
canvas.style.width = '100%';
canvas.style.height = '100%';
const c = canvas.getContext("2d");

let buffer1 = Array(w).fill().map(_=>Array(h).fill(0));
let buffer2 = Array(w).fill().map(_=>Array(h).fill(0));

let tmpCanvas = canvas.cloneNode(true),
		tmpC = tmpCanvas.getContext('2d');

tmpC.font = "30px Arial";
tmpC.textAlign = "center"
tmpC.fillRect(0,0,w,h)
tmpC.fillStyle = "rgb(50,50,50)"
tmpC.fillText("Hello World", w/2, h);


let temp;

function animation(){
	
	for(let i = 1; i < w-2; i++){
		for(let j = 1; j < h-2; j++){

			let n1 = buffer1[i+1][j],
					n2 = buffer1[i-1][j],
					n3 = buffer1[i][j+1],
					n4 = buffer1[i][j-1];
			
			buffer2[i][j-1] = Math.max((n1+n2+n3+n4)/4,0)
			
		}
	}
	
	let img = new ImageData(w, h)
	
	for(let i = 0; i < buffer1.length; i++){
		for(let j = 0; j < buffer1[0].length; j++){
			let index = (j * buffer1.length + i) * 4
			img.data[index] = buffer2[i][j]
			img.data[index+1] = buffer2[i][j]
			img.data[index+2] = buffer2[i][j]
			img.data[index+3] = 255
		}
	}
	
	c.putImageData(img,0,0)
	
	temp = buffer2;
	buffer2 = buffer1;
	buffer1 = temp;
	requestAnimationFrame(animation);
	ripple()
}

animation();

function ripple(e){
	let img = tmpC.getImageData(0,0,w,h);
	
	for(let i = 0; i < buffer1.length; i++){
		for(let j = 0; j < buffer1[0].length; j++){
			if(img.data[(j * buffer1.length + i) * 4])
				buffer1[i][j] = img.data[(j * buffer1.length + i) * 4]
		}
	}
}

document.addEventListener("click", ripple  );

//document.addEventListener("mousemove", ripple  );

window.addEventListener("resize",function(){
	location.reload();
});
