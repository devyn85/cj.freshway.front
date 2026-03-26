/*
 ############################################################################
 # FiledataField	: SysProgramSearch.tsx
 # Description		: ADMIN > 시스템운영 > 프로그램 검색 영역
 # Author			: JangGwangSeok
 # Since			: 25.05.20
 ############################################################################
*/

// CSS

// Component
import { InputText, SelectBox } from '@/components/common/custom/form';

// interface PrintLabelSampleSearchProps {
// 	form?: any;
// 	search?: () => void;
// 	onLabelChange?: (value: string) => void;
// }

const PrintLabelSampleSearch = (props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	//const { t } = useTranslation();

	const labelList = props.labelList || [];
	const previewList = [
		{ label: 'Y', value: 'Y' },
		{ label: 'N', value: 'N' },
	];


	return (
		<>
			<li>
				<SelectBox
					name={"labelCode"}
					label={"라벨종류"}
					options={labelList}
					// options={labelList.map((item: any) => ({
					// 	...item,
					// 	label: `${item.label} - ${item.fileName}`,
					// }))}
					style={{ minWidth: 300 }}
				//initval="CJFWWD20"
				//onChange={handleChange}
				/>
			</li>

			<li style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
				<SelectBox
					name="previewYn"
					label="미리보기 여부"
					options={previewList}
					style={{ minWidth: 150 }}
				//initval="Y"
				/>
				<InputText
					name="printCnt"
					label="인쇄매수"
					style={{ minWidth: 150 }}
				//defaultValue={0}
				/>
			</li>
			<InputText
				name="fileName"
				readOnly
				style={{ display: 'none' }}
			/>

		</>
	);
};

export default PrintLabelSampleSearch;
