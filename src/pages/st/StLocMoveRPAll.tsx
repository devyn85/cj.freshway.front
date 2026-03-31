/*
 ############################################################################
 # FiledataField	: StLocMoveRPAll.tsx
 # Description		: 출고재고보충(전센터)
 # Author			: 공두경
 # Since			: 25.09.16
 ############################################################################
*/
import { Form } from 'antd';

//Api
import { apiGetMasterList, apiSave, apiSavePrint } from '@/api/st/apiStLocMoveRPAll';

//Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import StLocMoveRPAllSearch from '@/components/st/locMoveRPAll/StLocMoveRPAllSearch';
import StLocMoveRPAllTap1Detail from '@/components/st/locMoveRPAll/StLocMoveRPAllTap1Detail';
import StLocMoveRPAllTap2Detail from '@/components/st/locMoveRPAll/StLocMoveRPAllTap2Detail';
import { useAppSelector } from '@/store/core/coreHook';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

//Util

// lib
const StLocMoveRPAll = () => {
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [gridData2, setGridData2] = useState([]);
	const [activeKeyMaster, setActiveKeyMaster] = useState('1');
	const [totalCnt, setTotalCnt] = useState(0);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const refs: any = useRef(null);
	const refs2: any = useRef(null);
	const [loopTrParams, setLoopTrParams] = useState({});
	const modalRef = useRef(null);
	const { t } = useTranslation();

	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		dccode: globalVariable.gDccode,
		storagetype: null,
		lottable01yn: null,
		stocktype: null,
		stockGrade: null,
		zone: null,
		ifflagyn: null,
	});

	const searchMasterList = () => {
		const params = form.getFieldsValue();

		if (commUtil.isNull(params.searchDate)) {
			showAlert('', '출고일자를 선택해주세요.');
			return;
		}
		params.docdt = params.searchDate.format('YYYYMMDD');

		if (activeKeyMaster === '1') {
			// 보충생성
			params.reasoncode2 = '01';
		} else if (activeKeyMaster === '2') {
			// 보충생성(2차)
			params.reasoncode2 = '02';
		}
		apiGetMasterList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	const save = (type: string) => {
		const searchParams = form.getFieldsValue();

		if (commUtil.isNull(searchParams.searchDate)) {
			showAlert('', '출고일자를 선택해주세요.');
			return;
		}
		searchParams.docdt = searchParams.searchDate.format('YYYYMMDD');
		searchParams.slipdt = searchParams.searchDate.format('YYYYMMDD');

		let command = '';
		let checkedRows = [];

		if (activeKeyMaster === '1') {
			// 보충생성
			if (type === 'CREATION') {
				command = 'CREATION';
			} else if (type === 'SETTASK') {
				checkedRows = refs.gridRef.current.getCheckedRowItemsAll();
			} else if (type === 'CONFIRM') {
				checkedRows = refs.gridRef.current.getCheckedRowItemsAll();
			} else if (type === 'DELETE') {
				checkedRows = refs.gridRef.current.getCheckedRowItemsAll();
			} else if (type === 'PRINT') {
				checkedRows = refs.gridRef.current.getCheckedRowItemsAll();
			}
		} else if (activeKeyMaster === '2') {
			// 보충생성(2차)
			if (type === 'CREATION') {
				command = 'CREATION_SEC';
			} else if (type === 'SETTASK') {
				//asis에는 2차 탭의 자료는 보충지시 하지 않음.
				//tobe에서는 사용할지 확인 필요
				checkedRows = refs2.gridRef.current.getCheckedRowItemsAll();
			} else if (type === 'CONFIRM') {
				checkedRows = refs2.gridRef.current.getCheckedRowItemsAll();
			} else if (type === 'DELETE') {
				//asis에는 2차 탭의 자료는 보충지시 하지 않음.
				//tobe에서는 사용할지 확인 필요
				checkedRows = refs2.gridRef.current.getCheckedRowItemsAll();
			} else if (type === 'PRINT') {
				checkedRows = refs2.gridRef.current.getCheckedRowItemsAll();
			}
		}
		if (type === 'CREATION') {
			// 보충생성
			showConfirm(null, t('msg.MSG_COM_CFM_020', ['보충생성']), () => {
				const params = {
					apiUrl: '/api/st/locMoveRPAll/v1.0/save',
					avc_COMMAND: command,
					slipdt: searchParams.slipdt,
					sku: searchParams.sku,
					fromzone: searchParams.fromzone,
					tozone: searchParams.tozone,
					type: type,
				};
				apiSave(params).then(res => {
					if (res.statusCode > -1) {
						showAlert('', t('msg.MSG_COM_SUC_999', ['보충생성 작업이 완료되었습니다.'])); // 작업이 완료되었습니다.
						searchMasterList(); // 검색 함수 호출
					}
				});
			});
		} else if (type === 'SETTASK') {
			// 보충지시

			// 선택된 행이 없으면 경고 메시지 표시
			if (!checkedRows || checkedRows.length < 1) {
				showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
				return;
			}

			// ifflagyn이 'N'인 행만 필터링
			const paramRows1 = checkedRows.filter((item: any) => ['N'].includes(item.ifflagyn));
			const paramRows2 = checkedRows.filter((item: any) => !['90'].includes(item.status));

			if (paramRows1.length > 0 && paramRows2.length > 0) {
				showConfirm(null, t('msg.MSG_COM_CFM_020', ['보충지시']), () => {
					const params = {
						apiUrl: '/api/st/locMoveRPAll/v1.0/save',
						avc_COMMAND: 'SETTASK',
						saveDataList: checkedRows, // 선택행에 대해 지시된것과 지시한것을 looptranpopup에서 처리하기 위해 모두 전달
						type: type,
					};

					setLoopTrParams(params);
					modalRef.current.handlerOpen();
				});
			} else if (paramRows1.length <= 0) {
				showAlert(null, '보충지시 완료된 품목  입니다.');
				return;
			} else if (paramRows2.length <= 0) {
				showAlert(null, '보충이동 완료된 품목  입니다.');
				return;
			}
		} else if (type === 'CONFIRM') {
			// 일반보충이동
			// 선택된 행이 없으면 경고 메시지 표시
			if (!checkedRows || checkedRows.length < 1) {
				showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
				return;
			}

			const paramRows1 = checkedRows.filter((item: any) => ['N'].includes(item.ifflagyn));
			const paramRows2 = checkedRows.filter((item: any) => ['90'].includes(item.status));

			if (paramRows1.length > 0) {
				showAlert(null, '보충지시 된 전표만 확정 가능합니다.');
				return;
			}
			if (paramRows2.length > 0) {
				showAlert(null, '보충이동 안된 전표만 보충이동 가능합니다.');
				return;
			}

			showConfirm(null, t('msg.MSG_COM_CFM_020', ['보충이동']), () => {
				const params = {
					apiUrl: '/api/st/locMoveRPAll/v1.0/save',
					avc_COMMAND: 'CONFIRM',
					saveDataList: checkedRows, // 선택된 행의 데이터
					type: type,
				};

				setLoopTrParams(params);
				modalRef.current.handlerOpen();
			});
		} else if (type === 'DELETE') {
			// 보충삭제

			// 선택된 행이 없으면 경고 메시지 표시
			if (!checkedRows || checkedRows.length < 1) {
				showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
				return;
			}

			// ifflagyn이 'N'인 행만 필터링
			const paramRows = checkedRows.filter(
				(item: any) => ['N'].includes(item.ifflagyn) && ['10'].includes(item.status),
			);

			if (checkedRows.length > paramRows.length) {
				showAlert(null, '확정 및 보충지시 전인 전표만 삭제 가능합니다.');
				return;
			}
			if (paramRows.length > 0) {
				showConfirm(null, t('msg.MSG_COM_CFM_020', ['보충삭제']), () => {
					const params = {
						apiUrl: '/api/st/locMoveRPAll/v1.0/save',
						avc_COMMAND: 'DELETE',
						saveDataList: paramRows, // 선택된 행의 데이터
						type: type,
					};

					setLoopTrParams(params);
					modalRef.current.handlerOpen();
				});
			} else {
				showAlert(null, '보충삭제가 가능한 데이터가 없습니다.');
				return;
			}
		} else if (type === 'PRINT') {
			// 리스트

			// 선택된 행이 없으면 경고 메시지 표시
			if (!checkedRows || checkedRows.length < 1) {
				showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
				return;
			}

			//showConfirm(null, t('출력하시겠습니까?', []), () => {
			// 인쇄 를/을 처리하시겠습니까?
			//showConfirm(null, t('msg.MSG_COM_CFM_023', [t('lbl.PRINT')]), async () => {
			// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
			showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
				const params = {
					apiUrl: '/api/st/locMoveRPAll/v1.0/print',
					avc_COMMAND: 'PRINT',
					printmemo: searchParams.printmemo,
					saveDataList: checkedRows, // 선택된 행의 데이터
					type: type,
				};

				apiSavePrint(params).then(res => {
					const printData = res.data;
					if (res.statusCode > -1) {
						if (printData && printData.length > 0) {
							// 출력 기능 구현 필요(개발중)

							//showAlert('', '출력 기능 구현 필요(개발중)'); // 출력할 데이터가 없습니다.
							viewRdReportMaster(printData);
						} else {
							showAlert('', t('msg.noPrintData')); // 출력할 데이터가 없습니다.
						}
					}
				});
			});
		}
	};

	/**
	 * 리포트 뷰어 열기
	 * @param params
	 */
	const viewRdReportMaster = (params: any) => {
		// 리포트 파일명
		const fileName = 'ST_LocMoveRP_All.mrd';

		// 리포트에 전송할 파라미터
		const reprotParams = {};

		// 리포트에 XML 생성을 위한 DataSet 생성
		const dataSet = { ds_report: params };

		reportUtil.openAgentReportViewer(fileName, dataSet, reprotParams);
	};

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string, e: any) => {
		if (key === '1') {
			setActiveKeyMaster('1');
			if (refs.gridRef.current) {
				refs.gridRef.current?.resize('100%', '100%');
			}
		} else if (key === '2') {
			setActiveKeyMaster('2');
			if (refs2.gridRef?.current) {
				refs2.gridRef?.current?.resize('100%', '100%');
			}
		}
		return;
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
		searchMasterList(); // 검색 함수 호출
	};

	const titleFunc = {
		searchYn: searchMasterList,
	};
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StLocMoveRPAllSearch ref={refs} search={searchMasterList} form={form} activeKey={activeKeyMaster} />
			</SearchFormResponsive>
			<Tabs activeKey={activeKeyMaster} onTabClick={tabClick} className="contain-wrap">
				<TabPane tab="보충생성" key="1">
					<StLocMoveRPAllTap1Detail
						ref={refs}
						form={form}
						data={gridData}
						totalCnt={totalCnt}
						save={save}
						search={searchMasterList}
					/>
				</TabPane>
				<TabPane tab="보충생성(2차)" key="2">
					<StLocMoveRPAllTap2Detail
						ref={refs2}
						form={form}
						data={gridData2}
						totalCnt={totalCnt2}
						save={save}
						search={searchMasterList}
					/>
				</TabPane>
			</Tabs>
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
};

export default StLocMoveRPAll;
