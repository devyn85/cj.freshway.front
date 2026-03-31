/*
 ############################################################################
 # FiledataField	: MsPopMngMainPopup.tsx
 # Description		:  상품 엑셀 업로드 팝업
 # Author			: JeongHyeongCheol
 # Since			: 25.07.22
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils

// store
import { useAppSelector } from '@/store/core/coreHook';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';

// Type
import { GridBtnPropsType } from '@/types/common';

// API
import { apiGetDetailCodeList, apiPostSaveCodeList } from '@/api/ms/apiMsPopMng';

interface PropsType {
	close?: any;
	dccode?: string;
}

const MsPopMngMainPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close, dccode } = props;

	// 다국어
	const { t } = useTranslation();
	const userAuthInfo = useAppSelector(state => state.user.userInfo);
	const gridRef = useRef(null);
	const basecodeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return value === 'STD' ? '전체' : value;
	};
	const gridCol = [
		{
			headerText: t('lbl.CENTER_CODENAME'), // 센터코드/명
			dataField: 'basecode',
			dataType: 'code',
			labelFunction: basecodeLabelFunc,
			editable: false,
		},
		{
			headerText: '기간(년)',
			dataField: 'basedescr',
			// dataType: 'numeric',
			dataType: 'code',
			onlyNumeric: true,
		},
		{
			dataField: 'addwho',
			headerText: t('lbl.ADDWHO'),
			visible: false,
		},
		{
			dataField: 'regNm',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'addwho',
			editable: false,
		},

		{
			dataField: 'adddate',
			headerText: t('lbl.ADDDATE'), // 등록일시
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
		{
			dataField: 'editwho',
			headerText: t('lbl.EDITWHO'),
			visible: false,
		},
		{
			dataField: 'updNm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'editwho',
			editable: false,
		},
		{
			dataField: 'editdate',
			headerText: t('lbl.EDITDATE'), // 수정일시
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
	];

	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const saveCodeList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = gridRef.current.getChangedData({ validationYn: false });
		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		const params = gridRef.current.getChangedData().map((item: any) => {
			return {
				...item,
				codelist: 'BASE_POP_CHG_TERM',
				dccode: item.basecode,
			};
		});
		// 저장하시겠습니까?
		showConfirm(null, params[0].basedescr + '년 동안 출고가 없는 거래처 POP를 대표POP로 변경하시겠습니까? ', () => {
			apiPostSaveCodeList(params).then((res: any) => {
				if (res.data.statusCode > -1) {
					gridRef.current.setAllCheckedRows(false);
					gridRef.current.resetUpdatedItems();
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							close();
						},
					});
				}
			});
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save',
				callBackFn: saveCodeList,
			},
		],
	};

	// 초기 세팅
	const initEvent = () => {
		// 센터코드 목록 관리자만 전체수정가능
		const params: { codelist: string; multiBasecode: string[] } = {
			codelist: 'BASE_POP_CHG_TERM',
			multiBasecode: [],
		};
		if (userAuthInfo.roles?.includes('00') || userAuthInfo.roles?.includes('000')) {
			params.multiBasecode.push('STD');
		}
		params.multiBasecode.push(dccode);
		apiGetDetailCodeList(params).then(res => {
			const gridData = res.data;
			// 센터코드 목록 세팅
			gridRef.current.setGridData(gridData);
		});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */
	useEffect(() => {
		initEvent();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="대표POP 변경" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.BTN_CANCEL')}</Button>
			</ButtonWrap>
		</>
	);
};

export default MsPopMngMainPopup;
