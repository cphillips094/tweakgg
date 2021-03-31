import React from 'react';
import Logo from './assets/images/full-logo.png';

const BobbingLogo = () => {
	return (
		<a
			href='https://www.twitch.tv/tweak'
			target='_blank'
			rel='noreferrer'
		>
			<img
				className='tweak-logo filter-shadow'
				src={Logo}
				alt='Tweak Logo'
			/>
		</a>
	);
}

export default BobbingLogo;