import {Add} from './Add'
import {MeasuringBox} from './MeasuringBox'

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
let measuringData = {}

export tag CropImage
	prop width
	prop height

	def mount
		[width, height] = data.getSize(data.uploaded_image.width, data.uploaded_image.height)
		crop.width = width
		crop.height = height
		crop.left = 0
		crop.top = 0
		measuringData =
			crop: crop
			width: width
			height: height

		canvas.width = width
		canvas.height = height
		canvas.imageSmoothingQuality = 'high'
		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
		canvas.getContext('2d').drawImage(data.uploaded_image, 0, 0, width, height)
		imba.commit()

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

			# In this box are all needed things for resizing the image
			<MeasuringBox bind=measuringData>

			<Add[pos: absolute t: {height + 8}px w: {width}px l: 0] @click=cropImg> "Next"

	css .dragger
		pos: absolute
		size: 16px
		bg: rgba(192, 192, 192, 0.5)
		zi: 3