###
This tag is a box with resizers and gragggers
to measure borders for resizing image or text &c
###

let crop =
	left: 0
	top: 0
	width: 0
	height: 0

# Save state of crop before dragging
# to calculate result of dragging suming up touch difference and previous state
let bcrop =
	left: 0
	top: 0
	width: 0
	height: 0

export tag MeasuringBox
	prop width
	prop height
	prop text_resizing = no

	def mount
		crop = data.crop
		width = data.width
		height = data.height
		text_resizing = data.text_resizing || data.text_resizing
		backUpCrop()

	def backUpCrop
		bcrop = JSON.parse(JSON.stringify(crop))

	# Functions that calculate new value concrete side
	def moveN e
		const new_height = bcrop.height - e.dy
		if e.dy < 0 && (new_height > height || bcrop.top + e.dy < 0) && crop.width * 2 >= bcrop.height + bcrop.top
			crop.top = 0
			crop.height = bcrop.height + bcrop.top
		elif new_height >= crop.width * 2
			crop.height = crop.width * 2
			crop.top = (bcrop.height - crop.height) + bcrop.top
		elif height >= new_height >= crop.width / 2 && new_height >= 64
			crop.height = new_height
			crop.top = bcrop.top + e.dy
		else
			crop.height = crop.width / 2 > 64 ? crop.width / 2 : 64
			crop.top = bcrop.top + (bcrop.height - crop.height)

	def moveW e
		const new_width = bcrop.width - e.dx
		# This function is used for text editing where is another restrictions
		unless text_resizing
			if e.dx < 0 && (bcrop.width - e.dx > width || bcrop.left + e.dx < 0) && crop.height * 2 >= bcrop.width + bcrop.left
				crop.left = 0
				crop.width = bcrop.width + bcrop.left
			elif new_width >= crop.height * 2
				crop.width = crop.height * 2
				crop.left = (bcrop.width - crop.width) + bcrop.left
			elif width >= new_width >= crop.height / 2 && new_width >= 64
				crop.width = new_width
				crop.left = bcrop.left + e.dx
			else
				crop.width = crop.height / 2 > 64 ? crop.height / 2 : 64
				crop.left = bcrop.left + (bcrop.width - crop.width)
		else
			if data.calculateNewHeight(new_width) > height && new_width < crop.width
				return
			if e.dx < 0 && (bcrop.width - e.dx > width || bcrop.left + e.dx < 0)
				crop.left = 0
				crop.width = bcrop.width + bcrop.left
			elif width >= new_width >= data.minimum_text_width
				crop.width = new_width
				crop.left = bcrop.left + e.dx
			else
				crop.width = data.minimum_text_width
				crop.left = bcrop.left + (bcrop.width - crop.width)

	def moveS e
		const new_height = bcrop.height + e.dy
		if e.dy > 0 && bcrop.top + bcrop.height + e.dy > height && crop.width * 2 >= height - bcrop.top
			crop.height = height - bcrop.top
		elif new_height >= crop.width * 2
			crop.height = crop.width * 2
		elif height >= new_height >= crop.width / 2 && new_height >= 64
			crop.height = new_height
		else
			crop.height = crop.width / 2 > 64 ? crop.width / 2 : 64

	def moveE e
		const new_width = bcrop.width + e.dx
		unless text_resizing
			if e.dx > 0 && bcrop.left + bcrop.width + e.dx > width && crop.height * 2 >= width - bcrop.left
				crop.width = width - bcrop.left
			elif new_width >= crop.height * 2
				crop.width = crop.height * 2
			elif width >= new_width >= crop.height / 2 && new_width >= 64
				crop.width = new_width
			else
				crop.width = crop.height / 2 > 64 ? crop.height / 2 : 64
		else
			if data.calculateNewHeight(new_width) > height && new_width < crop.width
				return
			if e.dx > 0 && bcrop.left + bcrop.width + e.dx > width
				crop.width = width - bcrop.left
			elif width >= new_width >= data.minimum_text_width
				crop.width = new_width
			else
				crop.width = data.minimum_text_width

	# # # # # Functions that trigger concrete functions to change concrete sides
	# Fonctions for sides changes
	def dragN e
		if e.type.slice(-4) == 'down'
			backUpCrop()
		if e.type.slice(-4) == 'move'
			moveN(e)

	def dragW e
		if e.type.slice(-4) == 'down'
			backUpCrop()
		if e.type.slice(-4) == 'move'
			moveW(e)

	def dragS e
		if e.type.slice(-4) == 'down'
			backUpCrop()
		if e.type.slice(-4) == 'move'
			moveS(e)

	def dragE e
		if e.type.slice(-4) == 'down'
			backUpCrop()
		if e.type.slice(-4) == 'move'
			moveE(e)

	# Functions for corner changes
	def dragNW e
		if e.type.slice(-4) == 'down'
			backUpCrop()
		if e.type.slice(-4) == 'move'
			moveN(e)
			moveW(e)

	def dragNE e
		if e.type.slice(-4) == 'down'
			backUpCrop()
		if e.type.slice(-4) == 'move'
			moveN(e)
			moveE(e)

	def dragSE e
		if e.type.slice(-4) == 'down'
			backUpCrop()
		if e.type.slice(-4) == 'move'
			moveS(e)
			moveE(e)

	def dragSW e
		if e.type.slice(-4) == 'down'
			backUpCrop()
		if e.type.slice(-4) == 'move'
			moveS(e)
			moveW(e)


	def dragCropArea e
		if e.target.className.indexOf('dragger') > 0
		if e.type.slice(-4) == 'down'
			backUpCrop()
		if e.type.slice(-4) == 'move'
			unless bcrop.top + e.dy + crop.height > height or bcrop.top + e.dy < 0
				crop.top = bcrop.top + e.dy
			else
				if bcrop.top + e.dy + crop.height > height
					crop.top = height - bcrop.height
				elif height or bcrop.top + e.dy < 0
					crop.top = 0

			unless bcrop.left + e.dx + crop.width > width or bcrop.left + e.dx < 0
				crop.left = bcrop.left + e.dx
			else
				if bcrop.left + e.dx + crop.width > width
					crop.left = width - bcrop.width
				elif width or bcrop.left + e.dx < 0
					crop.left = 0

	def render
		<self[pos: absolute t:0 l:0 d:block overflow:visible bg:blue1 o: {text_resizing ? 0 : 1} @hover: 1]>
			# Block that shows the "gray area" around cropped area
			<div[pos: absolute d: block l: 0 t: 0 w: {width}px h: {height}px bg: rgba(0, 0, 0, 0.5) clip-path: polygon(0% 0%, 0% 100%, {crop.left}px {crop.top + crop.height}px, {crop.left}px {crop.top}px, {crop.left + crop.width}px {crop.top}px, {crop.left + crop.width}px {crop.top + crop.height}px, {crop.left}px {crop.top + crop.height}px, 0% 100%, 100% 100%, 100% 0%);]>

			# Here is draggers for resizing image
			<div[pos: absolute d: block l: 0 t: 0 w: {width}px h: {height}px]>
				unless text_resizing
					# Side resizers
					<div[t: {crop.top - 8}px l: {crop.left + (crop.width)/2 - 8}px cursor: ns-resize].dragger @touch=dragN>
					<div[t: {crop.top + (crop.height)/2 - 8}px l: {crop.left + crop.width - 8}px cursor: ew-resize].dragger @touch=dragE>
					<div[t: {crop.top + crop.height - 8}px l: {crop.left + (crop.width)/2 - 8}px cursor: ns-resize].dragger @touch=dragS>
					<div[t: {crop.top + (crop.height)/2 - 8}px l: {crop.left - 8}px cursor: ew-resize].dragger @touch=dragW>

					# Corner resizers
					<div[t: {crop.top - 8}px l: {crop.left - 8}px cursor: nwse-resize].dragger @touch=dragNW>
					<div[t: {crop.top - 8}px l: {crop.left + crop.width - 8}px cursor: nesw-resize].dragger @touch=dragNE>
					<div[t: {crop.top + crop.height - 8}px l: {crop.left + crop.width - 8}px cursor: nwse-resize].dragger @touch=dragSE>
					<div[t: {crop.top + crop.height - 8}px l: {crop.left - 8}px cursor: nesw-resize].dragger @touch=dragSW>
				else
					<div[h: {crop.height}px t: {crop.top}px l: {crop.left + crop.width - 8}px cursor: ew-resize].dragger @touch=dragE>
					<div[h: {crop.height}px t: {crop.top}px l: {crop.left - 8}px cursor: ew-resize].dragger @touch=dragW>
					

				# Square for dragging the crop area
				<[pos: absolute t: {crop.top}px l: {crop.left}px w: {crop.width}px h: {crop.height}px cursor: move] @touch=dragCropArea>

	css
		transition: all 300ms ease 0s

	css .dragger
		pos: absolute
		size: 16px
		bg: rgba(192, 192, 192, 0.5)
		zi: 3