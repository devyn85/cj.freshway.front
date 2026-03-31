// lib
import { Button } from 'antd';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store
import { useAppSelector } from '@/store/core/coreHook';
// Type
import { GridBtnPropsType } from '@/types/common';

// api
import { apiGetCmCodeDetailList } from '@/api/cm/apiCmCode';

const BatchParamSetPop = (props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 사용자 정보
	const storerkey = useAppSelector(state => state.global.globalVariable.gStorerkey);
	const { codeType, close } = props;
	const { t } = useTranslation();
	const gridRef = useRef<any>();

	// 그리드 컬럼 정의
	const gridCol = [
		{
			headerText: '인수명',
		},
		{
			headerText: '인수 설명',
		},
		{
			headerText: '디폴트 값',
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

	// 데이터 조회
	const fetchGridData = () => {
		apiGetCmCodeDetailList({ storerkey, codelist: codeType }).then(res => {
			gridRef.current?.setGridData(res.data ?? []);
		});
	};

	// 타이틀 func
	const titleFunc = {
		refresh: fetchGridData,
		searchYn: fetchGridData,
	};

	/**
	 * 그리드 버튼 함수를 설정한다.
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'copy', // 행복사
					initValues: {
						menuId: '',
						regId: '',
						regDt: '',
					},
				},
				{
					btnType: 'curPlus', // 행삽입
				},
				{
					btnType: 'plus', // 행추가
					initValues: {
						menuYn: 0,
						useYn: 0,
					},
				},
				{
					btnType: 'save', // 저장
				},
			],
		};

		return gridBtn;
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		fetchGridData();
	}, [codeType]);

	return (
		<>
			<PopupMenuTitle name="인수 설정" func={titleFunc} />
			<AGrid>
				<GridTopBtn gridTitle={'인수 설정 목록'} gridBtn={getGridBtn()} totalCnt={124}></GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					{t('lbl.BTN_CANCEL')}
				</Button>
				<Button size={'middle'} type="primary">
					{t('lbl.BTN_CONFIRM')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default BatchParamSetPop;
