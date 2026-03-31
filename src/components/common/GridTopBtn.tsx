/*
 ############################################################################
 # FiledataField	: GridTopBtn.tsx
 # Description		: 그리드 상위 버튼
 # Author			: JangGwangSeok
 # Since			: 25.05.21
 ############################################################################
*/

// lib
import { Button } from 'antd';
import { ReactNode } from 'react';

// Util
import commUtil from '@/util/commUtil';
import Constants from '@/util/constants';
import dateUtils from '@/util/dateUtil';
import fileUtil from '@/util/fileUtils';

// Store
import { getFindMenu } from '@/store/core/menuStore';
// Type
import { GridBtnPropsType, GridBtnType } from '@/types/common';

// Hooks
import { useThrottle } from '@/hooks/useThrottle';

// CSS
import CustomTooltip from '@/components/common/custom/CustomTooltip';
import IcoSvg from '@/components/common/IcoSvg';
import icoSvgData from '@/components/common/icoSvgData.json';
import { useKeydownAUIGrid } from '@/hooks/useKeydownAUIGrid';

//API
import { usePageLayoutVisible } from '@/hooks/usePageLayoutVisible';
import { useAppSelector } from '@/store/core/coreHook';
import styled, { CSSProperties } from 'styled-components';

interface PropsType {
	gridTitle?: string; // 타이틀
	gridBtn?: GridBtnPropsType;
	gridProps?: any;
	position?: 'prefix' | 'postfix';
	children?: any;
	totalCnt?: number; // 총 개수
	purchaseCnt?: number; // 발주대상 개수
	customCont?: any;
	extraContentLeft?: ReactNode; // 왼쪽 노출 영역
	className?: string;
	style?: CSSProperties;
}

/**
 * 그리드 상위 버튼 컴포넌트
 * @param {PropsType} props 설정 값
 * @returns {*} 그리드 버튼 컴포넌트
 */
