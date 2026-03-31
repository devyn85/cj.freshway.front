/*
 ############################################################################
 # FiledataField	: StInquiryMoveDetail1.tsx
 # Description		: 재고 > 재고조사 > 재고조사결과처리(Detail)
 # Author			: sss
 # Since			: 25.08.04
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { SelectBox } from '@/components/common/custom/form';
import InputText from '@/components/common/custom/form/InputText';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';
import { Form } from 'antd';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	getFooterLayout,
	getGridColumns,
	getGridProps,
	isDisabled,
	isDisabledToLot,
	saveMasterListImp01,
} from './StInquiryMoveDetailGridColumns';

const StInquiryMoveDetail1 = forwardRef((props: any, ref: any) => {
	const { t } = useTranslation();
	const { form, activeKeyMaster } = props; // Antd Form
	const [loopTrParams, setLoopTrParams] = useState({});
	const [formRef] = Form.useForm();
	ref.gridRef = useRef();
	const refLoopModal = useRef(null);

	/**
	 * 저장 - 소비기한
	 */
	const saveMasterList = async () => {
		// 소비기한
		await saveMasterListImp01(
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
	const gridCol = getGridColumns(t, '1', ref.gridRef);

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

		if (props.searchMasterList && typeof props.searchMasterList === 'function') {
			props.searchMasterList();
		} else {
		}
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
			}
		}
	}, [props.data, form]);

	useEffect(() => {
		// form 초기값 설정
		formRef.setFieldsValue({
			reasoncode: '1',
			loc: 'ADJUST',
		});

		const gridRef = ref.gridRef.current;
		if (gridRef) {
			// 셀 편집 시작 이벤트 바인딩
			gridRef?.unbind('cellEditBegin'); // [필수]기존 이벤트 핸들러 제거 - 안하면 재 랜더링 시 이벤트가 중복으로 발행함
			gridRef?.bind('cellEditBegin', function (event: any) {
				// 변경소비기한이고 컬럼이고 isDisabledToLot이 true면 입력 불가
				if (event?.dataField === 'toLot' && isDisabledToLot(event?.item)) {
					return false;
				}

				// 그 외에는 isDisabled 함수로 편집 가능 여부 판단
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
			<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.DETAIL_VIEW')} totalCnt={props.totalCnt}>
					{/* START.일괄적용영역 */}
					<Form form={formRef} layout="inline">
						<div className="sect">
							<li>
								{/* 소비기한 사유 */}
								<SelectBox
									name="reasoncode"
									label={t('소비기한 사유')} /*소비기한 사유*/
									options={getCommonCodeList('REASONCODE_CL', t('lbl.SELECT'))}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									required
									rules={[{ required: true, validateTrigger: 'none' }]}
									className="bg-white"
									style={{ width: '200px' }}
								/>
							</li>
							<li>
								<InputText
									name="reasonmsg"
									className="bg-white"
									required
									placeholder={t('msg.placeholder1', [t('lbl.REASONMSG')])}
									rules={[{ required: true, message: t('msg.placeholder1', [t('lbl.REASONMSG')]) }]} /*사유메세지*/
								/>
							</li>
							<li>
								{/* 재고이동사유 */}
								<SelectBox
									name="reasoncodeMove"
									label={t('재고이동사유')} /*재고이동사유*/
									options={getCommonCodeList('REASONCODE_MV', t('lbl.SELECT'))}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									defaultValue={t('lbl.SELECT')}
									style={{ width: '180px' }}
									className="bg-white"
								/>
							</li>
							<li>
								{/* 로케이션 */}
								<InputText label={t('lbl.LOC')} name="loc" className="bg-white" maxLength={100} />
							</li>
						</div>
					</Form>
				</GridTopBtn>
			</AGrid>
			<GridAutoHeight>
				{/* 상품 LIST 그리드 */}
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</GridAutoHeight>
			<CustomModal ref={refLoopModal} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEventLoop} />
			</CustomModal>
		</>
	);
});
export default StInquiryMoveDetail1;
