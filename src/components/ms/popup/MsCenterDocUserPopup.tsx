/*
 ############################################################################
 # FiledataField	: MsCenterDocUserPopup.tsx
 # Description		: 센터서류 담당자 조회 팝업
 # Author			: jangjaehyun
 # Since			: 25.09.02
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
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

// component
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputText, SearchForm, SelectBox } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// Type
import { GridBtnPropsType } from '@/types/common';

//Store
import { getUserDccodeList } from '@/store/core/userStore';

// API Call Function
import { apiGetAllUserPopupList } from '@/api/cm/apiCmSearch';
import { apiGetMasterList, apiPostSaveMasterList } from '@/api/ms/apiMsCenterDocUser';
import CmIndividualPopup from '@/components/cm/popup/CmIndividualPopup';
import { isEmpty } from 'lodash';

/**
 * =====================================================================
 *	01. 변수 선언부
 * =====================================================================
 */
interface MsCenterDocUserPopupProps {
	callBack?: any;
	close?: any;
	search?: any;
	parentFormValues?: any;
}

const MsCenterDocUserPopup = forwardRef(
	({ callBack, close, search, parentFormValues }: MsCenterDocUserPopupProps, ref: any) => {
		const { t } = useTranslation();
		const gridRef = useRef(null);
		const userDccodeList = getUserDccodeList('') ?? [];
		const [form] = Form.useForm();
		//조회 팝업
		const modalRef = useRef(null);

		const [popupList, setPopupList] = useState([]);
		const [totalCount, setTotalCount] = useState(0);
		const [selectedDcCode, setSelectedDcCode] = useState([]);

		const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
		// 개인정보 팝업
		const refModalIndividualPop = useRef(null);
		const [popUpParams, setPopUpParams] = useState({});

		const [searchBox] = useState({
			multiDcCode: [gDccode],
			userNm: '',
			delYn: 'N',
		});

		const gridId = uuidv4() + '_gridWrap';

		// 그리드 초기화
		const gridCol = [
			{
				dataField: 'dcCode',
				headerText: t('lbl.DCCODE'),
				dataType: 'code',
				commRenderer: {
					type: 'dropDown',
					list: userDccodeList,
					keyField: 'dccode',
					valueField: 'dcname',
				},
				filter: {
					showIcon: true,
				},
				required: true,
			},
			// {
			// 	dataField: 'dcName',
			// 	headerText: t('lbl.DCNAME'),
			// 	dataType: 'code',
			// 	editable: false,
			// 	filter: {
			// 		showIcon: true,
			// 	},
			// 	labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
			// 		const dcCode = item.dcCode;
			// 		return userDccodeList.find((item: any) => item.dccode === dcCode)?.dcnameOnlyNm || '';
			// 	},
			// },
			{
				dataField: 'userId',
				visible: false,
			},
			{
				dataField: 'userNm',
				headerText: t('lbl.USERNAME'),
				dataType: 'user',
				required: true,
				commRenderer: {
					type: 'search',
					popupType: 'user',
					searchDropdownProps: {
						dataFieldMap: {
							userId: 'userId',
							userNm: 'userNm',
							email: 'mailId',
						},
					},
					iconPosition: 'right',
					align: 'center',
					onClick: function (event: any) {
						modalRef.current.handlerOpen();
					},
				},
				// usePrimaryKey: true,
			},
			{
				dataField: 'email',
				headerText: 'EMAIL',
				dataType: 'string',
				required: true,
				editable: false,
				// usePrimaryKey: true,
			},
			{
				dataField: 'delYn',
				headerText: t('lbl.USE_YN'),
				dataType: 'code',
				commRenderer: {
					type: 'dropDown',
					list: [
						{ cdNm: 'Y', comCd: 'N' },
						{ cdNm: 'N', comCd: 'Y' },
					],
				},
				// editRenderer: {
				// 	type: 'DropDownListRenderer',
				// 	list: getCommonCodeList('YN', ''),
				// 	keyField: 'comCd', // key 에 해당되는 필드명
				// 	valueField: 'cdNm',
				// },
				// labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				// 	return getCommonCodebyCd('YN', value)?.cdNm;
				// },
			},
			{
				dataField: 'addWho',
				visible: false,
			},
			{
				dataField: 'addWhoNm',
				headerText: t('lbl.ADDWHO'),
				editable: false,
				dataType: 'manager',
				managerDataField: 'addWho',
			},
			{
				dataField: 'addDate',
				headerText: t('lbl.ADDDATE'),
				dataType: 'date',
				editable: false,
			},
			{
				dataField: 'editWho',
				visible: false,
			},
			{
				dataField: 'editWhoNm',
				headerText: t('lbl.EDITWHO'),
				editable: false,
				dataType: 'manager',
				managerDataField: 'editWho',
			},
			{
				dataField: 'editDate',
				headerText: t('lbl.EDITDATE'),
				dataType: 'date',
				editable: false,
			},
		];

		const gridProps = {
			editable: true,
			showRowCheckColumn: true,
			enableFilter: true,
			isLegacyRemove: true,
			fillColumnSizeMode: true,
		};

		/**
		 * =====================================================================
		 *	02. 함수
		 * =====================================================================
		 */

		/**
		 * 팝업 열기 이벤트
		 * @param params
		 */
		const fnCmIndividualPopup = (params: any) => {
			setPopUpParams(params);
			refModalIndividualPop.current.handlerOpen();
		};
		/**
		 * 팝업 닫기 이벤트
		 */
		const closeEvent01 = () => {
			refModalIndividualPop.current.handlerClose();
		};
		const initEvent = () => {
			gridRef?.current.setGridData([]);

			gridRef?.current.bind('cellDoubleClick', (event: any) => {
				selectRowData(event);
			});

			ref.detailGridRef3?.current.bind('cellEditEnd', (event: any) => {
				if (event.dataField === 'email') {
					// const calQty = ref.gridRef?.current.getSelectedRows()[0].eaCal;
					// ref.detailGridRef3.current.setCellValue(event.rowIndex, 'purchaseCalQty', event.value * calQty);
				}
			});
		};

		/**
		 * 검색 버튼 클릭
		 */
		const onClickSearchButton = () => {
			const formValues = form.getFieldsValue();
			gridRef.current?.clearGridData();

			apiGetMasterList(formValues).then(res => {
				if (res.statusCode === 0) {
					setPopupList(res.data || []);
					setTotalCount(res.data.length);
					gridRef.current?.setGridData(res.data || []);

					// 조회된 결과에 맞게 칼럼 넓이를 구한다.
					const colSizeList = gridRef.current.getFitColumnSizeList(true);

					// 구해진 칼럼 사이즈를 적용 시킴.
					gridRef.current.setColumnSizeList(colSizeList);
				}
			});
		};

		/**
		 * 새로고침 버튼 클릭
		 */
		const onClickRefreshButton = () => {
			form.setFieldsValue({
				multiDcCode: [gDccode],
				userNm: '',
				delYn: 'N',
			});
			gridRef.current?.clearGridData();
			setPopupList([]);
			setTotalCount(0);
		};

		// 메뉴 타이틀에 연결할 함수
		const titleFunc = {
			searchYn: onClickSearchButton,
			refresh: onClickRefreshButton,
		};

		/**
		 * 행 선택
		 * @param event
		 * 20260319 마스킹 처리 복호화 팝업 추가
		 */
		const selectRowData = (event: any) => {
			// const selectedRow = gridRef.current?.getSelectedRows();
			if (isEmpty(gridRef.current?.getCellValue(event.rowIndex, 'serialKey'))) {
				return;
			}
			const params = {
				url: '/api/ms/centerDocUser/v1.0/getMasterList', // 팝업 URL 설정
				individualKey: '',
				individualColId: event.dataField, // 개인정보 복호화 컬럼값
				serialKey: gridRef.current?.getCellValue(event.rowIndex, 'serialKey'), // 1건 조회하는 key 설정
				// custkey: gridRef2.current?.getCellValue(event.rowIndex, 'custkey'), // 1건 조회하는 key 설정
				// gubun: gridRef2.current?.getCellValue(event.rowIndex, 'gubun'), // 1건 조회하는 key 설정
				method: 'post',
			}; // 팝업 파라미터 초기화
			// 수신자
			if (event.dataField === 'userNm') {
				params.individualKey = 'userNm'; // 개인정보 키 설정(userNm: 수령자명)
				fnCmIndividualPopup(params);
			} else if (event.dataField === 'email') {
				params.individualKey = 'email'; // 개인정보 키 설정(handphoneNo: 휴대폰번호)
				fnCmIndividualPopup(params);
			}
		};

		/**
		 * 확인 버튼 클릭 시
		 */
		const checkRowData = () => {
			const selectedRow = gridRef.current?.getSelectedRows();
			if (!selectedRow || selectedRow.length === 0) {
				return;
			}
			callBack?.(selectedRow);
		};

		/**
		 * 저장
		 * @returns {void}
		 */
		const saveMasterList = () => {
			// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
			const updatedItems = gridRef.current.getChangedData({ validationYn: false });

			if (!updatedItems || updatedItems.length < 1) {
				showMessage({
					content: t('msg.MSG_COM_VAL_020'),
					modalType: 'info',
				});
				return;
			}
			if (!gridRef.current.validateRequiredGridData()) return;

			if (!gridRef.current.validatePKGridData(['dcCode', 'userNm', 'email'])) {
				return;
			}

			// 저장 실행
			// showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			gridRef.current.showConfirmSave(() => {
				apiPostSaveMasterList(updatedItems).then(() => {
					gridRef.current.getCheckedRowItems().map((item: any, index: any) => {
						gridRef.current.setCellValue(item.rowIndex, 'rowStatus', 'R');
					});
					gridRef.current.setAllCheckedRows(false);
					gridRef.current.resetUpdatedItems();

					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: onClickSearchButton,
					});
				});
			});
		};

		// 그리드 버튼 설정
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'plus', // 행추가
					initValues: {
						storerkey: 'FW00',
						dcCode:
							selectedDcCode[0] === '0000' || selectedDcCode[0] === '0001' || selectedDcCode[0] === '0002'
								? '선택'
								: selectedDcCode[0] || gDccode,
						status: '90',
						delYn: 'N',
						rowStatus: 'I', // 신규 행 상태로 설정
					},
				},
				{
					btnType: 'delete', // 행삭제
				},
				{
					btnType: 'save', // 저장
					callBackFn: saveMasterList,
				},
			],
		};

		const confirmPopup = (selectedRow: any) => {
			const params = {
				userId: selectedRow[0].userId,
				startRow: 0,
				listCount: 100,
				noMasking: true, // 마스킹 여부(true: 마스킹 해제, false: 마스킹(default))
				noMaskingLabel: 'name,engName,addr,telNo,email', // 마스킹 해제 필드
			};

			apiGetAllUserPopupList(params).then(res => {
				if (res.statusCode === 0) {
					gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'userId', res.data[0].userId);
					gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'userNm', res.data[0].userNm);
					gridRef.current.setCellValue(gridRef.current.getSelectedIndex()[0], 'email', res.data[0].mailId);
				}
				modalRef.current.handlerClose();
			});
		};

		const closeEvent = () => {
			modalRef.current.handlerClose();
		};

		/**
		 * =====================================================================
		 *	03. react hook event
		 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
		 * =====================================================================
		 */

		/**
		 * 그리드 더블클릭시 해당 로우 부모페이지에 표시
		 */
		useEffect(() => {
			initEvent();
		}, []);

		/**
		 * 부모에서 호출할 수 있는 함수 노출
		 */
		useImperativeHandle(ref, () => ({
			setMultiDcCode: (value: any) => {
				form.setFieldValue('multiDcCode', value);
			},
		}));

		/**
		 * 부모 컴포넌트의 form 값으로 초기화
		 */
		useEffect(() => {
			if (parentFormValues?.multiDcCode) {
				// 더 안정적인 방법으로 값 설정
				const timer = setTimeout(() => {
					form.setFieldValue('multiDcCode', parentFormValues.multiDcCode);
				}, 200);
				return () => clearTimeout(timer);
			}
		}, [parentFormValues]);

		return (
			<>
				{/* 상단 타이틀 및 페이지버튼 */}
				<PopupMenuTitle name="센터서류 담당자관리" func={titleFunc} />

				{/* 조회 컴포넌트 */}
				<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
					<UiFilterArea>
						<UiFilterGroup className="grid-column-2">
							<li>
								<CmGMultiDccodeSelectBox
									name="multiDcCode"
									placeholder="선택해주세요"
									fieldNames={{ label: 'dcname', value: 'dccode' }}
									mode="multiple"
									label={'물류센터'}
									onChange={() => {
										setSelectedDcCode(form.getFieldValue('multiDcCode'));
									}}
								/>
							</li>
							<li>
								<InputText
									name="userNm"
									placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.USERNAME')])}
									onPressEnter={search}
									label={t('lbl.USERNAME')}
								/>
							</li>
							<li>
								<SelectBox
									name="delYn"
									placeholder="선택해주세요"
									options={[
										{ cdNm: '전체', comCd: '' },
										{ cdNm: 'Y', comCd: 'N' },
										{ cdNm: 'N', comCd: 'Y' },
									]}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									label={t('lbl.USE_YN')}
								/>
							</li>
						</UiFilterGroup>
					</UiFilterArea>
				</SearchForm>

				{/* 그리드 영역 */}
				<AGrid>
					<GridTopBtn gridTitle={'센터서류담당자 목록'} gridBtn={gridBtn} totalCnt={totalCount} />
					<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>

				<ButtonWrap data-props="single">
					<Button onClick={close}>{t('lbl.CLOSE')}</Button>
					{/* <Button type="primary" onClick={checkRowData}>
					{t('lbl.BTN_CONFIRM')}
				</Button> */}
				</ButtonWrap>
				<CustomModal ref={modalRef} width="1000px">
					<CmSearchPopup type={'user'} callBack={confirmPopup} close={closeEvent}></CmSearchPopup>
				</CustomModal>
				{/* 개인정보 팝업 */}
				<CustomModal ref={refModalIndividualPop} width="700px" draggable={true}>
					<CmIndividualPopup popUpParams={popUpParams} close={closeEvent01} />
				</CustomModal>
			</>
		);
	},
);

export default MsCenterDocUserPopup;