function GridTopBtn(props: PropsType) {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// props 초기화
	const {
		gridTitle,
		gridBtn,
		gridProps,
		children,
		position = 'prefix',
		totalCnt,
		purchaseCnt,
		customCont,
		extraContentLeft,
		className,
		style,
	} = props;

	// 업로드 파일 Ref
	const excelUploadFileRef = useRef(null);

	// 노출시킬 버튼 목록
	const [btnList, setBtnList] = useState([]);

	// 현재 메뉴 정보
	const [menuAuthInfo, setMenuAuthInfo]: any = useState({});

	// 다국어
	const { t } = useTranslation();

	// 중복 이벤트 방지
	const throttle = useThrottle();

	// 아이콘 JSON any 타입으로 담기
	const icoSvgDataAny: any = icoSvgData;

	//전역정보
	const globalVariable = useAppSelector(state => state.global.globalVariable);
	const user = useAppSelector(state => state.user.userInfo); // 사용자 정보 가져오기

	const { layout } = usePageLayoutVisible();
	const isGridTopBtnVisible = layout.isGridTopBtnVisible;
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 콜백 Function 호출 전 처리
	 * @param {GridBtnType} btn 버튼 정보
	 * @returns {void}
	 */
	const preCallBackFn = throttle((btn: GridBtnType) => {
		// 호출 전 처리
		if (btn?.callBeforeFn && btn?.callBeforeFn instanceof Function) {
			const isStop = btn?.callBeforeFn();
			if (isStop) {
				return;
			}
		}
		// 콜백 Function 호출 전 처리 사용 유무 로직 추가
		const { isActionEvent = true } = btn;
		if (isActionEvent) {
			switch (btn.btnType) {
				// 엑셀선택
				case 'excelSelect':
					excelUploadFileRef.current.click();
					break;

				// 엑셀업로드
				case 'excelUpload':
					excelUploadFileRef.current.click();
					break;

				// 엑셀다운로드
				case 'excelDownload': {
					// 그리드 데이터 체크
					const gridData = gridBtn.tGridRef.current.getGridData();

					if (!gridData || gridData.length === 0) {
						showAlert(null, '다운로드할 데이터가 없습니다.');
						return;
					}

					// 엑셀 저장시 커스텀 옵션 적용
					if (commUtil.isNotEmpty(gridBtn.tGridRef.current?.getProp('exportToXlsxGridCustom'))) {
						gridBtn.tGridRef.current?.getProp('exportToXlsxGridCustom')();
					} else {
						const params = {
							fileName: `${storeUtil.getMenuInfo().progNm}_${dateUtils.getToDay('YYYYMMDD')}`,
						};
						gridBtn.tGridRef.current.exportToXlsxGrid(params);
					}

					break;
				}

				// 엑셀 양식 다운로드
				case 'excelForm': {
					const params = {
						fileName: `${storeUtil.getMenuInfo().progNm}_${dateUtils.getToDay('YYYYMMDD')}`,
					};
					gridBtn.tGridRef.current.exportToXlsxGrid(params);
					break;
				}

				// 행복사
				case 'copy': {
					let selectedRowTmp = [];
					selectedRowTmp = gridBtn.tGridRef.current?.getCheckedRowItems();

					if (selectedRowTmp && selectedRowTmp.length > 0) {
						selectedRowTmp?.forEach((selectedRowItem: any, index: number) => {
							const item = Object.assign({}, selectedRowItem['item'], btn.initValues);
							const addedRowIndex = selectedRowItem['rowIndex'] + index + 1;

							// 제외 대상 체크
							if (btn?.excludeFn && btn?.excludeFn instanceof Function) {
								if (btn?.excludeFn(item)) {
									return false;
								}
							}

							if (gridProps?.flat2tree) {
								// 트리 구조일 경우 function이 다름
								gridBtn.tGridRef.current.addTreeRowByIndex(item, addedRowIndex);
							} else {
								gridBtn.tGridRef.current.addRow(item, addedRowIndex);
							}
						});
					}
					break;
				}

				// 행삽입
				case 'curPlus': {
					const selectedRowCur = gridBtn.tGridRef.current.getSelectedRows();
					const selectedRowCurTmp = gridBtn.tGridRef.current.getCheckedRowItems();
					if (selectedRowCur && selectedRowCur.length > 0) {
						if (gridProps?.flat2tree) {
							// 트리 구조일 경우 function이 다름
							gridBtn.tGridRef.current.addTreeRow(btn.initValues || {}, selectedRowCur[0]['_$parent'], 'selectionDown');
						} else {
							const addedRowIndex = selectedRowCurTmp[0]['rowIndex'] + 1;
							gridBtn.tGridRef.current.addRow(btn.initValues || {}, addedRowIndex);
						}
					}
					break;
				}

				// 행추가
				case 'plus':
					const initAddCount = (btn.initValues as any)?.addCount;

					// 행추가 개수가 없을 경우 1개 추가
					if (initAddCount === undefined) {
						// 기존 로직 유지
						gridBtn.tGridRef?.current.addRow(btn.initValues ?? {});
					} else {
						// 행 추가 개수를 받도록 하는 경우, 0 또는 null 일 경우 오류 메시지 출력

						if (initAddCount === 0 || initAddCount === null) {
							showAlert(null, t('lbl.PBOX_ROW') + '은(는) 필수값입니다.');
							return;
						}

						const addCount = initAddCount ?? 1;

						if (addCount > 0) {
							Array.from({ length: addCount }).forEach(() => {
								gridBtn.tGridRef?.current.addRow(btn.initValues ?? {});
							});
						}
					}

					break;

				// 행삭제
				case 'delete':
					gridBtn.tGridRef?.current?.deleteRowItems();
					break;
			}
		}

		// 콜백 처리
		if (btn.callBackFn && btn.callBackFn instanceof Function) {
			// AUI그리드 Cell 입력중인 값 확정 전 버튼들 클릭으로 이벤트가 동시에 이루어지는 이슈 대응하기 위해 setTimeout 추가
			if (isActionEvent) {
				setTimeout(() => {
					btn.callBackFn();
				}, 100);
			} else {
				btn.callBackFn();
			}
		}
	}, 300);

	/**
	 * 엑셀 업로드 파일 변경 이벤트
	 * @param {object} e 이벤트
	 * @returns {void}
	 */
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, {});
	};

	/**
	 * 버튼 타입에 맞는 다국어 라벨명 설정
	 * @param {string} btnType 버튼 타입
	 * @returns {string} 버튼 라벨명
	 */
	const getBtnLabel = (btnType: string): string => {
		switch (btnType) {
			case 'plus':
				btnType = 'ADD_ROW';
				break;
			case 'delete':
				btnType = 'REMOVE_ROW';
				break;
		}
		return t(`lbl.` + btnType?.toUpperCase());
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		// 버튼 리스트 설정
		if (gridBtn?.btnArr && gridBtn?.btnArr.length > 0) {
			setBtnList(btnList => {
				if (!commUtil.isEmpty(gridBtn.btnArr)) {
					// 버튼에 대한 권한 타입 설정
					gridBtn.btnArr.forEach((viewBtn: GridBtnType) => {
						if (commUtil.isEmpty(viewBtn.authType)) {
							if ('copy/curPlus/plus'.includes(viewBtn.btnType)) {
								// 행복사/행삽입/행추가 버튼은 [ 신규 ] 권한 적용
								viewBtn.authType = 'new';
							} else {
								viewBtn.authType = viewBtn.btnType;
							}
						}
					});

					// 노출시키려는 버튼 목록
					const viewBtnList = gridBtn.btnArr.filter(
						(viewBtn: GridBtnType) =>
							commUtil.getKeyByValue(Constants.BTN_AUTH, `${viewBtn.authType}Yn`) !== undefined ||
							commUtil.getKeyByValue(Constants.BTN_AUTH_EX, `${viewBtn.authType}Yn`) !== undefined,
					);

					// 현재 메뉴의 버튼 권한 정보
					const menuAuthInfoTmp: any = getFindMenu(location.pathname);
					setMenuAuthInfo(getFindMenu(location.pathname));

					// 권한이 적용된 버튼 목록 설정
					btnList = viewBtnList.filter(
						(viewBtn: GridBtnType) =>
							Object.keys(menuAuthInfoTmp ?? {}).filter(
								key => menuAuthInfoTmp[key] === '1' && `${viewBtn.authType}Yn` === key,
							).length > 0 || commUtil.getKeyByValue(Constants.BTN_AUTH_EX, `${viewBtn.authType}Yn`) !== undefined,
					);
				} else {
					return [];
				}

				return [...btnList];
			});
		}

		// location.pathname 추가 (2026-02-06)
		// TAB을 통해 이동시 이동된 페이지의 버튼을 가져와서 세팅하는 이슈가 있음 getFindMenu(location.pathname)
		// 기존 TAB들에 이동된 TAB의 버튼들이 추가되는 이슈 해결 위해 location.pathname 추가
		// EX) "외부창고 출고지시서" >>> "외부창고 출고 확정" TAB 이동시 ["팩스", "메일"] 버튼이 생김
	}, [gridBtn?.btnArr, location.pathname]);

	// 컨텍스트 메뉴에서 발생하는 커스텀 이벤트 리스너
	useEffect(() => {
		if (!gridBtn?.tGridRef?.current || btnList?.length === 0) {
			return;
		}

		const handleContextMenuAction = (event: CustomEvent) => {
			const { action, gridId } = event.detail;

			// 현재 그리드와 이벤트가 발생한 그리드가 같은지 확인
			if (gridBtn.tGridRef.current && gridBtn.tGridRef.current.state.id === gridId) {
				// 해당 액션의 버튼 찾기
				const targetBtn = btnList.find((btn: GridBtnType) => btn.btnType === action);

				if (targetBtn) {
					preCallBackFn(targetBtn);
				}
			}
		};

		window.addEventListener('gridContextMenuAction', handleContextMenuAction as EventListener);

		return () => {
			window.removeEventListener('gridContextMenuAction', handleContextMenuAction as EventListener);
		};
	}, [btnList, gridBtn?.tGridRef]);

	// F7키를 누르면 DevTools의 콘솔에 표시함
	useKeydownAUIGrid(
		{ key: 'F7' },
		() => {
			// F7키를 누르면 DevTools의 콘솔에 표시함
		},
		gridBtn?.tGridRef,
	);

	// F8 키 누르면 저장 버튼 클릭
	useKeydownAUIGrid(
		{ key: 'F8' },
		() => {
			// btnList에서 save 타입 버튼 찾기
			const saveBtn = btnList.find((btn: GridBtnType) => btn.btnType === 'save');
			if (saveBtn) {
				preCallBackFn(saveBtn);
			}
		},
		gridBtn?.tGridRef,
	);

	useKeydownAUIGrid(
		{ key: 'Enter' },
		() => {
			const plusBtn = btnList.find((btn: GridBtnType) => btn.btnType === 'plus');

			if (plusBtn) {
				preCallBackFn(plusBtn);
			}
		},
		gridBtn?.tGridRef,
	);

	useKeydownAUIGrid(
		{ key: 'F', ctrlKey: true },
		() => {
			gridBtn?.tGridRef?.current?.openFindPopup();
		},
		gridBtn?.tGridRef,
	);

	useKeydownAUIGrid(
		{ key: 'P', ctrlKey: true },
		() => {
			const printBtn = btnList.find((btn: GridBtnType) => btn.btnType === 'print');

			if (printBtn) {
				preCallBackFn(printBtn);
			}
		},
		gridBtn?.tGridRef,
	);

	if (!isGridTopBtnVisible) return null;

	return (
		<div className="title-area" style={style}>
			<div className="title">
				{gridTitle && (
					<>
						<StyledTitle>{gridTitle || '목록'}</StyledTitle>
						{totalCnt > 0 && <em>총 {commUtil.changeNumberFormatter(totalCnt)}건</em>}
						{purchaseCnt > 0 && <em> / 발주대상 {commUtil.changeNumberFormatter(purchaseCnt)}건</em>}
						{customCont && <em>{customCont}</em>}
					</>
				)}

				{extraContentLeft && <>{extraContentLeft}</>}
			</div>

			<div className="grid-flex-wrap">
				{/* 커스텀 children 버튼 노출 (prefix) */}
				{position === 'prefix' && children}

				{/* 허용된 버튼 노출 */}
				{btnList.map((btn: GridBtnType) => {
					if (!btn.btnLabel) {
						// 버튼 아이콘으로 변경
						switch (btn.btnType) {
							// 아래로
							case 'down':
								btn.icoSvgData = 'icoArrowDown';
								btn.tooltip = btn.tooltip ?? '아래로';
								break;

							// 위로
							case 'up':
								btn.icoSvgData = 'icoArrowUp';
								btn.tooltip = btn.tooltip ?? '위로';
								break;

							// 엑셀업로드
							// case 'excelUpload':
							// 	btn.icoSvgData = 'icoExcelUpload';
							// 	btn.tooltip = btn.tooltip ?? '엑셀업로드';
							// 	break;

							// 엑셀다운로드
							// case 'excelDownload':
							// 	btn.icoSvgData = 'icoExcelDown';
							// 	btn.tooltip = btn.tooltip ?? '엑셀다운로드';
							// 	break;

							// 행복사
							case 'copy':
								btn.icoSvgData = 'icoCopy';
								btn.tooltip = btn.tooltip ?? '행복사';
								break;

							// 행삽입
							case 'curPlus':
								btn.icoSvgData = 'icoInsertion';
								btn.tooltip = btn.tooltip ?? '행삽입';
								break;

							// 행추가
							case 'plus':
								btn.icoSvgData = 'icoPlus';
								btn.tooltip = btn.tooltip ?? '행추가';
								break;

							// 행삭제
							case 'delete':
								btn.icoSvgData = 'icoMinus';
								btn.tooltip = btn.tooltip ?? '행삭제';
								break;

							// 사용자설정팝업
							case 'userSetting':
								btn.icoSvgData = 'icoUserSetting';
								btn.tooltip = btn.tooltip ?? '사용자설정팝업';
								break;
						}
					}

					return (
						<CustomTooltip key={`${btn.btnType}Yn`} placement="bottomLeft" title={btn.tooltip}>
							<Button
								key={`${btn.btnType}Yn`}
								icon={btn.icoSvgData && <IcoSvg data={icoSvgDataAny[btn.icoSvgData]} />}
								onClick={() => preCallBackFn(btn)}
								type={btn.btnType === 'save' ? 'primary' : null}
								disabled={btn?.disabledFn && btn?.disabledFn()}
							>
								{!btn.icoSvgData &&
									(btn.btnLabel || (menuAuthInfo && menuAuthInfo[`${btn.btnType}Nm`]) || getBtnLabel(btn.btnType))}
							</Button>
						</CustomTooltip>
					);
				})}

				{/* 커스텀 children 버튼 노출 (postfix) */}
				{position === 'postfix' && children}

				{/* 엑셀 파일 업로드 INPUT 영역 */}
				<input
					ref={excelUploadFileRef}
					id="excelUploadInput"
					type="file"
					onChange={onFileChange}
					onClick={(e: any) => {
						e.target.value = null;
					}}
					style={{ display: 'none' }}
				/>
			</div>
		</div>
	);
}
export default GridTopBtn;

const StyledTitle = styled.h3`
	flex: 0 0 auto;
	font-size: 16px;
	margin-right: 8px;
	display: flex;
	-webkit-box-align: center;
	align-items: center;
	line-height: 24px;
`;
