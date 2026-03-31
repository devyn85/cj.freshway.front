import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
// lib
import { Form } from 'antd';

// Components
import { SearchForm, SelectBox } from '@/components/common/custom/form';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

const SysPilot30Search = (props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();

	const { search } = props;

	// form data 초기화
	const initFormData = {
		name1: '',
		code1: '',
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 * @param changedValues
	 * @param allValues
	 */
	//Form 수정된값 출력
	const onValuesChange = (changedValues: any, allValues: any) => {
		// //console.log(allValues);
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			<SearchForm form={form} initialValues={initFormData} onValuesChange={onValuesChange}>
				<UiFilterArea>
					<UiFilterGroup>
						<li>
							<span>
								<SelectBox
									label="시스템구분"
									form={form}
									name="systemCl"
									placeholder="선택해주세요"
									options={getCommonCodeList('COUNTRY')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									onChange={search}
								/>
							</span>
						</li>
						<li>
							<span>
								{/* START.팝업.창고 */}
								<CmOrganizeSearch
									form={form}
									name="name1"
									code="code1"
									selectionMode="multipleRows"
									returnValueFormat="name"
								/>
								{/* END.팝업.창고 */}
							</span>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>
		</>
	);
};

export default SysPilot30Search;
