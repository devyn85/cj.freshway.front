// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
//Store
// component
import CustomModal from '@/components/common/custom/CustomModal';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { Datepicker, SearchForm, SelectBox } from '@/components/common/custom/form';
import MsCenterDistrictPlatformOrderTypeSetupPopup from '@/components/ms/popup/MsCenterDistrictPlatformOrderTypeSetupPopup';
// css
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
// api
import { apiGetDcOrdGrpList, apiGetDcOrdGrpListByPrDccode } from '@/api/ms/apiMsCenterDistrict';

interface IMsCenterDistrictPlatformOrderTypePopupProps {
	close?: any;
	platformOrderTypeCodeList?: any[];
	fwCenterList?: any[];
	foCenterList?: any[];
}

const MsCenterDistrictPlatformOrderTypePopup = forwardRef(
	(
		{ close, platformOrderTypeCodeList, fwCenterList, foCenterList }: IMsCenterDistrictPlatformOrderTypePopupProps,
		ref: any,
	) => {
		const { t } = useTranslation();
		const [form] = Form.useForm();

		// 그리드 처리 관련
		const gridRef = useRef<any>(null);
		const gridProps = useMemo(
			() => ({
				editable: false, // 데이터 수정 여부
				editBeginMode: 'click',
				showStateColumn: false, // row 편집 여부
				showRowCheckColumn: false, // 체크박스 컬럼 표시 (라이브러리에 따라 showCheckColumn 명칭일 수도 있음)
				enableColumnResize: true, // 열 사이즈 조정 여부
				fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
			}),
			[],
		);
		const [gridCol, setGridCol] = useState<any[]>([]);
		const [gridData, setGridData] = useState<any[]>([]);
		const [gridKey, setGridKey] = useState(0);

		const [isFirstLoad, setIsFirstLoad] = useState(false);

		const [setupPopupGridData, setSetupPopupGridData] = useState<any[]>([]);
		const [centerOptionList, setCenterOptionList] = useState<any[]>([]);

		// 플랫폼주문유형 설정 팝업 관련 ref
		const platformOrderTypeSetupPopupModal: any = useRef(null);
		const platformOrderTypeSetupPopupRef: any = useRef(null);

		/**
		 * 부모에서 호출할 수 있는 함수 노출
		 */
		useImperativeHandle(ref, () => ({
			setEffectiveDate: (value: any) => {
				form.setFieldValue('effectiveDate', value);
			},
			setOrderTypeCode: (value: any) => {
				form.setFieldValue('orderTypeCode', value);
			},
		}));

		// 셀 라벨 계산 헬퍼 함수
		const getCellLabel = useCallback(
			(value: any, item: any, comCd: string) => {
				const currentDcgroup = item?.[`${comCd}_dcgroup`];
				let label = '';
				if (currentDcgroup) {
					const labelList = currentDcgroup === 'FW' ? fwCenterList : foCenterList;
					const findItem = labelList.find((d: any) => d.comCd === value);
					label = findItem ? `${findItem.comCd}` : '';
				}
				if (!label) {
					label = item?.[`${comCd}_dcgroup`] ?? value;
				}
				return label;
			},
			[fwCenterList, foCenterList],
		);

		// 그리드 데이터 초기화 헬퍼 함수
		const resetGridDataToEmpty = useCallback((item: any) => {
			const next: any = {};

			Object.keys(item).forEach(key => {
				if (key === 'rowCd') {
					// 기준 키값은 유지
					next[key] = item[key];
				} else if (key === 'rowStatus') {
					// 상태는 R로 통일
					next[key] = 'R';
				} else {
					// 나머지 컬럼들은 전부 빈값으로 초기화
					next[key] = '';
				}
			});

			return next;
		}, []);

		const handleSearch = useCallback(async () => {
			const formValues = form.getFieldsValue();
			if (!formValues.orderTypeCode) {
				showAlert(null, '주문그룹을 선택해주세요.');
				return;
			}
			if (!formValues.effectiveDate) {
				showAlert(null, '적용일자를 선택해주세요.');
				return;
			}

			const params = {
				ordGrp: formValues.orderTypeCode,
				effectiveDate: formValues.effectiveDate.format('YYYYMMDD'),
			};

			const res = await apiGetDcOrdGrpList(params);
			if (res.statusCode === 0) {
				setIsFirstLoad(true);
				const data = res.data;
				// pr1Dccode = FW(행), pr2Dccode = FO(열)
				let tempGridData = gridData.map(row => ({ ...row }));

				// 우선순위 정해지지 않은 부분 얼럿 처리
				if (data.every((item: any) => !item.deliveryDccode || item.deliveryDccode === '')) {
					showAlert(null, '우선순위가 정해지지 않은 센터는 \n 익일 수정이 가능합니다.');
					return;
				}

				data.forEach((item: any) => {
					const fwCode = item.pr1Dccode; // 행(FW)
					const foCode = item.pr2Dccode; // 열(FO)
					const findItem = tempGridData.find((gridItem: any) => gridItem && gridItem.rowComCd === fwCode);

					if (findItem) {
						tempGridData = tempGridData.map(row =>
							row.rowComCd === fwCode
								? { ...row, [foCode]: item.deliveryDccode, [`${foCode}_dcgroup`]: item.dcgroup }
								: row,
						);
					}
				});
				setGridData(tempGridData);
				setTimeout(() => {
					gridRef.current?.setGridData(tempGridData);
					// 필요하면 여기서 컬럼폭 자동조정
					const fitList = gridRef.current?.getFitColumnSizeList(true);
					gridRef.current?.setColumnSizeList(fitList);
				}, 300);
			}
		}, [gridData, setGridData]);

		// 셀 클릭 이벤트 함수
		const handleCellClick = useCallback(
			async (event: any) => {
				const { dataField, item: rowObj } = event;

				if (!isFirstLoad) return showAlert(null, '조회 후 설정이 가능합니다.');

				if (rowObj && (!rowObj[dataField] || rowObj[dataField] === '')) {
					showAlert(null, '우선순위가 정해지지 않은 센터는 \n 익일 수정이 가능합니다.');
					return;
				}

				// fw 센터 열 선택 시 무반응 처리
				if (dataField === 'rowComCd') return;

				const grid = gridRef.current;
				if (!grid) return;

				// 주문그룹, 적용일자 가 조회조건에서 없으면 얼럿
				if (!form.getFieldValue('orderTypeCode')) {
					showAlert(null, '주문그룹을 선택해주세요.');
					return;
				}
				if (!form.getFieldValue('effectiveDate')) {
					showAlert(null, '적용일자를 선택해주세요.');
					return;
				}

				// FW = 행(row), FO = 열(column)
				const columnList = foCenterList;
				const rowList = fwCenterList;

				// 클릭한 셀에 해당하는 FW/FO 센터명 설정
				setCenterOptionList([
					{
						comCd: dataField, // FO 코드 (열)
						cdNm: columnList.find((d: any) => d.comCd === dataField)?.cdNm,
					},
					{
						comCd: rowObj?.rowComCd, // FW 코드 (행)
						cdNm: rowList.find((d: any) => d.comCd === rowObj?.rowComCd)?.cdNm,
					},
				]);

				// 상세 팝업 조회 파라미터: pr1 = FW, pr2 = FO
				const params = {
					ordGrp: form.getFieldValue('orderTypeCode'),
					effectiveDate: form.getFieldValue('effectiveDate').format('YYYYMMDD'),
					pr1Dccode: rowObj?.rowComCd, // FW
					pr2Dccode: dataField, // FO
				};

				const res = await apiGetDcOrdGrpListByPrDccode(params);
				if (res.statusCode === 0) {
					const data = res.data;
					const tempData = data.map((item: any) => ({
						...item,
						rowStatus: 'R',
						deliveryDccode2: item.deliveryDccode === item.pr1Dccode ? item.pr2Dccode : item.pr1Dccode,
						deliveryDcname2: item.deliveryDccode === item.pr1Dccode ? item.pr2Dcname : item.pr1Dcname,
					}));
					setSetupPopupGridData(tempData);
				}

				platformOrderTypeSetupPopupModal.current?.handlerOpen();
				setTimeout(() => {
					platformOrderTypeSetupPopupRef.current?.setOrdGrp(form.getFieldValue('orderTypeCode'));
					// FW / FO 각각 문자열로 전달
					platformOrderTypeSetupPopupRef.current?.setPr1Dccode(String(params.pr1Dccode)); // FW
					platformOrderTypeSetupPopupRef.current?.setPr2Dccode(String(params.pr2Dccode)); // FO
					platformOrderTypeSetupPopupRef.current?.setEffectiveDate(form.getFieldValue('effectiveDate'));
				}, 300);
			},
			[fwCenterList, foCenterList, form, isFirstLoad],
		);

		// 플랫폼 유형 설정 팝업 닫기 함수
		const handleClosePlatformOrderTypeSetupPopup = useCallback(() => {
			platformOrderTypeSetupPopupModal.current?.handlerClose();
			// 닫기 처리 후 현재 메트릭스 재요청 처리
			handleSearch();
		}, [handleSearch]);

		const titleFunc = {
			searchYn: handleSearch,
		};

		// FW/FO 리스트 길이에 따라 그리드 구조 동적 생성
		useEffect(() => {
			if (!fwCenterList.length || !foCenterList.length) {
				// 한쪽이라도 없으면 그리드 초기화
				setGridCol([]);
				gridRef.current?.setGridData?.([]);
				return;
			}

			// FW = 행(row), FO = 열(column)로 고정
			const columnList = [...foCenterList].sort((a: any, b: any) => Number(a.comCd) - Number(b.comCd)); // 열(FO)

			const rowList = [...fwCenterList].sort((a: any, b: any) => Number(a.comCd) - Number(b.comCd)); // 행(FW)

			// 1) 고정 컬럼(행 기준 센터 정보: FW)
			const baseCols = [
				{
					dataField: 'rowComCd',
					headerText: 'FW 센터 \\ FO센터',
					editable: false,
					minWidth: 160,
					labelFunction: (
						rowIndex: number,
						columnIndex: number,
						value: any,
						headerText: string,
						item: any,
						dataField: string,
					) => {
						const list = rowList || [];
						const findItem = list.find((d: any) => d.comCd === value);
						return findItem ? `[${findItem.comCd}]${findItem.cdNm}` : '';
					},
					styleFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any): string => {
						// 헤더와 같은 느낌으로 보여줄 CSS 클래스명
						return 'fw-fo-header-cell';
					},
				},
			];

			// 2) FO 리스트로 동적 컬럼 생성 (가로)
			const dynamicCols = columnList.map((columnItem: any) => ({
				dataField: `${columnItem.comCd ?? ''}`, // 셀 데이터 필드 (FO 코드)
				headerText: `[${columnItem.comCd}]${columnItem.cdNm} `, // 헤더에 FO 센터명
				editable: false,
				minWidth: 120,
				styleFunction: () => 'platform-center-cell',
				labelFunction: (
					rowIndex: number,
					columnIndex: number,
					value: any,
					headerText: string,
					item: any,
					dataField: string,
				) => getCellLabel(value, item, columnItem.comCd),
			}));

			// 3) FW 리스트를 기준으로 행 데이터 생성 (세로)
			const rowData = rowList.map((rowItem: any) => {
				const row: any = {
					rowStatus: 'R',
					rowComCd: rowItem.comCd, // FW 코드
				};

				// FO 컬럼들 초기값 셋팅
				columnList.forEach((columnItem: any) => {
					row[columnItem.comCd] = '';
					row[`${columnItem.comCd}_dcgroup`] = ''; // 해당 컬럼의 라벨 처리를 위한 속성 추가가
				});

				return row;
			});

			const tempGridCol = [...baseCols, ...dynamicCols];
			const tempGridData = rowData;

			setGridCol(tempGridCol);
			setGridData(tempGridData);
			setGridKey(prev => prev + 1);

			try {
				setTimeout(() => {
					gridRef.current?.setGridData(tempGridData);
					const fitList = gridRef.current?.getFitColumnSizeList(true);
					gridRef.current?.setColumnSizeList(fitList);
				}, 300);
			} catch (error) {}
		}, [fwCenterList, foCenterList]);

		// 이벤트 처리 useEffect
		useEffect(() => {
			const grid = gridRef.current;
			if (!grid || typeof grid.bind !== 'function') return;

			try {
				grid.bind('cellClick', handleCellClick);
			} catch (e) {}

			return () => {
				try {
					if (typeof grid.unbind === 'function') {
						grid.unbind('cellClick');
					}
				} catch (e) {}
			};
		}, [gridKey, handleCellClick]);

		return (
			<>
				{/* 상단 타이틀 및 페이지버튼 */}
				<PopupMenuTitle name="플랫폼 주문유형" func={titleFunc} />
				{/* 조회 컴포넌트 */}
				<SearchForm form={form} initialValues={{}} isAlwaysVisible>
					<UiFilterArea>
						<UiFilterGroup className="grid-column-3">
							{/* 주문그룹 */}
							<li>
								<SelectBox
									label={'주문그룹'}
									name={'orderTypeCode'}
									options={platformOrderTypeCodeList}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
								/>
							</li>
							{/* 적용일자 */}
							<li>
								<Datepicker label={'적용일자'} name={'effectiveDate'} />
							</li>
						</UiFilterGroup>
					</UiFilterArea>
				</SearchForm>
				{/* 그리드 영역 */}
				<AGrid dataProps={''}>
					<AUIGrid key={gridKey} ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>
				{/* 버튼 영역 */}
				<ButtonWrap data-props="single">
					<Button onClick={close}>{t('lbl.CLOSE')}</Button>
				</ButtonWrap>
				{/* 플랫폼주문유형 설정 팝업 */}
				<CustomModal ref={platformOrderTypeSetupPopupModal} width="1280px">
					<MsCenterDistrictPlatformOrderTypeSetupPopup
						ref={platformOrderTypeSetupPopupRef}
						close={handleClosePlatformOrderTypeSetupPopup}
						platformOrderTypeCodeList={platformOrderTypeCodeList}
						fwCenterList={fwCenterList}
						foCenterList={foCenterList}
						setupPopupGridData={setupPopupGridData}
						centerOptionList={centerOptionList}
					/>
				</CustomModal>
			</>
		);
	},
);

export default MsCenterDistrictPlatformOrderTypePopup;
