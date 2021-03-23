import React from 'react';

const TwitchTitle = ({ loading, error, title }) => {
	return (
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
	)
}

export default TwitchTitle;