export class MmeasuringTextState
	canvas = <canvas[d: block]>
	text = ''
	crop = {}
	font = {}
	width = 0
	height = 0
	text_resizing = yes
	minimum_text_width = 0

	def calculateTextLines context, maxWidth, lineHeight
		minimum_text_width = 0
		let words = text.split(' ')
		let line = ''
		let lines = []

		# Generates an array of wrapped line and
		# calculates the height of future text to center it later
		for n in [0...words.length]
			# The next 3 lines calculates minimum possible width of the text box
			let minimum_text_width_metrics = context.measureText(words[n])
			if minimum_text_width_metrics.width > minimum_text_width
				minimum_text_width = minimum_text_width_metrics.width

			let testLine = line + words[n] + ' '
			let metrics = context.measureText(testLine)
			let testWidth = metrics.width
			if (testWidth > maxWidth && n > 0)
				lines.push(line)
				line = words[n] + ' '
			else 
				line = testLine
		lines.push(line)

		if minimum_text_width > canvas.width
			minimum_text_width = canvas.width

		return lines


	def calculateNewHeight new_width, size = font.size
		let ctx = canvas.getContext('2d')
		ctx.save()

		ctx.font = size + 'px ' + font.family
		ctx.textAlign = font.align
		const lines = calculateTextLines(ctx, new_width, font.line-height * size)

		ctx.restore()
		return lines.length * (font.line-height * size)


	def calculateMaximumFontSize
		font.maxsize = 2048
		let new_height = calculateNewHeight(canvas.width, font.maxsize)
		console.log canvas.width * canvas.height, text.length * font.line-height * font.size * font.size
		# font.size = (canvas.width * canvas.height) / (text.length * font.line-height)
		# font.size = (canvas.width * canvas.height) / (text.length * font.line-height * font.line-height )
		font.size = Math.sqrt((canvas.width * canvas.height) / (text.length * font.line-height))

		let iterations = 0
		while new_height >= canvas.height
			console.log font.maxsize, canvas.height, new_height, ((canvas.height) / new_height)
			font.maxsize = font.maxsize * (((canvas.height) / new_height)) * 2
			new_height = calculateNewHeight(canvas.width, font.maxsize)

			iterations++

			if font.maxsize > 10000
				break

	
		console.log iterations, font.size, font.maxsize
		# if font.size > font.maxsize
		# 	font.size = font.maxsize
		if font.size > font.maxsize
			font.maxsize = font.size