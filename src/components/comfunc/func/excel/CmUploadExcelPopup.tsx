/*
 ############################################################################
 # FiledataField	: CmUploadExcelPopup.tsx
 # Description		:  엑셀 업로드 예제 팝업
 # Author			: Canal Frame
 # Since			: 25.05.09
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
import { showAlert } from '@/util/MessageUtil';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// API
import { apiPostSaveCustDeliveryInfo } from '@/api/ms/apiMsCustDeliveryInfo';

interface PropsType {
	close?: any;
}

const CmUploadExcelPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;

	// 다국어
	const { t } = useTranslation();

	const gridRef = useRef(null);

	const gridCol = [
		{
			headerText: '거래처코드',
			dataField: 'custType',
		},
		{
			headerText: '고객코드',
			dataField: 'custKey',
			disableMoving: true,
		},
		{
			headerText: '위도/경도',
			children: [
				{
					headerText: '위도',
					dataField: 'latitude',
					disableMoving: true,
				},
				{
					headerText: '경도',
					dataField: 'longitude',
					disableMoving: true,
				},
			],
		},
		{
			headerText: '체크결과',
			dataField: 'processYn',
		},
		{
			headerText: '체크메세지',
			dataField: 'processMsg',
		},
	];

	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelDownload',
			},
			{
				btnType: 'excelSelect',
			},
			{
				btnType: 'save',
			},
		],
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 유효성 검증
	 * @returns {void}
	 */
	const onDataCheckClick = () => {
		// 변경 데이터 확인
		const gpsList = gridRef.current.getChangedData({ validationYn: false });

		if (!gpsList || gpsList.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
				return;
			});
		} else if (gpsList.length > 0 && !gridRef.current.validateRequiredGridData()) {
			return;
		} else {
			const params = {
				processType: 'SPMS_CUSTDLVINFO_EXLCHK',
				gpsList: gpsList,
			};
			apiPostSaveCustDeliveryInfo(params).then((res: any) => {
				gridRef.current.clearGridData();
				gridRef.current.addRow(res.data);
			});
		}
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="GPS 좌표등록 일괄업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '}>
					<Button onClick={onDataCheckClick}>{'유효성검증'}</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
			</ButtonWrap>
		</>
	);
};

export default CmUploadExcelPopup;
