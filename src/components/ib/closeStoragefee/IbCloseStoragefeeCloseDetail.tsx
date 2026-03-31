/*
 ############################################################################
 # FiledataField	: IbCloseStoragefeeCloseDetail.tsx
 # Description		: 보관료 마감 처리 (마감)
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.29
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import IbCloseStockSkuBillPopup from '@/components/ib/closeStoragefee/IbCloseStockSkuBillPopup';

//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { v4 as uuidv4 } from 'uuid';
// Utils

// API Call Function
import {
	apiGetDataRead,
	apiSaveClose,
	apiSaveCloseStoragefee,
	apiSaveCloseStoragefeeWMS,
} from '@/api/ib/apiIbCloseStoragefee';

//types
import { GridBtnPropsType } from '@/types/common';
//store
import { useAppSelector } from '@/store/core/coreHook';
import { Form } from 'antd';

const IbCloseStoragefeeCloseDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();
	const [popupData, setPopupData] = useState([]);
	const gridId = uuidv4() + '_gridWrap';
	const user = useAppSelector(state => state.user.userInfo);
	const dcCode = Form.useWatch('dcCode', props.form);
	const refModal = useRef(null);
	const refModal1 = useRef(null);

	const gridCol = [
		// {
		// 	dataField: 'serialKey',
		// 	headerText: '데이터번호',
		// 	width: 120,
		// },
		{
			dataField: 'yyyymm',
			headerText: t('lbl.CLOSEMONTH'), //마감월
			width: 100,
			dataType: 'code', // ← date 대신 string
			labelFunction: (rowIndex: any, colIndex: any, value: any, headerText: any, item: any) => {
				// value: '202504'
				if (!value || value.length !== 6) return value;
				return `${value.slice(0, 4)}-${value.slice(4, 6)}`;
			},
		},
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'), //'창고',
			width: 180,
			dataType: 'code',
		},
		{
			dataField: 'storageLocName',
			headerText: t('lbl.ORGANIZENAME'), //'창고명',
			type: 'text',
			width: 150,
		},
		{
			dataField: 'closeYn',
			headerText: t('lbl.CLOSEYN'), //'마감여부',
			dataType: 'code',
			width: 100,
		},
		{
			dataField: 'sendCnt',
			headerText: t('lbl.SENDCNT'), //'마감차수',
			width: 100,
			dataType: 'numeric',
		},
		{
			dataField: 'editWhoName',
			headerText: t('lbl.EDITWHO'), //'수정자',
			width: 90,
			dataType: 'manager',
			managerDataField: 'editWho',
			editable: false,
		},
		{
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'), //'수정일시',
			dataType: 'date',
			width: 160,
		},
		{
			dataField: 'ortClose',
			headerText: t('lbl.ACCOUNTS_N_CANCEL'), // '마감/취소',
			width: 150,
			type: 'code',
			renderer: {
				type: 'ButtonRenderer',
				onClick: function (event: any) {
					if (event.item.btnFlag === 'N') return;
					saveCloseStoragefee([event.item]);
				},
			},

			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				if (item.btnFlag === 'N') return '';
				return item.closeYn === 'Y' ? '마감취소' : '마감';
			},
		},
		{
			dataField: 'skuBill',
			headerText: t('lbl.ACCOUNTS_DESCRIPTION'), //'마감내역',
			renderer: {
				type: 'ButtonRenderer',
				onClick: function (event: any) {
					if (event.item.btnFlag === 'N') return;
					callPopUp(event.item);
				},
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				if (item.btnFlag === 'N') return '';

				if (item.closeYn === 'N' && item.sendCnt > 0) {
					return t('lbl.ACCOUNTS_DESCRIPTION');
				}

				return t('lbl.ACCOUNTS_DESCRIPTION');
			},
			width: 150,
		},

		{
			dataField: 'wmsClose',
			headerText: t('lbl.WMS_ACCOUNTS_FORCED'), //'WMS강제마감',
			width: 150,
			type: 'code',
			renderer: {
				type: 'ButtonRenderer',
				labelText: t('lbl.DETAILVIEW'),

				onClick: function (event: any) {
					if (event.item.btnFlag === 'N') {
						return;
					}
					// if (user.authority !== '00') {
					// 	showAlert('', '시스템 관리자만 처리 가능합니다.');
					// 	return;
					// }
					saveCloseStoragefeeWMS([event.item]);
				},
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				if (item.btnFlag === 'N') return '';
				if (item.closeYn === 'N' && item.sendCnt > 0) {
					return t('lbl.ACCOUNTS_FORCED');
				}
				return t('lbl.WMS_ACCOUNTS_FORCED');
			},
		},
	];

	const gridProps = {
		// editable: true,
		// showRowCheckColumn: true,
		// isLegacyRemove: true,
	};

	const footerLayout = [{}];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 * @param data
	 */
	const callPopUp = (data: any) => {
		const searchVal = {
			zmonth: data.yyyymm.replaceAll('-', ''),
			lgort: data.storageLocation,
		};
		// //console.log(searchVal);
		apiGetDataRead(searchVal).then(res => {
			setPopupData(res.data);

			if (res.data.length === 0) {
				showAlert('', '조회된 데이터가 없습니다.');
				return;
			} else {
				refModal1.current.handlerOpen();
			}
		});
	};

	/**
	 * 저장로직
	 * @returns
	 */
	const saveMaster = () => {
		const codeDtl = ref.gridRef.current.getGridData();
		// //console.log(codeDtl);
		const valList = codeDtl.filter(item => item.closeYn === 'N');
		// //console.log(valList);
		if (valList.length > 0) {
			showAlert('', '전체 마감 이후 처리 재무 마감 처리 가능합니다');
			return;
		}
		if (!codeDtl || codeDtl.length === 0) {
			showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
				return;
			});
		} else {
			showConfirm(
				null,
				'저장하시겠습니까?',
				() => {
					// //console.log(val);
					const codeDtlWithCloseDt = codeDtl.map(row => ({
						...row,
						closedt: props.toYYYYMM(props.form.getFieldsValue().date),
						dcCode: dcCode,
					}));

					const saveList = {
						stockMonth: props.toYYYYMM(props.form.getFieldsValue().date),
						saveList: codeDtlWithCloseDt,
						dcCode: dcCode,
					};
					apiSaveClose(saveList)
						.then(res => {
							if (res.statusCode === 0) {
								ref.gridRef.current.clearGridData();
								props.fnCallBack(); // 저장 성공 후에만 호출
								showAlert('저장', '저장되었습니다.');
							} else {
								return false;
							}
						})
						.catch(e => {
							return false;
						});
				},
				() => {
					return;
				},
			);
		}
		// ref.gridRef.current.showConfirmSave(() => {});
	};

	/**
	 * 마감
	 * @param saveList
	 * @returns
	 */
	const saveCloseStoragefee = (saveList: any) => {
		const list = {
			saveList: saveList,
		};
		apiSaveCloseStoragefee(list)
			.then(res => {
				if (res.statusCode === 0) {
					showAlert('저장', '저장되었습니다.');
					props.callback();
				} else {
					return false;
				}
			})
			.catch(e => {
				return false;
			});
	};

	/**
	 * 강제 마감(WMS)
	 * @param saveArr
	 * @returns
	 */
	const saveCloseStoragefeeWMS = (saveArr: any) => {
		const list = {
			saveList: saveArr,
		};
		apiSaveCloseStoragefeeWMS(list)
			.then(res => {
				if (res.statusCode === 0) {
					showAlert('저장', '저장되었습니다.');
					props.callback();
				} else {
					return false;
				}
			})
			.catch(e => {
				return false;
			});
	};
	const close = () => {
		refModal1.current.handlerClose();
	};

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 저장
				callBackFn: saveMaster,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);

			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid>
				<GridTopBtn gridTitle="마감내역" totalCnt={props.totalCnt} gridBtn={gridBtn} />
				<AUIGrid
					ref={ref.gridRef}
					name={gridId}
					columnLayout={gridCol}
					gridProps={gridProps}
					footerLayout={footerLayout}
				/>
			</AGrid>
			<CmSearchWrapper ref={refModal} />
			<CustomModal ref={refModal1} width="1000px">
				<IbCloseStockSkuBillPopup gridCol={gridCol} data={popupData} close={close} />
			</CustomModal>
		</>
	);
});
export default IbCloseStoragefeeCloseDetail;
