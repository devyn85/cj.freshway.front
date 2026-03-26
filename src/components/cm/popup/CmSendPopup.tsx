// lib
import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { showAlert, showConfirm } from '@/util/MessageUtil';

// store
import { useAppSelector } from '@/store/core/coreHook';

// api
import { apiGetCmCodeDetailList, apiPostSaveCmDtlCode } from '@/api/cm/apiCmCode';

const CmSendPopup = (props: any) => {
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
	const [totalCount, setTotalCount] = useState(0);

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

	// 버튼 설정
	const gridBtn = {
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: 'plus' as const,
				initValues: {
					detailCode: '',
					detailCodeName: '',
					useYn: 'Y',
				},
			},
			{
				btnType: 'save' as const,
				callBackFn: () => onSave(),
			},
		],
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// 데이터 조회
	const fetchGridData = () => {
		apiGetCmCodeDetailList({ storerkey, codelist: codeType }).then(res => {
			setTotalCount(res.data?.length ?? 0);
			gridRef.current?.setGridData(res.data ?? []);
		});
	};

	// 저장
	const onSave = () => {
		const changed = gridRef.current.getChangedData({ validationYn: false });
		if (!changed || changed.length < 1) {
			showAlert(null, '변경사항이 없습니다.');
			return;
		}
		if (!gridRef.current.validateRequiredGridData()) return;
		showConfirm(null, '저장하시겠습니까?', () => {
			const processedData = changed.map((row: any) => ({
				...row,
				storerkey,
				codelist: codeType,
				useYn: row.useYn !== 'Y' ? 'N' : 'Y',
				status: '90', // 00(등록요청) 90(등록완료)
			}));

			apiPostSaveCmDtlCode({
				codelist: codeType,
				codeDtlList: processedData,
			}).then(() => {
				fetchGridData();
			});
		});
	};

	// 타이틀 func
	const titleFunc = {
		refresh: fetchGridData,
		searchYn: fetchGridData,
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
			<PopupMenuTitle name="수동 JOB 실행" func={titleFunc} />
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle="emailSendJob" totalCnt={totalCount} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			{/* 20250714 추가 */}
			<div className="title-area-h3 ta-c">BATCH JOB 즉시 실행 진행 하겠습니까?</div>
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

export default CmSendPopup;
