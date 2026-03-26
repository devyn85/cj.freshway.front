/*
 ############################################################################
 # FiledataField	: IbExpenseApprovalRequestPopup.tsx
 # Description		: 외부창고정산 - 결재상신 팝업 
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.08.10
 ############################################################################
 */

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';

// Type
import { GridBtnPropsType } from '@/types/common';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputSearch } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import IbExpenseApprovalUserPopup from '@/components/ib/expense/IbExpenseApprovalUserPopup';

// Utils

// API Call Function
import { apiPostPopupApprovalExpenseInfo, apiPostPopupApprovalUserInfo } from '@/api/ib/apiIbExpense';
import GridTopBtn from '@/components/common/GridTopBtn';

interface PropsType {
	callBack?: any;
	close?: any;
	selectedItems?: any;
	dccode: any;
}

const IbExpenseApprovalRequestPopup = forwardRef((props: PropsType, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { serialkey, callBack, close } = props;

	// 다국어
	const { t } = useTranslation();

	// Antd Form 사용
	const [form] = Form.useForm();

	// 컴포넌트 접근을 위한 Ref
	const gridRef: any = useRef(null);

	// 결재자 선택 팝업 Ref
	const refApprovalUserModal = useRef(null);

	// searchForm data 초기화
	const [searchBox] = useState({});

	// 트랜잭션 팝업 Ref
	const refTranModal = useRef(null);

	// loop transaction params
	const [loopTrParams, setLoopTrParams] = useState({});

	// transaction 처리 건수
	const [trProcessCnt, setTrProcessCnt] = useState({});

	// 결재자 검색어
	const [useridnm, setUseridnm] = useState('');

	// 그리드 칼럼 레이아웃 설정
	const gridCol = [
		// {
		// 	headerText: '결재선', //결재선
		// 	dataField: 'description',
		// },
		{
			dataField: 'requesttype',
			headerText: '유형', //유형
			visible: false,
		},
		{
			dataField: 'requesttypename',
			headerText: '유형', //유형
			dataType: 'code',
			visible: true,
		},
		{
			dataField: 'userId',
			headerText: '사용자ID', //사용자ID
			dataType: 'code',
			visible: true,
		},
		{
			dataField: 'userNm',
			headerText: '사용자이름', //사용자이름
			dataType: 'code',
			visible: true,
		},
		{
			dataField: 'storernm',
			headerText: '고객사명', //고객사명
			dataType: 'code',
			visible: true,
		},
		{
			dataField: 'deptnm',
			headerText: '부서명', //부서명
			dataType: 'code',
			visible: true,
		},
		{
			dataField: 'email',
			headerText: '이메일', //이메일
			dataType: 'string',
			visible: true,
		},
	];

	// 그리드 속성 설정
	const gridProps = {
		editable: false,
		fillColumnSizeMode: true,
		enableColumnResize: true,
		selectionMode: 'singleRow',
		isLegacyRemove: true,
		softRemoveRowMode: false,
		//enableDragByCellDrag: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 *
	 * @param rowIndex
	 * @param rowData
	 * @returns
	 */
	const getFormatDescription = (rowIndex, rowData) => {
		return (
			rowIndex +
			' / ' +
			(rowData.requesttype === '0' ? '기안' : rowData.requesttype === '2' ? '결재' : rowData.requesttype) +
			' / ' +
			rowData.userId +
			' / ' +
			rowData.userNm +
			' ' +
			rowData.storernm +
			'/' +
			rowData.deptnm
		);
	};

	/**
	 * 제목 조회
	 */
	const searchExpenseInfo = () => {
		// 조회 조건 설정
		const params = {
			serialkey: props.serialkey,
		};

		apiPostPopupApprovalExpenseInfo(params).then((res: any) => {
			if (res.data) {
				const title =
					'[통관전비용] ' +
					res.data[0].adjustmentSupplierName +
					' /  ' +
					res.data[0].amount +
					' (' +
					res.data[0].amountUnit +
					')' +
					' / ' +
					res.data[0].summary;

				form.setFieldValue('title', title);
			}
		});
	};

	/**
	 * 결재자 조회
	 * @param requsttype
	 */
	const searchApprovalUserInfo = (requsttype: any) => {
		// 조회 조건 설정
		const params = {
			requesttype: requsttype,
		};

		apiPostPopupApprovalUserInfo(params).then((res: any) => {
			gridRef.current?.setGridData(res.data);
		});
	};

	const getGridDataString = () => {
		const data = gridRef.current.getGridData();
		if (!data || data.length === 0) return '';

		// 컬럼 순서에 맞게 컬럼명 배열을 만듭니다.
		//const columns = gridCol.filter(col => col.visible !== false).map(col => col.dataField);
		const columns = gridCol.map(col => col.dataField);

		// 각 행을 컬럼 순서대로 콤마로 join, 행은 |로 join
		const result = data.map(row => columns.map(col => row[col]).join(',')).join('|');

		return result;
	};

	/**
	 * 요청 버튼 클릭
	 */
	const saveMaster = async () => {
		// 필수 입력 값 검증
		const checkedItems = gridRef.current.getGridData();

		if (checkedItems.length < 2) {
			const msg = '결재선을 추가하세요.';
			showMessage({
				content: msg,
				modalType: 'warning',
			});
			return;
		}

		// 대상 항목
		const serialkeyList: any[] = [];
		for (const sl of props.selectedItems) {
			const item = { serialkey: sl };
			serialkeyList.push(item);
		}

		// 결재라인
		const gridData = getGridDataString();

		// API 실행
		const msg = '승인요청 하시겠습니까?';
		showConfirm(null, msg, () => {
			// loop transaction
			const saveParams = {
				apiUrl: '/api/ib/expense/v1.0/saveApprovalRequest',
				avc_DCCODE: props.dccode,
				apprUsers: gridData,
				saveDataList: serialkeyList,
			};

			setLoopTrParams(saveParams);
			refTranModal.current.handlerOpen();
		});
	};

	/**
	 * 결재자 선택 팝업 오픈
	 */
	const openApprovalUserPopup = () => {
		refApprovalUserModal.current.handlerOpen();
	};

	/**
	 * 결재자 선택 팝업 닫기
	 */
	const closeEventApprovalUserPopup = () => {
		refApprovalUserModal.current.handlerClose();

		setUseridnm('');
		form.setFieldValue('useridnm', '');
	};

	/**
	 * 결재자 선택 팝업 처리 후 콜백
	 * @param param
	 */
	const callBackApprovalUserPopup = (param: any) => {
		const items = gridRef.current.getGridData();
		const dupleItems = items.filter((v: any) => v['userId'] === param.userId);

		setUseridnm('');
		form.setFieldValue('useridnm', '');

		if (dupleItems && dupleItems.length > 0) {
			const msg = '선택하신 사원은 이미 결재선에 포함되어 있습니다.';
			showMessage({
				content: msg,
				modalType: 'warning',
			});
		} else {
			const item = {
				userId: param.userId,
				userNm: param.userNm,
				storernm: param.storernm,
				deptnm: param.deptnm,
				email: param.email,
				requesttype: '2',
				requesttypename: '결재',
			};

			gridRef.current.appendData(item);
		}
	};

	/**
	 * 트랜잭션 팝업 닫기
	 */
	const closeEventTranPopup = () => {
		refTranModal.current.handlerClose();

		if (trProcessCnt) {
			if (trProcessCnt.total === trProcessCnt.success) {
				props.callBack();
			}
		}
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'down', // 아래로
					callBackFn: moveRowsToUp,
				},
				{
					btnType: 'up', // 위로
					callBackFn: moveRowsToDown,
				},
				{
					btnType: 'delete', // 삭제
					callBackFn: deleteUser,
					isActionEvent: false,
				},
			],
		};

		return gridBtn;
	};

	/**
	 * 선택 행들 아래로 한 단계 위로 올림
	 */
	const moveRowsToDown = () => {
		const selectedItem = gridRef.current.getSelectedItems()[0];

		if (selectedItem.item.requesttype === '0') {
			return;
		}

		if (selectedItem.rowIndex === 1) {
			return;
		}

		gridRef.current.moveRowsToUp();
	};

	/**
	 *선택 행들 위로 한 단계 아내로 내림
	 */
	const moveRowsToUp = () => {
		const selectedItem = gridRef.current.getSelectedItems()[0];

		if (selectedItem.item.requesttype === '0') {
			return;
		}

		gridRef.current.moveRowsToDown();
	};

	const deleteUser = () => {
		const items = gridRef.current.getSelectedRows();

		if (!items || items.length < 1) {
			const msg = '삭제할 행을 선택하세요.';
			showMessage({
				content: msg,
				modalType: 'warning',
			});
			return;
		}

		if (items[0].requesttype === '0') {
			const msg = '요청자는 삭제할 수 없습니다.';
			showMessage({
				content: msg,
				modalType: 'warning',
			});
			return;
		}

		const selectedItem = gridRef.current.getSelectedItems()[0];
		gridRef.current.removeRow(selectedItem.rowIndex);
	};

	// 메뉴 타이틀에 연결할 함수
	const titleFunc = {
		//searchYn: onClickSearchButton,
		//refresh: onClickRefreshButton,
		//saveYn: save,
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		searchApprovalUserInfo('0');
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={'결재라인'} func={titleFunc} />

			<Form form={form}>
				<UiDetailViewArea>
					<UiDetailViewGroup>
						<li style={{ gridColumn: '1 / span 4' }}>
							<InputSearch
								label={t('')}
								name="useridnm"
								onChange={(e: any) => setUseridnm(e.target.value)}
								onSearch={openApprovalUserPopup}
							/>
						</li>
					</UiDetailViewGroup>
				</UiDetailViewArea>
			</Form>

			{/* 그리드 영역 정의 */}
			<AGrid>
				<GridTopBtn gridTitle={''} gridBtn={getGridBtn()} totalCnt={0}></GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>닫기</Button>
				<Button onClick={saveMaster}>Approval Request</Button>
			</ButtonWrap>

			{/* 결재자 팝업 영역 정의 */}
			<CustomModal ref={refApprovalUserModal} width="1000px">
				<IbExpenseApprovalUserPopup
					callBack={callBackApprovalUserPopup}
					close={closeEventApprovalUserPopup}
					useridnm={useridnm}
				/>
			</CustomModal>

			{/* 트랜잭션 팝업 영역 정의 */}
			<CustomModal ref={refTranModal} width="1000px">
				<CmLoopTranPopup
					popupParams={loopTrParams}
					close={closeEventTranPopup}
					onResultChange={(success: number, fail: number, total: number) => {
						const tr = { total: total, success: success, fail: fail };
						setTrProcessCnt(tr);
					}}
				/>
			</CustomModal>
		</>
	);
});

export default IbExpenseApprovalRequestPopup;
