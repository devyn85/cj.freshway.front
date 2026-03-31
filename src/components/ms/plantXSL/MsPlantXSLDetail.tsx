/*
 ############################################################################
 # FiledataField	: MsPlantXSLDetail.tsx
 # Description		: 저장위치정보 상세
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.06.17
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form, Input } from 'antd';
//import { Form, Input } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// component
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import { InputNumber, InputText, LabelText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import TableTopBtn from '@/components/common/TableTopBtn';
import MsPlantXslFileUploadPopup from '@/components/ms/plantXSL/MsPlantXSLFileUploadPopup';

import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// api
import { apiGetAtchFileCnt, apiGetPlantXSLDtl, apiSavePlantXSLDtl } from '@/api/ms/apiMsPlantXSL';

// util
import { validateForm } from '@/util/FormUtil';
import { showAlert, showConfirm, showMessage } from '@/util/MessageUtil';

// hook

// type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// asset

import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import ScrollBox from '@/components/common/ScrollBox';
import Splitter from '@/components/common/Splitter';

interface MsPlantXSLDetailProps {
	close?: any;
	data: any;
	totalCnt: any;
	searchApi: any;
}

const MsPlantXSLDetail = forwardRef((props: MsPlantXSLDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const { close } = props;

	// grid Ref
	ref.gridRef = useRef();
	const [detailForm] = Form.useForm();
	const refModal = useRef(null);

	// 계약년도 옵션
	const [contractYearsOptions, setContractYearsOptions] = useState<any[]>([]);

	// 위치정보 serialkey
	const [serialkey, setSerialkey] = useState('');

	// 첨부파일 건수
	const [fileCnt, setFileCnt] = useState('');

	// 파일업로드 텍스트
	const [fileUploadText, setFileUploadText] = useState<string>(t('lbl.FILEUPLOAD')); // 파일업로드

	//마스터 그리드 생성시 필요한 변수들
	const gridId = uuidv4() + '_gridWrap';
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: '센터',
			width: '10%',
			visible: false,
		},
		{
			dataField: 'plant',
			headerText: '플랜트',
			width: '10%',
			visible: false,
		},
		{
			dataField: 'storageloc',
			headerText: '창고',
			width: '15%',
			dataType: 'code',
		},
		{
			dataField: 'storagelocname',
			headerText: '창고명',
			width: '45%',
		},
		// {
		// 	dataField: 'district',
		// 	headerText: '권역',
		// 	width: '10%',
		// },
		// {
		// 	dataField: 'area',
		// 	headerText: '지역',
		// 	width: '15%',
		// },
		{
			dataField: 'contractyn',
			headerText: '계약여부',
			width: '10%',
			dataType: 'code',
		},
		{
			dataField: 'contractenddate',
			headerText: '계약종료일',
			width: '15%',
			dataType: 'date',
		},
		{
			dataField: 'remainingdays',
			headerText: '잔여일수',
			width: '20%',
			dataType: 'numeric',
		},
		{
			dataField: 'stockamount',
			headerText: '재고금액',
			dataType: 'numeric',
			formatString: '#,##0',
		},
	];
	// AUIGrid 옵션
	const gridProps = {
		editable: false,
		showRowCheckColumn: false,
		clickable: true,
	};

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// DETAIL VIEW 상단 버튼 설정
	const setTableBtn = (): TableBtnPropsType => ({
		tGridRef: ref.gridRef,
		btnArr: [
			{
				btnType: 'pre', // 이전
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					// Form 변경 감지 체크
					if (detailForm.getFieldValue('rowStatus') === 'U') {
						showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
							// 그리드 이전 Row 선택 Function
							ref.gridRef.current.setPrevRowSelected();
						});
					} else {
						ref.gridRef.current.setPrevRowSelected();
					}
				},
			},
			{
				btnType: 'post', // 다음
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					// Form 변경 감지 체크
					if (detailForm.getFieldValue('rowStatus') === 'U') {
						showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
							// 다음 Row 선택 Function
							ref.gridRef.current.setNextRowSelected();
						});
					} else {
						ref.gridRef.current.setNextRowSelected();
					}
				},
			},
			{
				btnType: 'save',
				//	btnLabel: '저장',
				callBackFn: () => {
					/* 저장 로직 */
					saveDetailInfo();
				},
			},
		],
	});

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * 상세 조회
	 * @param params
	 */
	const searchDetailInfo = (params: any) => {
		if (!params?.plant) return;
		apiGetPlantXSLDtl(params).then(res => {
			if (!res.data) {
				showAlert('', '조회된 데이터가 없습니다.');
				return;
			}
			//FORM 데이터 세팅
			setContractYearsOptions(res.data?.contractyears || []);
			detailForm.resetFields();
			// form 변경 여부
			detailForm.setFieldsValue({
				...res.data,
				rowStatus: 'R',
				contractstartdate: res.data.contractstartdate ? dayjs(res.data.contractstartdate, 'YYYY-MM-DD') : null,
				contractenddate: res.data.contractenddate ? dayjs(res.data.contractenddate, 'YYYY-MM-DD') : null,
				contractYearCode:
					res.data.contractyears && res.data.contractyears.length > 0 ? res.data.contractyears[0].contractYearCode : '',
			});
			if (res.data.memo) {
				detailForm.setFieldValue('memoname', `[${res.data.memo}]${res.data.memoname}`);
				detailForm.setFieldValue('memo', res.data?.memo);
			}

			detailForm.setFieldValue('fileCnt', res.data['fileCnt']);
			if (res.data['fileCnt'] === 0 || res.data['fileCnt'] === '0') {
				setFileUploadText(t('lbl.FILEUPLOAD')); // 파일업로드
			} else {
				const fileText = String(res.data['fileCnt']) + '건';
				setFileUploadText(fileText);
			}
		});
	};

	/**
	 * 이동 여부 확인
	 * @param item
	 * @param toRow
	 * @param toColumn
	 */
	const onMoveRowHandler = async (toRow: number, toColumn: number) => {
		// 그리드 수정여부 체크
		const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009')); // 변경사항이 있습니다. 계속 진행하시겠습니까?
		if (isConfirm) {
			ref.gridRef?.current.setSelectionByIndex(toRow, toColumn);
		}
	};

	/**
	 * 그리드 이벤트 초기화
	 */
	const initEvent = () => {
		// selectionConstraint
		ref.gridRef?.current.bind('selectionConstraint', (event: any) => {
			if (ref.current.isChangeForm()) {
				onMoveRowHandler(event.toRowIndex, event.toColumnIndex);
				return false;
			}
		});

		ref.gridRef?.current.bind('selectionChange', async (event: any) => {
			if (event.primeCell?.item) {
				setSerialkey(event.primeCell.item.serialkey);
				searchDetailInfo(event.primeCell.item);
			}
		});
	};

	/**
	 * 저장
	 */
	const saveDetailInfo = () => {
		const isValid = validateForm(detailForm);
		if (!isValid) {
			return;
		}

		const formData = detailForm.getFieldsValue();

		if (formData.rowStatus === 'R') {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		// if (!formData?.plant) return; plant 제거 요청으로 삭제
		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			const params = {
				...formData,
				contractenddate: formData.contractenddate ? dayjs(formData.contractenddate).format('YYYYMMDD') : null,
				contractstartdate: formData.contractstartdate ? dayjs(formData.contractstartdate).format('YYYYMMDD') : null,
				// 다른 날짜 필드도 필요 시 추가 변환
			};

			apiSavePlantXSLDtl(params).then(res => {
				if (res.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'), // 저장되었습니다.
						modalType: 'info',
					});

					// 상세 조회
					searchDetailInfo(ref.gridRef?.current.getSelectedItems()[0].item);
				}
			});
		});
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		const chgKey = Object.keys(changedValues)[0];
		if (chgKey === 'contractYearCode' || chgKey === 'fileCnt') {
			return;
		}

		// 변경된 값이 있을 때만 처리
		if (Object.keys(changedValues).length > 0) {
			detailForm.setFieldValue('rowStatus', 'U');
		}
	};

	/**
	 * 셀 클릭 파일 업로드
	 * @param {object} item 파일 정보
	 * @returns {void}
	 */
	const onClickFileUploader = (item: any) => {
		// if (ref.current.isChangeForm()) {
		// 	// 그리드 수정여부 체크
		// 	const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009')); // 변경사항이 있습니다. 계속 진행하시겠습니까?
		// 	if (isConfirm) {
		// 		const serialkey = detailForm.getFieldValue('serialkey');
		// 		setSerialkey(serialkey);
		// 		refModal.current.handlerOpen();
		// 	}
		// } else {
		// 	const serialkey = detailForm.getFieldValue('serialkey');
		// 	setSerialkey(serialkey);
		// 	refModal.current.handlerOpen();
		// }

		const serialkey = detailForm.getFieldValue('serialkey');
		setSerialkey(serialkey);
		refModal.current.handlerOpen();
	};

	/**
	 * 팝업 close
	 * @param cnt
	 * @returns {void}
	 */
	const closeFilePopup = () => {
		const selectItems = ref.gridRef.current.getSelectedItems()[0];
		const param = {
			docId: selectItems.item['serialkey'],
		};

		// 첨부파일 count
		apiGetAtchFileCnt(param).then(res => {
			if (res.statusCode === 0) {
				detailForm.setFieldValue('fileCnt', res.data['fileCnt']);
				if (res.data['fileCnt'] === 0 || res.data['fileCnt'] === '0') {
					setFileUploadText(t('lbl.FILEUPLOAD')); // 파일업로드
				} else {
					const fileText = String(res.data['fileCnt']) + '건';
					setFileUploadText(fileText);
				}
				setFileCnt(res.data['fileCnt']);
			}
		});
	};

	/**
	 * 기본주소 change event
	 * @param event
	 */
	const handleAddress1Change = (event: any) => {
		const curAddress1 = event.target.value;
		const arrAddress1 = curAddress1.trim().split(' ');
		const curDistrict = arrAddress1[0] || '';
		const curAreat = arrAddress1[1] || '';

		detailForm.setFieldsValue({ district: curDistrict, area: curAreat });
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	useImperativeHandle(ref, () => ({
		resetDetail: () => {
			detailForm.resetFields();
			ref.gridRef.current.clearGridData();
		},
		isChangeForm: () => detailForm.getFieldValue('rowStatus') === 'U',
	}));
	// 최초 마운트시 초기화
	useEffect(() => {
		initEvent();
	}, []);
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			let selectRow = 0;
			if (commUtil.isNotEmpty(serialkey)) {
				selectRow = props.data.findIndex((item: any) => item.serialkey === serialkey);
			}

			if (selectRow < 0) {
				selectRow = 0;
			}

			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(selectRow, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn gridBtn={gridBtn} gridTitle="목록" totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} name={gridId} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<>
						<Form form={detailForm} onValuesChange={onValuesChange} onFieldsChange={onValuesChange}>
							<AGrid style={{ padding: '10px 0', height: 'auto', flex: 'none', marginBottom: 0 }}>
								<TableTopBtn tableBtn={setTableBtn()} />
							</AGrid>
							<ScrollBox>
								<div>
									<UiDetailViewArea>
										<UiDetailViewGroup className="grid-column-4">
											<Form.Item name="serialkey" hidden>
												<Input />
											</Form.Item>
											<Form.Item name="rowStatus" hidden>
												<Input />
											</Form.Item>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText name="dccode" label="물류센터" disabled allowClear={false} />
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText name="storageloc" label={t('lbl.ORGANIZE')} disabled allowClear={false} />
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText name="description" label={t('lbl.ORGANIZENAME')} disabled allowClear={false} />
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText
													name="vatno"
													label={t('lbl.VATNO_1')} // 사업자등록번호
													disabled
													allowClear={false}
												/>
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText name="zipcode" label="우편번호" />
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText name="address1" label="기본주소" onChange={handleAddress1Change} />
											</li>
											<li style={{ gridColumn: 'span 4' }}>
												<InputText name="address2" label="상세주소" />
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText name="phone1" label="전화번호1" />
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText name="phone2" label="전화번호2" />
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText name="fax" label="팩스번호1" />
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText name="email" label="email1" />
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText name="fax2" label="팩스번호2" />
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText name="email2" label="email2" />
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<CmPartnerSearch
													form={detailForm}
													selectionMode="singleRow"
													name="memoname"
													code="memo"
													value={detailForm.getFieldValue('memoname')}
													returnValueFormat="name"
												/>
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText name="district" label="권역" maxLength={6} disabled />
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText name="area" label="지역" maxLength={6} disabled />
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<DatePicker
													label={'계약시작'}
													name="contractstartdate"
													allowClear
													showNow={true}
													format="YYYY-MM-DD"
												/>
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<DatePicker
													label={'계약종료'}
													name="contractenddate"
													// onChange={onChange}
													allowClear
													showNow={true}
													format="YYYY-MM-DD"
												/>
											</li>
											<li>
												<InputText name="savecode" label="저장품목" />
											</li>
											<li>
												<SelectBox
													name="contractyn"
													label="계약여부"
													placeholder={'계약여부'}
													options={getCommonCodeList('YN2', t('lbl.SELECT'))}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
												/>
											</li>
											<li style={{ gridColumn: 'span 4' }}>
												<InputText name="remark" label="비고" />
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText name="siteid" label="사이트아이디" />
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText name="sitepw" label="사이트비번" />
											</li>
											<li style={{ gridColumn: 'span 4' }}>
												<InputText name="siteaddr" label="사이트주소" />
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<SelectBox
													name="contractchgntcyn"
													label="계약갱신알림"
													options={getCommonCodeList('YN2', t('lbl.SELECT'))}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
												/>
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText name="contractrmk" label="계약유의사항" />
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<InputText
													label="계약서"
													//name="fileCnt"
													onClick={onClickFileUploader}
													allowClear={false}
													value={fileUploadText}
													style={{ cursor: 'pointer', textAlign: 'center', borderRadius: '3px' }}
												/>
											</li>
											<li style={{ gridColumn: 'span 2' }}></li>
											<li style={{ gridColumn: 'span 2' }}>
												<LabelText
													label={t('lbl.ADDWHO')}
													name="addwho"
													value={detailForm.getFieldValue('addwho')}
													disabled
												/>
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<LabelText
													label={t('lbl.REGDATTM')}
													name="adddate"
													value={detailForm.getFieldValue('adddate')}
													disabled
												/>
											</li>
											<li style={{ gridColumn: ' span 2' }}>
												<LabelText
													label={t('lbl.EDITWHO')}
													name="editwho"
													value={detailForm.getFieldValue('editwho')}
													disabled
												/>
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<LabelText
													label={t('lbl.EDITDATE')}
													name="editdate"
													value={detailForm.getFieldValue('editdate')}
													disabled
												/>
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<SelectBox
													label="계약년도"
													name="contractYearCode"
													options={contractYearsOptions}
													fieldNames={{ label: 'contractYearName', value: 'contractYearCode' }}
													readOnly={true}
												></SelectBox>
											</li>
											<li style={{ gridColumn: 'span 2' }}>
												<SelectBox
													name="usebydateemailsendyn"
													label="소비기한이메일발송"
													placeholder={'소비기한이메일발송'}
													options={getCommonCodeList('YN2', t('lbl.SELECT'))}
													fieldNames={{ label: 'cdNm', value: 'comCd' }}
												/>
											</li>
											<li style={{ gridColumn: 'span 4' }}>
												<InputNumber name="usebydatefreert" label="소비기한잔여(%) (이하)" />
											</li>
										</UiDetailViewGroup>
									</UiDetailViewArea>
								</div>
							</ScrollBox>
						</Form>
					</>,
				]}
			/>

			{/* 저장위치 파일업로드 */}
			<CustomModal ref={refModal} width="700px">
				<MsPlantXslFileUploadPopup ref={refModal} close={closeFilePopup} serialkey={serialkey} />
			</CustomModal>
		</>
	);
});

export default MsPlantXSLDetail;
