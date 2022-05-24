// https://github.com/catdad/canvas-confetti
// https://github.com/catdad/canvas-confetti/blob/master/LICENSE

import Confetti from 'canvas-confetti'

export default () => {
	const confettiCanvas = document.createElement('canvas')
	confettiCanvas.id = 'confetti-canvas'
	document.body.appendChild(confettiCanvas)

	const confetti = Confetti.create(confettiCanvas, {
		resize: true,
		useWorker: true
	})

	const showConfetti = () => {
		confettiCanvas.style.display = 'block'

		setTimeout(() => {
			confetti({
				particleCount: 200,
				spread: 160,
				origin: { y: 0.7 }
			})
		}, 200)

		setTimeout(() => {
			confettiCanvas.style.display = 'none'
		}, 4000)
	}

	return {
		showConfetti
	}
}
