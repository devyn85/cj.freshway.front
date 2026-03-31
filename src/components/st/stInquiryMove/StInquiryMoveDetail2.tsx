/*
 ############################################################################
 # FiledataField	: StInquiryMoveDetail2.tsx
 # Description		: 재고 > 재고조사 > 재고조사결과처리(Detail)
 # Author			: sss
 # Since			: 25.08.04
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Grid Columns
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { SelectBox } from '@/components/common/custom/form';
import InputText from '@/components/common/custom/form/InputText';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
import {
	getFooterLayout,
	getGridColumns,
	getGridProps,
	isDisabled,
	saveMasterListImp02,
} from './StInquiryMoveDetailGridColumns';
// Redux

// API Call Function

const StInquiryMoveDetail2 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, activeKeyMaster } = props; // Antd Form
	const [loopTrParams, setLoopTrParams] = useState({});
	const [formRef] = Form.useForm();

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	const refLoopModal = useRef(null);
	const masterKey = useRef<string | null>(null); // 마스터키

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 저장
	 */
	const saveMasterList = async () => {
		// 저장 후 재조회 시 선택된 KEY 기준으로 그리드 포커스 이동(1/2)
		const selectedRow = ref.gridRef.current?.getSelectedRows?.();
		if (selectedRow && selectedRow[0]?.inquiryName) {
			masterKey.current = selectedRow[0].inquiryName + '';
		}

		await saveMasterListImp02(
			ref,
			ref.gridRef,
			t,
			form,
			formRef,
			props,
			activeKeyMaster,
			setLoopTrParams,
			refLoopModal,
		);
		saveMasterListCallBack();
	};

	const saveMasterListCallBack = () => {
		// 저장 완료 후 처리할 로직
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol = getGridColumns(t, '2', ref.gridRef);

	// 그리드 Props
	const gridProps = getGridProps();

	// FooterLayout Props
	const footerLayout = getFooterLayout(t);

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
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
	const closeEventLoop = () => {
		refLoopModal.current.handlerClose();

		props.searchMasterList();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.gridRef.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);

				// START.저장 후 재조회 시 선택된 KEY 기준으로 그리드 포커스 이동(2/2)

				let row = 0;
				if (masterKey.current) {
					const foundRow = props.data.findIndex((item: any) => item.inquiryName + '' === masterKey.current);

					if (foundRow >= 0) row = foundRow;
				}

				gridRef?.setSelectionByIndex(row, 0);
				masterKey.current = '';
				// END.저장 후 재조회 시 선택된 KEY 기준으로 그리드 포커스 이동(2/2)
			}
		}
	}, [props.data]);

	useEffect(() => {
		// form 초기값 설정
		formRef.setFieldsValue({
			reasoncode: '1',
		});

		const gridRef = ref.gridRef.current;
		if (gridRef) {
			// 셀 편집 시작 이벤트 바인딩
			gridRef?.bind('cellEditBegin', function (event: any) {
				if (!isDisabled(event?.item)) {
					return true;
				} else {
					return false;
				}
			});
		}
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.DETAIL_VIEW')} totalCnt={props.totalCnt}>
					{/* START.일괄적용영역 */}
					<Form form={formRef} layout="inline">
						<div className="sect">
							<li>
								{/* 이동사유 */}
								<SelectBox
									name="reasoncode"
									label={t('lbl.REASONCODE')}
									options={getCommonCodeList('REASONCODE_MV', t('lbl.SELECT'))}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									defaultValue={t('lbl.SELECT')}
									required
									rules={[{ required: true, message: t('msg.placeholder1', [t('lbl.REASONCODE')]) }]}
									style={{ width: '180px' }}
									className="bg-white"
								/>
							</li>
							<li>
								{/* 로케이션 */}
								<InputText
									label={t('lbl.LOC')}
									name="loc"
									className="bg-white"
									required
									rules={[{ required: true, message: t('msg.placeholder1', [t('lbl.LOC')]) }]}
									maxLength={100}
								/>
							</li>
						</div>
					</Form>
				</GridTopBtn>
			</AGrid>
			{/* 상품 LIST 그리드 */}
			<GridAutoHeight>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</GridAutoHeight>
			<CustomModal ref={refLoopModal} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEventLoop} />
			</CustomModal>
		</>
	);
});
export default StInquiryMoveDetail2;
