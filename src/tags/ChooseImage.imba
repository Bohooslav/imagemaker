export tag ChooseImage
	css
		w: 320px
		h: 320px

	def readFile file
		if !file or file.type.slice(0,5) != 'image'
			window.alert("Please choose image")
			return
		let reader = new FileReader()
		reader.onload = do(e) data.drawImage(e.target.result)
		reader.readAsDataURL(file)

	def onDropFile e
		e.stopPropagation()
		if window.File && window.FileReader && window.FileList && window.Blob
			var files = e.dataTransfer.files
			readFile(files[0])
		else
			window.alert('The File APIs are not fully supported in this browser.')

	def openFile
		readFile = do(e)
			let file = e.target.files[0]
			if !file or file.type.slice(0,5) != 'image'
				window.alert("Please choose image")
				return
			let reader = new FileReader()
			reader.onload = do(e)
				data.drawImage(e.target.result)
				document.body.removeChild(fileInput)
			reader.readAsDataURL(file)
		fileInput = document.createElement("input")
		fileInput.type='file'
		fileInput.accept="image/*"
		fileInput.style.display='none'
		fileInput.onchange=readFile
		document.body.appendChild(fileInput)
		clickElem(fileInput)

	def clickElem elem
		var eventMouse = document.createEvent("MouseEvents")
		eventMouse.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
		elem.dispatchEvent(eventMouse)

	def dragOver evt
		evt.stopPropagation()
		evt.dataTransfer.dropEffect = 'copy'


	def render
		<self>
			<button @click.prevent.openFile @dragover.prevent.dragOver @drop.prevent.onDropFile>
				<p> "Choose an image"
				<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
					<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z">
	css button
		1depth: 5px @hover: 6px @active: 3px
		--text: gray2 @hover: gray1
		--color: purple7 @hover: purple6 @active: purple7
		--shade: purple9 @hover: purple8 @active: purple9
		bg: var(--color)
		d: flex
		fd: collumn
		jc: center
		ai: center
		shadow: 0px 1depth var(--shade)
		color: var(--text)
		transition: all .08s
		transform: translateY(-1depth)

		radius:2 py:1 px:2
		w:100%
		h:100%
		font-size: 2xl