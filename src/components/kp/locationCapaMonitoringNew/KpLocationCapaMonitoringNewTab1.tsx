/*
 ############################################################################
 # FiledataField	: KpLocationCapaMonitoringNewTab1.tsx
 # Description		: 센터capa현황(new) - 요약 탭
 # Author			: YeoSeungCheol
 # Since			: 25.11.19
 ############################################################################
*/

import { forwardRef, Fragment } from 'react';

// CSS
import ScrollBox from '@/components/common/ScrollBox';

// Lib
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const KpLocationCapaMonitoringNewTab1 = forwardRef((props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 저장조건 감시
	const storagetype = Form.useWatch('storagetype', props.form);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	const parsingNumber = (v: any) => {
		const n = Number(v);
		return Number.isFinite(n) ? n.toLocaleString() : '0';
	};

	/**
	 * 저장조건에 따른 행 표시 여부 확인
	 * @param {string} rowType - 저장조건 타입 ('10': 실온, '20': 냉장, '30': 냉동)
	 * @returns {boolean} 행 표시 여부
	 */
	const shouldShowRow = (rowType: string) => {
		// 전체 선택 또는 미선택 시 모든 행 표시
		if (!storagetype || storagetype === '' || storagetype === null) {
			return true;
		}
		// 선택된 저장조건과 일치하는 행만 표시
		return storagetype === rowType;
	};

	/**
	 * 표시되는 행 개수에 따른 rowSpan 계산
	 * @returns {number} rowSpan 값
	 */
	const getRowSpan = () => {
		// 전체 선택 시: 4개 행 (전체 + 실온 + 냉장 + 냉동)
		if (!storagetype || storagetype === '' || storagetype === null) {
			return 4;
		}
		// 특정 저장조건 선택 시: 2개 행 (전체 + 선택된 행)
		return 2;
	};

	/**
	 * 가동율에 따른 스타일 반환 (80 이상이면 빨간색)
	 * @param {number} rate - 가동율 값
	 * @returns {object} 스타일 객체
	 */
	const getWorkingRateStyle = (rate: number) => {
		return rate >= 80 ? { color: 'red' } : {};
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<ScrollBox>
			<StyledTable className="tbl-list">
				<thead>
					<tr>
						{/* 센터 */}
						<StyledTh $top={0} rowSpan={2}>
							{t('lbl.CENTER')}
						</StyledTh>
						{/* 저장조건 */}
						<StyledTh $top={0} rowSpan={2}>
							{t('lbl.STORAGETYPE')}
						</StyledTh>
						{/* CAPA */}
						<StyledTh $top={0} colSpan={5}>
							CAPA
						</StyledTh>
						{/* 잔여공간 */}
						<StyledTh $top={0} colSpan={3}>
							{t('lbl.REST_AREA')}
						</StyledTh>
					</tr>
					<tr>
						{/* 총 CAPA */}
						<StyledTh $top={HEADER_ROW_HEIGHT}>{t('lbl.TOTAL_CAPA1')}</StyledTh>
						{/* 피킹 */}
						<StyledTh $top={HEADER_ROW_HEIGHT}>{t('lbl.PICKING')}</StyledTh>
						{/* 보관 */}
						<StyledTh $top={HEADER_ROW_HEIGHT}>{t('lbl.KEEP')}</StyledTh>
						{/* 보관량 */}
						<StyledTh $top={HEADER_ROW_HEIGHT}>{t('lbl.KEEP_AMOUNT')}</StyledTh>
						{/* 가동율 */}
						<StyledTh $top={HEADER_ROW_HEIGHT}>{t('lbl.WORKING_RATE')}</StyledTh>
						{/* 총 잔여 공간 */}
						<StyledTh $top={HEADER_ROW_HEIGHT}>{t('lbl.TOTAL_REST_AREA')}</StyledTh>
						{/* 피킹 */}
						<StyledTh $top={HEADER_ROW_HEIGHT}>{t('lbl.PICKING')}</StyledTh>
						{/* 보관 */}
						<StyledTh $top={HEADER_ROW_HEIGHT}>{t('lbl.KEEP')}</StyledTh>
					</tr>
				</thead>
				<tbody>
					{props.data?.map((row: any, idx: number) => (
						<Fragment key={row.DCCODE || idx}>
							<tr>
								<td className="txt" rowSpan={getRowSpan()}>
									{row.DCNAME}
								</td>
								<td className="txt">
									{/* 전체 */}
									{t('lbl.ALL')}
								</td>
								<td>
									{/* CAPA 전체 총CPAP */}
									{parsingNumber(
										(row.PK_RT_P_STOCK_CNT || 0) +
											(row.PK_RT_S_STOCK_CNT || 0) +
											(row.PK_CD_P_STOCK_CNT || 0) +
											(row.PK_CD_S_STOCK_CNT || 0) +
											(row.PK_FZ_P_STOCK_CNT || 0) +
											(row.PK_FZ_S_STOCK_CNT || 0) +
											(row.KP_RT_P_STOCK_CNT || 0) +
											(row.KP_RT_S_STOCK_CNT || 0) +
											(row.KP_CD_P_STOCK_CNT || 0) +
											(row.KP_CD_S_STOCK_CNT || 0) +
											(row.KP_FZ_P_STOCK_CNT || 0) +
											(row.KP_FZ_S_STOCK_CNT || 0) +
											(row.PK_RT_P_FREE_CNT || 0) +
											(row.PK_RT_S_FREE_CNT || 0) +
											(row.PK_CD_P_FREE_CNT || 0) +
											(row.PK_CD_S_FREE_CNT || 0) +
											(row.PK_FZ_P_FREE_CNT || 0) +
											(row.PK_FZ_S_FREE_CNT || 0) +
											(row.KP_RT_P_FREE_CNT || 0) +
											(row.KP_RT_S_FREE_CNT || 0) +
											(row.KP_CD_P_FREE_CNT || 0) +
											(row.KP_CD_S_FREE_CNT || 0) +
											(row.KP_FZ_P_FREE_CNT || 0) +
											(row.KP_FZ_S_FREE_CNT || 0),
									)}
								</td>
								<td>
									{/* CAPA 전체 피킹 */}
									{parsingNumber(
										(row.PK_RT_P_STOCK_CNT || 0) +
											(row.PK_RT_S_STOCK_CNT || 0) +
											(row.PK_CD_P_STOCK_CNT || 0) +
											(row.PK_CD_S_STOCK_CNT || 0) +
											(row.PK_FZ_P_STOCK_CNT || 0) +
											(row.PK_FZ_S_STOCK_CNT || 0),
									)}
								</td>
								<td>
									{/* CAPA 전체 보관 */}
									{parsingNumber(
										(row.KP_RT_P_STOCK_CNT || 0) +
											(row.KP_RT_S_STOCK_CNT || 0) +
											(row.KP_CD_P_STOCK_CNT || 0) +
											(row.KP_CD_S_STOCK_CNT || 0) +
											(row.KP_FZ_P_STOCK_CNT || 0) +
											(row.KP_FZ_S_STOCK_CNT || 0),
									)}
								</td>
								<td>
									{/* CAPA 전체 보관량 */}
									{parsingNumber(
										(row.PK_RT_P_STOCK_CNT || 0) +
											(row.PK_RT_S_STOCK_CNT || 0) +
											(row.PK_CD_P_STOCK_CNT || 0) +
											(row.PK_CD_S_STOCK_CNT || 0) +
											(row.PK_FZ_P_STOCK_CNT || 0) +
											(row.PK_FZ_S_STOCK_CNT || 0) +
											(row.KP_RT_P_STOCK_CNT || 0) +
											(row.KP_RT_S_STOCK_CNT || 0) +
											(row.KP_CD_P_STOCK_CNT || 0) +
											(row.KP_CD_S_STOCK_CNT || 0) +
											(row.KP_FZ_P_STOCK_CNT || 0) +
											(row.KP_FZ_S_STOCK_CNT || 0),
									)}
								</td>
								{/* CAPA 가동율 */}
								<td
									style={getWorkingRateStyle(
										Math.floor(
											(((row.PK_RT_P_STOCK_CNT || 0) +
												(row.PK_RT_S_STOCK_CNT || 0) +
												(row.PK_CD_P_STOCK_CNT || 0) +
												(row.PK_CD_S_STOCK_CNT || 0) +
												(row.PK_FZ_P_STOCK_CNT || 0) +
												(row.PK_FZ_S_STOCK_CNT || 0) +
												(row.KP_RT_P_STOCK_CNT || 0) +
												(row.KP_RT_S_STOCK_CNT || 0) +
												(row.KP_CD_P_STOCK_CNT || 0) +
												(row.KP_CD_S_STOCK_CNT || 0) +
												(row.KP_FZ_P_STOCK_CNT || 0) +
												(row.KP_FZ_S_STOCK_CNT || 0)) /
												((row.PK_RT_P_STOCK_CNT || 0) +
													(row.PK_RT_S_STOCK_CNT || 0) +
													(row.PK_CD_P_STOCK_CNT || 0) +
													(row.PK_CD_S_STOCK_CNT || 0) +
													(row.PK_FZ_P_STOCK_CNT || 0) +
													(row.PK_FZ_S_STOCK_CNT || 0) +
													(row.KP_RT_P_STOCK_CNT || 0) +
													(row.KP_RT_S_STOCK_CNT || 0) +
													(row.KP_CD_P_STOCK_CNT || 0) +
													(row.KP_CD_S_STOCK_CNT || 0) +
													(row.KP_FZ_P_STOCK_CNT || 0) +
													(row.KP_FZ_S_STOCK_CNT || 0) +
													(row.PK_RT_P_FREE_CNT || 0) +
													(row.PK_RT_S_FREE_CNT || 0) +
													(row.PK_CD_P_FREE_CNT || 0) +
													(row.PK_CD_S_FREE_CNT || 0) +
													(row.PK_FZ_P_FREE_CNT || 0) +
													(row.PK_FZ_S_FREE_CNT || 0) +
													(row.KP_RT_P_FREE_CNT || 0) +
													(row.KP_RT_S_FREE_CNT || 0) +
													(row.KP_CD_P_FREE_CNT || 0) +
													(row.KP_CD_S_FREE_CNT || 0) +
													(row.KP_FZ_P_FREE_CNT || 0) +
													(row.KP_FZ_S_FREE_CNT || 0))) *
												100,
										),
									)}
								>
									{parsingNumber(
										Math.floor(
											(((row.PK_RT_P_STOCK_CNT || 0) +
												(row.PK_RT_S_STOCK_CNT || 0) +
												(row.PK_CD_P_STOCK_CNT || 0) +
												(row.PK_CD_S_STOCK_CNT || 0) +
												(row.PK_FZ_P_STOCK_CNT || 0) +
												(row.PK_FZ_S_STOCK_CNT || 0) +
												(row.KP_RT_P_STOCK_CNT || 0) +
												(row.KP_RT_S_STOCK_CNT || 0) +
												(row.KP_CD_P_STOCK_CNT || 0) +
												(row.KP_CD_S_STOCK_CNT || 0) +
												(row.KP_FZ_P_STOCK_CNT || 0) +
												(row.KP_FZ_S_STOCK_CNT || 0)) /
												((row.PK_RT_P_STOCK_CNT || 0) +
													(row.PK_RT_S_STOCK_CNT || 0) +
													(row.PK_CD_P_STOCK_CNT || 0) +
													(row.PK_CD_S_STOCK_CNT || 0) +
													(row.PK_FZ_P_STOCK_CNT || 0) +
													(row.PK_FZ_S_STOCK_CNT || 0) +
													(row.KP_RT_P_STOCK_CNT || 0) +
													(row.KP_RT_S_STOCK_CNT || 0) +
													(row.KP_CD_P_STOCK_CNT || 0) +
													(row.KP_CD_S_STOCK_CNT || 0) +
													(row.KP_FZ_P_STOCK_CNT || 0) +
													(row.KP_FZ_S_STOCK_CNT || 0) +
													(row.PK_RT_P_FREE_CNT || 0) +
													(row.PK_RT_S_FREE_CNT || 0) +
													(row.PK_CD_P_FREE_CNT || 0) +
													(row.PK_CD_S_FREE_CNT || 0) +
													(row.PK_FZ_P_FREE_CNT || 0) +
													(row.PK_FZ_S_FREE_CNT || 0) +
													(row.KP_RT_P_FREE_CNT || 0) +
													(row.KP_RT_S_FREE_CNT || 0) +
													(row.KP_CD_P_FREE_CNT || 0) +
													(row.KP_CD_S_FREE_CNT || 0) +
													(row.KP_FZ_P_FREE_CNT || 0) +
													(row.KP_FZ_S_FREE_CNT || 0))) *
												100,
										),
									)}
									%
								</td>
								<td>
									{/* 잔여공간 총 잔여공간 */}
									{parsingNumber(
										(row.PK_RT_P_FREE_CNT || 0) +
											(row.PK_RT_S_FREE_CNT || 0) +
											(row.PK_CD_P_FREE_CNT || 0) +
											(row.PK_CD_S_FREE_CNT || 0) +
											(row.PK_FZ_P_FREE_CNT || 0) +
											(row.PK_FZ_S_FREE_CNT || 0) +
											(row.KP_RT_P_FREE_CNT || 0) +
											(row.KP_RT_S_FREE_CNT || 0) +
											(row.KP_CD_P_FREE_CNT || 0) +
											(row.KP_CD_S_FREE_CNT || 0) +
											(row.KP_FZ_P_FREE_CNT || 0) +
											(row.KP_FZ_S_FREE_CNT || 0),
									)}
								</td>
								<td>
									{/* 잔여공간 피킹 */}
									{parsingNumber(
										(row.PK_RT_P_FREE_CNT || 0) +
											(row.PK_RT_S_FREE_CNT || 0) +
											(row.PK_CD_P_FREE_CNT || 0) +
											(row.PK_CD_S_FREE_CNT || 0) +
											(row.PK_FZ_P_FREE_CNT || 0) +
											(row.PK_FZ_S_FREE_CNT || 0),
									)}
								</td>
								<td>
									{/* 잔여공간 보관 */}
									{parsingNumber(
										(row.KP_RT_P_FREE_CNT || 0) +
											(row.KP_RT_S_FREE_CNT || 0) +
											(row.KP_CD_P_FREE_CNT || 0) +
											(row.KP_CD_S_FREE_CNT || 0) +
											(row.KP_FZ_P_FREE_CNT || 0) +
											(row.KP_FZ_S_FREE_CNT || 0),
									)}
								</td>
							</tr>

							{/* 실온(10) 표시 */}
							{shouldShowRow('10') && (
								<tr>
									{/* 실온 */}
									<td className="txt">{t('lbl.ROOM_TEMP')}</td>
									<td>
										{/* 실온 CAPA 총CAPA */}
										{parsingNumber(
											(row.PK_RT_P_STOCK_CNT || 0) +
												(row.PK_RT_S_STOCK_CNT || 0) +
												(row.KP_RT_P_STOCK_CNT || 0) +
												(row.KP_RT_S_STOCK_CNT || 0) +
												(row.PK_RT_P_FREE_CNT || 0) +
												(row.PK_RT_S_FREE_CNT || 0) +
												(row.KP_RT_P_FREE_CNT || 0) +
												(row.KP_RT_S_FREE_CNT || 0),
										)}
									</td>
									<td>
										{/* 실온 CAPA 피킹 */}
										{parsingNumber((row.PK_RT_P_STOCK_CNT || 0) + (row.PK_RT_S_STOCK_CNT || 0))}
									</td>
									<td>
										{/* 실온 CAPA 보관 */}
										{parsingNumber((row.KP_RT_P_STOCK_CNT || 0) + (row.KP_RT_S_STOCK_CNT || 0))}
									</td>
									<td>
										{/* 실온 CAPA 보관량 */}
										{parsingNumber(
											(row.PK_RT_P_STOCK_CNT || 0) +
												(row.PK_RT_S_STOCK_CNT || 0) +
												(row.KP_RT_P_STOCK_CNT || 0) +
												(row.KP_RT_S_STOCK_CNT || 0),
										)}
									</td>
									<td
										style={getWorkingRateStyle(
											Math.floor(
												(((row.PK_RT_P_STOCK_CNT || 0) +
													(row.PK_RT_S_STOCK_CNT || 0) +
													(row.KP_RT_P_STOCK_CNT || 0) +
													(row.KP_RT_S_STOCK_CNT || 0)) /
													((row.PK_RT_P_STOCK_CNT || 0) +
														(row.PK_RT_S_STOCK_CNT || 0) +
														(row.KP_RT_P_STOCK_CNT || 0) +
														(row.KP_RT_S_STOCK_CNT || 0) +
														(row.PK_RT_P_FREE_CNT || 0) +
														(row.PK_RT_S_FREE_CNT || 0) +
														(row.KP_RT_P_FREE_CNT || 0) +
														(row.KP_RT_S_FREE_CNT || 0))) *
													100,
											),
										)}
									>
										{/* 실온 CAPA 가동율 */}
										{parsingNumber(
											Math.floor(
												(((row.PK_RT_P_STOCK_CNT || 0) +
													(row.PK_RT_S_STOCK_CNT || 0) +
													(row.KP_RT_P_STOCK_CNT || 0) +
													(row.KP_RT_S_STOCK_CNT || 0)) /
													((row.PK_RT_P_STOCK_CNT || 0) +
														(row.PK_RT_S_STOCK_CNT || 0) +
														(row.KP_RT_P_STOCK_CNT || 0) +
														(row.KP_RT_S_STOCK_CNT || 0) +
														(row.PK_RT_P_FREE_CNT || 0) +
														(row.PK_RT_S_FREE_CNT || 0) +
														(row.KP_RT_P_FREE_CNT || 0) +
														(row.KP_RT_S_FREE_CNT || 0))) *
													100,
											),
										)}
										%
									</td>
									<td>
										{/* 실온 잔여공간 총잔여공간 */}
										{parsingNumber(
											(row.PK_RT_P_FREE_CNT || 0) +
												(row.PK_RT_S_FREE_CNT || 0) +
												(row.KP_RT_P_FREE_CNT || 0) +
												(row.KP_RT_S_FREE_CNT || 0),
										)}
									</td>
									<td>
										{/* 실온 잔여공간 파킹 */}
										{parsingNumber((row.PK_RT_P_FREE_CNT || 0) + (row.PK_RT_S_FREE_CNT || 0))}
									</td>
									<td>
										{/* 실온 잔여공간 보관 */}
										{parsingNumber((row.KP_RT_P_FREE_CNT || 0) + (row.KP_RT_S_FREE_CNT || 0))}
									</td>
								</tr>
							)}

							{/* 냉장(20) 표시 */}
							{shouldShowRow('20') && (
								<tr>
									{/* 냉장 */}
									<td className="txt">{t('lbl.REFRIGERATION_TEMP')}</td>
									<td>
										{/* 냉장 capa.총capa */}
										{parsingNumber(
											(row.PK_CD_P_STOCK_CNT || 0) +
												(row.PK_CD_S_STOCK_CNT || 0) +
												(row.KP_CD_P_STOCK_CNT || 0) +
												(row.KP_CD_S_STOCK_CNT || 0) +
												(row.PK_CD_P_FREE_CNT || 0) +
												(row.PK_CD_S_FREE_CNT || 0) +
												(row.KP_CD_P_FREE_CNT || 0) +
												(row.KP_CD_S_FREE_CNT || 0),
										)}
									</td>
									<td>
										{/* 냉장 capa.피킹 */}
										{parsingNumber((row.PK_CD_P_STOCK_CNT || 0) + (row.PK_CD_S_STOCK_CNT || 0))}
									</td>
									<td>
										{/* 냉장 capa.보관 */}
										{parsingNumber((row.KP_CD_P_STOCK_CNT || 0) + (row.KP_CD_S_STOCK_CNT || 0))}
									</td>
									<td>
										{/* 냉장 capa.보관량 */}
										{parsingNumber(
											(row.PK_CD_P_STOCK_CNT || 0) +
												(row.PK_CD_S_STOCK_CNT || 0) +
												(row.KP_CD_P_STOCK_CNT || 0) +
												(row.KP_CD_S_STOCK_CNT || 0),
										)}
									</td>
									<td
										style={getWorkingRateStyle(
											Math.floor(
												(((row.PK_CD_P_STOCK_CNT || 0) +
													(row.PK_CD_S_STOCK_CNT || 0) +
													(row.KP_CD_P_STOCK_CNT || 0) +
													(row.KP_CD_S_STOCK_CNT || 0)) /
													((row.PK_CD_P_STOCK_CNT || 0) +
														(row.PK_CD_S_STOCK_CNT || 0) +
														(row.KP_CD_P_STOCK_CNT || 0) +
														(row.KP_CD_S_STOCK_CNT || 0) +
														(row.PK_CD_P_FREE_CNT || 0) +
														(row.PK_CD_S_FREE_CNT || 0) +
														(row.KP_CD_P_FREE_CNT || 0) +
														(row.KP_CD_S_FREE_CNT || 0))) *
													100,
											),
										)}
									>
										{/* 냉장 capa.가동율 */}
										{parsingNumber(
											Math.floor(
												(((row.PK_CD_P_STOCK_CNT || 0) +
													(row.PK_CD_S_STOCK_CNT || 0) +
													(row.KP_CD_P_STOCK_CNT || 0) +
													(row.KP_CD_S_STOCK_CNT || 0)) /
													((row.PK_CD_P_STOCK_CNT || 0) +
														(row.PK_CD_S_STOCK_CNT || 0) +
														(row.KP_CD_P_STOCK_CNT || 0) +
														(row.KP_CD_S_STOCK_CNT || 0) +
														(row.PK_CD_P_FREE_CNT || 0) +
														(row.PK_CD_S_FREE_CNT || 0) +
														(row.KP_CD_P_FREE_CNT || 0) +
														(row.KP_CD_S_FREE_CNT || 0))) *
													100,
											),
										)}
										%
									</td>
									<td>
										{/* 냉장 capa.총잔여공간 */}
										{parsingNumber(
											(row.PK_CD_P_FREE_CNT || 0) +
												(row.PK_CD_S_FREE_CNT || 0) +
												(row.KP_CD_P_FREE_CNT || 0) +
												(row.KP_CD_S_FREE_CNT || 0),
										)}
									</td>
									<td>
										{/* 냉장 capa.피킹 */}
										{parsingNumber((row.PK_CD_P_FREE_CNT || 0) + (row.PK_CD_S_FREE_CNT || 0))}
									</td>
									<td>
										{/* 냉장 capa.보관 */}
										{parsingNumber((row.KP_CD_P_FREE_CNT || 0) + (row.KP_CD_S_FREE_CNT || 0))}
									</td>
								</tr>
							)}

							{/* 냉동(30) 표시 */}
							{shouldShowRow('30') && (
								<tr>
									{/* 냉동 */}
									<td className="txt">{t('lbl.FREEZING_TEMP')}</td>
									<td>
										{/* 냉동 capa. 총CAPA */}
										{parsingNumber(
											(row.PK_FZ_P_STOCK_CNT || 0) +
												(row.PK_FZ_S_STOCK_CNT || 0) +
												(row.KP_FZ_P_STOCK_CNT || 0) +
												(row.KP_FZ_S_STOCK_CNT || 0) +
												(row.PK_FZ_P_FREE_CNT || 0) +
												(row.PK_FZ_S_FREE_CNT || 0) +
												(row.KP_FZ_P_FREE_CNT || 0) +
												(row.KP_FZ_S_FREE_CNT || 0),
										)}
									</td>
									<td>
										{/* 냉동 capa. 피킹 */}
										{parsingNumber((row.PK_FZ_P_STOCK_CNT || 0) + (row.PK_FZ_S_STOCK_CNT || 0))}
									</td>
									<td>
										{/* 냉동 capa. 보관 */}
										{parsingNumber((row.KP_FZ_P_STOCK_CNT || 0) + (row.KP_FZ_S_STOCK_CNT || 0))}
									</td>
									<td>
										{/* 냉동 capa. 보관량 */}
										{parsingNumber(
											(row.PK_FZ_P_STOCK_CNT || 0) +
												(row.PK_FZ_S_STOCK_CNT || 0) +
												(row.KP_FZ_P_STOCK_CNT || 0) +
												(row.KP_FZ_S_STOCK_CNT || 0),
										)}
									</td>
									<td
										style={getWorkingRateStyle(
											Math.floor(
												(((row.PK_FZ_P_STOCK_CNT || 0) +
													(row.PK_FZ_S_STOCK_CNT || 0) +
													(row.KP_FZ_P_STOCK_CNT || 0) +
													(row.KP_FZ_S_STOCK_CNT || 0)) /
													((row.PK_FZ_P_STOCK_CNT || 0) +
														(row.PK_FZ_S_STOCK_CNT || 0) +
														(row.KP_FZ_P_STOCK_CNT || 0) +
														(row.KP_FZ_S_STOCK_CNT || 0) +
														(row.PK_FZ_P_FREE_CNT || 0) +
														(row.PK_FZ_S_FREE_CNT || 0) +
														(row.KP_FZ_P_FREE_CNT || 0) +
														(row.KP_FZ_S_FREE_CNT || 0))) *
													100,
											),
										)}
									>
										{/* 냉동 capa. 가동율 */}
										{parsingNumber(
											Math.floor(
												(((row.PK_FZ_P_STOCK_CNT || 0) +
													(row.PK_FZ_S_STOCK_CNT || 0) +
													(row.KP_FZ_P_STOCK_CNT || 0) +
													(row.KP_FZ_S_STOCK_CNT || 0)) /
													((row.PK_FZ_P_STOCK_CNT || 0) +
														(row.PK_FZ_S_STOCK_CNT || 0) +
														(row.KP_FZ_P_STOCK_CNT || 0) +
														(row.KP_FZ_S_STOCK_CNT || 0) +
														(row.PK_FZ_P_FREE_CNT || 0) +
														(row.PK_FZ_S_FREE_CNT || 0) +
														(row.KP_FZ_P_FREE_CNT || 0) +
														(row.KP_FZ_S_FREE_CNT || 0))) *
													100,
											),
										)}
										%
									</td>
									<td>
										{/* 냉동 capa. 총잔여공간 */}
										{parsingNumber(
											(row.PK_FZ_P_FREE_CNT || 0) +
												(row.PK_FZ_S_FREE_CNT || 0) +
												(row.KP_FZ_P_FREE_CNT || 0) +
												(row.KP_FZ_S_FREE_CNT || 0),
										)}
									</td>
									<td>
										{/* 냉동 capa. 피킹 */}
										{parsingNumber((row.PK_FZ_P_FREE_CNT || 0) + (row.PK_FZ_S_FREE_CNT || 0))}
									</td>
									<td>
										{/* 냉동 capa.보관 */}
										{parsingNumber((row.KP_FZ_P_FREE_CNT || 0) + (row.KP_FZ_S_FREE_CNT || 0))}
									</td>
								</tr>
							)}
						</Fragment>
					))}
				</tbody>
			</StyledTable>
		</ScrollBox>
	);
});

const HEADER_ROW_HEIGHT = 27;

const StyledTable = styled.table`
	position: relative;
	width: 100%;
	table-layout: fixed;
	border-collapse: collapse;
	border: 0;
	box-sizing: border-box;
	th,
	td {
		border: 1px solid #ddd;
		background-clip: padding-box;
	}

	thead tr:first-child th {
		top: 0;
	}

	thead tr:nth-child(2) th {
		top: ${HEADER_ROW_HEIGHT}px;
	}

	thead th::before {
		content: '';
		position: absolute;
		inset: -1px -1px 0 -1px;
		border: 1px solid #ddd;
		border-bottom: 0;
		pointer-events: none;
	}

	thead tr:nth-child(2) th::before {
		inset: -1px -1px -1px -1px;
		border-bottom: 1px solid #ddd;
	}
`;

const StyledTh = styled.th<{ $top: number }>`
	position: sticky;
	top: ${({ $top }) => `${$top}px`};
	z-index: 3;
	background-color: #f5f5f7;
`;

export default KpLocationCapaMonitoringNewTab1;
