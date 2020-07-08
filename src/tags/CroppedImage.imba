let canvas = <canvas[d: block]>

export tag CroppedImage
	def mount
		const crop = data.crop
		const image = data.image
		[width, height] = data.getSize(crop.width * image.width, image.height * crop.height)

		canvas.width = width
		canvas.height = height
		canvas.imageSmoothingQuality = 'high'
		canvas.getContext('2d').drawImage(image, crop.left * image.width, crop.top * image.height, crop.width * image.width, crop.height * image.height, 0, 0, width, height)

	def render
		<self>
			canvas
