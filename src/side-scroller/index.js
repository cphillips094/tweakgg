import React from 'react';
import "./index.scss";

const Index = ({ items, className }) => {
	return (
		<div className={`scrolling-wrapper ${className ? className : ''}`}>
			{
				items &&
				items.map(item =>
					<div className='scrolling-item'>
						{item}
					</div>
				)
			}
		</div>
	)
}

export default Index;