/*
############################################################################
# FiledataField : CmPurchaseCustPopup.tsx
# Description   : 사용자코드설정팝업
# Author        : 
# Since         : 26.01.31
############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form, Tabs } from 'antd';

// component
import { InputText, SearchForm, SelectBox } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// store

// api
import { apiGetCmCodeDetailList } from '@/api/cm/apiCmCode';
import { apiPostSaveCmDtlCode } from '@/api/ms/apiMsPurchaseCust';
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import CustomModal from '@/components/common/custom/CustomModal';
import { useAppSelector } from '@/store/core/coreHook';
import TabPane from 'antd/es/tabs/TabPane';

interface PropsType {
	callBack?: () => void;
	close: () => void;
}

const CmPurchaseCustPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const storerkey = useAppSelector(state => state.global.globalVariable.gStorerkey); // 사용자 정보
	const { callBack, close } = props;
	const gridRef = useRef<any>();
	const gridRef2 = useRef<any>();
	const gridRef3 = useRef<any>();
	const refModal = useRef(null);
	const refModal2 = useRef(null);
	const [searchForm] = Form.useForm();
	const [totalCount, setTotalCount] = useState(0);
	const [totalCount2, setTotalCount2] = useState(0);
	const [totalCount3, setTotalCount3] = useState(0);
	const [codelist, setCodelist] = useState('BUYERKEY');

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClickDetail1 = (key: string, e: any) => {
		setCodelist(key);

		if (key === 'BUYERKEY') {
			gridRef.current?.resize('100%', '100%');
		} else if (key === 'KX_CONFIRM_AUTO_SKU_LIST') {
			gridRef2.current?.resize('100%', '100%');
		} else if (key === 'KX_CONFIRM_VENDOR') {
			gridRef3.current?.resize('100%', '100%');
		}

		// formRef2.setFieldValue('activeKey', key);
		// searchDetailList();
	};

	/**
	 * 상세 조회
	 */
	const searchDetailList = () => {
		// if (formRef2.getFieldValue('activeKey') === '1') {
		// 	// 상세정보 조회 - 집하지
		// 	searchDetail01List();
		// } else if (formRef2.getFieldValue('activeKey') === '2') {
		// 	// 상세정보 조회 - 고객
		// 	searchDetail02List();
		// }
	};

	// 사용여부 옵션
	const useYnOptions = [
		{ comCd: '', cdNm: '전체' },
		{ comCd: 'Y', cdNm: '사용' },
		{ comCd: 'N', cdNm: '미사용' },
	];

	// 검색 조건 초기값
	const [searchBox] = useState({
		searchVal: '', // 상세코드/상세코드명
		useYn: '', // 사용여부
	});
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,

		// showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		customRowCheckColumnDataField: '', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};
	const gridCol = [
		{
			headerText: t('lbl.DETAIL_CODE'), // 상세코드
			dataField: 'basecode',
			required: true,
			dataType: 'code',
		},
		{
			headerText: t('lbl.DETAIL_CODE_NAME'), // 상세코드명
			dataField: 'basedescr',
			required: true,
			dataType: 'string',
		},
		{
			headerText: t('lbl.USE_YN'), // 사용여부
			dataField: 'useYn',
			required: true,
			width: 80,
			style: 'ta-c', // 체크박스 중앙정렬
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: 'Y', // 체크 = 사용
				unCheckValue: 'N', // 체크 해제 = 미사용
				editable: true,
			},
		},
	];
	const gridCol2 = [
		{
			headerText: t('lbl.SKU'), // 상세코드
			dataField: 'basecode',
			required: true,
			dataType: 'code',
			commRenderer: {
				type: 'search',
				popupType: 'sku',
				searchDropdownProps: {
					dataFieldMap: {
						basecode: 'code',
						basedescr: 'name',
					},
				},
				onClick: (e: any) => {
					refModal.current.handlerOpen();
				},
			},
		},
		{
			headerText: t('lbl.SKUNM'), // 상세코드명
			dataField: 'basedescr',
			required: true,
			dataType: 'string',
			editable: false,
		},
		{
			headerText: t('lbl.USE_YN'), // 사용여부
			dataField: 'useYn',
			required: true,
			width: 80,
			style: 'ta-c', // 체크박스 중앙정렬
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: 'Y', // 체크 = 사용
				unCheckValue: 'N', // 체크 해제 = 미사용
				editable: true,
			},
		},
	];

	const gridCol3 = [
		{
			headerText: t('lbl.VENDOR'), // 상세코드
			dataField: 'basecode',
			required: true,
			dataType: 'code',
			commRenderer: {
				type: 'search',
				popupType: 'partner',
				searchDropdownProps: {
					dataFieldMap: {
						basecode: 'code',
						basedescr: 'name',
					},
				},
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;

					// 예: custcd 컬럼에서 팝업 열기
					refModal2.current.open({
						gridRef: gridRef3,
						codeName: e.text,
						rowIndex,
						dataFieldMap: {
							basecode: 'code',
							basedescr: 'name',
						},
						popupType: 'partner',
					});
				},
			},
		},
		{
			headerText: t('lbl.VENDORNAME'), // 상세코드명
			dataField: 'basedescr',
			required: true,
			dataType: 'string',
			editable: false,
		},
		{
			headerText: t('lbl.USE_YN'), // 사용여부
			dataField: 'useYn',
			required: true,
			width: 80,
			style: 'ta-c', // 체크박스 중앙정렬
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: 'Y', // 체크 = 사용
				unCheckValue: 'N', // 체크 해제 = 미사용
				editable: true,
			},
		},
	];

	// 버튼 설정
	const gridBtn = {
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: 'plus' as const,
				initValues: {
					basecode: '',
					basedescr: '',
					useYn: 'Y', // 신규 추가 시 기본값은 사용(Y)
				},
			},
			{
				btnType: 'save' as const,
				callBackFn: () => onSave(),
			},
		],
	};
	// 버튼 설정
	const gridBtn2 = {
		tGridRef: gridRef2,
		btnArr: [
			{
				btnType: 'plus' as const,
				initValues: {
					basecode: '',
					basedescr: '',
					useYn: 'Y', // 신규 추가 시 기본값은 사용(Y)
				},
			},
			{
				btnType: 'save' as const,
				callBackFn: () => onSave(),
			},
		],
	};
	// 버튼 설정
	const gridBtn3 = {
		tGridRef: gridRef3,
		btnArr: [
			{
				btnType: 'plus' as const,
				initValues: {
					basecode: '',
					basedescr: '',
					useYn: 'Y', // 신규 추가 시 기본값은 사용(Y)
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
		const searchParams = searchForm.getFieldsValue();

		// 사용여부(Y/N)를 삭제여부(N/Y)로 변환
		let delYnParam = '';
		if (searchParams.useYn === 'Y') {
			delYnParam = 'N'; // 사용 = 삭제되지 않음
		} else if (searchParams.useYn === 'N') {
			delYnParam = 'Y'; // 미사용 = 삭제됨
		}
		const params = {
			storerkey,
			codelist: codelist,
			searchVal: searchParams.searchVal || '',
			delYn: delYnParam,
		};
		apiGetCmCodeDetailList(params).then(res => {
			// 서버에서 받은 delYn을 useYn으로 변환하여 화면에 표시
			const processedData =
				res.data?.map((item: any) => ({
					...item,
					useYn: item.delYn === 'N' ? 'Y' : 'N', // 삭제되지 않음(N) = 사용(Y)
				})) ?? [];

			if (codelist === 'BUYERKEY') {
				gridRef.current?.setGridData(processedData);
				setTotalCount(processedData.length);
			} else if (codelist === 'KX_CONFIRM_AUTO_SKU_LIST') {
				gridRef2.current?.setGridData(processedData);
				setTotalCount2(processedData.length);
			} else if (codelist === 'KX_CONFIRM_VENDOR') {
				gridRef3.current?.setGridData(processedData);
				setTotalCount3(processedData.length);
			}
		});
	};

	// 저장
	const onSave = () => {
		let currentGridRef = gridRef;
		if (codelist === 'BUYERKEY') {
			currentGridRef = gridRef;
		} else if (codelist === 'KX_CONFIRM_AUTO_SKU_LIST') {
			currentGridRef = gridRef2;
		} else if (codelist === 'KX_CONFIRM_VENDOR') {
			currentGridRef = gridRef3;
		}

		// 각 gridRef 검사 하기
		const changed = currentGridRef.current.getChangedData({ validationYn: false });
		if (!changed || changed.length < 1) {
			// 변경사항이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}
		if (!currentGridRef.current.validateRequiredGridData()) return;

		// 신규 스펙 컨펌 팝업 (신규/수정/삭제 건수 표시)
		currentGridRef.current.showConfirmSave(() => {
			const processedData = changed.map((row: any) => ({
				...row,
				storerkey,
				codelist,
				delYn: row.useYn === 'Y' ? 'N' : 'Y', // 사용(Y) = 삭제되지 않음(N)
				status: '90', // 00(등록요청) 90(등록완료)
			}));

			apiPostSaveCmDtlCode({
				codelist,
				codeDtlList: processedData,
			}).then((res: any) => {
				if (res.data.statusCode === 0) {
					showAlert(null, t('msg.MSG_COM_SUC_003'), () => {
						fetchGridData();
						// close(); // 팝업 닫기
					});
				}
			});
		});
	};

	// 검색 버튼 클릭
	const onClickSearchButton = () => {
		fetchGridData();
	};

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		// 현재 탭만 ?
		searchForm.setFieldsValue({ searchVal: '', useYn: '' });
		gridRef.current?.clearGridData();
		setTotalCount(0);
	};

	const confirmPopup = (selectedRow: any) => {
		gridRef2.current.setCellValue(gridRef2.current.getSelectedIndex()[0], 'basecode', selectedRow[0].code);
		gridRef2.current.setCellValue(gridRef2.current.getSelectedIndex()[0], 'basedescr', selectedRow[0].name);
		refModal.current.handlerClose();
	};

	const closeEvent = () => {
		if (commUtil.isEmpty(gridRef2.current.getCellValue(gridRef2.current.getSelectedIndex()[0], 'basedescr'))) {
			gridRef2.current.setCellValue(gridRef2.current.getSelectedIndex()[0], 'basecode', '');
		} else {
			gridRef2.current.restoreEditedCells([gridRef2.current.getSelectedIndex()[0], 'basecode']);
			gridRef2.current.restoreEditedCells([gridRef2.current.getSelectedIndex()[0], 'basedescr']);
		}
		refModal.current.handlerClose();
	};

	// 메뉴 타이틀에 연결할 함수
	const titleFunc = useMemo(
		() => ({
			searchYn: onClickSearchButton,
			refresh: onClickRefreshButton,
		}),
		[onClickSearchButton, onClickRefreshButton],
	);
	return (
		<>
			<PopupMenuTitle name={'수급담당'} func={titleFunc} />
			{/* 조회 컴포넌트 */}
			<SearchForm form={searchForm} initialValues={searchBox} isAlwaysVisible>
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						<li>
							<InputText
								label="상세코드/명"
								name="searchVal"
								placeholder={t('msg.MSG_COM_VAL_006', ['상세코드 또는 상세코드명'])}
								onPressEnter={onClickSearchButton}
							/>
						</li>
						<li>
							<SelectBox
								name="useYn"
								label={t('lbl.USE_YN')}
								options={useYnOptions}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
							/>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			<Tabs activeKey={codelist} onTabClick={tabClickDetail1}>
				<TabPane tab="수급담당" key="BUYERKEY">
					<AGrid>
						<GridTopBtn gridBtn={gridBtn} gridTitle={'수급담당자 목록'} totalCnt={totalCount} />
						<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
					</AGrid>
				</TabPane>
				<TabPane tab="KX동탄저장상품리스트" key="KX_CONFIRM_AUTO_SKU_LIST">
					<AGrid>
						<GridTopBtn gridBtn={gridBtn2} gridTitle={'KX동탄저장상품리스트'} totalCnt={totalCount2} />
						<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps} />
					</AGrid>
				</TabPane>
				<TabPane tab="KX매입실적수신협력사" key="KX_CONFIRM_VENDOR">
					<AGrid>
						<GridTopBtn gridBtn={gridBtn3} gridTitle={'KX매입실적수신협력사'} totalCnt={totalCount3} />
						<AUIGrid ref={gridRef3} columnLayout={gridCol3} gridProps={gridProps} />
					</AGrid>
				</TabPane>
			</Tabs>
			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.BTN_CANCEL') || '닫기'}</Button>
			</ButtonWrap>
			<CustomModal ref={refModal} width="1000px">
				<CmSearchPopup type={'sku'} codeName={''} callBack={confirmPopup} close={closeEvent}></CmSearchPopup>
			</CustomModal>
			<CmSearchWrapper ref={refModal2} />
		</>
	);
};

export default CmPurchaseCustPopup;
