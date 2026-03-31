/*
 ############################################################################
 # FiledataField	: MsCustDeliveryInfoPUploadExcelPopup.tsx
 # Description		:  상품 엑셀 업로드 팝업
 # Author			: JeongHyeongCheol
 # Since			: 25.07.22
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { apiGetValidateExcelList, apiPostSaveMaster } from '@/api/ms/apiMsCustDeliveryInfoP';
import { GridBtnPropsType } from '@/types/common';
import fileUtil from '@/util/fileUtils';

// API

interface PropsType {
	close?: any;
}

const MsCustDeliveryInfoPUploadExcelPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;

	// 다국어
	const { t } = useTranslation();

	const gridRef = useRef(null);
	const excelUploadFileRef = useRef(null);
	const gridCol = [
		{
			dataField: 'gubun',
			headerText: t('lbl.GUBUN_2'),
			required: true,
		},
		{
			dataField: 'custkey',
			headerText: t('lbl.PARTNER_CD'),
			filter: {
				showIcon: true,
			},
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'custname',
			headerText: t('lbl.PARTNER_NAME'),
			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'smsYn',
			headerText: 'SMS 수신유무',
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'mailYn',
			headerText: '메일 수신유무',
			dataType: 'code',
			required: true,
		},
		{
			dataField: 'name',
			headerText: t('lbl.NAME'),
			required: true,
		},
		{
			dataField: 'phone',
			headerText: t('lbl.PHONE'),
			required: true,
		},
		{
			dataField: 'email',
			headerText: t('lbl.EMAIL'),
			required: true,
		},
		{
			dataField: 'etc',
			headerText: t('lbl.ETC'),
		},
		{
			dataField: 'delYn',
			headerText: t('lbl.DELETE_YN'),
		},
	];
	// 그리드 속성
	const gridProps = {
		editable: false,
		showRowCheckColumn: true,
		enableFilter: true,
		showCustomRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 *
	 */

	// 이메일 유효성 검사
	const isValidEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	/**
	 * 전화번호 및 팩스번호 정규식 패턴
	 * 기존: 010, 011, 016, 017, 018, 019
	 * 추가: 02, 031, 032, 033, 041, 042, 051, 052, 053, 054, 055, 061, 062, 063, 064, 070
	 * 비고1: 하이픈 포험, 미포함 커버 (기존방식에서 변경)
	 * 비고2: 3자리-4자리, 4자리-3자리 커버
	 * 비고3: 하이픈 없이 입력시 자동으로 하이픈 붙여주는 기능O (공통 개발 사항)
	 * @param phone
	 * @returns {boolean}
	 */
	const isValidPhone = (phone: string) => {
		// 전화번호 유효성 검사
		const PHONE_PATTERN = /^(01[016-9]|02|0[3-6]\d|070|080)-?\d{3,4}-?\d{4}$/;
		return PHONE_PATTERN.test(phone);
	};

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		gridRef.current.changeColumnLayout(gridCol);
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, validateExcelList);
	};

	const validateExcelList = async () => {
		const params = gridRef.current.getGridData();
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		apiGetValidateExcelList(params).then(res => {
			const checkColumn = [
				{
					dataField: 'processYn',
					headerText: '체크결과',
				},
				{
					dataField: 'processMsg',
					headerText: '체크메시지',
				},
			];
			gridRef.current.addColumn(checkColumn, 1);
			const rowsToUpdate = res.data.data;

			const updateData: any[] = [];
			const updateIndex: any[] = [];
			rowsToUpdate.forEach((row: any, index: any) => {
				let processMsg;
				let processYn;

				if (!row.gubun) {
					processMsg = '구분은 필수값입니다.';
					processYn = 'N';
				} else if (row.custkeyYn === 'N') {
					processMsg = '협력사코드가 존재하지 않습니다.';
					processYn = 'N';
				}
				//  else if (row.custnameYn === 'N') {
				// 	processMsg = '협력사명이 존재하지 않습니다.';
				// 	processYn = 'N';
				// }
				// else if (row.processYn === 'N') {
				// 	processMsg = '협력사코드와 협력사명이 일치하지 않습니다.';
				// 	processYn = 'N';
				// }
				else if (row.duplicateYn === 'N') {
					processMsg = '중복된 정보입니다.';
					processYn = 'N';
				}
				// SMS 수신유무 값 유효성 검사
				// 'Y'도 아니고 'N'도 아닐 때 에러
				else if (row.smsYn !== 'Y' && row.smsYn !== 'N') {
					processMsg = 'SMS 수신유무는 Y 또는 N만 가능합니다.';
					processYn = 'N';
				}
				// 메일 수신유무 값 유효성 검사
				else if (row.mailYn !== 'Y' && row.mailYn !== 'N') {
					processMsg = '메일 수신유무는 Y 또는 N만 가능합니다.';
					processYn = 'N';
				} else if (!row.name) {
					processMsg = '이름은 필수값입니다.';
					processYn = 'N';
				}

				// 전화번호 유효성 검사
				else if (!isValidPhone(params[index]?.phone || '')) {
					processMsg = '유효하지 않은 전화번호 형식입니다.';
					processYn = 'N';
				}
				// // 이메일 유효성 검사
				else if (!isValidEmail(params[index]?.email || '')) {
					processMsg = '유효하지 않은 이메일 형식입니다.';
					processYn = 'N';
				}

				// 삭제 유무 값 유효성 검사
				else if (row.delYn && row.delYn !== 'Y' && row.delYn !== 'N') {
					processMsg = '삭제 여부는 Y 또는 N만 가능합니다.';
					processYn = 'N';
				} else {
					processMsg = '정상';
					processYn = 'Y';
				}
				let rowStatus = 'I';
				if (row.updateYn === 'Y') {
					rowStatus = 'U';
				}
				updateData.push({
					processYn: processYn,
					processMsg: processMsg,
					rowStatus: rowStatus,
				});
				updateIndex.push(index);
			});
			gridRef.current.updateRows(updateData, updateIndex);
			// 오류케이스 체크 해제
			const uncheckedItems = gridRef.current.getGridData().filter((item: any) => {
				return item.processYn === 'N';
			});
			const uncheckedIds = uncheckedItems.map((item: any) => item._$uid);

			gridRef.current.addUncheckedRowsByIdsBefore(uncheckedIds);
		});
	};
	const saveExcelList = async () => {
		// 변경 데이터 확인
		const detailParams = gridRef.current.getCustomCheckedRowItems();

		// 유효성 검사 통과 못한 데이터 확인
		const isProcessYN = detailParams.some((item: any) => item.processYn !== 'Y');

		// 'N'인 항목이 있다면 메시지를 띄우고 함수를 종료
		if (isProcessYN) {
			showMessage({
				content: '유효성 검증이 완료되지 않은 데이터가 포함되어 있습니다.\n확인 후 다시 시도해주세요.',
				modalType: 'info',
			});
			return;
		}

		const params = {
			excelList: detailParams,
		};

		const updateLength = detailParams.filter((item: any) => item.rowStatus === 'U').length;
		const insertLength = detailParams.filter((item: any) => item.rowStatus === 'I').length;

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${insertLength}건
				수정 : ${updateLength}건
				삭제 : 0건`;

		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, () => {
			apiPostSaveMaster(params).then(() => {
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
					onOk: () => {
						close();
					},
				});
			});
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelForm',
			},
			{
				btnType: 'excelSelect',
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					excelUploadFileRef.current.click();
				},
			},

			{
				btnType: 'save',
				callBackFn: saveExcelList,
			},
		],
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="협력사정보 일괄업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.BTN_CANCEL')}</Button>
			</ButtonWrap>
			{/* 엑셀 파일 업로드 INPUT 영역 */}
			<input
				ref={excelUploadFileRef}
				id="excelUploadInput"
				type="file"
				onChange={onFileChange}
				onClick={(e: any) => {
					e.target.value = null;
				}}
				style={{ display: 'none' }}
			/>
		</>
	);
};

export default MsCustDeliveryInfoPUploadExcelPopup;
