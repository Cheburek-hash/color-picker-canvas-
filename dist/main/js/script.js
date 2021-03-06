/*** FREE USE  contact : <here>  ***/
'use strict';

const cvs = document.querySelector('canvas');
const ctx = cvs.getContext('2d', {alpha: false});

const w = window.innerWidth;
const h = window.innerHeight;

const downGradienHeight = 50;
const rightGradientWidth = 50;

const cursorSquere = 50;

cvs.width = w;
cvs.height = h;

/**
*	Default Preview gradient
*/

let gradientView = 
[
	[0,0,0],
	[255,0,0],
	[255,255,255]
];
function colorConverter(r, g, b)
{
	return {
		hex: ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
	};
}
window.addEventListener('mousemove', (cursorPosition) => {

	draw(gradientView);
	
	/**
	* down gradient`s collisions
	*/
	
	if (cursorPosition.y >= h - downGradienHeight - 5) {
		
    	let rectPosition = (cursorPosition.x >= cursorSquere / 2) ? (cursorPosition.x + cursorSquere / 2  >= w) ? w - cursorSquere : cursorPosition.x - cursorSquere / 2 : 1;
    	
    	ctx.beginPath();
	   	ctx.lineWidth = 1;
	    ctx.rect(rectPosition, h - downGradienHeight, downGradienHeight, downGradienHeight);
	    ctx.stroke();
	    ctx.closePath();
		
		let pixels = ctx.getImageData(rectPosition + downGradienHeight / 2, h - (downGradienHeight/2), 1, 1).data.slice(0,-1);
		
		gradientView[1] = [...pixels];
    	
    }
    /**
    *	right gradient collisions
    */
    else if (cursorPosition.x >= w - rightGradientWidth - 5) {
    	
    	let rectPosition =  (cursorPosition.y <= h-downGradienHeight - cursorSquere / 2) ? (cursorPosition.y <= cursorSquere / 2) ? 1 : cursorPosition.y - cursorSquere / 2 : h - downGradienHeight - cursorSquere;
    	
    	let coefficient = cursorPosition.y / 100;
    	
    	ctx.beginPath();
	   	ctx.lineWidth = 1;
	   	ctx.strokeStyle = `rgb(${[255 / coefficient, 255 / coefficient, 255 / coefficient]})`;
	    ctx.rect(w - rightGradientWidth + 3, rectPosition, rightGradientWidth - 4, rightGradientWidth);
	    ctx.stroke();
	    ctx.closePath();
			
	 	let color = ctx.getImageData(w-rightGradientWidth / 2, rectPosition + (rightGradientWidth / 2), 1, 1).data[0];
	
	 	gradientView[1] = [color, color, color];

    }
    /**
    *	Main gradients`s  rectangle
    */
    else {

    	let rectPosition = {
    		x: (cursorPosition.x >= cursorSquere / 2) ? cursorPosition.x - cursorSquere / 2 + 1 : 1,
    		y: cursorPosition.y - 20
    	}

    	let color = ctx.getImageData(rectPosition.x + 20, rectPosition.y + 20, 1, 1).data.slice(0,-1);

    	/**
    	*	color converter
    	*/

    	let colors = colorConverter(color[0],color[1],color[2]);

    	/**
    	* color changing coefficient
    	*/

    	let coefficient = Math.floor(255 / (rectPosition.x / 100));

    	ctx.strokeStyle = `rgb(${[coefficient, coefficient, coefficient]})`;

    	ctx.beginPath();
	    ctx.lineWidth = 1;
	    ctx.rect(rectPosition.x, rectPosition.y, downGradienHeight, downGradienHeight);
	    ctx.stroke();
	    ctx.closePath();

	    ctx.beginPath();
	   	ctx.lineWidth = 5;
	    ctx.rect(2,2,165,150);
	    ctx.rect(2,152,165,150);
	    ctx.stroke();
	    ctx.closePath();

	    /**
	    *	Block to display colors code
	    */

	    ctx.fillStyle = 'white';
	    ctx.fillRect(2,152,165,150);

	    /**
	    *	Block for preview color
	    */
	    
	    ctx.fillStyle = `rgb(${color})`;
	    ctx.fillRect(2,2,165,150);

	    /**
	    *	Colors code
	    */

	    ctx.font = '18px Arial';
	    ctx.fillStyle = 'black';
	    ctx.fillText(`RGB = ${color}`, 5, 170);
	    ctx.fillText(`HEX = #${colors.hex}`, 5, 190);
    	
    
    }

});

function createGradient(data, points = [0, w, w, 0], coefficient = false) {
	let linearGradient = ctx.createLinearGradient(...points);
	let count = 1;
	
	if (!coefficient){
		coefficient = 1 / data.colors.length
	}
	
	for (let i = data.colors.length - 1; i >= 0; i--) {
		linearGradient.addColorStop(count, data.colors[i]);
		count -= coefficient;
	}

	return linearGradient;	
}

function draw(gradientView) {

	ctx.clearRect(0,0,w,h)

	/**
	 *	 Background Gradient
	 */
	ctx.fillStyle = createGradient({
		colors:
		[
			`rgb(${gradientView[0]})`,
			`rgb(${gradientView[1]})`,
			`rgb(${gradientView[2]})`
		]
	});
	ctx.fillRect(0, 0, w, h - downGradienHeight);

	/**
	 *  Right Gradient
	 */

	 ctx.fillStyle = createGradient({
	 	colors:
	 	[
	 		'rgb(255,255,255)',
	 		'rgb(0,0,0)'
	 	]
	 }, [0,h*1.5,h/10,0]);
	 ctx.fillRect(w - rightGradientWidth, 0, rightGradientWidth, h-downGradienHeight);

	/**
	 *	 Down Gradient
	 */

	ctx.fillStyle = createGradient({
		colors:
		[
			'rgb(255,0,0)',
			'rgb(0,255,0)',
			'rgb(0,0,255)'
		]		
	},
	[0,w/100,w,0], 0.5);
	ctx.fillRect(0, h - downGradienHeight, w, downGradienHeight);
	
	/**
	 *	 Down and right Gradient's lines
	 */
	
	ctx.beginPath();
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 5;
	ctx.moveTo(0,h-downGradienHeight);
	ctx.lineTo(w,h - downGradienHeight);
	ctx.moveTo(w-rightGradientWidth,0);
	ctx.lineTo(w-rightGradientWidth,h-downGradienHeight)
	ctx.stroke();
}

draw(gradientView);