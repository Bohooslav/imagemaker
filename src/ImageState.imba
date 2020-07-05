export class ImageState
	image = new Image

	stage = 0
	crop = {
		left: 0
		top: 0
		width: 0
		height: 0
	}

	# def constructor
	# 	console.log("initialize")

	# def setup
	# 	self

	def drawImage src
		image.src = src
		setTimeout(&, 1) do
			stage = 1
			imba.commit()

	def back
		if stage
			stage--

	def getSize width, height
		let MAX_WIDTH = 800
		let MAX_HEIGHT = 600

		if width > height
			height *= MAX_WIDTH / width
			width = MAX_WIDTH
		else
			width *= MAX_HEIGHT / height
			height = MAX_HEIGHT

		return [width, height]
