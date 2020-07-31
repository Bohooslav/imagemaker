export class ImageState
	uploaded_image = new Image
	image = new Image

	stage = 0
	crop = {
		left: 0
		top: 0
		width: 0
		height: 0
	}

	def drawImage src
		uploaded_image.src = src
		setTimeout(&, 1) do
			stage = 1
			imba.commit()

	def back
		if stage
			stage--

	# # Returns size optimized for 800x600 frame
	# # The frame may has another dimensions
	# TODO! optimaze for different devices
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
