/*
############################################################################
 # FiledataField	: TmHjdPopUp.tsx
 # Description		: 센터별구간설정(행정동팝업)
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 2025.09.12
 ############################################################################
*/
// css
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

// component
import { SearchForm } from '@/components/common/custom/form';

// Hooks
import { useThrottle } from '@/hooks/useThrottle';

// API Call Function
import { apigetHjdDataList } from '@/api/tm/apiTmDistanceBand';
import PopupMenuTitle2 from '@/components/common/custom/PopupMenuTitle2';

interface PropsType {
	// type?: string;
	callBack?: any;
	close?: any;
	codeName?: string;
	data: any;
}

const TmHjdPopUp = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack } = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const gridRef = useRef(null);

	const throttle = useThrottle();

	// scroll Paging
	const [gridData, setGridData] = useState([]);
	const [pageSizeScr] = useState(constants.PAGE_INFO.PAGE_SIZE);
	const [totalCount, setTotalCount] = useState(0);

	const [searchBox] = useState({
		codeName: '',
	});

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const gridId = uuidv4() + '_gridWrap';

	const gridCol = [
		{
			headerText: '행정동명',
			dataField: 'cdNm',
			width: 246,
		},
		{
			headerText: '행정동코드',
			dataField: 'hjdongCd',
			visible: false,
		},

		{
			dataField: 'parentCd',
			visible: false,
		},
		{
			dataField: 'rowId',
			visible: false,
		},
	];

	const gridProps = {
		editable: false,
		enterKeyColumnBase: true,
		useContextMenu: false,
		enableFilter: false,
		// 헤더 표시하지 않음
		showHeader: false,
		// 줄번호 칼럼 렌더러 출력 안함
		showRowNumColumn: false,
		// singleRow 선택모드
		selectionMode: 'singleRow',
		hoverMode: 'singleRow',
		// 트리 컬럼(즉, 폴딩 아이콘 출력 칼럼) 을 인덱스1번으로 설정함(디폴트 0번임)
		treeColumnIndex: 0,
		// 최초 보여질 때 모두 열린 상태로 출력 여부 -> 이 설정이 적용되지 않아서 그리드의 ready 이벤트에서 collapseAll() 호출함
		displayTreeOpen: false,
		// 일반 데이터를 트리로 표현할지 여부(treeIdField, treeIdRefField 설정 필수)
		flat2tree: true,
		// 행의 고유 필드명
		// rowIdField: 'rowId',
		// 트리의 고유 필드명
		treeIdField: 'hjdongCd',
		rowCheckDependingTree: true,
		showRowCheckColumn: true,
		// 계층 구조에서 내 부모 행의 treeIdField 참고 필드명
		treeIdRefField: 'parentCd',
		// 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		fillColumnSizeMode: false,
		// treeIconFunction: function (rowIndex, isBranch, isOpen, depth, item) {
		// 	let imgSrc = null;
		// 	if (item.hjdongCd) {
		// 		imgSrc = null;
		// 	}

		// 	return imgSrc;
		// },
		treeIconFunction: () => {
			return false;
		},
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	interface HjdNode {
		hjdongCd: string;
		parentCd?: string | null;
		// 필요하면 ctpKorNm, sigKorNm, hjdongNm 등 더 쓸 수 있음
	}

	// parent(=hjdongCd) -> child hjdongCd[] 맵 만들기
	/**
	 *
	 * @param nodes
	 */
	function buildParentMap(nodes: HjdNode[]) {
		const parentToChildren = new Map<string, string[]>();

		nodes.forEach(n => {
			if (n.parentCd) {
				const arr = parentToChildren.get(n.parentCd) ?? [];
				arr.push(n.hjdongCd);
				parentToChildren.set(n.parentCd, arr);
			}
		});

		return parentToChildren;
	}

	// 선택된 hjdongCd 목록을 부모 기준으로 압축
	/**
	 *
	 * @param allNodes
	 * @param selectedIds
	 */
	function compressSelection(allNodes: HjdNode[], selectedIds: string[]): string[] {
		const parentToChildren = buildParentMap(allNodes);
		//console.log(('compressSelection | allNodes', allNodes);
		//console.log(('compressSelection | selectedIds', selectedIds);
		//console.log(('parentToChildren', parentToChildren);

		const selected = new Set(selectedIds);
		let changed = true;

		while (changed) {
			changed = false;

			for (const [parentId, childIds] of parentToChildren.entries()) {
				if (!childIds.length) continue;

				const allChildrenSelected = childIds.every(id => selected.has(id));

				if (allChildrenSelected) {
					// 자식들 제거
					childIds.forEach(id => selected.delete(id));
					// 부모 추가 (이미 선택되어 있어도 상관 없음)
					if (!selected.has(parentId)) {
						selected.add(parentId);
						changed = true;
					}
				}
			}
		}

		return Array.from(selected);
	}

	const init = () => {
		gridRef.current.clearGridData();
		// search(true, form.getFieldValue(name), form.getFieldValue('multiSelect'));
		const param = {};
		apigetHjdDataList(param).then((res: any) => {
			setGridData(res.data);
		});
	};

	/**
	 * 메뉴 타이틀에 연결할 함수
	 */
	const titleFunc = () => {
		/**/
	};

	/**
	 * 행 선택
	 */
	const selectRowData = () => {
		const selectedRow = gridRef.current.getSelectedRows();
		//console.log((selectedRow);
		callBack(selectedRow);
	};

	// /**
	//  * 확인
	//  * @param event
	//  */
	// const checkRowData = (event: any) => {
	// 	//console.log((event);
	// 	const selectRow = gridRef.current.getCheckedRowItemsAll();
	// 	// //console.log((checkedRow);
	// 	if (selectRow.length === 0) {
	// 		const checkedRow = gridRef.current.getSelectedRows();
	// 		//console.log((checkedRow);
	// 		if (checkedRow.length > 0) {
	// 			callBack(checkedRow);
	// 		}
	// 		return;
	// 	}
	// 	callBack(selectRow);
	// };
	const checkRowData = (event: any) => {
		//console.log((event);

		// 1) 체크된 행 가져오기
		const checkedRows = gridRef.current.getCheckedRowItemsAll();

		// 아무 것도 체크 안 했으면: 기존 로직 그대로 (선택 행 한 줄만 콜백)
		if (!checkedRows || checkedRows.length === 0) {
			const selectedRows = gridRef.current.getSelectedRows();
			//console.log((selectedRows);
			if (selectedRows.length > 0) {
				callBack(selectedRows);
			}
			return;
		}

		// 2) 체크된 행들의 hjdongCd만 추출
		const selectedIds = checkedRows.map((r: any) => r?.hjdongCd).filter((v: any) => !!v) as string[];
		//console.log(('checkedRows', checkedRows);
		//console.log(('selectedIds', selectedIds);
		//console.log(('checkedRows', checkedRows);
		//console.log(('gridData', gridData);
		// 3) gridData(전체 행정동) 기준으로 부모 압축
		const compressedIds = compressSelection(gridData as HjdNode[], selectedIds);

		// 4) hjdongCd -> node 매핑 (row 만들어 줄 용도)
		const nodeMap = new Map<string, any>();
		(gridData as any[]).forEach(n => {
			if (n.hjdongCd) {
				nodeMap.set(n.hjdongCd, n);
			}
		});
		//console.log((compressedIds);
		// 5) 압축된 ID 기준으로 최종 콜백용 배열 생성
		//    getCheckedRowItemsAll()가 { rowIndex, item } 형태를 주니까
		//    모양을 최대한 맞춰서 넘겨줌
		const finalRows = compressedIds
			.map(id => {
				const item = nodeMap.get(id);
				if (!item) return null;
				return {
					// rowIndex: -1, // rowIndex는 크게 중요하지 않으면 -1로
					item,
				};
			})
			.filter(v => v !== null);
		//console.log((finalRows);
		// 6) 부모 페이지로 전달
		callBack(finalRows.map(row => row.item));
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	/**
	 * 그리드 더블클릭시 해당 로우 부모페이지에 표시
	 */
	useEffect(() => {
		init();
	}, []);

	/**
	 * 부모페이지의 검색어를 가져온다.
	 *  - 검색어에 관계없이 전체 데이터를 조회한다.
	 */

	/**
	 * data가 조회되면 그리드에 바인딩
	 */
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(gridData);
		}
	}, [gridData]);

	/**
	 * 그리드 데이터 바인딩 이벤트
	 */
	useEffect(() => {
		gridRef.current.bind('ready', () => {
			// 그리드 데이터 바인딩 후에 트리를 모두 닫기로 설정
			gridRef.current.collapseAll();
		});
	});

	/**
	 * 그리드 셀 더블클릭 이벤트 - 해당 로우를 부모페이지에 표시
	 */
	useEffect(() => {
		gridRef.current.bind('cellDoubleClick', (event: any) => {
			//console.log((event);
			// const selectedRow = gridRef.current.getSelectedRow();
			// //console.log((selectedRow);
			// selectRowData();
			callBack([event.item]);
		});
	});

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle2 name="행정동 조회" func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
				{/* 그리드 영역 */}
				<AGrid>
					<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} name={gridId} />
				</AGrid>

				<ButtonWrap data-props="single">
					<Button onClick={props.close}>취소</Button>
					<Button type="primary" onClick={checkRowData}>
						확인
					</Button>
				</ButtonWrap>
			</SearchForm>
		</>
	);
};

export default TmHjdPopUp;
