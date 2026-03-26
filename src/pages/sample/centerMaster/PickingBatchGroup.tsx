/*
 ############################################################################
 # FiledataField	: PickingBatchGroup.tsx
 # Description		: 피킹그룹정보
 # Author			: Canal Frame
 # Since			: 25.04.21
 ############################################################################
 */
import {
	apiCntrPickGroupBatchDetail,
	apiCntrPickGroupBatchList,
	apiCntrPickGroupDcodeList,
	apiSaveCntrPickGroupBatch,
} from '@/api/sample/apiCntrPickGroupBatch';
import { SearchForm } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import DetailCntrPickingGroup from '@/components/sample/centerMaster/DetailCntrPickingGroup';
import InsertCntrPickingGroup from '@/components/sample/centerMaster/InsertCntrPickingGroup';
import SearchCntrPickingGroup from '@/components/sample/centerMaster/SearchCntrPickingGroup';
import { showAlert, showConfirm } from '@/util/MessageUtil';
import { Breadcrumb, Form, Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import dayjs from 'dayjs';

const PickingBatchGroup = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	const [insertForm] = Form.useForm();

	//그리드 데이터 세팅
	const [gridData, setGridData] = useState([]);
	const [searchBox] = useState({});
	const [singleData, setSingleData] = useState({});
	//탭 2의 입력 가능여부
	const [state, setState] = useState(true);
	const [updateChk, setUpdateChk] = useState(false);
	const [dcCodeList, setDcCodeList] = useState([]);
	const [saveRow, setSaveRow] = useState();
	// const [isMoving, setIsMoving] = useState(false);
	const refs: any = useRef(null);
	// 다국어
	const { t } = useTranslation();

	const [tab, setTab] = useState('1');
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 조회함수
	 */
	const search = () => {
		refs.gridRef.current.clearGridData();
		const params = form.getFieldsValue();
		if (chckCud() === false) {
			showAlert(null, t('변경사항이 존재합니다')); // 변경사항이 없습니다
			return false;
		}
		apiCntrPickGroupBatchList(params).then(res => {
			if (tab === '2') {
				setTab('1');
			}

			setGridData(res.data);
			setUpdateChk(false);
			setState(true);
			// //console.log(dcCodeList);
		});
	};

	/**
	 * 저장
	 */
	const save = () => {
		const raw = insertForm.getFieldsValue();
		const grid = refs.gridRef.current;

		chckCud();
		// 변경사항 체크
		if (updateChk === true) {
			showConfirm(null, t('com.msg.confirmSave'), () => {
				const insertParams = {
					...raw,
				};

				apiSaveCntrPickGroupBatch([insertParams]).then(res => {
					showAlert(null, t('저장되었습니다')); // 저장되었습니다

					const rowIndex = grid.getSelectedIndex()[0];

					// setTab('1');

					searchDetail(rowIndex);
				});
			});
		} else {
			showAlert(null, t('com.msg.noChange')); // 변경사항이 없습니다
		}
	};
	/**
	 * 상세조회
	 * @param row
	 * @param rowindex
	 * @param rowIndex
	 */
	const searchDetail = (rowIndex: number) => {
		const grid = refs.gridRef.current;
		const searchParam = grid.getItemByRowIndex(rowIndex);

		if (!searchParam) {
			showAlert(null, t('데이터가 존재하지 않습니다.')); // 데이터가 존재하지 않습니다.
			return;
		}

		apiCntrPickGroupBatchDetail(searchParam).then(res => {
			if (res.data.length === 0) {
				showAlert(null, t('데이터가 존재하지 않습니다.')); // 데이터가 존재하지 않습니다.
				return;
			}

			setSingleData({ ...res.data[0] });
			setState(true);
			setTab('2');
		});
	};
	/**
	 * 변경 사항 체크
	 * @param changedValues
	 * @param allValues
	 */
	const onFormChange = (changedValues: any, allValues: any) => {
		// 시리얼키로 신규, 수정 구분
		if (!singleData?.serialkey) {
			insertForm.setFieldsValue({ flag: 'I' });
		} else {
			insertForm.setFieldsValue({ flag: 'U' });
		}

		setUpdateChk(true);
	};

	const chckCud = () => {
		if (state === true && (insertForm.getFieldsValue().flag === 'I' || insertForm.getFieldsValue().flag === 'U')) {
			// //console.log('state = ' + state);
			// showAlert(null, t('com.msg.noChange')); // 변경사항이 없습니다
			return false;
		}
	};
	/**
	 * 입력탭 하단의 이전,다음 버튼
	 * @param event
	 * @returns
	 */

	const onClickNext = () => {
		if (chckCud() === false) {
			showAlert(null, t('변경사항이 존재합니다')); // 변경사항이 없습니다
			return false;
		}
		const grid = refs.gridRef.current;
		const selected = grid.getSelectedIndex()[0];

		// let targetRow = selected[0];

		grid.setSelectionByIndex(selected + 1);

		searchDetail(selected + 1);
	};
	const onClickPrev = () => {
		if (chckCud() === false) {
			showAlert(null, t('변경사항이 존재합니다')); // 변경사항이 없습니다
			return false;
		}
		const grid = refs.gridRef.current;
		const selected = grid.getSelectedIndex()[0];

		// let targetRow = selected[0];

		grid.setSelectionByIndex(selected - 1);

		searchDetail(selected - 1);
	};
	const new1 = () => {
		if (chckCud() === false) {
			showAlert(null, t('변경사항이 존재합니다')); // 변경사항이 없습니다
			return false;
		}
		setState(false);

		setSingleData({});
		setTab('2');
		// insertForm.setFieldValue({ ...singleData });
	};

	//CRUD 설정
	const titleFunc = {
		searchYn: search,
		saveYn: save,
		newYn: new1,
		// insertYn: insert,
	};
	/**
	 * 날짜 세팅
	 */
	const initFormData = {
		datePickerbasic1: dayjs(),
		datePickerbasic2: dayjs(),
	};

	useEffect(() => {
		if (!refs.gridRef.current) {
			//console.warn('AUIGrid ref 연결 안됨');
			return;
		}

		refs.gridRef.current.bind('cellDoubleClick', function () {
			const rowIndex = refs.gridRef.current.getSelectedIndex()[0];

			searchDetail(rowIndex);
		});
	}, []);
	/**
	 * 물류센터 리스트 조회
	 */
	useEffect(() => {
		apiCntrPickGroupDcodeList().then(res => {
			const dcCodeList = res.data.map((item: any) => ({
				cdNm: item.cdNm,
				comCd: item.comCd,
				description: item.description,
				// //console.log(item.cdNm);
			}));
			setDcCodeList(dcCodeList);
			// //console.log(dcCodeList);
		});

		// 다국어 처리
	}, []);
	return (
		<>
			<Form form={form} initialValues={initFormData}>
				<MenuTitle func={titleFunc} authority="searchYn|saveYn|newYn" />
				<Breadcrumb
					separator=">"
					items={[{ title: '기준정보' }, { title: '센터기준정보' }, { title: '피킹그룹정보' }]}
				/>

				<Tabs activeKey={tab} onChange={(key: string) => setTab(key)}>
					<TabPane tab="조회" key="1">
						<div>
							<SearchForm form={form} initialValues={searchBox}>
								<SearchCntrPickingGroup search={search} />
							</SearchForm>
							<DetailCntrPickingGroup ref={refs} data={gridData} />
						</div>
					</TabPane>
					<TabPane tab="입력" key="2">
						<InsertCntrPickingGroup
							data={singleData}
							state={state}
							onFormChange={onFormChange}
							insertForm={insertForm}
							onClickNext={onClickNext}
							onClickPrev={onClickPrev}
							dcList={dcCodeList}
						/>
					</TabPane>
				</Tabs>
			</Form>
		</>
	);
};
export default PickingBatchGroup;
