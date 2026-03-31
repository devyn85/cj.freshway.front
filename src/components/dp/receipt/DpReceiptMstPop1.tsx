/*
############################################################################
# FiledataField : DpReceiptMstPop1.tsx
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
// import { apiGetCmCodeDetailList } from '@/api/cm/apiCmCode';
import { getCommonCodeList } from '@/store/core/comCodeStore';

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
		| 'EX_PARTNER';
	callBack?: () => void;
	close: () => void;
}

const DpReceiptMstPop1 = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const CODE_DESCRIPTIONS: Record<PropsType['codeType'], string> = {
		CARAGENTKEY: t('lbl.CARAGENTKEY'), // 차량소유업체
		PARTNERKEY: t('lbl.PARTNER'), // 협력사
		DIRECTTYPE: t('lbl.DIRECTTYPE'), // 직배송
		BUYERKEY: t('lbl.POMDCODE'), // 구매처
		IBCARRIERCUST: t('lbl.IBCARRIERCUST'), // 입고운송사
		EXPIRATION_DATE_DP: t('lbl.DP_CRI'), // 센터 입고기준
		LIMIT_COLD_TEMP: t('lbl.FREEZE_CRI'), // 냉장기준
		LIMIT_FREEZE_TEMP: t('lbl.COLD_CRI'), // 냉동기준
		RT_CHG_DEPT_DAY: t('lbl.CONFIRM_CRI'), // 확정기준
		EX_PARTNER: t('lbl.EX_PARTNER'), // 예외거래처
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
	const gridCol = [
		{
			headerText: '저장타입',
			dataField: 'storageType',
			required: true,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('STORAGETYPE'),
			},
		},
		{
			headerText: '시작일', // 시작일
			dataField: 'startDate',
			required: true,
			dataType: 'code',
			width: 70,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				maxlength: 4,
				validator: function (oldValue: any, newValue: any | any[], item: any) {
					let isValid = false;
					let msg = '';
					// 문자열로 변환 후 길이 체크
					const strVal = String(newValue);
					const numVal = Number(newValue);
					if (strVal.length !== 4) {
						msg = '4자리로 입력해주세요. ex) 0001';
					} else if (numVal > 9998) {
						msg = '9998일 까지 입력 가능합니다.';
					} else {
						isValid = true;
					}
					return { validate: isValid, message: msg };
				},
			},
		},
		{
			headerText: '종료일', // 종료일
			dataField: 'endDate',
			required: true,
			dataType: 'code',
			width: 70,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				maxlength: 4,
				validator: function (oldValue: any, newValue: any | any[], item: any) {
					let isValid = false;
					let msg = '';
					// 문자열로 변환 후 길이 체크
					const strVal = String(newValue);
					const numVal = Number(newValue);
					if (strVal.length !== 4) {
						msg = '4자리로 입력해주세요. ex) 0001';
					} else if (numVal > 9998) {
						msg = '9998일 까지 입력 가능합니다.';
					} else {
						isValid = true;
					}
					return { validate: isValid, message: msg };
				},
			},
		},
		{
			headerText: '허용율', // 허용율
			dataField: 'limitRate',
			required: true,
			dataType: 'code',
			width: 70,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				maxlength: 2,
				validator: function (oldValue: any, newValue: any | any[], item: any) {
					let isValid = false;
					let msg = '';
					// 문자열로 변환 후 길이 체크
					const strVal = String(newValue);
					const numVal = Number(newValue);
					if (strVal.length !== 2) {
						msg = '2자리로 입력해주세요. ex) 01';
					} else if (numVal < 1) {
						msg = '01 ~ 99까지 입력 가능합니다.';
					} else {
						isValid = true;
					}
					return { validate: isValid, message: msg };
				},
			},
		},
		{
			headerText: t('lbl.DETAIL_CODE'), // 상세코드
			dataField: 'basecode',
			dataType: 'code',
			editable: false,
			visible: false,
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
			// dataType: 'boolean',
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: 'Y', // 체크 = 사용
				unCheckValue: 'N', // 체크 해제 = 미사용
				editable: true,
			},
		},
	];

	const gridProps = {
		editable: true,
		showRowCheckColumn: true,

		// showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		customRowCheckColumnDataField: '', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};

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
					storageType: item.basecode.split('_')[0],
					startDate: item.basecode.split('_')[1],
					endDate: item.basecode.split('_')[2],
					limitRate: item.basecode.split('_')[3],
				})) ?? [];

			setTotalCount(processedData.length);
			gridRef.current?.setGridData(processedData);
		});
	};

	// 저장
	const onSave = () => {
		const changed = gridRef.current.getChangedData({ validationYn: false });

		if (!gridRef.current.validateRequiredGridData()) return;

		const gridData = gridRef.current.getGridData();
		// storageType별로 날짜 겹침 검증

		// storageType별로 날짜 구간을 그룹핑하고, 겹침 검증
		const byStorage: { [key: string]: { start: number; end: number; rowIdx: number }[] } = {};
		gridData.forEach((row: any, idx: number) => {
			const storageType = row.storageType;
			const start = parseInt(row.startDate, 10);
			const end = parseInt(row.endDate, 10);
			if (!byStorage[storageType]) byStorage[storageType] = [];
			byStorage[storageType].push({ start, end, rowIdx: idx });
		});

		// 겹치는 구간이 있는지 체크
		for (const storageType in byStorage) {
			const arr = byStorage[storageType];
			// 모든 쌍 비교
			for (let i = 0; i < arr.length; i++) {
				for (let j = i + 1; j < arr.length; j++) {
					// 구간이 겹치면
					if (arr[i].start <= arr[j].end && arr[j].start <= arr[i].end) {
						showAlert(null, `${arr[i].rowIdx + 1}행과 ${arr[j].rowIdx + 1}행의 날짜 구간이 겹칩니다.`);
						return;
					}
				}
			}
		}

		// 신규 스펙 컨펌 팝업 (신규/수정/삭제 건수 표시)
		gridRef.current.showConfirmSave(() => {
			const processedData = changed.map((row: any) => ({
				...row,
				storerkey,
				codelist: codeType,
				delYn: row.useYn === 'Y' ? 'N' : 'Y', // 사용(Y) = 삭제되지 않음(N)
				status: '90', // 00(등록요청) 90(등록완료)
				basecode: `${row.storageType}_${row.startDate}_${row.endDate}_${row.limitRate}`,
			}));

			apiPostSaveCmDtlCode({
				codelist: codeType,
				codeDtlList: processedData,
			}).then(() => {
				showAlert(null, t('msg.MSG_COM_SUC_003'), () => {
					callBack?.(); // 부모가 전달한 함수 실행
					close(); // 팝업 닫기
				});
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
			<PopupMenuTitle name={CODE_DESCRIPTIONS[codeType] + ' 팝업'} func={titleFunc} />

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
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.BTN_CANCEL') || '닫기'}</Button>
			</ButtonWrap>
		</>
	);
};

export default DpReceiptMstPop1;
