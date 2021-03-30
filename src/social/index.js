import React, { useState } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { useSpring, useSprings, animated } from 'react-spring'
import './index.scss'

const Index = () => {
	const [media] = useState([
		<div>twitter</div>,
		<div>youtube</div>,
		<div>discord</div>,
		<div>instagram</div>,
	]);
	const [selectedMediaIndex, setSelectedMediaIndex] = useState(null);
	const [mediaIsOpen, setMediaIsOpen] = useState(false);

	const expandMedia = index => {
		setSelectedMediaIndex(index);
		setMediaIsOpen(true);
	}

	const closeMedia = () => {
		setSelectedMediaIndex(null);
		setMediaIsOpen(false);
	}

	const smallMediaStyles = useSprings(media.length, media.map(item => {
		let result = null;
		if (mediaIsOpen) {
			result = {
				height: '0%',
				position: 'inline-block',
				opacity: 0,
			}
		} else {
			result = {
				height: '80%',
				position: 'inline-block',
				opacity: 1,
			}
		}
		return result;
	}));

	const expandedMediaStyles = useSpring({
		transform: mediaIsOpen ? 'translate3d(0, 0 ,0)' : 'translate3d(0, -500px ,0)',
		height: mediaIsOpen ? '90%' : '0%',
		top: mediaIsOpen ? '5%' : '0%',
	})

	return (
		<div
			id='social-page'
			className='page-container'
		>
			<animated.div
				id='main-media'
				style={expandedMediaStyles}
			>
				<button type='button' onClick={closeMedia}>
					close
				</button>
				{selectedMediaIndex !== null && media[selectedMediaIndex]}
			</animated.div>
			<Grid className='page-grid' fluid style={{ height: '100%', width: '100%' }}>
				<Row className='media-row'>
					{
						smallMediaStyles.slice(0, 2).map((style, index) =>
							<Col
								className='media-col'
								xs
							>
								<animated.div
									className='media-item'
									style={style}
								>
									<button type='button' onClick={() => expandMedia(index)}>
										expand
									</button>
								</animated.div>
							</Col>
						)
					}
				</Row>
				<Row className='media-row'>
					{
						smallMediaStyles.slice(2, 4).map((style, index) =>
							<Col
								className='media-col'
								xs
							>
								<animated.div
									className='media-item'
									style={style}
								>
									<button type='button' onClick={() => expandMedia(index)}>
										expand
									</button>
								</animated.div>
							</Col>
						)
					}
				</Row>
			</Grid>
		</div >
	)
}

export default Index;