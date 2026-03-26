/*
 ############################################################################
 # FiledataField	: MsExDCStatusDetail.tsx
 # Description		: 외부창고현황 관리 상세
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.06.17
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
//import { Button, Form, Input } from 'antd';
import { Form, Input } from 'antd';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

// component
import CustomModal from '@/components/common/custom/CustomModal';
import { InputText, LabelText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';
import MsExDCStatusFileUploadPopup from '@/components/ms/exDCStatus/MsExDCStatusFileUploadPopup';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// api
import { apiGetExDCStatusDtl } from '@/api/ms/apiMsExDCStatus';

// util
import { showAlert } from '@/util/MessageUtil';

// hook

// type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// asset
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';

interface MsExDCStatusProps {
	form?: any;
	data: any;
	totalCnt: any;
	callBackFn: any;
}

const MsExDCStatusDetail = forwardRef((props: MsExDCStatusProps, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// grid Ref
	ref.gridRef = useRef();
	ref.gridRef1 = useRef();
	const refModal = useRef(null);
	const [detailForm] = Form.useForm();

	// 위치정보 serialkey
	const [serialkey, setSerialkey] = useState('');

	// 파일업로드 텍스트
	const [fileUploadText, setFileUploadText] = useState<string>(String(t('lbl.FILEUPLOAD')));

	//마스터 그리드 생성시 필요한 변수들
	const gridId = uuidv4() + '_gridWrap';
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: '센터',
			width: '1%',
			visible: false,
		},
		{
			dataField: 'plant',
			headerText: '플랜트',
			width: '1%',
			visible: false,
		},
		{
			dataField: 'storageloc',
			headerText: '창고',
			width: '10%',
			dataType: 'code',
		},
		{
			dataField: 'storagelocname',
			headerText: '창고명',
			width: '30%',
		},
		{
			dataField: 'district',
			headerText: '권역',
			width: '10%',
		},
		{
			dataField: 'area',
			headerText: '지역',
			width: '15%',
		},
		{
			dataField: 'sku',
			headerText: '상품',
		},
		{
			dataField: 'startdate',
			visible: false,
		},
		{
			dataField: 'enddate',
			visible: false,
		},
		{
			dataField: 'organize',
			visible: false,
		},
	];
	// AUIGrid 옵션
	const gridProps = {
		editable: false,
		selectionMode: 'singleRow',
		showRowCheckColumn: false,
		clickable: true,
		copySingleCellOnRowMode: true,
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
				btnType: 'pre',
				btnLabel: '이전',
			},
			{
				btnType: 'post',
				btnLabel: '다음',
			},
		],
	});
	// 상품요율 그리드 컬럼 설정
	const gridId1 = uuidv4() + '_gridWrap';
	const gridCol1 = [
		{
			dataField: 'speccodenm',
			headerText: '상품분류',
		},
		{
			dataField: 'storagetypenm',
			headerText: '저장조건',
			width: '10%',
			dataType: 'code',
		},
		{
			dataField: 'baseuom',
			headerText: '단위',
			width: '10%',
			dataType: 'code',
		},
		{
			dataField: 'grpriceuppertranskg',
			headerText: '입고료',
			width: '20%',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'gipriceuppertranskg',
			headerText: '출고료',
			width: '20%',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'storagepriceuppertranskg',
			headerText: '창고료',
			width: '20%',
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
	];
	// 상품요율 AUIGrid 옵션
	const gridProps1 = {
		editable: false,
		selectionMode: 'singleRow',
		showRowCheckColumn: false,
		clickable: true,
		fillColumnSizeMode: true,
		height: 100,
		autoGridHeight: true,
	};
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
		const searchData = props.form.getFieldsValue();
		params = {
			...params,
			fromDt: searchData.searchDt[0].format('YYYYMMDD'),
			thruDt: searchData.searchDt[1].format('YYYYMMDD'),
			storagetype: searchData.storagetype,
		};

		apiGetExDCStatusDtl(params).then(res => {
			if (!res.data) {
				showAlert('', '조회된 데이터가 없습니다.');
				return;
			}
			//FORM 데이터 세팅
			// setContractYearsOptions(res.data?.contractyears || []);
			// form 변경 여부
			const memonameWithValue = res.data.memo ? `[${res.data.memo}] ${res.data.memoname || ''}` : res.data.memoname;

			detailForm.setFieldValue('rowStatus', 'I');
			detailForm.setFieldsValue({
				...res.data,
				contractstartdate: res.data.contractstartdate ? dayjs(res.data.contractstartdate, 'YYYY-MM-DD') : null,
				contractenddate: res.data.contractenddate ? dayjs(res.data.contractenddate, 'YYYY-MM-DD') : null,
				memoname: memonameWithValue,
				// contractYearCode:
				// 	res.data.contractyears && res.data.contractyears.length > 0 ? res.data.contractyears[0].contractYearCode : '',
			});
			ref.gridRef1.current.clearGridData();
			ref.gridRef1.current.setGridData(res.data.skuList || []);

			detailForm.setFieldValue('fileCnt', res.data['fileCnt']);
			const fileText = String(res.data['fileCnt']) + '건';
			setFileUploadText(fileText);
		});
	};

	/**
	 * 그리드 이벤트 초기화
	 */
	const initEvent = () => {
		ref.gridRef?.current.bind('selectionChange', (event: any) => {
			if (event.primeCell?.item) {
				searchDetailInfo(event.primeCell.item);
			}
		});
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
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
	const onClickFileUploader = () => {
		const serialkey = detailForm.getFieldValue('serialkey');
		setSerialkey(serialkey);
		refModal.current.handlerOpen();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	// 부모 컴포넌트로 전달할 함수
	useImperativeHandle(ref, () => ({
		resetDetail: () => {
			detailForm.resetFields();
			ref.gridRef.current.clearGridData();
			ref.gridRef1.current.clearGridData();
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
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
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
		ref.gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn} gridTitle="목록" totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} name={gridId} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
					</>,
					<>
						<Form form={detailForm} onValuesChange={onValuesChange}>
							<AGrid className="form-inner">
								<TableTopBtn tableBtn={setTableBtn()} className="fix-title" />
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
											<InputText name="address1" label="기본주소" disabled />
										</li>
										<li style={{ gridColumn: 'span 2' }}>
											<InputText name="zipcode" label="우편번호" disabled allowClear={false} />
										</li>
										<li style={{ gridColumn: 'span 4' }}>
											<InputText name="address2" label="상세주소" disabled />
										</li>
										<li style={{ gridColumn: 'span 2' }}>
											<InputText name="phone1" label="전화번호1" disabled />
										</li>
										<li style={{ gridColumn: 'span 2' }}>
											<InputText name="phone2" label="전화번호2" disabled />
										</li>
										<li style={{ gridColumn: 'span 2' }}>
											<InputText name="fax" label="팩스번호1" disabled />
										</li>
										<li style={{ gridColumn: 'span 2' }}>
											<InputText name="email" label="email1" disabled />
										</li>
										<li style={{ gridColumn: 'span 2' }}>
											<InputText name="fax2" label="팩스번호2" disabled />
										</li>
										<li style={{ gridColumn: 'span 2' }}>
											<InputText name="email2" label="email2" disabled />
										</li>
										<li style={{ gridColumn: 'span 2' }}>
											{/* <CmPartnerSearch
										form={detailForm}
										selectionMode="singleRow"
										name="memoname"
										code="memo"
										returnValueFormat="name"
									/> */}
											<InputText name="memoname" label={t('lbl.VENDORCODENAME')} disabled />
										</li>
										<li style={{ gridColumn: 'span 2' }}>
											<InputText name="district" label="권역" disabled />
										</li>
										<li style={{ gridColumn: 'span 2' }}>
											<InputText name="area" label="지역" disabled />
										</li>
										<li style={{ gridColumn: 'span 2' }}>
											<InputText name="savecode" label="저장품목" disabled />
										</li>
										<li style={{ gridColumn: 'span 2' }}>
											<DatePicker
												label={'계약시작'}
												name="contractstartdate"
												allowClear
												showNow={true}
												format="YYYY-MM-DD"
												disabled
												//rules={[{ required: true, validateTrigger: 'none' }]}
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
												disabled
												//rules={[{ required: true, validateTrigger: 'none' }]}
											/>
										</li>
										<li style={{ gridColumn: 'span 2' }}>
											<SelectBox
												name="contractyn"
												label="계약여부"
												placeholder={'계약여부'}
												options={getCommonCodeList('YN2', t('lbl.SELECT'))}
												fieldNames={{ label: 'cdNm', value: 'comCd' }}
												disabled
											/>
										</li>
										<li style={{ gridColumn: 'span 2' }}>
											<InputText name="remark" label="비고" disabled />
										</li>
										<li style={{ gridColumn: 'span 2' }}>
											<InputText name="siteid" label="사이트아이디" disabled allowClear={false} />
										</li>
										<li style={{ gridColumn: 'span 2' }}>
											<InputText name="sitepw" label="사이트비번" disabled allowClear={false} />
										</li>
										<li style={{ gridColumn: 'span 4' }}>
											<InputText name="siteaddr" label="사이트주소" disabled allowClear={false} />
										</li>
										<li>
											<SelectBox
												name="contractchgntcyn"
												label="계약갱신알림"
												options={getCommonCodeList('YN2', t('lbl.SELECT'))}
												fieldNames={{ label: 'cdNm', value: 'comCd' }}
												disabled
											/>
										</li>
										<li style={{ gridColumn: '2 / span 3' }}>
											<InputText name="contractrmk" label="계약유의사항" disabled />
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
										{/* 20251219 보이지지 않기로 함
							<li style={{ gridColumn: ' span 2' }}>
								<SelectBox
									label="계약년도"
									name="contractYearCode"
									options={contractYearsOptions}
									fieldNames={{ label: 'contractYearName', value: 'contractYearCode' }}
									readOnly={true}
								></SelectBox>
							</li> */}
										<li style={{ gridColumn: 'span 2' }}>
											<LabelText name="usebydateemailsendyn" label="소비기한이메일발송" disabled />
										</li>
										<li style={{ gridColumn: 'span 2' }}>
											<LabelText name="usebydatefreert" label="소비기한잔여율(이하)" disabled />
										</li>
									</UiDetailViewGroup>
								</UiDetailViewArea>
							</AGrid>
							<GridAutoHeight>
								<AUIGrid ref={ref.gridRef1} name={gridId1} columnLayout={gridCol1} gridProps={gridProps1} />
							</GridAutoHeight>
						</Form>
					</>,
				]}
			/>

			<CustomModal ref={refModal} width="700px">
				<MsExDCStatusFileUploadPopup ref={refModal} serialkey={serialkey} />
			</CustomModal>
		</>
	);
});

export default MsExDCStatusDetail;
