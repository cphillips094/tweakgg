import React from 'react';
import Slider from '../side-scroller';

const TwitchClips = ({ loading, error, clips }) => {
	return (
		<>
			{
				!loading &&
				(
					(
						!error &&
						<>
							<h2 style={{ marginBottom: '10px' }}>
								TOP CLIPS
							</h2>
							<Slider
								items={clips}
								className='filter-shadow'
							/>
						</>
					) ||
					''
				)
			}
		</>
	)
}

export default TwitchClips;