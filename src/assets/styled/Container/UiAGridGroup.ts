import styled from 'styled-components';

const UiAGridGroup = styled.div`
	height: 100%;
	display: flex;
	> div {
		height: 100%;
		width: 100%;
		> div {
			margin-bottom: 0 !important;
			align-items: flex-start !important;
		}
	}
`;

export default UiAGridGroup;
