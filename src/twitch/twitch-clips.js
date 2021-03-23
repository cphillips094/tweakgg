import React from 'react';
import pageData from '../configuration/twitch-page.json';
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
								{pageData.clipsTitle || 'Clips'}
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