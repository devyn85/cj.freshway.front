// Lib
import AGrid from '@/assets/styled/AGrid/AGrid';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// Store

// API
import { apiPostSaveEtcFee } from '@/api/st/apiStExDCStorage';

interface StExDCEtcFeePopupDetailProps {
	dccode: any;
	form: any;
	data: any;
	totalCnt: any;
	checkedList: any;
	callBack: any;
}

const StExDCEtcFeePopupDetail = forwardRef((props: StExDCEtcFeePopupDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// grid data
	const [totalCnt, setTotalCnt] = useState(0);

	// grid Ref
	ref.gridRef = useRef();
	ref.gridRefDtl = useRef();

	// 그룹코드 그리드 칼럼 레이아웃 설정
	const gridCol = [
		{
			dataField: 'serialkey',
			visible: false,
		},
		{
			headerText: 'COSTCD', //COSTCD
			dataField: 'basecode',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: 'COSTNAME', //COSTNAME
			dataField: 'basedescr',
			editable: false,
		},
		{
			headerText: 'SUPPLYPRICE', //SUPPLYPRICE
			dataField: 'tranprice',
			dataType: 'numeric',
			editable: true,
		},
		{
			headerText: 'ACCOUNTNO', //ACCOUNTNO
			dataField: 'data1',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: 'ACCOUNTNAME', //ACCOUNTNAME
			dataField: 'data2',
			editable: false,
		},
		{
			headerText: 'JOURNALTYPENAME', //JOURNALTYPENAME
			dataField: 'data3',
			editable: false,
		},
	];

	// 그룹코드 그리드 속성 설정
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 공통 코드 저장
	 * @returns {void}
	 */
	const saveMaster = async () => {
		// 입력 값
		const isValid = await validateForm(props.form);
		if (!isValid) {
			return;
		}

		const gridData = ref.gridRef.current.getGridData();
		const journalcodeItems = gridData.filter((v: any) => v.tranprice > 0);

		let etcPrice = 0;
		let ioFlag = '';
		const serialkeyItems: any[] = [];
		let updatedItems: any[] = [];

		if (!props.checkedList || props.checkedList.length === 0) {
			showMessage({
				content: t('msg.MSG_COM_SUC_003'),
				modalType: 'info',
			});
			return;
		}

		for (const item of props.checkedList) {
			ioFlag = item.ioFlag;
			etcPrice += item.ifEtcAmount;
			serialkeyItems.push({ serialkey: item.serialkey });
		}

		if (ioFlag === '출고') {
			if (etcPrice === 0) {
				showMessage({
					content: '기정산 운송료 금액이 모두 0원이면 처리하실 수 없습니다.',
					modalType: 'info',
				});
				return;
			}

			if (journalcodeItems && journalcodeItems.length > 0) {
				// K01 : 내륙운송비가 있는지 체크
				const K01 = journalcodeItems.filter((v: any) => v.basecode === 'K01');

				if (K01 && K01.length > 0) {
					// 내륙운송비가 있는경우는 내륙운송비를 제외한 나머지는 미처리
					for (let ii = 0; ii < journalcodeItems.length; ii++) {
						if (K01[0].serialkey !== journalcodeItems[ii].serialkey) {
							journalcodeItems[ii].tranprice = 0;
						}
					}
				} else {
					// 내륙운송비가 없는경우 제일 첫번째 로우 금액만 남기고 나머지는 0처리
					for (let ii = 1; ii < journalcodeItems.length; ii++) {
						journalcodeItems[ii].tranprice = 0;
					}
				}

				updatedItems = journalcodeItems.filter((v: any) => v.tranprice > 0);
			}
		} else {
			updatedItems = journalcodeItems.filter((v: any) => v.tranprice > 0);
		}

		if (updatedItems === null || updatedItems.length <= 0) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'warning',
			});
			return;
		}

		// API 실행
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			// 파라미터에 처리 대상 설정
			const params = {
				fixdccode: props.dccode,
				custkey: props.form.getFieldValue('custkey'),
				serialkeyList: serialkeyItems,
				priceList: updatedItems,
			};

			apiPostSaveEtcFee(params).then(res => {
				if (res.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
					props.callBack?.();
				}
			});
		});
	};

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveMaster,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);

			// 상세 총건수 초기화
			if (props.data?.length < 1) {
				setTotalCnt(0);
			}
		}
	}, [props.data]);

	return (
		<AGrid>
			<GridTopBtn gridBtn={gridBtn} gridTitle={''} totalCnt={props.totalCnt} />
			<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
});

export default StExDCEtcFeePopupDetail;
