/*
 ############################################################################
 # FiledataField    : StConvertLotDetail.tsx
 # Description      : 유통기한변경
 # Author           : sss
 # Since            : 25.07.04
 # 
 # [주요 기능]
 # 1. 유통기한 일자 변경
 #    - 제조일자/소비일자 라디오 버튼으로 입력 방식 선택
 #    - DatePicker를 통한 일자 입력 및 자동 계산
 #      * 제조일자 입력 시: 소비기한일수를 더해 소비일자 자동 계산
 #      * 소비일자 입력 시: 소비기한일수를 빼서 제조일자 자동 계산
 #      * 소비기한잔여율, 유효기간(잔여/전체) 자동 계산
 # 
 # 2. STD(표준) 모드
 #    - STD 버튼 클릭 시 일자 입력 모드와 STD 모드 전환
 #    - STD 모드: 제조일자/소비일자 대신 'STD' 값으로 설정
 #      * expiredt: STD (또는 선택된 값)
 #      * manufacturedt, usebydatefreert, durationTerm: 빈값 처리
 #    - 일자 모드: 일반적인 날짜 기반 계산 수행
 # 
 # 3. 선택적용
 #    - 그리드에서 체크된 행들에 일괄 적용
 #    - 사유코드/사유메시지 필수 입력
 #    - 현재 버튼 상태(STD/일자)에 따라 다른 처리 로직 실행
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { v4 as uuidv4 } from 'uuid';
// Utils
//types
import { GridBtnPropsType } from '@/types/common';
// API Call Function
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import InputText from '@/components/common/custom/form/InputText';
import SelectBox from '@/components/common/custom/form/SelectBox';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import commUtil from '@/util/commUtil';
import dateUtil from '@/util/dateUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
import { Button, Form, Radio } from 'antd';
import { forwardRef, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const StConvertLotDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, formRef } = props; // Antd Form
	const gridId = uuidv4() + '_gridWrap';
	const globalVariable = useAppSelector(state => state.global.globalVariable); // 전역 변수
	const [dsExpedit, setDsExpedit] = useState<any[]>([]); // EXPEDIT 권한 데이터 상태 추가
	const [loopTrParams, setLoopTrParams] = useState({});
	const [showStdInput, setShowStdInput] = useState(false);
	const [stdButtonLabel, setStdButtonLabel] = useState('STD');
	const bCheckYnFlag = { current: false }; // 그리드 Props

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	const modalRef = useRef(null);
	const initialDataRef = useRef<any[]>([]); // 초기 데이터 저장

	// Declare init value(3/4)

	/**
	 * 셀 편집 완료 이벤트 핸들러
	 * @param {object} event - 셀 편집 이벤트 객체
	 */
	const handleCellEditEnd = (event: any) => {
		const { dataField, value, rowIndex } = event;
		const grid = ref.gridRef.current;

		// 제조일자(manufacturedt)가 변경된 경우 소비기한일자와 소비기한잔여율 자동 계산
		if (dataField === 'manufacturedt') {
			const currentRow = grid.getItemByRowIndex(rowIndex);
			const manufacturedt = value;
			const duration = currentRow.duration;

			if (manufacturedt && duration) {
				// const expiredt = manufacturedt == 'STD' ? 'STD' : dateUtil.addDate(manufacturedt, duration);
				// const usebydatefreert = calculateUsebydateFreert(expiredt, duration);
				// const durationTerm = calculateDurationTerm(expiredt, duration);

				const expiredt = commUtil.calcLotDates('1', manufacturedt, Number(duration));
				const usebydatefreert = commUtil.calcDurationRate(expiredt, duration, false);
				const durationTerm = commUtil.calcDurationTerm(expiredt, duration);

				// updateRowsById 방식으로 변경
				const updatedRow = {
					...currentRow,
					[dataField]: value, // 현재 편집된 필드 값도 업데이트
					expiredt: expiredt,
					lottable01: expiredt, // lottable01도 동일하게 설정
					usebydatefreert: usebydatefreert,
					durationTerm: durationTerm,
				};

				grid.updateRowsById([updatedRow], true); // isMarkEdited: true
			}
		}

		// 소비일자(expiredt) 또는 duration 변경된 경우 제조일자와 소비기한잔여율 자동 계산
		else if (dataField === 'expiredt') {
			const currentRow = grid.getItemByRowIndex(rowIndex);
			const expiredt = dataField === 'expiredt' ? value : currentRow.expiredt;
			const duration = dataField === 'duration' ? value : currentRow.duration;

			// 소비일자로 제조일자 구하기
			if (expiredt && duration) {
				// const manufacturedt = expiredt == 'STD' ? 'STD' : dateUtil.addDate(expiredt, -duration);
				// const usebydatefreert = calculateUsebydateFreert(expiredt, duration);
				// const durationTerm = calculateDurationTerm(expiredt, duration);

				const manufacturedt = commUtil.calcLotDates('2', expiredt, Number(duration));
				const usebydatefreert = commUtil.calcDurationRate(expiredt, duration, false);
				const durationTerm = commUtil.calcDurationTerm(expiredt, duration);

				// updateRowsById 방식으로 변경
				const updatedRow = {
					...currentRow,
					[dataField]: value, // 현재 편집된 필드 값도 업데이트
					lottable01: value, // lottable01도 동일하게 설정
					manufacturedt: manufacturedt,
					usebydatefreert: usebydatefreert,
					durationTerm: durationTerm,
				};

				grid.updateRowsById([updatedRow], true); // isMarkEdited: true
			}
		}
	};

	/**
	 * 소비기한잔여율 계산 함수
	 * @param {string} expiredt - 소비일자
	 * @param {number} duration - 소비기한일수
	 * @returns {number} 소비기한잔여율
	 */
	const calculateUsebydateFreert = (expiredt: string, duration: number) => {
		if (expiredt === 'STD') {
			return 100;
		}
		if (!expiredt || !duration) return 0;

		const today = dateUtil.today();
		const expiredDate = new Date(expiredt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
		const todayDate = new Date(today.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));

		// 남은 일수 계산
		const timeDiff = expiredDate.getTime() - todayDate.getTime();
		const remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

		// 소비기한잔여율 = (남은일수 / 총소비기한일수) * 100
		const usebydatefreert = (remainingDays / duration) * 100;
		return Math.max(0, Math.round(usebydatefreert * 100) / 100); // 소수점 2자리까지, 음수 방지
	};

	/**
	 * durationTerm 계산 함수 (남은일수/총일수 형태)
	 * @param {string} expiredt - 소비일자
	 * @param {number} duration - 소비기한일수
	 * @returns {string} durationTerm
	 */
	const calculateDurationTerm = (expiredt: string, duration: number) => {
		if (expiredt === 'STD') {
			return `/${duration}`;
		}
		if (!expiredt || !duration) return '';

		const today = dateUtil.today();
		const expiredDate = new Date(expiredt.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
		const todayDate = new Date(today.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));

		// 남은 일수 계산
		const timeDiff = expiredDate.getTime() - todayDate.getTime();
		const remainingDays = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

		// 남은일수/총일수 형태로 반환
		return `${remainingDays}/${duration}`;
	};

	//그리드 Props
	const gridProps = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 성능개선(1/3)
		independentAllCheckBox: false, // 성능개선(2/3)
		fillColumnSizeMode: false,
		showFooter: true,
	};

	// 그리드 컬럼 세팅
	// ...existing code...
	// 그리드 컬럼 세팅
	const gridCol = [
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), dataType: 'code', width: 100, editable: false }, // 물류센터
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), dataType: 'code', width: 100, editable: false }, // 창고
		{
			dataField: 'durationtype',
			headerText: t('lbl.DURATIONTYPE'),
			dataType: 'code',
			width: 100,
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const code = getCommonCodebyCd('DURATIONTYPE', value);
				return code?.cdNm ?? '';
			},
		}, // 유통기한관리방법
		{ dataField: 'stockgradename', headerText: t('lbl.STOCKGRADE'), dataType: 'code', width: 100, editable: false }, // 재고속성
		{
			headerText: t('lbl.SKUINFO'), // 상품정보
			children: [
				{ dataField: 'mc', headerText: t('lbl.SKUGROUP'), dataType: 'code', width: 100, editable: false }, // 상품분류
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'),
					width: 80,
					editable: false,
					filter: { showIcon: true },
					dataType: 'code',
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(e.item, 'sku');
						},
					},
				}, // 상품코드
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'),
					width: 120,
					editable: false,
					dataType: 'name',
					filter: { showIcon: true },
				}, // 상품명
			],
		},
		{ dataField: 'fromLoc', headerText: t('lbl.LOC'), dataType: 'code', editable: false }, // LOC
		{ dataField: 'uom', headerText: t('lbl.UOM_ST'), dataType: 'code', width: 100, editable: false }, // 단위
		{
			headerText: t('lbl.QTYINFO'), // 수량정보
			children: [
				{
					dataField: 'qty',
					headerText: t('lbl.QTY_ST'),
					dataType: 'numeric',
					formatString: '#,##0.##',
					editable: false,
				}, // 수량
				{
					dataField: 'openqty',
					headerText: t('lbl.OPENQTY_ST'),
					dataType: 'numeric',
					formatString: '#,##0.##',
					editable: false,
				}, // 가용재고수량
				{
					dataField: 'qtyallocated',
					headerText: t('lbl.QTYALLOCATED_ST'),
					dataType: 'numeric',
					formatString: '#,##0.##',
					editable: false,
				}, // 재고할당수량
				{
					dataField: 'qtypicked',
					headerText: t('lbl.QTYPICKED_ST'),
					dataType: 'numeric',
					formatString: '#,##0.##',
					editable: false,
				}, // 피킹재고
				{
					dataField: 'tranqty',
					headerText: t('lbl.TRANQTY'),
					formatString: '#,##0.##',
					dataType: 'numeric',
					editRenderer: { type: 'InputEditRenderer', allowNegative: true, allowPoint: true },
				}, // 작업수량
			],
		},
		{
			headerText: t('lbl.LOTINFO'), // LOT 정보
			children: [
				{ dataField: 'fromLot', headerText: t('lbl.LOT'), dataType: 'code', editable: false }, // LOT
				{ dataField: 'fromStockid', headerText: t('lbl.FROM_STOCKID'), dataType: 'code', editable: false }, // 재고ID
				{ dataField: 'stockgradename', headerText: t('lbl.STOCKGRADE'), dataType: 'code', editable: false }, // 재고속성
				{ dataField: 'fromStocktypedescr', headerText: t('lbl.STOCKTYPE'), dataType: 'code', editable: false }, // 재고위치
				// START.제조일자/소비일자/유효기간/소비기한잔여율
				{
					headerText: t('lbl.MANUFACTUREDT'), // 제조일자
					dataField: 'manufacturedt',
					dataType: 'code',
					editable: true,
					formatString: 'yyyy-mm-dd',
					dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
					minWidth: 120,
					commRenderer: {
						type: 'calender',
						onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
						showExtraDays: false,
						align: 'center',
					},
					// 입력부 항목 색생 주석처리 요청
					// styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
					// 	ref.gridRef.current.removeEditClass(columnIndex);
					// 	return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'isEdit');
					// },
				},

				{
					headerText: t('lbl.EXPIREDT'), // 소비일자
					dataField: 'expiredt',
					dataType: 'code',
					editable: true,
					formatString: 'yyyy-mm-dd',
					dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
					minWidth: 120,
					commRenderer: {
						type: 'calender',
						onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
						showExtraDays: false,
						align: 'center',
					},
					// 입력부 항목 색생 주석처리 요청
					// styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
					// 	ref.gridRef.current.removeEditClass(columnIndex);
					// 	return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, 'isEdit'); // 편집중 스타일
					// },
				},
				{
					headerText: t('lbl.DURATION_TERM'), // 유효기간-소비기간(잔여/전체)
					dataField: 'durationTerm',
					dataType: 'code',
					width: 150,
					editable: false,
					styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
					},
				},
				{
					headerText: t('lbl.USEBYDATE_FREE_RT'), // 소비기한잔여율
					dataField: 'usebydatefreert',
					headerTooltip: {
						show: true,
						tooltipHtml: '※소비기한일을 관리하지 않으면 빈값으로 표시되고<br>잔여율이 -인 경우는 0으로 표시됩니다.',
					},
					dataType: 'numeric',
					filter: { showIcon: true },
					formatString: '#,##0',
					editable: false,
				},
				// END.제조일자/소비일자/유효기간/소비기한잔여율
			],
		},
		{
			headerText: t('lbl.REASON'), // REASON
			children: [
				{
					dataField: 'reasoncode',
					headerText: t('lbl.REASONCODE'),
					dataType: 'code',
					width: 120,
					editable: true,
					required: true,
					commRenderer: {
						type: 'dropDown',
						list: getCommonCodeList('REASONCODE_CL'),
					},
				}, // 사유코드
				{
					dataField: 'reasonmsg',
					headerText: t('lbl.REASONMSG'),
					dataType: 'code',
					width: 200,
					editable: true,
					required: true,
				}, // 사유메시지
			],
		},
		{
			headerText: t('lbl.SERIALINFO'), // 상품이력정보
			children: [
				{ dataField: 'serialno', headerText: t('lbl.SERIALNO'), dataType: 'code', editable: false }, // 이력번호
				{ dataField: 'barcode', headerText: t('lbl.BARCODE'), dataType: 'code', editable: false }, // 바코드
				{ dataField: 'convserialno', headerText: t('lbl.BLNO'), dataType: 'code', editable: false }, // B/L 번호
				{ dataField: 'butcherydt', headerText: t('lbl.BUTCHERYDT'), dataType: 'code', editable: false }, // 도축일자
				{ dataField: 'factoryname', headerText: t('lbl.FACTORYNAME'), dataType: 'code', editable: false }, // 도축장
				{ dataField: 'contracttype', headerText: t('lbl.CONTRACTTYPE'), dataType: 'code', editable: false }, // 계약유형
				{ dataField: 'contractcompany', headerText: t('lbl.CONTRACTCOMPANY'), dataType: 'code', editable: false }, // 계약업체
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					dataType: 'code',
					editable: false,
				}, // 계약업체명
				{ dataField: 'fromvaliddt', headerText: t('lbl.FROMVALIDDT'), dataType: 'code', editable: false }, // 유효일자(FROM)
				{ dataField: 'tovaliddt', headerText: t('lbl.TOVALIDDT'), dataType: 'code', editable: false }, // 유효일자(TO)
			],
		},
		/*START.hidden 컬럼*/
		{ dataField: 'lottable01', visible: false }, // lottable01
		/*END.hidden 컬럼*/
	];

	// 그리드 footer
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: gridCol[0].dataField, // 첫 번째 dataField 사용
		},
		{
			dataField: 'qty',
			positionField: 'qty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 수량1
		{
			dataField: 'openqty',
			positionField: 'openqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 가용재고수량
		{
			dataField: 'qtyallocated',
			positionField: 'qtyallocated',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 재고할당수량
		{
			dataField: 'qtypicked',
			positionField: 'qtypicked',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
			renderer: {
				type: 'BarRenderer',
				min: 0,
				max: 100,
				style: 'my-custom-bar',
			},
		}, // 피킹재고
	];

	/**
	 * =====================================================================
	 * 02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * 선택적용 - 선택된 행에 사유코드와 사유메시지 적용
	 */
	const handleSelectApply = () => {
		const gridRef = ref.gridRef.current;
		const checkedItems = gridRef.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length === 0) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		const reasoncode = formRef.getFieldValue('reasoncode');
		const reasonmsg = formRef.getFieldValue('reasonmsg');
		const lottable01 = formRef.getFieldValue('lottable01'); // 소비기한일자 (원본)

		if (commUtil.isEmpty(reasoncode) && commUtil.isEmpty(reasonmsg)) {
			return;
		}

		// 'STD' 모드인 경우
		if (lottable01 == 'STD') {
			gridRef.updateRowsById(
				checkedItems.map((row: any) => ({
					...row,
					reasoncode: reasoncode,
					reasonmsg: reasonmsg,
					expiredt: lottable01 || '',
					manufacturedt: lottable01 || '',
					usebydatefreert: '',
					durationTerm: '',
					lottable01: lottable01 || '',
				})),
			);
			return;
		} else {
			// 일반 일자 모드인 경우
			const normalizedLottable01 = String(commUtil.nvl(lottable01, '')).replace(/-/g, '');
			if (!dateUtil.isValid(normalizedLottable01, 'YYYYMMDD')) {
				showAlert(null, '날짜 형식을 확인해주세요. (YYYYMMDD)');
				return;
			}
		}

		const applyLottable01 = String(commUtil.nvl(lottable01, '')).replace(/-/g, '');

		const dateType = formRef.getFieldValue('dateType'); // 제조일자/소비일자 구분 값

		gridRef.updateRowsById(
			checkedItems.map((row: any) => {
				let manufacturedt = row.manufacturedt;
				let expiredt = row.expiredt;
				let usebydatefreert = row.usebydatefreert;
				let durationTerm = row.durationTerm;

				// dateType에 따라 제조일자 또는 소비일자 기준으로 계산
				if (applyLottable01 && row.duration) {
					const numDuration = row.duration;

					if (dateType === 'manufacture') {
						// 제조일자 기준: lottable01을 제조일자로 설정하고 소비일자 계산
						manufacturedt = applyLottable01;
						// expiredt = dateUtil.addDate(applyLottable01, numDuration);
						// usebydatefreert = calculateUsebydateFreert(expiredt, numDuration);
						// durationTerm = calculateDurationTerm(expiredt, numDuration);

						expiredt = commUtil.calcLotDates('1', applyLottable01, Number(numDuration));
						usebydatefreert = commUtil.calcDurationRate(expiredt, numDuration, false);
						durationTerm = commUtil.calcDurationTerm(expiredt, numDuration);
					} else if (dateType === 'expire') {
						// 소비일자 기준: lottable01을 소비일자로 설정하고 제조일자 계산
						expiredt = applyLottable01;
						// manufacturedt = dateUtil.addDate(applyLottable01, -numDuration);
						// usebydatefreert = calculateUsebydateFreert(applyLottable01, numDuration);
						// durationTerm = calculateDurationTerm(applyLottable01, numDuration);

						// 소비일자 기준: lottable01을 소비일자로 설정하고 제조일자 계산
						manufacturedt = commUtil.calcLotDates('2', expiredt, Number(numDuration));
						usebydatefreert = commUtil.calcDurationRate(expiredt, numDuration, false);
						durationTerm = commUtil.calcDurationTerm(expiredt, numDuration);
					}
				}

				return {
					...row,
					reasoncode: reasoncode,
					reasonmsg: reasonmsg,
					manufacturedt: manufacturedt,
					expiredt: expiredt,
					usebydatefreert: usebydatefreert,
					durationTerm: durationTerm,
					lottable01: applyLottable01,
				};
			}),
		);

		const firstCheckedRowIndex = checkedItems[0]?.rowIndex;
		const manufacturedtColIndex = gridRef.getColumnIndexByDataField('manufacturedt');
		if (firstCheckedRowIndex !== undefined && manufacturedtColIndex !== undefined) {
			gridRef.setSelectionByIndex(firstCheckedRowIndex, manufacturedtColIndex);
		}
	};

	/**
	 * 저장
	 */
	const saveMasterList = async () => {
		const gridRef = ref.gridRef.current; // 그리드

		// const menus = gridRef.getChangedData();
		// if (!menus || menus.length < 1) {
		// 	showAlert(null, t('msg.noChange')); // 변경사항이 없습니다.
		// 	return;
		// }

		if (gridRef.getCheckedRowItemsAll().length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// validation
		if (!gridRef.validateRequiredGridData()) {
			return;
		}

		// 그리드 선택된 행의 사유코드/사유메시지 필수 체크
		const checkedItems = gridRef.getCheckedRowItems();
		for (let i = 0; i < checkedItems.length; i++) {
			const item = checkedItems[i].item;
			if (Number(item.tranqty) < 1) {
				showAlert(null, `${checkedItems[i].rowIndex + 1}번째 행의 작업수량은 1 이상 입력해주세요.`);
				return;
			}
			if (!item.reasoncode) {
				showAlert(null, `${checkedItems[i].rowIndex + 1}번째 행의 사유코드를 입력해주세요.`);
				return;
			}
			if (!item.reasonmsg || item.reasonmsg.trim() === '') {
				showAlert(null, `${checkedItems[i].rowIndex + 1}번째 행의 사유메시지를 입력해주세요.`);
				return;
			}
		}

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			// 법적유통기한이 초과된 유통기한으로 입력하였는지 체크
			let strCheck = 'Y';
			const dsCheckedHeader = gridRef.getCheckedRowItemsAll();

			// START.소비기한일자 체크
			for (let i = 0; i < dsCheckedHeader.length; i++) {
				const rowLottable01 = commUtil.nvl(dsCheckedHeader[i].lottable01, ''); // 그리드의 lottable01 값 사용

				// 유통기한 체크
				if (rowLottable01 != 'STD' && rowLottable01 != '') {
					if (!dsCheckedHeader[i].duration || dsCheckedHeader[i].duration === null) continue;

					const numDuration = Number(dsCheckedHeader[i].duration);
					if (dsCheckedHeader[i].durationtype == '1') {
						// 유통기한
						if (dateUtil.addDate(rowLottable01, -numDuration) > dateUtil.today() || rowLottable01 < dateUtil.today()) {
							strCheck = 'N';
							break;
						}
					} else if (dsCheckedHeader[i].durationtype == '2') {
						//  제조일자
						if (rowLottable01 > dateUtil.today() || dateUtil.addDate(rowLottable01, numDuration) < dateUtil.today()) {
							strCheck = 'N';
							break;
						}
					}
				}
			}
			// END.소비기한일자 체크

			//alert(globalVariable.gAuthority);
			//alert(globalVariable.gUserId.toUpperCase());
			if (
				strCheck == 'N' &&
				globalVariable.gAuthority != '00' &&
				globalVariable.gAuthority != '05' &&
				dsExpedit.findIndex(item => item.comCd === globalVariable.gUserId.toUpperCase()) < 0
			) {
				// 유통기한 입력 권한 보유자 추가
				showAlert(null, '법적유통기한이 초과된 유통기한으로 입력할 수 없습니다.');
				return;
			}

			const params = {
				apiUrl: '/api/st/convertLot/v1.0/saveMasterList',
				avc_COMMAND: 'CONFIRM',
				converttype: 'CL',
				lottable01: '', // row별 lottable01 값으로 처리
				lottable02: 'STD',
				lottable03: 'STD',
				lottable04: 'STD',
				lottable05: 'STD',
				//
				dataKey: 'saveList',
				saveDataList: gridRef.getCheckedRowItemsAll(), // 선택된 행의 데이터
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
	};

	/**
	 * 표준일자 클릭
	 */
	const handleStdClick = () => {
		const nextLabel = stdButtonLabel === 'STD' ? '일자' : 'STD';
		setStdButtonLabel(nextLabel);
		setShowStdInput(nextLabel != 'STD');
		if (nextLabel === 'STD') {
			formRef?.setFieldsValue({ lottable01_2: 'STD' });
		}
	};

	const handleDateTypeChange = () => {
		//
	};

	/**
	 * 저장 - 구현
	 * @param {object} params - 저장할 파라미터 객체
	 * @returns {Promise<any>} Axios response data
	 */
	// const apiPostSaveMasterList = (params: any) => {
	// 	return axios.post('/api/st/convertLot/v1.0/saveMasterList', params).then(res => res.data);
	// };

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef,
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
		props.search();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	// 그리드 초기 데이터 세팅
	useEffect(() => {
		const gridRef = ref.gridRef.current;
		if (gridRef) {
			// 초기 데이터 저장
			initialDataRef.current = props.data;

			gridRef?.setSelectionByIndex(0, 0);
			gridRef?.setGridData(props.data);

			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	// 성능개선(3/3) - 그리드 이벤트 바인딩(rowCheckClick:필요시, rowAllCheckClick:필수)
	useEffect(() => {
		const gridRef = ref.gridRef.current;
		try {
			const codeList = getCommonCodeList('EXP_DATE_EDIT'); // 유통기한변경가능자확인
			//console.log(('codeList', codeList);
			if (codeList) {
				setDsExpedit(codeList || []);
			}
		} catch (error) {
			setDsExpedit([]);
		}

		// 기존 이벤트 언바인딩 (중복 방지)
		//gridRef.unbind('cellEditEnd');
		// 새로운 이벤트 바인딩
		gridRef.unbind('cellEditEnd');
		gridRef.bind('cellEditEnd', handleCellEditEnd);

		// 이벤트.전체 체크박스 클릭 시
		ref.gridRef.current?.bind('rowAllCheckClick', function (checked: any) {
			const gridRef = ref.gridRef.current;
			bCheckYnFlag.current = true;

			if (checked) {
				const rows = gridRef.getGridData();
				const updatedRows = rows.map((item: any) => ({
					...item,
					toOrderqtyBox: item.posbqtyBox ?? 0,
					toOrderqtyEa: item.posbqtyEa ?? 0,
				}));

				if (updatedRows.length) {
					gridRef.updateRowsById(updatedRows, true);
				}
			} else {
				// 전체 언체크 시 초기 데이터 다시 로드
				const initialData = initialDataRef.current;
				gridRef?.setGridData(initialData);
				gridRef?.setSelectionByIndex(0, 0);

				if (initialData.length > 0) {
					const colSizeList = gridRef.getFitColumnSizeList(true);
					gridRef.setColumnSizeList(colSizeList);
				}
			}
			bCheckYnFlag.current = false;
		});
	}, []);

	return (
		<AGrid className="contain-wrap">
			<GridTopBtn gridTitle="목록" totalCnt={props.totalCnt} gridBtn={gridBtn}>
				<Form form={formRef} layout="inline" className="sect">
					{/* 사유코드 */}
					<SelectBox
						name="reasoncode"
						label={t('lbl.REASONCODE')} /*사유코드*/
						options={getCommonCodeList('REASONCODE_CL', t('lbl.SELECT'))}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
						className="bg-white"
						style={{ width: '200px' }}
						initval={'1'}
					/>
					<InputText
						name="reasonmsg"
						className="bg-white"
						required
						placeholder={t('msg.placeholder1', [t('lbl.REASONMSG')])}
						rules={[{ required: true, message: t('msg.placeholder1', [t('lbl.REASONMSG')]) }]} /*사유메세지*/
						style={{ width: '300px' }}
					/>
					{!showStdInput && (
						<Form.Item name="dateType" initialValue="manufacture">
							<Radio.Group className="bg-white" onChange={handleDateTypeChange}>
								<Radio value="manufacture" style={{ marginRight: '2px' }}>
									제조일자
								</Radio>
								<Radio value="expire">소비일자</Radio>
							</Radio.Group>
						</Form.Item>
					)}
					<InputText
						name="lottable01"
						className="bg-white"
						required
						placeholder={t('msg.placeholder1', [t('lbl.LOTTABLE01')])}
						rules={[{ required: true, message: t('msg.placeholder1', [t('lbl.LOTTABLE01')]) }]} /*소비기한일*/
						style={{ width: '100px' }}
					/>{' '}
					<Button size={'small'} className="mr20" onClick={() => handleSelectApply()}>
						{t('lbl.APPLY_SELECT')} {/* 선택적용 */}
					</Button>
					<CustomModal ref={modalRef} width="1000px">
						<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
					</CustomModal>
				</Form>
			</GridTopBtn>

			<AUIGrid
				ref={ref.gridRef}
				name={gridId}
				columnLayout={gridCol}
				gridProps={gridProps}
				footerLayout={footerLayout}
			/>
		</AGrid>
	);
});
export default StConvertLotDetail;
