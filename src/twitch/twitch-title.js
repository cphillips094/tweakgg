import React from 'react';

const TwitchTitle = ({ loading, error, title }) => {
	return (
		<div
			id='stream-title-container'
			className='colorful-border big-border shadow rounded'
		>
			<div className='bg-gradient'>
				<h1>
					{
						(
							loading &&
							'Loading Stream...'
						) ||
						(
							(
								error &&
								''
							) ||
							title
						)
					}
				</h1>
			</div>
		</div>
	)
}

export default TwitchTitle;