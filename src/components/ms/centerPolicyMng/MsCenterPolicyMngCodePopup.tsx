/*
 ############################################################################
 # FiledataField	: MsCenterPolicyMngDetail.tsx
 # Description		: 기준정보 > 센터기준정보 > 센터정책관리
 # Author			: JeongHyeongCheol
 # Since			: 25.08.06
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

// api
import { apiGetDetailList, apiGetValidateCodeList } from '@/api/ms/apiMsCenterPolicyMng';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';

interface PropsType {
	dccode?: string;
	plcycodeList?: Array<object>;
	selectedCode?: string;
	callBack?: any;
	close: () => void;
}

const MsCenterPolicyMngCodePopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const { dccode, selectedCode, plcycodeList, callBack, close } = props;
	const gridRef = useRef<any>();
	const [searchForm] = Form.useForm();
	const [totalCount, setTotalCount] = useState(0);

	// 유형 옵션
	const useTypeOptions = [
		{ comCd: '', cdNm: '미지정' },
		{ comCd: 'Time', cdNm: 'Time' },
		{ comCd: 'Combo', cdNm: 'Combo' },
	];

	// 검색 조건 초기값
	const [searchBox] = useState({
		searchVal: '', // 상세코드/상세코드명
	});
	const commDtlCdLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return value === '0' ? '' : value;
	};

	// 그리드 컬럼 정의
	const gridCol = [
		{
			headerText: '코드',
			dataField: 'commCd',
			required: true,
			dataType: 'code',
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			headerText: '코드명',
			dataField: 'commDescr',
			required: true,
			dataType: 'string',
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			headerText: t('lbl.DETAIL_CODE'), // 상세코드
			dataField: 'commDtlCd',
			dataType: 'code',
			labelFunction: commDtlCdLabelFunc,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			headerText: t('lbl.DETAIL_CODE_NAME'), // 상세코드명
			dataField: 'commDtlDescr',
			dataType: 'string',
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			headerText: '연관코드',
			dataField: 'refCommCd',
			dataType: 'code',
		},
		{
			headerText: '연관코드명',
			dataField: 'refCommDescr',
			dataType: 'string',
		},
		{
			headerText: '멀티선택여부',
			dataField: 'slctYn',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('YN2'),
			},
		},
		{
			headerText: '유형',
			dataField: 'refCdType',
			commRenderer: {
				type: 'dropDown',
				list: useTypeOptions,
			},
		},
	];

	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
	};

	// 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: 'plus',
				initValues: {
					rowStatus: 'I',
				},
			},
			{
				btnType: 'delete',
			},
		],
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// 데이터 조회
	const onClickSearchButton = () => {
		const searchParams = searchForm.getFieldsValue();
		const params = {
			commCd: searchParams.searchVal || '',
			dccode: dccode,
			plcycode: searchParams.plcycode || '',
		};
		apiGetDetailList(params).then(res => {
			setTotalCount(res.data.length);
			gridRef.current?.setGridData(res.data);
		});
	};

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		searchForm.setFieldsValue({ searchVal: '' });
		gridRef.current?.clearGridData();
		setTotalCount(0);
	};

	const callBackFn = () => {
		const checkedRow = gridRef.current.getChangedData();
		let isValidSlctYn = true;
		let alertMessage = '';
		if (checkedRow.length === 0) {
			close();
			return;
		}
		// 멀티여부 유효성체크
		else {
			// checkedRow를 commCd 기준으로 그룹화 (Map<commCd, Row[]>)
			const commCdGroups = new Map<string, any[]>();
			for (const item of checkedRow) {
				let rows = commCdGroups.get(item.commCd);
				if (!rows) {
					rows = [];
					commCdGroups.set(item.commCd, rows);
				}
				rows.push(item);
			}

			// 그룹 정보를 기반으로 필요한 메타데이터 계산
			const uniqueCommCdCount = commCdGroups.size;
			const duplicatedGroups = Array.from(commCdGroups.values()).filter(rows => rows.length > 1);
			const hasDuplicates = duplicatedGroups.length > 0;

			// 조건: 고유 commCd가 2개 이상 AND 중복되는 commCd가 존재할 때
			const checkCase = uniqueCommCdCount > 1 && hasDuplicates;

			// ----------------------------------------------------------------------
			// 유효성 검사 로직
			// ----------------------------------------------------------------------

			if (checkCase) {
				// CASE 1: [10, 10, 12, 12] 등 (중복 그룹 내에서만 slctYn 동일해야 함)

				// 중복된 그룹(duplicatedGroups)만 순회하며 검사
				for (const rows of duplicatedGroups) {
					const firstSlctYnInGroup = rows[0].slctYn;

					const isGroupSlctYnSame = rows.every((row: any) => row.slctYn === firstSlctYnInGroup);

					if (!isGroupSlctYnSame) {
						isValidSlctYn = false;
						// 중복 그룹 중 첫 번째 문제가 되는 commCd를 찾아서 메시지 생성
						const offendingCommCd = rows[0].commCd;
						alertMessage = `코드 ${offendingCommCd} 그룹 내의 멀티선택여부가 동일해야 합니다.`;
						break;
					}
				}
			} else {
				// CASE 2: [10, 12] 또는 [10, 10, 10] 케이스 (모든 slctYn 동일해야 함)

				// 첫 번째 항목의 slctYn을 기준으로 잡고, 모든 row가 동일한지 확인
				const firstSlctYn = checkedRow[0].slctYn;
				const isSlctYnAllSame = checkedRow.every((row: any) => row.slctYn === firstSlctYn);

				if (!isSlctYnAllSame) {
					isValidSlctYn = false;
					alertMessage = '선택된 옵션들의 멀티선택여부가 동일해야 합니다.';
				}
			}
		}

		// ----------------------------------------------------------------------
		// 멀티여부 유효성 결과 처리
		// ----------------------------------------------------------------------
		// 멀티여부 유효성 통과
		if (isValidSlctYn) {
			// 코드 존재여부 유효성 체크
			const validParam = checkedRow.map((item: any) => {
				return {
					...item,
					commDtlCd: item.commDtlCd === '0' ? '' : item.commDtlCd,
				};
			});
			apiGetValidateCodeList(validParam).then(res => {
				if (res.status === 200) {
					callBack(checkedRow);
				}
			});
		}
		// 멀티여부 유효성 실패
		else {
			showMessage({
				content: alertMessage,
				modalType: 'info',
			});
		}
	};

	// 메뉴 타이틀에 연결할 함수
	const titleFunc = useMemo(
		() => ({
			searchYn: onClickSearchButton,
			refresh: onClickRefreshButton,
		}),
		[onClickSearchButton, onClickRefreshButton],
	);

	const initEvent = () => {
		// 에디팅 시작 이벤트 바인딩
		gridRef.current.bind('cellEditBegin', function (event: any) {
			const rowIdField = gridRef.current.getProp('rowIdField');
			// 신규행만 수정 가능
			if (
				event.dataField == 'commCd' ||
				event.dataField == 'commDescr' ||
				event.dataField == 'commDtlCd' ||
				event.dataField == 'commDtlDescr'
			) {
				return gridRef.current.isAddedById(event.item[rowIdField]);
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		initEvent();
	}, []);

	return (
		<>
			<PopupMenuTitle name={'기타설정'} func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={searchForm} initialValues={searchBox} isAlwaysVisible>
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						<li>
							<SelectBox
								label="정책코드"
								name="plcycode"
								placeholder={t('msg.MSG_COM_VAL_006', ['정책코드'])}
								initval={selectedCode}
								span={24}
								options={plcycodeList}
								fieldNames={{ label: 'plcycode', value: 'plcycode' }}
							/>
						</li>
						<li>
							<InputText
								label="공통코드/명"
								name="searchVal"
								placeholder={t('msg.MSG_COM_VAL_006', ['공통코드 또는 공통코드명'])}
								onPressEnter={onClickSearchButton}
							/>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={'목록'} totalCnt={totalCount} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.BTN_CANCEL') || '닫기'}</Button>
				<Button type="primary" onClick={callBackFn}>
					확인
				</Button>
			</ButtonWrap>
		</>
	);
};

export default MsCenterPolicyMngCodePopup;
