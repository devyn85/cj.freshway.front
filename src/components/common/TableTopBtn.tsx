/*
 ############################################################################
 # FiledataField	: TableTopBtn.tsx
 # Description		: 표 상위 버튼
 # Author			: JangGwangSeok
 # Since			: 25.05.21
 ############################################################################
*/

// lib
import { Button } from 'antd';

// Util
import commUtil from '@/util/commUtil';
import Constants from '@/util/constants';

// Store
import { getFindMenu } from '@/store/core/menuStore';

// Hook
import { useKeydown } from '@/hooks/useKeydown';

// Type
import { TableBtnPropsType, TableBtnType } from '@/types/common';

// CSS
import CustomTooltip from '@/components/common/custom/CustomTooltip';
import IcoSvg from '@/components/common/IcoSvg';
import icoSvgData from '@/components/common/icoSvgData.json';

interface PropsType {
	tableTitle?: string; // 타이틀
	tableSubTitle?: string; // 서브 타이틀
	tableBtn?: TableBtnPropsType;
	position?: 'prefix' | 'postfix';
	children?: any;
	className?: string;
	disabled?: any;
}

/**
 * 그리드 상위 버튼 컴포넌트
 * @param {PropsType} props 설정 값
 * @returns {*} 그리드 버튼 컴포넌트
 */
function TableTopBtn(props: PropsType) {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// props 초기화
	const { tableTitle, tableSubTitle, tableBtn, children, position = 'prefix', className, disabled } = props;

	// 노출시킬 버튼 목록
	const [btnList, setBtnList] = useState([]);

	// 현재 메뉴 정보
	const [menuAuthInfo, setMenuAuthInfo]: any = useState({});

	// 다국어
	const { t } = useTranslation();

	// 아이콘 JSON any 타입으로 담기
	const icoSvgDataAny: any = icoSvgData;

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 콜백 Function 호출 전 처리
	 * @param {TableBtnType} btn 버튼 정보
	 * @returns {void}
	 */
	const preCallBackFn = (btn: TableBtnType) => {
		// 콜백 Function 호출 전 처리 사용 유무 로직 추가
		const { isActionEvent = true } = btn;
		if (isActionEvent) {
			switch (btn.btnType) {
				// 이전
				case 'pre':
					tableBtn.tGridRef?.current.setPrevRowSelected();
					break;

				// 다음
				case 'post':
					tableBtn.tGridRef?.current.setNextRowSelected();
					break;

				// 행삭제
				case 'delete':
					tableBtn.tGridRef?.current.removeRow('selectedIndex');
					break;
			}
		}

		// 콜백 처리
		if (btn.callBackFn && btn.callBackFn instanceof Function) {
			btn.callBackFn();
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		// 버튼 리스트 설정
		setBtnList(btnList => {
			if (!commUtil.isEmpty(tableBtn.btnArr)) {
				// 노출시키려는 버튼 목록
				const viewBtnList = tableBtn.btnArr.filter(
					(viewBtn: TableBtnType) =>
						commUtil.getKeyByValue(Constants.BTN_AUTH, `${viewBtn.btnType}Yn`) !== undefined ||
						commUtil.getKeyByValue(Constants.BTN_AUTH_EX, `${viewBtn.btnType}Yn`) !== undefined,
				);

				// 현재 메뉴의 버튼 권한 정보
				const menuAuthInfoTmp: any = getFindMenu(location.pathname);
				setMenuAuthInfo(getFindMenu(location.pathname));

				// 권한이 적용된 버튼 목록 설정
				btnList = viewBtnList.filter(
					(viewBtn: TableBtnType) =>
						Object.keys(menuAuthInfoTmp || {}).filter(
							key => menuAuthInfoTmp[key] === '1' && `${viewBtn.btnType}Yn` === key,
						).length > 0 || commUtil.getKeyByValue(Constants.BTN_AUTH_EX, `${viewBtn.btnType}Yn`) !== undefined,
				);
			}

			return [...btnList];
		});
	}, [tableBtn]);
	// }, [tableBtn.btnArr]);

	// F8 키 누르면 저장 버튼 클릭
	useKeydown(
		{ key: 'F8' },
		() => {
			// btnList에서 save 타입 버튼 찾기
			const saveBtn = btnList.find((btn: TableBtnType) => btn.btnType === 'save');
			if (saveBtn) {
				preCallBackFn(saveBtn);
			}
		},
		tableBtn?.tGridRef,
	);

	return (
		<div className={`title-area ${className ?? ''}`}>
			<div className="title">{tableTitle && <h3>{tableTitle || '상세'}</h3>}</div>
			{tableSubTitle && <div className="sub-title">{tableSubTitle}</div>}
			<div className="grid-flex-wrap">
				{/* 커스텀 children 버튼 노출 (prefix) */}
				{position === 'prefix' && children}

				{/* 허용된 버튼 노출 */}
				{btnList.map((btn: TableBtnType) => {
					// 버튼 아이콘으로 변경
					switch (btn.btnType) {
						// 이전
						case 'pre':
							btn.icoSvgData = 'icoArrowLeft';
							btn.tooltip = btn.tooltip ?? '이전';
							break;

						// 다음
						case 'post':
							btn.icoSvgData = 'icoArrowRight';
							btn.tooltip = btn.tooltip ?? '다음';
							break;

						// 행삭제
						case 'delete':
							btn.icoSvgData = 'icoMinus';
							btn.tooltip = btn.tooltip ?? '행삭제';
							break;
					}

					return (
						<CustomTooltip key={`${btn.btnType}Yn`} placement="bottomLeft" title={btn.tooltip}>
							<Button
								key={`${btn.btnType}Yn`}
								icon={btn.icoSvgData && <IcoSvg data={icoSvgDataAny[btn.icoSvgData]} />}
								onClick={() => preCallBackFn(btn)}
								type={btn.btnType === 'save' ? 'primary' : null}
								disabled={disabled || false}
							>
								{!btn.icoSvgData &&
									(btn.btnLabel || menuAuthInfo[`${btn.btnType}Nm`] || t(`lbl.` + btn.btnType?.toUpperCase()))}
							</Button>
						</CustomTooltip>
					);
				})}

				{/* 커스텀 children 버튼 노출 (postfix) */}
				{position === 'postfix' && children}
			</div>
		</div>
	);
}
export default TableTopBtn;
