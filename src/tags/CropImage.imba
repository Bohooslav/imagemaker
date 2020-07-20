import {Add} from './Add'

# Here we save crop information
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

let canvas = <canvas[d: block]>

export tag CropImage
	prop width
	prop height

	def mount
		[width, height] = data.getSize(data.uploaded_image.width, data.uploaded_image.height)

		crop.width = width
		crop.height = height
		crop.left = 0
		crop.top = 0
		backUpCrop()

		canvas.width = width
		canvas.height = height
		canvas.imageSmoothingQuality = 'high'
		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
		canvas.getContext('2d').drawImage(data.uploaded_image, 0, 0, width, height)
		imba.commit()

	def backUpCrop
		bcrop = JSON.parse(JSON.stringify(crop))

	# Functions that calculate new value concrete side
	def moveN e
		const new_height = bcrop.height - e.dy
		if e.dy < 0 && (new_height > height || bcrop.top + e.dy < 0) && crop.width * 2 >= new_height
			crop.top = 0
			crop.height = bcrop.height + bcrop.top
		elif new_height >= crop.width * 2
			crop.height = crop.width * 2
			crop.top = (bcrop.height - crop.height) + bcrop.top
		elif height >= new_height >= crop.width / 2 && height >= 64
			crop.height = new_height
			crop.top = bcrop.top + e.dy
		else
			crop.height = crop.width / 2 > 64 ? crop.width / 2 : 64
			crop.top = bcrop.top + (bcrop.height - crop.height)

	def moveW e
		const new_width = bcrop.width - e.dx
		if e.dx < 0 && (bcrop.width - e.dx > width || bcrop.left + e.dx < 0) && crop.height * 2 >= new_width
			crop.left = 0
			crop.width = bcrop.width + bcrop.left
		elif new_width >= crop.height * 2
			crop.width = crop.height * 2
			crop.left = (bcrop.width - crop.width) + bcrop.left
		elif width >= new_width >= crop.height / 2 && height >= 64
			crop.width = new_width
			crop.left = bcrop.left + e.dx
		else
			crop.width = crop.height / 2 > 64 ? crop.height / 2 : 64
			crop.left = bcrop.left + (bcrop.width - crop.width)


	def moveS e
		const new_height = bcrop.height + e.dy
		if e.dy > 0 && bcrop.top + bcrop.height + e.dy > height && crop.width * 2 >= new_height
			crop.height = height - bcrop.top
		elif new_height >= crop.width * 2
			crop.height = crop.width * 2
		elif height >= new_height >= crop.width / 2 && height >= 64
			crop.height = new_height
		else
			crop.height = crop.width / 2 > 64 ? crop.width / 2 : 64

	def moveE e
		const new_width = bcrop.width + e.dx
		if e.dx > 0 && bcrop.left + bcrop.width + e.dx > width && crop.height * 2 >= new_width
			crop.width = width - bcrop.left
		elif new_width >= crop.height * 2
			crop.width = crop.height * 2
		elif width >= new_width >= crop.height / 2 && height >= 64
			crop.width = new_width
		else
			crop.width = crop.height / 2 > 64 ? crop.height / 2 : 64

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
	
	def cropImg
		# In this view I get crop mesures on resized image,
		# in the next stage will be "real" cropping,
		# which will be on full image,
		# so for that I convert the mesures to percentages
		crop.width = crop.width / width
		crop.height = crop.height / height
		crop.left = crop.left / width
		crop.top = crop.top / height

		data.crop = crop

		# # Get new optimized width, height and height for new canvas
		[width, height] = data.getSize(crop.width * data.uploaded_image.width, data.uploaded_image.height * crop.height)
		canvas.width = width
		canvas.height = height

		# Paint the cropped image on canvas and get toDataURL image
		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
		canvas.getContext('2d').drawImage(data.uploaded_image, crop.left * data.uploaded_image.width, crop.top * data.uploaded_image.height, crop.width * data.uploaded_image.width, crop.height * data.uploaded_image.height, 0, 0, width, height)

		data.image.src = canvas.toDataURL()
		# Now applied changes, grap picture and in the next tick go to the next stage
		await imba.commit().then do
			data.stage += 1
			imba.commit()

	def render
		<self[pos: relative d:block overflow:visible bg:blue1]>
			# Canvas with image
			canvas

			# Block that shows the "gray area" around cropped area
			<div[pos: absolute d: block l: 0 t: 0 w: {width}px h: {height}px bg: rgba(0, 0, 0, 0.5) clip-path: polygon(0% 0%, 0% 100%, {crop.left}px {crop.top + crop.height}px, {crop.left}px {crop.top}px, {crop.left + crop.width}px {crop.top}px, {crop.left + crop.width}px {crop.top + crop.height}px, {crop.left}px {crop.top + crop.height}px, 0% 100%, 100% 100%, 100% 0%);]>

			# Here is draggers for resizing image
			<div[pos: absolute d: block l: 0 t: 0 w: {width}px h: {height}px]>
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

				# Square for dragging the crop area
				<[pos: absolute t: {crop.top}px l: {crop.left}px w: {crop.width}px h: {crop.height}px cursor: move] @touch=dragCropArea>
			<Add[pos: absolute t: {height + 8}px w: {width}px l: 0] @click=cropImg> "Next"

	css .dragger
		pos: absolute
		size: 16px
		bg: rgba(192, 192, 192, 0.5)
		zi: 3