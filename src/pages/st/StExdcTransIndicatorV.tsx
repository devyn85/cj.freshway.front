/*
 ############################################################################
 # FiledataField	: StExdcTransIndicatorV.tsx
 # Description		: 월별마감실적
 # Author			    :
 # Since			    : 26.03.18
 ############################################################################
*/

import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import { StExdcTransIndicatorVDetail } from '@/components/st/StExdcTransIndicatorV/StExdcTransIndicatorVDetail';

import { StExdcTransIndicatorVSearch } from '@/components/st/StExdcTransIndicatorV/StExdcTransIndicatorVSearch';
import { Form } from 'antd';
import { forwardRef, useRef } from 'react';
import styled from 'styled-components';

export const StExdcTransIndicatorV = forwardRef((props: any, gridRef: any) => {
	const [form] = Form.useForm();
	const refs: any = useRef(null);

	return (
		<>
			<MenuTitle name={'월별마감실적'} />
			<SearchFormResponsiveWrap>
				<SearchFormResponsive form={form}>
					<StExdcTransIndicatorVSearch form={form} />
				</SearchFormResponsive>
			</SearchFormResponsiveWrap>
			<StExdcTransIndicatorVDetail ref={refs} data={[]} totalCnt={0} form={form} />
		</>
	);
});

const SearchFormResponsiveWrap = styled.div`
	form {
		> div {
			margin-bottom: 5px !important;
		}
	}
`;
