/*
 ############################################################################
 # FiledataField	: MsZoneListSelectBox.tsx
 # Description		: 기준정보 > 센터기준정보 > 존정보
 # Author			: JeongHyeongCheol
 # Since			: 25.05.27
 ############################################################################
*/
// component
import { SelectBox } from '@/components/common/custom/form';

// CSS

// store

// API Call Function
import { apiGetMasterList } from '@/api/ms/apiMsZoneManager';

// lib
import _ from 'lodash';

interface MsZoneListSelectBoxProps {
	dccode?: string[];
	gridChange: boolean;
	setGridChange?: any;
	form?: any;
}

const MsZoneListSelectBox = (props: MsZoneListSelectBoxProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, dccode, gridChange, setGridChange } = props;
	const { t } = useTranslation();
	const [zoneList, setZoneList] = useState([]);
	const [totalZoneList, setTotalZoneList] = useState([]);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		if (gridChange) {
			const fetchInitialTotalZoneList = async () => {
				const res = await apiGetMasterList({ dccode: '' });
				setTotalZoneList(res.data);
			};
			fetchInitialTotalZoneList();
			setGridChange(false);
		}
	}, [gridChange]);

	// dccode가 변경될 때 zoneList를 계산
	useEffect(() => {
		if (totalZoneList.length === 0) {
			return;
		}
		const dccode = form.getFieldValue('dccode');

		const allItem = {
			comGrpCd: 'zone',
			cdNm: t('lbl.ALL'),
			comCd: 'all',
		};

		let editList;
		if (Array.isArray(dccode) && dccode.length === 0) {
			editList = totalZoneList;
		} else {
			editList = totalZoneList.filter((item: any) => dccode?.includes(item.dccode));
		}

		const resultList = editList.map((item: any) => ({
			comGrpCd: 'zone',
			cdNm: `[${item.zone}]`,
			comCd: item.zone,
		}));
		const finalZoneList = [
			allItem,
			...resultList, // 나머지 기존 리스트 요소
		];

		setZoneList(_.uniqBy(finalZoneList, 'comCd'));
	}, [dccode, totalZoneList]); // dccode 변경 시 재실행

	return (
		<SelectBox
			name="zone"
			span={24}
			placeholder="선택해주세요"
			options={zoneList}
			fieldNames={{ label: 'cdNm', value: 'comCd' }}
			mode="multiple"
			label={'피킹존'}
		/>
	);
};

export default MsZoneListSelectBox;
