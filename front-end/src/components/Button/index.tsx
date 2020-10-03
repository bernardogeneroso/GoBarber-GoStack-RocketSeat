import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';
import { PulseLoader } from 'react-spinners';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, loading, ...rest }) => (
	<Container type="button" {...rest}>
		{loading ? <PulseLoader color="#302E38" /> : children}
	</Container>
);

export default Button;
