/*
 # FiledataField	: MSPopUploadLocation.tsx
 # Description		: 로케이션등록 일괄업로드
 # Author			: YeoSeungCheol
 # Since			: 25.08.29
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import { InputText } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils
import fileUtil from '@/util/fileUtils';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// API
import { apiGetMaster } from '@/api/ms/apiMsLocation';
import { apiPostUploadPopUploadLocation, apiPostValidatePopUploadLocation } from '@/api/ms/apiMsPopUploadLocation';
import { useAppSelector } from '@/store/core/coreHook';

interface PropsType {
	close?: any;
}

const MsPopUploadLocation = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;

	// 다국어
	const { t } = useTranslation();

	const gridRef = useRef(null);
	const excelUploadFileRef = useRef(null);
	const globalVariable = useAppSelector(state => state.global.globalVariable);
	const dcCodeFromGlobal = globalVariable?.gDccode;

	const [baseLocation, setBaseLocation] = useState('');

	// 문자열 자르기 ("자동적용" 버튼 사용시 필요)
	const substrSafe = (s: string, from: number, len: number): string => {
		if (!s) return '';
		return s.slice(from, from + len);
	};

	// 안전한 행 업데이트 유틸리티
	const safeUpdateRow = (rowIndex: number, patch: any) => {
		const api = gridRef.current as any;
		if (!api) return;

		// setCellValue로 각 필드 업데이트
		Object.entries(patch).forEach(([field, value]) => {
			try {
				api.setCellValue(rowIndex, field, value);
			} catch (error) {
				// 오류 발생 시 처리
			}
		});

		// rowStatus를 'U'로 설정 (변경된 행임을 표시)
		try {
			api.setCellValue(rowIndex, 'rowStatus', 'U');
		} catch (error) {
			// 오류 발생 시 처리
		}
	};

	// 숫자 변환 유틸리티
	const toNum = (v: any) => (v === '' || v == null || isNaN(Number(v)) ? undefined : Number(v));

	// 선택된 행 또는 모든 행 가져오기
	const getCheckedOrAllRows = (): any[] => {
		const checkedItems = (gridRef.current as any).getCheckedRowItems();
		if (checkedItems && checkedItems.length > 0) {
			return checkedItems;
		}
		return (gridRef.current as any).getGridData();
	};

	// 행 업데이트
	const patchRowsByIndex = (updates: Array<{ index: number; data: any }>) => {
		updates.forEach(({ index, data }) => {
			safeUpdateRow(index, data);
		});
	};

	const gridCol = [
		{
			headerText: '로케이션',
			dataField: 'loc',
			required: true,
		},
		/**
		 * DCCODE 자리는 OM_FILECONVERT.ROWID로 대체
		 */
		{
			headerText: '내역',
			dataField: 'description',
		},
		{
			headerText: '로케이션종류',
			dataField: 'locCategory',
			required: true,
		},
		// {
		// 	headerText: '로케이션구분',
		// 	dataField: 'locFlag',
		// 	editable: true,
		// },
		{
			headerText: '로케이션유형',
			dataField: 'locType',
			required: true,
		},
		{
			dataField: 'locFlag',
			headerText: t('lbl.LOCFLAG'), // 로케이션구분
			dataType: 'code',
		},
		{
			dataField: 'locLevel',
			headerText: t('lbl.LOCLEVEL'), // 로케이션레벨
			dataType: 'code',
		},
		{
			headerText: '재고위치',
			dataField: 'stockType',
			required: true,
		},
		{
			headerText: '저장조건',
			dataField: 'storageType',
			required: true,
		},
		{
			headerText: '창고구분',
			dataField: 'whArea',
			required: true,
		},
		{
			headerText: '창고층',
			dataField: 'whAreaFloor',
			required: true,
		},
		{
			headerText: '랙열번호',
			dataField: 'rackColumn',
			required: true,
		},
		{
			headerText: '랙행번호',
			dataField: 'rackLine',
			required: true,
		},
		{
			headerText: '피킹존',
			dataField: 'zone',
			required: true,
		},
		{
			headerText: '랙',
			dataField: 'rack',
			required: true,
		},
		{
			headerText: '작업키',
			dataField: 'sortKey',
			required: true,
		},
		{
			headerText: '로케이션 수평우선순위계산',
			dataField: 'logicalLocH',
			editor: { type: 'numeric' },
			width: 160,
			required: true,
		},
		{
			headerText: '로케이션 수직우선순위계산',
			dataField: 'logicalLocV',
			editor: { type: 'numeric' },
			width: 180,
			required: true,
		},
		// {
		// 	headerText: '로케이션레벨',
		// 	dataField: 'locLevel',
		// 	required: true,
		// },
		{
			headerText: '출고가능',
			dataField: 'outYn',
			required: true,
		},
		{
			headerText: '입고가능',
			dataField: 'inYn',
			required: true,
		},
		{
			headerText: '이동완료여부',
			dataField: 'moveYn',
			required: true,
		},
		{
			headerText: '상품혼합여부',
			dataField: 'skuMixYn',
			required: true,
		},
		{
			headerText: '로트혼합여부',
			dataField: 'lotMixYn',
			required: true,
		},
		{
			headerText: '로케이션체적',
			dataField: 'locCube',
			editor: { type: 'numeric' },
			required: true,
		},
		{
			headerText: '로케이션규격(높이)',
			dataField: 'locCubeH',
			editor: { type: 'numeric' },
			width: 130,
			required: true,
		},
		{
			headerText: '로케이션규격(길이)',
			dataField: 'locCubeL',
			editor: { type: 'numeric' },
			width: 130,
			required: true,
		},
		{
			headerText: '로케이션규격(너비)',
			dataField: 'locCubeW',
			editor: { type: 'numeric' },
			width: 130,
			required: true,
		},
		{
			headerText: 'LOC적재무게',
			dataField: 'locWeight',
			editor: { type: 'numeric' },
			width: 110,
			required: true,
		},
		{
			headerText: 'CAPA적용여부',
			dataField: 'capaYn',
			required: true,
			width: 110,
		},
		{
			// 멀티로케이션여부
			headerText: t('lbl.MULTI_LOC_YN'),
			dataField: 'multiLocYn',
			required: true,
			width: 130,
		},
		{
			// PLT 구분
			headerText: 'PLT구분',
			dataField: 'pltFlg',
			required: true,
		},
		{
			// 혼합대상
			headerText: t('lbl.MIXTGT_TP'),
			dataField: 'mixtgtType',
		},
		{
			headerText: 'CAPA로케이션유형',
			dataField: 'capaLocType',
			width: 130,
			required: true,
		},
	];

	const gridProps = {
		editable: false,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		rowCheckDisabledFunction: (rowIndex: number, isChecked: boolean, item: any) => {
			return item.processYn !== 'N';
		},
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 일괄적용 기능
	 * @returns {void}
	 */
	const onApplyFromBase = async () => {
		// //console.log('[일괄적용] 시작', { baseLocation });

		if (!baseLocation) {
			return;
		}
		const params = {
			loc: baseLocation,
			// dcCode: gDccode,
		};

		// //console.log('API 호출 파라미터:', params);
		const res = await apiGetMaster(params);
		// //console.log('[일괄적용] API 응답:', res);

		const baseData = res.data;
		if (!baseData) {
			// //console.log('[일괄적용] baseData가 없음');
			return;
		}
		// //console.log('[일괄적용] 기준 데이터:', baseData);

		const api = gridRef.current as any;
		const gridData = api.getGridData();
		const targets = getCheckedOrAllRows();

		// //console.log('[일괄적용] 대상 행들:', {
		// 	gridDataLength: gridData.length,
		// 	targetsLength: targets.length,
		// 	targets: targets.map(t => ({ loc: (t.item || t).loc, rowIndex: t.rowIndex })),
		// });

		// 복사 대상 필드 (로케이션 코드, 위치정보, 검증결과는 제외)
		const copyFields = [
			'description',
			'locCategory',
			'locFlag',
			'locType',
			'stockType',
			'storageType',
			'whArea',
			'whAreaFloor',
			'sortKey',
			'logicalLocH',
			'logicalLocV',
			'locLevel',
			'outYn',
			'inYn',
			'moveYn',
			'skuMixYn',
			'lotMixYn',
			'locCube',
			'locCubeH',
			'locCubeL',
			'locCubeW',
			'locWeight',
			'pltFlg',
			'capaYn',
			'capaLocType',
			'mixtgtType',
			'multiLocYn',
		];

		// 제외할 필드들 (일괄적용 대상이 아님)
		// - loc: 로케이션 코드 (변경하면 안됨)
		// - rack, rackColumn, rackLine, zone: 위치정보 (자동적용에서 채움)
		// - processYn, processMsg: 검증/저장 결과

		const updates = targets
			.map((target: any) => {
				// getCheckedRowItems()는 {rowIndex, item} 형태로 반환
				const row = target.item || target;
				const rowIndex =
					target.rowIndex !== undefined
						? target.rowIndex
						: gridData.findIndex((r: any) => String(r?.loc ?? '').trim() === String(row?.loc ?? '').trim());

				// //console.log('[일괄적용] 행 처리:', {
				// 	loc: row.loc,
				// 	rowIndex,
				// 	targetRowIndex: target.rowIndex,
				// });

				// if (rowIndex < 0) {
				// 	//console.log('[일괄적용] 행을 찾을 수 없음:', row.loc);
				// 	return null;
				// }

				const current = gridData[rowIndex];
				const patch: any = { ...current };
				let changed = false;

				copyFields.forEach(field => {
					const currentValue = patch[field];
					const baseValue = baseData[field];

					// 값 정규화 비교 (타입, 공백 등 고려)
					const normalizeCurrent = String(currentValue ?? '').trim();
					const normalizeBase = String(baseValue ?? '').trim();

					if (normalizeCurrent !== normalizeBase) {
						patch[field] = baseValue;
						changed = true;
					}
				});

				return changed ? { index: rowIndex, data: patch } : null;
			})
			.filter(Boolean) as Array<{ index: number; data: any }>;

		if (updates.length > 0) {
			patchRowsByIndex(updates);
		} else {
		}
	};

	/**
	 * 자동적용 기능
	 * @returns {void}
	 */
	const onAutoApply = () => {
		const api = gridRef.current as any;
		const gridData = api.getGridData();
		const targets = (gridRef.current as any).getCheckedRowItems(); // 체크된 행만!

		const updates = targets
			.map((target: any) => {
				// getCheckedRowItems()는 {rowIndex, item} 형태로 반환
				const row = target.item || target;
				const rowIndex =
					target.rowIndex !== undefined
						? target.rowIndex
						: gridData.findIndex((r: any) => String(r?.loc ?? '').trim() === String(row?.loc ?? '').trim());

				if (rowIndex < 0) return null;

				const loc = row.loc || '';
				const updateData = { ...row };

				updateData.zone = substrSafe(loc, 0, 3);
				updateData.rack = substrSafe(loc, 0, 3);
				updateData.rackColumn = toNum(substrSafe(loc, 4, 2));
				updateData.rackLine = toNum(substrSafe(loc, 6, 2));

				return { index: rowIndex, data: updateData };
			})
			.filter(Boolean) as Array<{ index: number; data: any }>;

		patchRowsByIndex(updates);
	};

	/**
	 * 엑셀 데이터 세팅 후 필수값 체크를 위한 delay
	 * 지정된 지연 시간 후 그리드 유효성 검사를 수행하고 결과를 Promise로 반환
	 * @returns {Promise<boolean>} 유효성 검사 결과 (true/false)
	 */
	const validateGridDataWithDelay = () => {
		return new Promise(resolve => {
			setTimeout(() => {
				const isValid = gridRef.current.validateRequiredGridData();
				resolve(isValid);
			}, 50);
		});
	};

	// 엑셀 선택 시 처리: 컬럼 세팅 후 검증 호출
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		gridRef.current.changeColumnLayout(gridCol);
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, validateExcelList);
	};

	// 서버 검증 호출 및 Grid 반영
	const validateExcelList = async () => {
		const params = gridRef.current.getGridData();
		if (!params || params.length < 1) {
			showMessage({ content: t('msg.MSG_COM_VAL_020'), modalType: 'info' });
			return;
		}

		const isValid = await validateGridDataWithDelay();
		if (!isValid) return;

		const rows = params.map((row: any, idx: number) => {
			return {
				fileLineNo: idx + 1,
				loc: row.loc || '',
				description: row.description || '',
				locCategory: row.locCategory || '',
				locFlag: row.locFlag || '',
				locType: row.locType || '',
				stockType: row.stockType || '',
				storageType: row.storageType || '',
				whArea: row.whArea || '',
				whAreaFloor: row.whAreaFloor || '',
				rackColumn: String(row.rackColumn || ''),
				rackLine: String(row.rackLine || ''),
				zone: row.zone || '',
				rack: row.rack || '',
				sortKey: String(row.sortKey || ''),
				logicalLocH: String(row.logicalLocH || ''),
				logicalLocV: String(row.logicalLocV || ''),
				locLevel: row.locLevel || '',
				outYn: row.outYn || '',
				inYn: row.inYn || '',
				moveYn: row.moveYn || '',
				skuMixYn: row.skuMixYn || '',
				lotMixYn: row.lotMixYn || '',
				locCube: String(row.locCube || ''),
				locCubeH: String(row.locCubeH || ''),
				locCubeL: String(row.locCubeL || ''),
				locCubeW: String(row.locCubeW || ''),
				locWeight: String(row.locWeight || ''),
				pltFlg: row.pltFlg || '',
				capaYn: row.capaYn || '',
				capaLocType: row.capaLocType || '',
				multiLocYn: row.multiLocYn || 'N',
				mixtgtType: row.mixtgtType || '',
			};
		});

		apiPostValidatePopUploadLocation({ rows }).then((res: any) => {
			const rowsToUpdate = res?.data || [];
			const checkColumn = [
				{
					dataField: 'processYn',
					headerText: '체크결과',
					readOnly: true,
					cellStyleFunction: function (rowIndex: number, columnIndex: number, value: any) {
						if (value === 'E') {
							return 'auiGrid-cell-error';
						}
						return null;
					},
				},
				{ dataField: 'processMsg', headerText: '체크메시지', readOnly: true },
				{ dataField: 'rowStatus', headerText: '상태(I/U)', visible: false },
			];
			gridRef.current.addColumn(checkColumn, 1);

			const gridRows = gridRef.current.getGridData();
			const updateData: any[] = [];
			const updateIndex: any[] = [];

			rowsToUpdate.forEach((row: any) => {
				const idx = gridRows.findIndex((g: any) => String(g.loc ?? '').trim() === String(row.loc ?? '').trim());
				if (idx >= 0) {
					const rowIndex = gridRef.current.getRowIndexesByValue('_$uid', [gridRows[idx]._$uid]);
					if (rowIndex !== undefined) {
						const raw = row.processYn ?? 'N'; // Y/N/E
						const processYn = raw === 'Y' ? 'Y' : 'N';
						const processMsg = row.processMsg || '';
						const rowStatus = row.updateYn === 'Y' ? 'U' : 'I';
						updateData.push({ processYn, processMsg, rowStatus });
						updateIndex.push(rowIndex);
					}
				}
			});

			if (updateData.length > 0) {
				gridRef.current.updateRows(updateData, updateIndex);
			}

			const uncheckedItems = gridRef.current.getGridData().filter((it: any) => it.processYn === 'N');
			const uncheckedIds = uncheckedItems.map((it: any) => it._$uid);
			gridRef.current.addUncheckedRowsByIdsBefore(uncheckedIds);
		});
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveExcelList = () => {
		const params = gridRef.current.getCustomCheckedRowItems().map((item: any) => {
			return {
				...item,
			};
		});
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.noSelect'),
				modalType: 'info',
			});
			return;
		}

		const isProcessYN = params.some((item: any) => item.processYn !== 'Y');
		if (isProcessYN) {
			showMessage({
				content: '유효성 검증이 완료되지 않은 데이터가 포함되어 있습니다.\n확인 후 다시 시도해주세요.',
				modalType: 'info',
			});
			return;
		}

		const rows = params.map((item: any, index: number) => {
			return {
				fileLineNo: index + 1,
				loc: item.loc || '',
				description: item.description || '',
				locCategory: item.locCategory || '',
				locFlag: item.locFlag || '',
				locType: item.locType || '',
				stockType: item.stockType || '',
				storageType: item.storageType || '',
				whArea: item.whArea || '',
				whAreaFloor: item.whAreaFloor || '',
				rackColumn: String(item.rackColumn || ''),
				rackLine: String(item.rackLine || ''),
				zone: item.zone || '',
				rack: item.rack || '',
				sortKey: String(item.sortKey || ''),
				logicalLocH: String(item.logicalLocH || ''),
				logicalLocV: String(item.logicalLocV || ''),
				locLevel: item.locLevel || '',
				outYn: item.outYn || '',
				inYn: item.inYn || '',
				moveYn: item.moveYn || '',
				skuMixYn: item.skuMixYn || '',
				lotMixYn: item.lotMixYn || '',
				locCube: String(item.locCube || ''),
				locCubeH: String(item.locCubeH || ''),
				locCubeL: String(item.locCubeL || ''),
				locCubeW: String(item.locCubeW || ''),
				locWeight: String(item.locWeight || ''),
				pltFlg: item.pltFlg || '',
				capaYn: item.capaYn || '',
				capaLocType: item.capaLocType || '',
				multiLocYn: item.multiLocYn || 'N',
				mixtgtType: item.mixtgtType || '',
			};
		});

		const newCount = params.filter((item: any) => item.rowStatus === 'I').length;
		const updateCount = params.filter((item: any) => item.rowStatus === 'U').length;

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${newCount}건
				수정 : ${updateCount}건
				삭제 : 0건`;

		showConfirm(null, messageWithRowStatusCount, () => {
			apiPostUploadPopUploadLocation({ rows }).then(() => {
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
					onOk: () => {
						close();
					},
				});
			});
		});
	};

	/**
	 * 엑셀 양식 다운로드
	 * 로케이션 일괄업로드만 공통 기능을 사용하지 않고 버튼으로 추가(별도양식)
	 */
	const onExcelDownload = () => {
		const params = {
			dirType: 'excelTemplate',
			attchFileNm: '로케이션_정보관리.xlsx',
		};

		fileUtil.downloadFile(params);
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			// { btnType: 'excelForm' },
			{
				btnType: 'excelSelect', // 엑셀선택
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					excelUploadFileRef.current.click();
				},
			},
			{
				btnType: 'save',
				callBackFn: saveExcelList,
			},
		],
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (!gridRefCur) return;

		// cellClick 이벤트에서 processYn이 'N'이면 체크 막기
		gridRefCur.bind('cellClick', (event: any) => {
			if (event.dataField === gridRefCur.getProp('customRowCheckColumnDataField')) {
				// 체크하려고 할 때 (unCheckValue -> checkValue로 변경하려고 할 때)
				if (event.value === gridRefCur.getProp('customRowCheckColumnUnCheckValue')) {
					// processYn이 'N'이면 체크 막기
					if (event.item?.processYn === 'N') {
						setTimeout(() => {
							gridRefCur.setCellValue(
								event.rowIndex,
								gridRefCur.getProp('customRowCheckColumnDataField'),
								gridRefCur.getProp('customRowCheckColumnUnCheckValue'),
								true,
							);
						}, 0);
					}
				}
			}
		});
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="로케이션등록 일괄업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '}>
					<li>
						<InputText
							name="baseLocation"
							label="기준로케이션"
							placeholder="기준로케이션 정보 일괄 적용"
							className="bg-white"
							value={baseLocation}
							onChange={(e: any) => setBaseLocation(e.target.value)}
						/>
					</li>
					<Button onClick={onApplyFromBase}>일괄적용</Button>
					<Button onClick={onAutoApply}>자동적용</Button>

					{/* "양식 다운로드"를 gridBtn으로 넘기지 않고 버튼으로 추가 */}
					<Button onClick={onExcelDownload}>양식다운로드</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.CLOSE')}</Button>
			</ButtonWrap>

			{/* 숨김 파일 업로드 INPUT 영역 */}
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
		</>
	);
};

export default MsPopUploadLocation;
