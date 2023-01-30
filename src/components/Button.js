import React from 'react';
import './Button.css';
import { Link } from 'react-router-dom';

const STYLES = ['btn--primary', 'btn--outline', 'btn--test' , 'btn--2','btn--5'];
const SIZES = ['btn--medium', 'btn--large'];

export const Button = ({
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize,
  path
}) => {
  const checkButtonStyle = STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];

  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

	if(buttonStyle=="btn--5"){
		return (
			<Link to={path} className='btn-mobile5'>
				<button
					className={`btn ${checkButtonStyle} ${checkButtonSize}`}
					onClick={onClick}
					type={type}
					>
					{children}
				</button>
			</Link>
		);
	}else{

		return (
			<Link to={path} className='btn-mobile'>
				<button
					className={`btn ${checkButtonStyle} ${checkButtonSize}`}
					onClick={onClick}
					type={type}
					>
					{children}
				</button>
			</Link>
		);
	}
};