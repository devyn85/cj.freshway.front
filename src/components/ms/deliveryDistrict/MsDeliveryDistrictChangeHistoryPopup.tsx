/*
############################################################################
# Component: MsDeliveryDistrictChangeHistoryPopup (배송 권역 변경이력 모달)
############################################################################
*/

import { apiPostDeliveryDistrictHistoryList } from '@/api/ms/apiMsDeliveryDistrict';
import AGrid from '@/assets/styled/AGrid/AGrid';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SearchFormResponsive } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// 배차옵션 모달 Props 타입 정의
export type TmClaimModalProps = {
	pForm?: any; // 선택한 row
};

const MsDeliveryDistrictChangeHistoryPopup = ({ pForm }: TmClaimModalProps) => {
	const initDccode = useSelector((state: any) => state.global.globalVariable.gDccode) || null;
	const [form] = Form.useForm();
	const gridRef: any = useRef(null);

	const [date] = useState(dayjs()); // 적용일자
	const dateFormat = 'YYYY-MM-DD'; // dayjs date format
	const [totalCnt, setTotalCnt] = useState(null); // 그리드 총 개수

	useEffect(() => {
		// 현재날짜를 셋팅한다.
		form.setFieldValue('effectiveDate', date);
	}, []);

	// 다국어
	const { t } = useTranslation();

	const gridCol = [
		{
			headerText: '물류센터',
			dataField: 'dcname',
			dataType: 'code',
			// width: 110,
		},
		{
			headerText: '이력일시',
			dataField: 'hisdate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			minWidth: 170,
			editable: false,
		},
		{
			headerText: '권역그룹명',
			dataField: 'dlvgroupNm',
			dataType: 'code',
			// width: 100,
		},
		{
			headerText: '권역명',
			dataField: 'dlvdistrictNm',
			dataType: 'code',
			// width: 100,
		},
		{
			headerText: '대표POP번호',
			dataField: 'popno',
			dataType: 'code',
			// width: 100,
		},
		{
			headerText: '대표POP명',
			dataField: 'popname',
			dataType: 'code',
			// width: 100,
		},
		{
			headerText: '시작시간',
			dataField: 'fromHour',
			dataType: 'code',
			// dataType: 'date',
			// formatString: 'hh:MM',
			// width: 80,
			labelFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
				return dateUtil.formatTimeInput(value);
			},
			editable: false,
		},
		{
			headerText: '종료시간',
			dataField: 'toHour',
			dataType: 'code',
			// dataType: 'date',
			// formatString: 'hh:MM',
			// width: 80,
			labelFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
				return dateUtil.formatTimeInput(value);
			},
			editable: false,
		},
		{
			headerText: '시/도',
			dataField: 'ctpKorNm',
			dataType: 'code',
			// width: 90,
		},
		{
			headerText: '시/군/구',
			dataField: 'sigKorNm',
			dataType: 'code',
			// width: 90,
		},
		{
			headerText: '행정동',
			dataField: 'hjdongNm',
			dataType: 'code',
			// width: 90,
		},
		{
			headerText: '행정동코드',
			dataField: 'hjdongCd',
			dataType: 'code',
			// width: 110,
		},
		{
			headerText: '적용시작일자',
			dataField: 'fromDate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			// width: 100,
			editable: false,
		},
		{
			headerText: '적용종료일자',
			dataField: 'toDate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			// width: 100,
			editable: false,
		},
		{
			headerText: '삭제여부',
			dataField: 'delYn',
			dataType: 'code',
			// width: 70,
		},
		{
			headerText: '등록자 이름',
			dataField: 'addwho',
			dataType: 'code',
			// width: 80,
		},
		{
			headerText: '수정자 이름',
			dataField: 'editwho',
			dataType: 'code',
			// width: 80,
		},
	];

	const gridProps = {
		showRowNumColumn: true,
		editable: false,
		fillColumnSizeMode: false,
		enableFilter: true,
	} as any;

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	const onSearchList = async () => {
		try {
			await form.validateFields();

			const values = form.getFieldsValue();

			values.gMultiDccodeList = [values.dccode];
			values.effectiveDate = values.effectiveDate.format('YYYYMMDD');

			apiPostDeliveryDistrictHistoryList(values).then(res => {
				if (res.statusCode === 0) {
					const list = res?.data?.list ?? [];
					setTotalCnt(res?.data?.totalCount);
					gridRef.current.setGridData(list);

					// 데이터 기준으로 칼럼 너비 자동 조정
					if (list.length > 0) {
						try {
							const colSizeList = gridRef.current.getFitColumnSizeList(true);
							gridRef.current.setColumnSizeList(colSizeList);
						} catch (e) {
							// 필요시 로그
						}
					}
				}
			});
		} catch (error: any) {
			showAlert(null, error.errorFields[0].errors[0]);
		}
	};

	const titleFunc = {
		searchYn: onSearchList,
	};

	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
		};

		return gridBtn;
	};

	// 상위 form 값 하위 폼에 초기 적용
	useEffect(() => {
		form.setFieldValue('dccode', pForm.getFieldsValue()?.dccode || initDccode); // 물류센터
		form.setFieldValue('effectiveDate', pForm.getFieldsValue()?.effectiveDate || dayjs()); // 적용일자
		form.setFieldValue('dlvgroupNm', pForm.getFieldsValue()?.searchDistrictGroup || ''); // 권역그룹
		form.setFieldValue('dlvdistrictNm', pForm.getFieldsValue()?.searchDistrict || ''); // 권역
	}, [pForm]);

	// 그리드 마운트 시, 헤더 텍스트 기준으로 칼럼 너비 자동 조정
	useEffect(() => {
		const grid = gridRef.current;
		if (!grid) return;

		try {
			const colSizeList = grid.getFitColumnSizeList(true);
			grid.setColumnSizeList(colSizeList);
		} catch (e) {
			// 필요하면 로그만 남기고 무시
		}
	}, []);

	return (
		<>
			<PopupMenuTitle name="배송 권역 변경이력" func={titleFunc} showButtons={true} />
			<SearchFormResponsive form={form} groupClass={'grid-column-3'}>
				<li>
					{/* 물류센터 */}
					<CmGMultiDccodeSelectBox
						// mode={'multiple'}
						name={'dccode'}
						rules={[{ required: true }]}
						disabled={true}
					/>
					<Form.Item name="pageNum" hidden initialValue={'0'}></Form.Item>
					<Form.Item name="listCount" hidden initialValue={'10000'}></Form.Item>
				</li>
				<li>
					{/* 적용일자  */}
					<DatePicker
						name="effectiveDate"
						label={t('lbl.EFFECTIVEDATE')}
						allowClear
						defaultValue={date} // 초기값 설정
						format={dateFormat} // 화면에 표시될 형식
						required={true}
					/>
				</li>
				<li>
					{/* 권역그룹 */}
					<InputText label={'권역그룹'} name="dlvgroupNm" placeholder={'권역그룹을 입력해주세요'} />
				</li>
				<li>
					{/* 권역 */}
					<InputText label={'권역'} name="dlvdistrictNm" placeholder={'권역을 입력해주세요'} />
				</li>
				<li>
					{/* 행정구역 */}
					<InputText label={'행정구역'} name="hjDistrictNm" placeholder={'행정구역을 입력해주세요'} />
				</li>
			</SearchFormResponsive>

			<div style={{ width: '100%', height: '70%' }}>
				<AGrid>
					<GridTopBtn gridTitle={'목록'} gridBtn={getGridBtn()} totalCnt={totalCnt} />
					<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>
			</div>
		</>
	);
};

export default MsDeliveryDistrictChangeHistoryPopup;
