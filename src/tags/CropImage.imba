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
		[width, height] = data.getSize(data.image.width, data.image.height)

		crop.width = width
		crop.height = height
		crop.left = 0
		crop.top = 0
		backUpCrop()

		canvas.width = width
		canvas.height = height
		canvas.imageSmoothingQuality = 'high'
		canvas.getContext('2d').drawImage(data.image, 0, 0, width, height)
		imba.commit()

	def backUpCrop
		bcrop = JSON.parse(JSON.stringify(crop))

	# Functions that calculate new value concrete side
	def moveN e
		const new_height = bcrop.height - e.dy
		if e.dy < 0 && (bcrop.height - e.dy > height || bcrop.top + e.dy < 0)
			crop.top = 0
			crop.height = bcrop.height + bcrop.top
		elif height >= new_height >= 64
			crop.height = new_height
			crop.top = bcrop.top + e.dy

	def moveW e
		const new_width = bcrop.width - e.dx
		if e.dx < 0 && (bcrop.width - e.dx > width || bcrop.left + e.dx < 0)
			crop.left = 0
			crop.width = bcrop.width + bcrop.left
		elif width >= new_width >= 64
			crop.width = new_width
			crop.left = bcrop.left + e.dx

	def moveS e
		const new_height = bcrop.height + e.dy
		if e.dy > 0 && bcrop.top + bcrop.height + e.dy > height
			crop.height = height - bcrop.top
		elif height >= new_height >= 64
			crop.height = new_height

	def moveE e
		const new_width = bcrop.width + e.dx
		if e.dx > 0 && bcrop.left + bcrop.width + e.dx > width
			crop.width = width - bcrop.left
		elif width >= new_width >= 64
			crop.width = new_width

	# # Functions that trigger concrete functions to change concrete sides
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
		crop.width = crop.width / width
		crop.height = crop.height / height
		crop.left = crop.left / width
		crop.top = crop.top / height

		data.crop = crop
		data.stage += 1


	def render
		<self[pos: relative d:block overflow:visible bg:blue1]>
			canvas
			<div[pos: absolute d: block l: 0 t: 0 w: {width}px h: {height}px bg: rgba(0, 0, 0, 0.5) clip-path: polygon(0% 0%, 0% 100%, {crop.left}px {crop.top + crop.height}px, {crop.left}px {crop.top}px, {crop.left + crop.width}px {crop.top}px, {crop.left + crop.width}px {crop.top + crop.height}px, {crop.left}px {crop.top + crop.height}px, 0% 100%, 100% 100%, 100% 0%);]>
			<div[pos: absolute d: block l: 0 t: 0 w: {width}px h: {height}px]>
				<div[t: {crop.top - 8}px l: {crop.left + (crop.width)/2 - 8}px cursor: ns-resize].dragger @touch=dragN>
				<div[t: {crop.top + (crop.height)/2 - 8}px l: {crop.left + crop.width - 8}px cursor: ew-resize].dragger @touch=dragE>
				<div[t: {crop.top + crop.height - 8}px l: {crop.left + (crop.width)/2 - 8}px cursor: ns-resize].dragger @touch=dragS>
				<div[t: {crop.top + (crop.height)/2 - 8}px l: {crop.left - 8}px cursor: ew-resize].dragger @touch=dragW>

				<div[t: {crop.top - 8}px l: {crop.left - 8}px cursor: nwse-resize].dragger @touch=dragNW>
				<div[t: {crop.top - 8}px l: {crop.left + crop.width - 8}px cursor: nesw-resize].dragger @touch=dragNE>
				<div[t: {crop.top + crop.height - 8}px l: {crop.left + crop.width - 8}px cursor: nwse-resize].dragger @touch=dragSE>
				<div[t: {crop.top + crop.height - 8}px l: {crop.left - 8}px cursor: nesw-resize].dragger @touch=dragSW>

				<[pos: absolute t: {crop.top}px l: {crop.left}px w: {crop.width}px h: {crop.height}px cursor: move] @touch=dragCropArea>
				<Add[pos: absolute t: {height + 8}px w: {width}px l: 0] @click=cropImg> "Next"

	css .dragger
		pos: absolute
		size: 16px
		bg: rgba(192, 192, 192, 0.5)
		zi: 3