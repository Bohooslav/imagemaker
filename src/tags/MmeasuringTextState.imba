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

		return lines


	def calculateNewHeight new_width
		let ctx = canvas.getContext('2d')
		ctx.font = font.size + 'px ' + font.family
		ctx.textAlign = font.align
		ctx.fillStyle = font.color
		const lines = calculateTextLines(ctx, new_width, font.line-height * font.size)
		return lines.length * (font.line-height * font.size)