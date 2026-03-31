import styled from 'styled-components';

export const QueueSelectorContainer = styled.div<{
	mod?: string;
	selected?: boolean;
	disabled?: boolean;
	len?: number;
}>``;

export default QueueSelectorContainer;
