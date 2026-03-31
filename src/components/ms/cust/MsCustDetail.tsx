/*
 ############################################################################
 # FiledataField	: MsCustDetail.tsx
 # Description		: 기준정보 > 거래처기준정보 > 고객정보
 # Author			: JeongHyeongCheol
 # Since			: 25.06.09
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Components
import { InputText, SelectBox, TimeRangeInput } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form, Input } from 'antd';
import dayjs from 'dayjs';

// store
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';

// API Call Function
import { apiGetMaster, apiPostSaveMaster } from '@/api/ms/apiMsCust';

// util
import { showConfirm, showMessage } from '@/util/MessageUtil';

// types
import GridAutoHeight from '@/components/common/GridAutoHeight';
import ScrollBox from '@/components/common/ScrollBox';
import Splitter from '@/components/common/Splitter';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';
import styled from 'styled-components';
interface MsCustDetailProps {
	form?: any;
	gridData?: Array<object>;
	setCurrentPage?: any;
	totalCount?: number;
	dlvDcList?: Array<object>;
	locationParam?: any;
	selectedRow?: any;
	setSelectedRow?: any;
}
const MsCustDetail = forwardRef((props: MsCustDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { form, setCurrentPage, totalCount, gridData, dlvDcList, locationParam, selectedRow, setSelectedRow } = props;
	const { t } = useTranslation();
	const [labelstrategy, setLabelstrategy] = useState('');
	const [currentTime, setCurrentTime] = useState(dayjs().format('HHmmss'));
	const tableRef = useRef(null);
	const [formDisabled, setFormDisabled] = useState(true);

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================
	// 거래처 유형명
	const custtypedescrLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CUSTTYPE', value)?.cdNm;
	};
	// 거래처 유형명
	const custgroupLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CUSTOMER-CUSTTYPE', value)?.cdNm;
	};
	// 영업조직
	const saleorganizeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('SALEORGANIZE', value)?.cdNm;
	};
	// 사업장
	const saledepartmentLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('SALEDEPARTMENT', value)?.cdNm;
	};
	// 영업그룹
	const salegroupLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('SALEGROUP', value)?.cdNm;
	};
	// 기본운송장유형명
	const invoicetypeDescLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('INVOICETYPE', value)?.cdNm;
	};
	// 마감유형
	const custorderclosetypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CUSTORDERCLOSETYPE', value)?.cdNm;
	};
	// 배송그룹
	const courierLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('COURIER', value)?.cdNm;
	};
	// 2차점 라벨출력 옵션
	const labelstrategyLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('LABELSTRATEGY_CUST', value)?.cdNm;
	};
	// 상태명
	const statusnmLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('STATUS_CUST', value)?.cdNm;
	};
	// 거래처전략5(납품서출력옵션)
	const custstrategy5LabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CUSTSTRATEGY5', value)?.cdNm;
	};

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'custtype',
			labelFunction: custtypedescrLabelFunc,
			headerText: t('lbl.TYPE'),
			dataType: 'code',
		},
		{
			dataField: 'custkey',
			headerText: t('lbl.CUSTKEY_WD'),
			filter: {
				showIcon: true,
			},
			dataType: 'code',
		},
		{
			dataField: 'description',
			headerText: t('lbl.CUSTNAME_WD'),
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'custgroup',
			labelFunction: custgroupLabelFunc,
			headerText: '고객분류',
		},
		{
			dataField: 'other04',
			labelFunction: saleorganizeLabelFunc,
			headerText: t('lbl.SALEGROUP'),
		},
		{
			dataField: 'saledepartment',
			labelFunction: saledepartmentLabelFunc,
			headerText: t('lbl.SALEDEPARTMENT'),
		},
		{
			dataField: 'salegroup',
			labelFunction: salegroupLabelFunc,
			headerText: t('lbl.CUSTGROUP'),
		},
		{
			dataField: 'vatno',
			headerText: t('lbl.VATNO_1'),
		},
		{
			dataField: 'vataddress1',
			headerText: t('lbl.VATADDRESS1'),
		},
		{
			dataField: 'dlvDccode',
			headerText: t('lbl.WD_DCCODE'),
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'dlvDcname',
			headerText: t('lbl.WD_CENTER'),
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'statusnm',
			headerText: '상태명',
		},
		{
			dataField: 'invoicetype',
			labelFunction: invoicetypeDescLabelFunc,
			headerText: t('lbl.INVOICETYPE'),
		},
		{
			dataField: 'storercustkey',
			headerText: t('lbl.STORERCUSTKEY_FU'),
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'custstrategy4',
			labelFunction: custorderclosetypeLabelFunc,
			headerText: t('lbl.CUSTORDERCLOSETYPE'),
		},
		{
			dataField: 'courier',
			headerText: t('lbl.COURIER'),
			labelFunction: courierLabelFunc,
		},
		{
			dataField: 'labelstrategy',
			labelFunction: labelstrategyLabelFunc,
			headerText: '라벨출력여부',
		},
		{
			dataField: 'startdate',
			headerText: t('lbl.STARTDATE'),
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
		},
		{
			dataField: 'enddate',
			headerText: t('lbl.ENDDATE'),
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
		},
		{
			dataField: 'status',
			labelFunction: statusnmLabelFunc,
			headerText: t('lbl.STATUS'),
		},
		{
			dataField: 'custstrategy5',
			labelFunction: custstrategy5LabelFunc,
			headerText: t('lbl.CUSTSTRATEGY5'),
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
		},

		{
			dataField: 'adddate',
			headerText: t('lbl.CREATEDATE'),
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
		},
		{
			dataField: 'editwho',
			headerText: t('lbl.EDITWHO'),
			visible: false,
		},
		{
			dataField: 'updNm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager', // dataType을 'manager'로 설정
			managerDataField: 'editwho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
		},

		{
			dataField: 'editdate',
			headerText: t('lbl.MODIFYDATE'),
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
		},
	];
	// 그리드 속성
	const gridProps = {
		editable: false,
		enableFilter: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 상세정보 호출
	 * @param {any} params 조회 데이터
	 * @returns {void}
	 */
	const searchMaster = (params: any) => {
		apiGetMaster(params).then(res => {
			form.resetFields();
			form.setFieldsValue({
				...res.data,
				districtcodeNm: res.data?.districtcode ? getCommonCodebyCd('T005S', res.data?.districtcode)?.cdNm : null,
				custstrategy4Nm: res.data?.custstrategy4
					? getCommonCodebyCd('CUSTORDERCLOSETYPE', res.data?.custstrategy4)?.cdNm
					: null,
				rowStatus: 'R',
			});
			setLabelstrategy(res.data?.labelstrategy);
			setFormDisabled(false);
		});
	};

	/**
	 * 상세정보 수정사항 저장
	 * @returns {void}
	 */
	const saveMaster = () => {
		// 변경 데이터 확인
		if (form.getFieldValue('rowStatus') !== 'U') {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		const params = form.getFieldsValue(true);
		params.avc_COMMAND = 'CONVDLVCUSTKEY';
		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			apiPostSaveMaster(params).then(() => {
				gridRef.current.setSelectedRowValue(params);
				form.setFieldValue('rowStatus', 'R');
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
				});
			});
		});
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const setGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
		};

		return gridBtn;
	};

	/**
	 * 상세 표 버튼 설정
	 * @returns {TableBtnPropsType} 표 버튼 설정 객체
	 */
	const setTableBtn = () => {
		const tableBtn: TableBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'pre', // 이전
					isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
					callBackFn: () => {
						// TO-DO : 각자 업무화면에서 Form 변경 감지 체크
						if (form.getFieldValue('rowStatus') === 'U') {
							showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
								// 그리드 이전 Row 선택 Function
								gridRef.current.setPrevRowSelected();
							});
						} else {
							gridRef.current.setPrevRowSelected();
						}
					},
				},
				{
					btnType: 'post', // 다음
					isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
					callBackFn: () => {
						// TO-DO : 각자 업무화면에서 Form 변경 감지 체크
						if (form.getFieldValue('rowStatus') === 'U') {
							showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
								// 그리드 다음 Row 선택 Function
								gridRef.current.setNextRowSelected();
							});
						} else {
							gridRef.current.setNextRowSelected();
						}
					},
				},
				// {
				// 	btnType: 'save', // 저장
				// 	callBackFn: saveMaster,
				// },
			],
		};

		return tableBtn;
	};

	/**
	 * 그리드 이벤트 설정
	 */
	let prevRowIndex: any = null;
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 선택전에 실행
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('selectionConstraint', function (event: any) {
			const { toRowIndex } = event;
			if (form.getFieldValue('rowStatus') === 'U') {
				// selectionConstraint에서는 즉시 false를 반환하여 선택을 일단 막음
				// 그 후 별도의 함수에서 confirm을 띄우고 수동으로 선택 처리
				handleBlockedSelection(toRowIndex);
				return false;
			}
		});

		// selectionConstraint에서 호출될 함수
		const handleBlockedSelection = (rowIndex: any) => {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				gridRef?.current.setSelectionByIndex(rowIndex);
			});
		};

		/**
		 * 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('selectionChange', (event: any) => {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell?.item?._$uid === prevRowIndex) return;
			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell.item?._$uid;
			const primeCell = event.primeCell;
			setSelectedRow(primeCell.item);
		});
	};

	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			setCurrentPage((currentPageScr: any) => currentPageScr + 1);
		},
		totalCount,
	});

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		const currentTimeTmp = dayjs().format('HHmmss');
		if (
			(changedValues?.labelstrategy || changedValues?.labelstrategy === null) &&
			!(currentTimeTmp > '010000' && currentTimeTmp < '100000')
		) {
			showMessage({
				content: '01시부터 10시까지만 수정 가능합니다.',
				modalType: 'info',
			});
			form.setFieldValue('labelstrategy', labelstrategy);
			return;
		}
		if (Object.keys(changedValues).length > 0) {
			// 변경된 값이 있을 때만 처리
			form.setFieldValue('rowStatus', 'U');
		} else {
			form.setFieldValue('rowStatus', '');
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();

		// AUI그리드 내 오른쪽 마우스 클릭시 노출되는 Context Menu가 아래 로직 때문에 닫혀버림 (from. JGS)
		// 시간 체크는 해당 로직에서 바로 체크하게 수정
		// // 1초마다 현재 시간을 업데이트하는 타이머 설정
		// const timer = setInterval(() => {
		// 	setCurrentTime(dayjs().format('HHmmss'));
		// }, 1000); // 1초마다 업데이트

		// // 컴포넌트 언마운트 시 타이머 정리
		// return () => clearInterval(timer);
	}, []);

	// 그리드 다음 페이지 Data 조회되면 그리드에 추가
	useEffect(() => {
		if (gridData.length > 0) {
			gridRef.current.appendData(gridData);
			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList = gridRef.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef.current.setColumnSizeList(colSizeList);
		}
	}, [gridData]);

	// 바로가기로 접근시 바로 상세조회
	useEffect(() => {
		if (locationParam.custkey) {
			searchMaster(locationParam);
		}
	}, [locationParam]);

	useEffect(() => {
		if (selectedRow) {
			searchMaster(selectedRow);
		}
	}, [selectedRow]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
		tableRef?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<Splitter
			onResizing={resizeAllGrids}
			onResizeEnd={resizeAllGrids}
			items={[
				<>
					<AGrid dataProps={'row-single'} style={{ padding: '10px 0', marginBottom: 0, flex: 'none', height: 'auto' }}>
						<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={setGridBtn()} totalCnt={totalCount} />
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
					</GridAutoHeight>
				</>,
				<>
					<CustomForm form={form} onValuesChange={onValuesChange} disabled={true}>
						<AGrid style={{ padding: '10px 0', marginBottom: 0, flex: 'none', height: 'auto' }}>
							{/*상세정보*/}
							<TableTopBtn tableTitle={t('lbl.DETAIL')} tableBtn={setTableBtn()} disabled={formDisabled} />
						</AGrid>
						<ScrollBox>
							<div>
								<UiDetailViewGroup className="grid-column-2" ref={tableRef}>
									<Form.Item name="rowStatus" hidden>
										<Input />
									</Form.Item>
									<li>
										<InputText label={t('lbl.CUSTKEY_WD')} name="custkey" />
									</li>
									<li>
										<InputText label={t('lbl.CUSTNAME_WD')} name="description" />
									</li>
									<li>
										<SelectBox
											label={t('lbl.SALEGROUP')}
											name="other04"
											options={getCommonCodeList('SALEORGANIZE')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
									<li>
										<SelectBox
											label={t('lbl.CUSTGROUP')}
											name="salegroup"
											options={getCommonCodeList('SALEGROUP')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
									<li>
										<SelectBox
											label={'고객분류'}
											name="custgroup"
											options={getCommonCodeList('CUSTOMER-CUSTTYPE')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
									<li>
										<SelectBox
											label={'라벨출력여부'}
											name="labelstrategy"
											options={getCommonCodeList('LABELSTRATEGY_CUST')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
									<li>
										<InputText label={t('lbl.STARTDATE')} name="startdate" />
									</li>
									<li>
										<InputText label={t('lbl.ENDDATE')} name="enddate" />
									</li>
									<li>
										<SelectBox
											label={t('lbl.DLV_DCCODE')}
											name="dlvDccode"
											options={dlvDcList}
											fieldNames={{ label: 'basedescr', value: 'basecode' }}
										/>
									</li>
									<li>
										<SelectBox
											label={t('lbl.SALEDEPARTMENT')}
											name="saledepartment"
											options={getCommonCodeList('SALEDEPARTMENT')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
									<li>
										<SelectBox
											label={t('lbl.COURIER')}
											name="courier"
											options={getCommonCodeList('COURIER')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
									<li>
										<SelectBox
											label={t('lbl.INVOICETYPE')}
											name="invoicetype"
											options={getCommonCodeList('INVOICETYPE')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
									<li>
										<InputText label={'거래처마감유형'} name="custstrategy4Nm" />
									</li>
									<li>
										<SelectBox
											label={t('lbl.INVOICETYPE_BT')}
											name="invoicetypeBt"
											options={getCommonCodeList('INVOICETYPE_BT')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
									<li>
										<TimeRangeInput
											label={'OTD(배송요구시간)'}
											fromName="reqdlvtime1From"
											toName="reqdlvtime1To"
											fromPlaceholder="HH:MM"
											toPlaceholder="HH:MM"
											fromMaxLength={5}
											toMaxLength={5}
										/>
									</li>
									<li>
										<SelectBox
											label={t('lbl.FACE_TO_FACE_INSPECTION_YN ')}
											name="inspecttype"
											options={getCommonCodeList('YN')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
								</UiDetailViewGroup>
								<UiDetailViewGroup className="grid-column-2" ref={tableRef}>
									<li>
										<InputText label={'지번주소'} name="address1" />
									</li>
									<li>
										<InputText label={t('lbl.BASE_DISTRICT')} name="districtcodeNm" />
									</li>
									<li>
										<InputText label={'지번주소2'} name="address2" />
									</li>
									<li>
										<InputText label={t('lbl.ZIPCODE')} name="zipcode" />
									</li>
									<li>
										<InputText label={'도로명주소'} name="address3" />
									</li>
									<li>
										<InputText label={t('lbl.PHONE')} name="phone1" />
									</li>
									<li>
										<InputText label={'도로명주소2'} name="address4" />
									</li>
									<li>
										<InputText label={t('lbl.FAX')} name="fax" />
									</li>
									<li>
										<SelectBox
											label={t('lbl.CUSTSTRATEGY5')}
											name="custstrategy5"
											options={getCommonCodeList('CUSTSTRATEGY5')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
											// disabled={formDisabled}
											// required
										/>
									</li>
								</UiDetailViewGroup>
								<UiDetailViewGroup className="grid-column-2" ref={tableRef}>
									<li>
										<InputText label={t('lbl.VATNO_1')} name="vatno" />
									</li>
									<li>
										<InputText label={'관리사원명1'} name="empname1" />
									</li>
									<li>
										<InputText label={t('lbl.VATOWNER')} name="vatowner" />
									</li>
									<li>
										<InputText label={'관리사원명2'} name="empname2" />
									</li>
									<li>
										<InputText label={t('lbl.VATTYPE')} name="vattype" />
									</li>
									<li>
										<InputText label={'MA'} name="ma" />
									</li>
									<li>
										<InputText label={t('lbl.VATCATEGORY')} name="vatcategory" />
									</li>
									<li>
										<SelectBox
											label={'고객삭제여부'}
											name="delYn"
											options={getCommonCodeList('CUST_DEL_YN')}
											fieldNames={{ label: 'cdNm', value: 'comCd' }}
										/>
									</li>
									<li>
										<InputText label={t('lbl.VATADDRESS1')} name="vataddress1" />
									</li>
									<li>
										<InputText label={t('lbl.VATADDRESS2')} name="vataddress2" />
									</li>
									<li>
										<InputText label={'최초 등록 일자'} name="adddate" />
									</li>
									<li>
										<InputText label={'최초 등록자'} name="addwho" />
									</li>
									<li>
										<InputText label={'최종 변경 일자'} name="editdate" />
									</li>
									<li>
										<InputText label={'최종 변경자'} name="editwho" />
									</li>
								</UiDetailViewGroup>
							</div>
						</ScrollBox>
					</CustomForm>
				</>,
			]}
		/>
	);
});

export default MsCustDetail;

const CustomForm = styled(Form)`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
`;
