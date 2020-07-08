import {Add} from './tags/Add'
import {Logo} from './tags/Logo'
import {ChooseImage} from './tags/ChooseImage'
import {CroppedImage} from './tags/CroppedImage'
import {CropImage} from './tags/CropImage'
import {ImageState} from './ImageState'
let counter = 0

css @root, body
	1radius: 5px

css *
	box-sizing: border-box
	scrollbar-color: rgba(68, 119, 255, 0.1) rgba(0, 0, 0, 0)
	scrollbar-width: auto
	m: 0
	p: 0
	scroll-behavior: smooth
	-webkit-overflow-scrolling: touch
	-webkit-tap-highlight-color: transparent


tag app-root
	imgstate = new ImageState

	def render
		<self>
			<Add[mt: 12px pos: absolute l: 8px] @click=imgstate.back()> "Back"
			<Logo>
			unless imgstate.stage
				<ChooseImage bind=imgstate>
			elif imgstate.stage == 1
				<CropImage bind=imgstate>
			else
				<CroppedImage bind=imgstate>

	css &
		d: flex
		fld: column
		ai:center
		ta:center
		bg:gray9
		min-height: 100vh
		br: 2space
		pb: 64px