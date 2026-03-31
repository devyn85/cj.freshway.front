import { Tabs } from 'antd';
import styled from 'styled-components';

export const TmStyledTab = styled(Tabs)`
	.ant-tabs-tab {
		border-radius: 0 !important;
	}
	.ant-tabs-tab-active {
		z-index: 1;
	}
`;
