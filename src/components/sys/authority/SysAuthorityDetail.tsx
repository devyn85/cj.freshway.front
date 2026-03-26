// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { useAppSelector } from '@/store/core/coreHook';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// API
import { apiPostSaveSysAuthorityGroup } from '@/api/sys/apiSysAuthority';

const SysAuthorityDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 그리드 접근 Ref
	ref.gridRefGrp = useRef();

	// 다국어
	const { t } = useTranslation();

	// 사용자 정보 가져오기
	const userInfo = useAppSelector(state => state.user.userInfo);

	// 그룹권한 그리드 컬럼
	const gridColGrp = [
		{
			dataField: 'authCd', // 권한그룹코드
			dataType: 'code',
			headerText: t('lbl.AUTH_CD'),
			required: userInfo['repUserIdYn'] !== 'Y',
			usePrimaryKey: userInfo['repUserIdYn'] !== 'Y',
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (userInfo['repUserIdYn'] === 'Y' || commUtil.isNotEmpty(item.updId)) {
					// 편집 가능 class 삭제
					ref.gridRefGrp.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'authNm', // 권한그룹명
			headerText: t('lbl.AUTH_NM'),
			required: true,
		},
		{
			dataField: 'upAuthGroupCd', // 상위권한코드
			dataType: 'code',
			headerText: t('lbl.UP_AUTH_GROUP_CD'),
			editable: false,
		},
		{
			dataField: 'lowAuthYn', // 하위권한그룹여부
			dataType: 'code',
			headerText: t('lbl.LOW_AUTH_YN'),
			editable: false,
		},
		{
			dataField: 'updNm', // 수정자
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'updId',
			editable: false,
		},
		{
			dataField: 'updId',
			visible: false,
		},
		{
			dataField: 'updDtm', // 수정일시
			headerText: t('lbl.EDITDATE'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'regNm', // 등록자
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'regId',
			editable: false,
		},
		{
			dataField: 'regId',
			visible: false,
		},
		{
			dataField: 'regDtm', // 등록일시
			headerText: t('lbl.ADDDATE'),
			dataType: 'date',
			editable: false,
		},
	];

	// 그룹권한 그리드 Props
	const gridPropsGrp = {
		editable: true,
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		fillColumnSizeMode: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그룹권한 저장
	 * @returns {void}
	 */
	const saveGrp = () => {
		// 변경 데이터 확인
		const authGrpList = ref.gridRefGrp.current.getChangedData({ validationYn: false });
		if (!authGrpList || authGrpList.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// validation
		if (!ref.gridRefGrp.current.validateRequiredGridData()) {
			return;
		}

		// "권한그룹코드" 포맷 체크
		if (userInfo['repUserIdYn'] !== 'Y') {
			const pattern = /^WAYLO_[A-Z0-9]{3}$/;
			for (const auth of authGrpList) {
				if (!pattern.test(auth.authCd)) {
					showAlert(null, t('msg.MSG_COM_VAL_230')); // "WAYLO_문자숫자3자리" 포맷에 맞게 입력해주세요.

					// 해당 인덱스로 이동
					if (auth._$uid) {
						const rowIndex = ref.gridRefGrp.current.rowIdToIndex(auth._$uid);
						ref.gridRefGrp.current.setSelectionByIndex(rowIndex, 0);
					}
					return false;
				}
			}
		}

		ref.gridRefGrp.current.showConfirmSave(() => {
			const params = {
				authGrpList: authGrpList,
			};
			apiPostSaveSysAuthorityGroup(params).then(() => {
				// 콜백 처리
				if (props.callBackFn && props.callBackFn instanceof Function) {
					props.callBackFn();
				}
			});
		});
	};

	// 그룹권한 그리드 버튼 설정
	const gridBtnGrp: GridBtnPropsType = {
		tGridRef: ref.gridRefGrp, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveGrp,
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
		const gridRefCur1 = ref.gridRefGrp?.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);
		}
	}, [props.data]);

	useEffect(() => {
		const gridRefGrp = ref.gridRefGrp?.current;

		// 그룹권한 그리드 행 변경 시
		gridRefGrp.bind('cellEditBegin', function (event: any) {
			// '권한그룹코드', '권한그룹명' 수정 가능
			if (
				event.dataField == 'authNm' ||
				(event.dataField == 'authCd' && userInfo['repUserIdYn'] !== 'Y' && commUtil.isEmpty(event.item.updId))
			) {
				return true;
			} else {
				return false;
			}
		});
	}, []);

	return (
		<AGrid className="contain-wrap">
			<GridTopBtn gridBtn={gridBtnGrp} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
			<AUIGrid ref={ref.gridRefGrp} columnLayout={gridColGrp} gridProps={gridPropsGrp} />
		</AGrid>
	);
});

export default SysAuthorityDetail;
