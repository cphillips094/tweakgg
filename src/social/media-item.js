import React from 'react';
import { Col } from 'react-flexbox-grid';
import { animated } from 'react-spring';


const MediaItem = ({ mediaData, onExpand, style }) => {
	return (
		<Col
			className='media-col'
			xs
		>
			<animated.div
				className='media-item colorful-border big-border shadow rounded'
				style={style}
			>
				<div className='bg-gradient rounded'>
					<h1 className='media-title' onClick={onExpand}>
						{mediaData.title.toUpperCase()}
					</h1>
					{mediaData.collapsed}
				</div>
			</animated.div>
		</Col>
	);
}

export default MediaItem;