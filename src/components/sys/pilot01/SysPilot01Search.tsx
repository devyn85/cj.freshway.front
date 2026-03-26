import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import CmCarAreaSearch from '@/components/cm/popup/CmCarAreaSearch';
import CmDcSearch from '@/components/cm/popup/CmDcSearch';

// Components
import { SelectBox } from '@/components/common/custom/form';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

const SysPilot01Search = (props: any) => {
	const { form, search } = props;

	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	//Form 수정된값 출력

	return (
		<>
			<div className="grid-column-2"></div>
			<UiFilterArea>
				<UiFilterGroup>
					<li>
						<SelectBox
							name="systemCl"
							label="시스템구분"
							placeholder="선택해주세요"
							options={getCommonCodeList('COUNTRY')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							onChange={search}
						/>
					</li>
					<li>
						<CmCarAreaSearch form={form} name="carno" code="name" selectionMode="multipleRows" />
					</li>
					<li>
						<CmDcSearch form={form} name="dccode" code="code" selectionMode="multipleRows" />
					</li>
				</UiFilterGroup>
			</UiFilterArea>
		</>
	);
};

export default SysPilot01Search;
