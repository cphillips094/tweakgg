import { render } from 'react-dom'
import React, { useRef } from 'react'
import clamp from 'lodash-es/clamp'
import { useSprings, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import Index from './twitch/index'
import './view-pager.scss'
import './index.scss'

const pages = [
	<Index />,
	<React.Fragment></React.Fragment>,
	<React.Fragment></React.Fragment>,
	<React.Fragment></React.Fragment>,
]

function Viewpager() {
	const index = useRef(0)
	const [props, set] = useSprings(pages.length, (i) => ({
		x: i * window.innerWidth,
		scale: 1,
		display: 'block'
	}))
	const bind = useDrag(({ active, movement: [mx], direction: [xDir], distance, cancel }) => {
		if (active && distance > window.innerWidth / 2)
			cancel((index.current = clamp(index.current + (xDir > 0 ? -1 : 1), 0, pages.length - 1)))
		set((i) => {
			if (i < index.current - 1 || i > index.current + 1) {
				return { display: 'none' }
			}
			const x = (i - index.current) * window.innerWidth + (active ? mx : 0)
			const scale = active ? 1 - distance / window.innerWidth / 2 : 1
			return { x, scale, display: 'block' }
		})
	})
	return props.map(({ x, display, scale }, i) => (
		<animated.div {...bind()} key={i} style={{ display, x }}>
			<animated.div style={{ scale }}>
				{pages[i]}
			</animated.div>
		</animated.div>
	))
}

render(<Viewpager />, document.getElementById('root'));