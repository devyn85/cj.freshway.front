/*
 ############################################################################
 # FiledataField	: WdAllocationBatchGroupDetail3.tsx
 # Description		: 피킹유형 미정의 관리처 Detail
 # Author			: 공두경
 # Since			: 25.08.21
 ############################################################################
*/
import { Button, Form } from 'antd';
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import { InputText } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import { apiSaveTab3MasterList } from '@/api/wd/apiWdAllocationBatchGroup';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';

// Utils
// API Call Function

const WdAllocationBatchGroupDetail3 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	//const [form] = Form.useForm();
	ref.gridRef = useRef();
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	/**
	 * 결품사유, 처리결과 입력
	 * @param {*} key 탭번호
	 */
	const onClickInsert = () => {
		const currentGrid = ref.gridRef.current;

		if (!currentGrid) return;

		// 폼 인스턴스에서 현재 탭에 맞는 값을 가져옵니다.
		const formValues = props.form.getFieldsValue();

		// SelectBox의 전체 옵션 목록을 가져옵니다.
		const distanceTypeOptions = getCommonCodeList('DISTANCETYPE', '--- 전체 ---');
		// form에서 가져온 선택된 값(value)을 사용하여 전체 옵션에서 일치하는 옵션을 찾습니다.
		const selectedOption = distanceTypeOptions.find(option => option.comCd === formValues.distancetype);
		// 찾은 옵션에서 라벨(label)을 추출합니다.
		const selectedLabel = selectedOption ? selectedOption.cdNm : '';

		if (commUtil.isNull(selectedLabel)) {
			showAlert('', '정의되지 않은 피킹유형입니다');
			return;
		}

		// getCheckedRowItems()는 현재 페이지에서 체크된 행들의 item과 rowIndex를 함께 반환합니다.
		const checkedItems = currentGrid.getCheckedRowItems();

		if (!checkedItems || checkedItems.length === 0) {
			showAlert('', t('msg.noSelect')); // 필요시 주석 해제하여 사용
			return;
		}

		// 체크된 각 행에 대해 반복
		for (const checkedItem of checkedItems) {
			const { rowIndex } = checkedItem;
			currentGrid.setCellValue(rowIndex, 'mngDistancetype', formValues.distancetype);
		}
	};

	/**
	 * 저장
	 */
	const saveMasterList = async () => {
		// 수정된 데이터
		const updatedItems = ref.gridRef.current.getChangedData({ validationYn: false });
		// 변경 데이터 확인
		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		const distanceTypeOptions = getCommonCodeList('DISTANCETYPE');
		const invalidMessages = [] as any[];

		updatedItems.forEach((item: any) => {
			if (item.mngDistancetype && !distanceTypeOptions.some(option => option.comCd === item.mngDistancetype)) {
				invalidMessages.push(`${item.mngDistancetype}`);
			}
		});

		if (invalidMessages.length > 0) {
			showAlert('', `정의되지 않은 피킹유형이 있습니다: ${invalidMessages.join(', ')}`);
			return;
		}

		if (updatedItems.length > 0 && !ref.gridRef.current.validateRequiredGridData()) {
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			apiSaveTab3MasterList(updatedItems).then(res => {
				if (res.statusCode == 0) {
					showAlert('', t('msg.MSG_COM_SUC_003'), () => {
						ref.gridRef.current.clearGridData();
						props.callBackFn(); // 검색 함수 호출
					});
				}
			});
		});
	};

	/**
	 * 저장
	 */
	const onClickBatch = () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
	};
	// 마감유형
	const custorderclosetypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CUSTORDERCLOSETYPE', value)?.cdNm;
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{ headerText: t('lbl.DCCODE'), /*물류센터*/ dataField: 'dccode', dataType: 'code', editable: false },
		{ headerText: t('lbl.DELIVERYDATE'), /*배송일자*/ dataField: 'deliverydate', dataType: 'date', editable: false },
		{ headerText: t('lbl.PLANTCD'), /*플랜트코드*/ dataField: 'plant', dataType: 'code', editable: false },
		{ headerText: t('lbl.PLANT_NM'), /*플랜트명*/ dataField: 'description', editable: false },
		{ headerText: '거래처별POP<br/>등록여부', /*플랜트명*/ dataField: 'custxpopYn', dataType: 'code', editable: false },
		{
			headerText: t('lbl.TO_CUSTKEY_WD2'), //관리처
			children: [
				{
					headerText: t('lbl.TO_CUSTKEY_WD2'), //관리처
					dataField: 'toCustkey',
					dataType: 'code',
					filter: {
						showIcon: true,
					},
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(
								{
									custkey: e.item.toCustkey,
								},
								'cust',
							);
						},
					},
					editable: false,
				},
				{
					headerText: t('lbl.TO_CUSTNAME_WD'), //관리처명
					dataField: 'toCustname',
					filter: {
						showIcon: true,
					},
					editable: false,
				},
				{
					dataField: 'custstrategy4',
					labelFunction: custorderclosetypeLabelFunc,
					headerText: t('lbl.CUSTORDERCLOSETYPE'),
					editable: false,
				},
				{
					headerText: t('lbl.PICKING_DISTANCETYPE') /*피킹(원거리)유형*/,
					dataField: 'mngDistancetype',
					dataType: 'code',
					editRenderer: {
						type: 'InputEditRenderer',
						autoUpperCase: true,
					},
				},
			],
		},
		{ headerText: t('lbl.DOCNO_WD'), /*주문번호*/ dataField: 'docno', dataType: 'code', editable: false },
		{ headerText: t('lbl.ZIPCODE'), /*우편번호*/ dataField: 'zipcode', dataType: 'code', editable: false },
		{ headerText: t('lbl.ADDRESS1'), /*기본주소*/ dataField: 'address1', editable: false },
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		autoGridHeight: false, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: true,
		showFooter: false,
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};

	// FooterLayout Props
	const footerLayout = [{}];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save',
				callBackFn: saveMasterList,
			},
		],
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				colSizeList[4] = 100; //거래처별POP등록여부
				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	useEffect(() => {
		ref.gridRef.current.bind('cellEditBegin', (event: any) => {
			return ['mngDistancetype'].includes(event.dataField);
		});
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const upperValue = e.target.value.toUpperCase();
		props.form.setFieldsValue({ distancetype: upperValue });
	};

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid style={{ marginTop: '15px', marginBottom: '10px' }}>
				<GridTopBtn gridBtn={gridBtn} gridTitle="피킹유형 미정의 관리처 목록" totalCnt={props.totalCnt}>
					<Form form={props.form} layout="inline">
						<InputText
							label={t('lbl.PICKINGTYPE')} //피킹유형
							name="distancetype"
							onChange={handleChange}
							placeholder={t('msg.placeholder1', [t('lbl.DISTANCETYPE')])}
							className="bg-white"
						/>
						<Button onClick={() => onClickInsert()}>{'선택적용'}</Button>
					</Form>
				</GridTopBtn>
			</AGrid>
			<GridAutoHeight id="picking-types-grid">
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</GridAutoHeight>
		</>
	);
});

export default WdAllocationBatchGroupDetail3;
