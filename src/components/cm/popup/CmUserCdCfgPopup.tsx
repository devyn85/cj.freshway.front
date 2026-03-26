/*
############################################################################
# FiledataField : CmUserCdCfgPopup.tsx
# Description   : 사용자코드설정팝업
# Author        : YeoSeungCheol
# Since         : 24.06.10
############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';

// component
import { InputText, SearchForm, SelectBox } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// store
import { useAppSelector } from '@/store/core/coreHook';

// api
import { apiGetCmCodeDetailList, apiPostSaveCmDtlCode } from '@/api/cm/apiCmCode';

interface PropsType {
	codeType:
		| 'CARAGENTKEY'
		| 'PARTNERKEY'
		| 'DIRECTTYPE'
		| 'BUYERKEY'
		| 'IBCARRIERCUST'
		| 'EXPIRATION_DATE_DP'
		| 'LIMIT_FREEZE_TEMP'
		| 'LIMIT_COLD_TEMP'
		| 'RT_CHG_DEPT_DAY'
		| 'CHEILJEDANG_SKU'
		| 'EX_PARTNER'
		| 'EXDC_MANAGE_USER'
		| 'N_DELIVERY_CUST_SKU'
		| 'QUICK_ORDERER';
	callBack?: () => void;
	close: () => void;
}

const CmUserCdCfgPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const CODE_DESCRIPTIONS: Record<PropsType['codeType'], string> = {
		CARAGENTKEY: t('lbl.CARAGENTKEY'), // 차량소유업체
		PARTNERKEY: t('lbl.PARTNER'), // 협력사
		DIRECTTYPE: t('lbl.DELIVERYTYPE_PO'), // 직배송(DIRECTTYPE) -> 직송그룹(DELIVERYTYPE_PO)
		BUYERKEY: t('lbl.POMDCODE'), // 구매처
		IBCARRIERCUST: t('lbl.IBCARRIERCUST'), // 입고운송사
		EXPIRATION_DATE_DP: t('lbl.DP_CRI'), // 센터 입고기준
		LIMIT_COLD_TEMP: t('lbl.FREEZE_CRI'), // 냉장기준
		LIMIT_FREEZE_TEMP: t('lbl.COLD_CRI'), // 냉동기준
		RT_CHG_DEPT_DAY: t('lbl.CONFIRM_CRI'), // 확정기준
		EX_PARTNER: t('lbl.EX_PARTNER1'), // 예외거래처
		CHEILJEDANG_SKU: t('lbl.CHEILJEDANG_SKU'), // 재당상품
		EXDC_MANAGE_USER: t('lbl.EXDC_MANAGE_USER'),
		N_DELIVERY_CUST_SKU: t('N배송 고객사 상품'), // N배송 고객사 상품
		QUICK_ORDERER: t('퀵사용자관리'), // 퀵사용자관리
	};

	const storerkey = useAppSelector(state => state.global.globalVariable.gStorerkey); // 사용자 정보
	const { codeType, callBack, close } = props;
	const gridRef = useRef<any>();
	const [searchForm] = Form.useForm();
	const [totalCount, setTotalCount] = useState(0);

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

	// 그리드 컬럼 정의
	const gridCol = () => {
		if (codeType === 'EXDC_MANAGE_USER') {
			return [
				{ headerText: t('lbl.SEQNO'), dataType: 'numeric', dataField: 'seqno', required: true },
				{ headerText: t('lbl.DETAIL_CODE'), dataField: 'basecode', required: true, dataType: 'code' },
				{ headerText: t('lbl.DETAIL_CODE_NAME'), dataField: 'basedescr', required: true, dataType: 'string' },
				{ headerText: '입고생성자', dataField: 'data1', required: true, dataType: 'string' },
				{ headerText: '출고생성자', dataField: 'data2', required: true, dataType: 'string' },
				{
					headerText: t('lbl.USE_YN'),
					dataField: 'useYn',
					required: true,
					width: 80,
					style: 'ta-c',
					renderer: { type: 'CheckBoxEditRenderer', checkValue: 'Y', unCheckValue: 'N', editable: true },
				},
			];
		}
		// N배송 고객사 상품코드
		else if (codeType === 'N_DELIVERY_CUST_SKU') {
			return [
				{ headerText: t('lbl.SEQNO'), dataType: 'numeric', dataField: 'seqno', width: 80, required: true },
				{ headerText: t('일련번호'), dataField: 'basecode', required: true, width: 80, dataType: 'code' },
				{ headerText: t('판매사이트코드'), dataField: 'data1', required: true, width: 100, dataType: 'string' },
				{ headerText: t('판매사이트명'), dataField: 'basedescr', required: true, dataType: 'string' },
				{ headerText: t('상품코드'), dataField: 'data2', required: true, dataType: 'string' },
				{
					headerText: t('lbl.USE_YN'),
					dataField: 'useYn',
					required: true,
					width: 80,
					style: 'ta-c',
					renderer: { type: 'CheckBoxEditRenderer', checkValue: 'Y', unCheckValue: 'N', editable: true },
				},
			];
		}
		// 퀵 사용자 관리
		else if (codeType === 'QUICK_ORDERER') {
			return [
				{ headerText: t('lbl.SEQNO'), dataType: 'numeric', dataField: 'seqno', width: 80, required: true },
				{ headerText: t('사용자ID'), dataField: 'basecode', required: true, width: 120, dataType: 'code' },
				{ headerText: t('부서명'), dataField: 'data1', required: true, width: 200, dataType: 'string' },
				{ headerText: t('사용자ID(퀵업체)'), dataField: 'basedescr', width: 200, required: true, dataType: 'string' },
				{ headerText: t('연락처'), dataField: 'data2', required: true, dataType: 'string' },
				{
					headerText: t('lbl.USE_YN'),
					dataField: 'useYn',
					required: true,
					width: 80,
					style: 'ta-c',
					renderer: { type: 'CheckBoxEditRenderer', checkValue: 'Y', unCheckValue: 'N', editable: true },
				},
			];
		}

		return [
			{ headerText: t('lbl.SEQNO'), dataType: 'numeric', dataField: 'seqno', visible: false },
			{ headerText: t('lbl.DETAIL_CODE'), dataField: 'basecode', required: true, dataType: 'code' },
			{ headerText: t('lbl.DETAIL_CODE_NAME'), dataField: 'basedescr', required: true, dataType: 'string' },
			{
				headerText: t('lbl.USE_YN'),
				dataField: 'useYn',
				required: true,
				width: 80,
				style: 'ta-c',
				renderer: { type: 'CheckBoxEditRenderer', checkValue: 'Y', unCheckValue: 'N', editable: true },
			},
		];
	};

	const gridProps = {
		editable: true,
		showRowCheckColumn: true,

		// showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		customRowCheckColumnDataField: '', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 신규 행 추가 - N배송 고객사 상품은 seqno, basecode 자동 증감
	 */
	const handleAddRow = () => {
		const allData = gridRef.current.getGridData();

		if (codeType === 'N_DELIVERY_CUST_SKU') {
			// N배송 고객사 상품코드인 경우 seqno와 basecode를 자동으로 최대값 + 1로 설정하여 추가
			const maxSeqNo = Math.max(...allData.map((item: any) => Number(item.seqno || 0)), 0);
			const maxBasecode = Math.max(...allData.map((item: any) => Number(item.basecode || 0)), 0);

			gridRef.current.addRow({
				seqno: maxSeqNo + 1,
				basecode: String(maxBasecode + 1),
				basedescr: '',
				data1: '',
				data2: '',
				useYn: 'Y',
				rowStatus: 'I',
			});
		} else {
			gridRef.current.addRow({
				basecode: '',
				basedescr: '',
				useYn: 'Y',
				rowStatus: 'I',
			});
		}
	};

	// 버튼 설정
	const gridBtn = {
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: 'plus' as const,
				isActionEvent: false,
				callBackFn: handleAddRow,
			},
			{
				btnType: 'save' as const,
				callBackFn: () => onSave(),
			},
		],
	};

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
			codelist: codeType,
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

			setTotalCount(processedData.length);
			gridRef.current?.setGridData(processedData);
		});
	};

	// 저장
	const onSave = () => {
		const changed = gridRef.current.getChangedData({ validationYn: false });
		const allData = gridRef.current.getGridData({ validationYn: false });

		if (!changed || changed.length < 1) {
			// 변경사항이 없습니다.
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}
		if (!gridRef.current.validateRequiredGridData()) return;

		if (codeType === 'DIRECTTYPE') {
			// 중복 체크 DIRECTTYPE
			const dupliacateRow = changed.find((item: any) => {
				return allData.find((row: any) => row.basecode === item.basecode && row._$uid !== item._$uid);
			});
			if (dupliacateRow) {
				showAlert(null, t('msg.MSG_COM_ERR_057', ['상세 코드 :' + dupliacateRow.basecode])); // 중복된 {{0}}(이)가 존재합니다
				return;
			}
		}

		// 신규 스펙 컨펌 팝업 (신규/수정/삭제 건수 표시)
		gridRef.current.showConfirmSave(() => {
			let processedData;
			if (codeType === 'DIRECTTYPE') {
				// 직송그룹 팝업에서 저장 할때 가제로 seqno 를 추가 해준다.
				const maxSeqNo = Math.max(...allData.map((item: any) => Number(item.seqno || 0)));
				let nextSeqNo = maxSeqNo; // 시작 seqNo
				processedData = changed.map((row: any, index: number) => ({
					...row,
					storerkey,
					codelist: codeType,
					seqno: commUtil.isEmpty(row?.seqno) ? ++nextSeqNo : row.seqno,
					delYn: row.useYn === 'Y' ? 'N' : 'Y', // 사용(Y) = 삭제되지 않음(N)
					status: '90', // 00(등록요청) 90(등록완료)
				}));
			} else {
				processedData = changed.map((row: any) => ({
					...row,
					storerkey,
					codelist: codeType,
					delYn: row.useYn === 'Y' ? 'N' : 'Y', // 사용(Y) = 삭제되지 않음(N)
					status: '90', // 00(등록요청) 90(등록완료)
				}));
			}

			apiPostSaveCmDtlCode({
				codelist: codeType,
				codeDtlList: processedData,
			}).then((res: any) => {
				if (res.data.statusCode > -1) {
					showAlert(null, t('msg.MSG_COM_SUC_003'), () => {
						// callBack?.(); // 부모가 전달한 함수 실행
						// close(); // 팝업 닫기
						onClickSearchButton();
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
		searchForm.setFieldsValue({ searchVal: '', useYn: '' });
		gridRef.current?.clearGridData();
		setTotalCount(0);
	};

	// 메뉴 타이틀에 연결할 함수
	const titleFunc = useMemo(
		() => ({
			searchYn: onClickSearchButton,
			refresh: onClickRefreshButton,
		}),
		[onClickSearchButton, onClickRefreshButton],
	);

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
			<PopupMenuTitle name={CODE_DESCRIPTIONS[codeType]} func={titleFunc} />

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

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={CODE_DESCRIPTIONS[codeType] + ' 목록'} totalCnt={totalCount} />
				<AUIGrid ref={gridRef} columnLayout={gridCol()} gridProps={gridProps} />
			</AGrid>
			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.BTN_CANCEL') || '닫기'}</Button>
			</ButtonWrap>
		</>
	);
};

export default CmUserCdCfgPopup;
