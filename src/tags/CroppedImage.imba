# const StackBlur = require('stackblur-canvas')
import * as StackBlur from 'stackblur-canvas'
import {MeasuringBox} from './MeasuringBox'

let canvas = <canvas[d: block]>

let measuringData = {}

export tag CroppedImage
	image = new Image
	text = "Hello dad :) mage(data.image, data.crop.left * data.image.width, data.crop.top * data.image.height, data.crop.width * data.image.width, data.crop.height * data.ima"
	font = {
		size: 30
		family: "Arial"
		color: "white"
		align: "center"
		line-height: 1.5
	}
	blur = no
	blur_radius = 4
	text_crop = {
		left: 0
		top: 0
		width: 0
		height: 0
	}
	total_text_height = 1.5

	def mount
		# Before painting text I use crop data to crop original image
		[width, height] = data.getSize(data.crop.width * data.uploaded_image.width, data.uploaded_image.height * data.crop.height)
		text_crop.width = width * 0.9
		text_crop.height = height
		text_crop.left = width * 0.05
		text_crop.top = 0
		measuringData =
			crop: text_crop
			width: width
			height: height
			text_resizing: yes

		canvas.width = width
		canvas.height = height
		canvas.imageSmoothingQuality = 'high'
		renderImage()
		calculateTop()
		calculateLuminance()

	# Needed to define correct font collor. 
	# Dark on lighter pictures and light on darker
	def calculateLuminance
		let rgb = getAverageRGB()
		document.body.children[2].style.backgroundColor = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')'
		let Y = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b
		if Y < 128
			font.color = "white"
		else font.color = "black"

	def calculateTop
		text_crop.top = (height - total_text_height) / 2

	def renderImage
		let ctx = canvas.getContext('2d')
		ctx.save()
		# Clear canvas before painting
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		drawImage(ctx)
		drawText(ctx)

		ctx.restore()
		imba.commit()

	def drawImage ctx
		if blur
			StackBlur.image(data.image, canvas, blur_radius, no)
		else
			ctx.drawImage(data.image, 0, 0, width, height)


	def drawText ctx
		ctx.font = font.size + 'px ' + font.family
		ctx.textAlign = font.align
		ctx.fillStyle = font.color
		const x = text_crop.width / 2 + text_crop.left
		const y = text_crop.height / 2 + text_crop.top - (font.line-height * font.size) / 4
		wrapText(ctx, x, y, text_crop.width, font.line-height * font.size)

	def wrapText context, x, y, maxWidth, lineHeight
		let words = text.split(' ')
		let line = ''
		let lines = []
		total_text_height = lineHeight

		# Generates an array of wrapped line and
		# calculates the height of future text to center it later
		for n in [0...words.length]
			let testLine = line + words[n] + ' '
			let metrics = context.measureText(testLine)
			let testWidth = metrics.width
			if (testWidth > maxWidth && n > 0)
				lines.push(line)
				line = words[n] + ' '
				total_text_height += lineHeight
			else 
				line = testLine
		lines.push(line)

		# TODO Before drawing text check out if it can be fitted in the canvas frames
		if total_text_height > canvas.height
			console.log "Do something with it Bo!"
		
		text_crop.height = total_text_height
		# Center the text position around y coordinate
		y = y - total_text_height / 2 + lineHeight
		# Write the lines from top to bottom
		for line in lines
			context.fillText(line, x, y)
			# Change position of next line to be lower
			y += lineHeight

	def getAverageRGB
		let blockSize = 5 # only visit every 5 pixels
		let defaultRGB = {r:0,g:0,b:0} # for non-supporting envs
		let context = canvas.getContext && canvas.getContext('2d')
		let imgdata
		let i = -4
		let rgb = {r:0,g:0,b:0}
		let count = 0
			
		unless context
			return defaultRGB
				
		try
			imgdata = context.getImageData(0, 0, canvas.width, canvas.height)
		catch e
			# security error, img on diff domain */alert('x')
			return defaultRGB

		while (i += blockSize * 4) < imgdata.data.length
			++count
			rgb.r += imgdata.data[i]
			rgb.g += imgdata.data[i+1]
			rgb.b += imgdata.data[i+2]
		
		# ~~ used to floor values
		rgb.r = ~~(rgb.r/count)
		rgb.g = ~~(rgb.g/count)
		rgb.b = ~~(rgb.b/count)
		
		return rgb


	def render
		renderImage()
		<self[pos: relative d:block w: {width}px h: {height}px overflow:visible bg:blue1]>
			canvas
			<MeasuringBox bind=measuringData>
