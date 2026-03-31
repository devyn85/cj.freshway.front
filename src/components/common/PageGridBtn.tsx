import { ButtonConfig, pageGridBtnPropsType } from '@/types/auiGrid';
import commUtil from '@/util/commUtil';
import { Button } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

import IcoSvg from '@/components/common/IcoSvg';
import icoSvgData from '@/components/common/icoSvgData.json';

/**
 * 그리드 버튼 컴포넌트
 * @param {any} root0 props
 * @param {string} root0.gridTitle 그리드 제목
 * @param {Array} root0.gridBtn 그리드 버튼 목록
 * @param {*} root0.children children Element
 * @param {string} root0.position children 자리 위치
 * @returns {*} 그리드 버튼 컴포넌트
 */

/**
 *
 * @param {any} root0
 * @param {any} root0.gridTitle
 * @param {any} root0.gridBtn
 * @param {any} root0.children
 * @param {any} root0.position
 * @param {any} root0.totalCnt
 * @param {any} root0.order
 * @param root0.msg
 * @param root0.extraContentLeft
 * @param root0.buttons
 */
function PageGrid({
	gridTitle,
	gridBtn,
	children,
	position = 'prefix',
	totalCnt,
	order,
	msg,
	extraContentLeft,
	buttons,
}: pageGridBtnPropsType) {
	const { t } = useTranslation();
	if (commUtil.isEmpty(gridBtn)) gridBtn = {};

	const renderButtons = (buttonsParam: any = []) => {
		const buttons: ButtonConfig[] = Array.isArray(buttonsParam) ? buttonsParam : [];
		return buttons.map((btn, idx) => {
			if (btn.visible === false) return null;
			if (btn.customRender) return <React.Fragment key={idx}>{btn.customRender}</React.Fragment>;

			// @ts-ignore
			return (
				<Button
					key={idx}
					onClick={btn.onClick}
					type={btn.type}
					icon={btn.icon && <IcoSvg data={icoSvgData[btn.icon]} />}
				>
					{btn.label}
				</Button>
			);
		});
	};

	return (
		<>
			<div className="title-area">
				<div className="title">
					<h3>{gridTitle}</h3>
					{totalCnt && (
						<>
							<em>총 {commUtil.changeNumberFormatter(totalCnt)}건</em>
						</>
					)}
					{order && (
						<>
							<em className="dot">발주대상 20건</em>
						</>
					)}
					{msg && (
						<>
							<span className="msg">상품 조회 시 속도가 많이 느려지며 서버에 많은 부담을 주게 됩니다.</span>
						</>
					)}

					{extraContentLeft && <>{extraContentLeft}</>}
				</div>

				<div className="grid-flex-wrap">
					{position === 'prefix' && children}
					{/*<Button label={'이전'} icon={<IcoSvg data={icoSvgData.icoArrowLeft} />} onClick={gridBtn.plusFunction} />
					<Button label={'다음'} icon={<IcoSvg data={icoSvgData.icoArrowRight} />} onClick={gridBtn.plusFunction} />
					<Button label={'아래'} icon={<IcoSvg data={icoSvgData.icoArrowDown} />} onClick={gridBtn.plusFunction} />
					<Button label={'위로'} icon={<IcoSvg data={icoSvgData.icoArrowUp} />} onClick={gridBtn.plusFunction} />
					<Button
						label={'엑셀업로드'}
						icon={<IcoSvg data={icoSvgData.icoExcelUpload} />}
						onClick={gridBtn.plusFunction}
					/>
					<Button
						label={'엑셀다운로드'}
						icon={<IcoSvg data={icoSvgData.icoExcelDown} />}
						onClick={gridBtn.plusFunction}
					/>
					<Button label={'행복사'} icon={<IcoSvg data={icoSvgData.icoCopy} />} onClick={gridBtn.plusFunction} />
					<Button label={'행추가'} icon={<IcoSvg data={icoSvgData.icoPlus} />} onClick={gridBtn.plusFunction} />
					<Button label={'행삭제'} icon={<IcoSvg data={icoSvgData.icoMinus} />} onClick={gridBtn.plusFunction} />

					{gridBtn.isPlus ? (

						<Button onClick={gridBtn.plusFunction}>
							 행추가
						</Button>
					) : null}
					{gridBtn.isMinus ? (
						<Button onClick={gridBtn.minusFunction}>
							 행삭제
						</Button>
					) : null}
					{gridBtn.isCopy ? (
						<Button onClick={gridBtn.copyFunction}>
							 행복사
						</Button>
					) : null}
					{gridBtn.isAddBtn1 ? (
						<Button type={'primary'} onClick={gridBtn.addFunction1}>
							{gridBtn.addLabel1 || '저장'}
						</Button>
					) : null}
					{gridBtn.isAddBtn2 ? (
						<Button type={'outline-primary'} onClick={gridBtn.addFunction2}>
							{gridBtn.addLabel2 || t('lbl.btn2')}
						</Button>
					) : null}
					{gridBtn.isAddBtn3 ? (
						<Button onClick={gridBtn.addFunction3}>{gridBtn.addLabel3 || t('lbl.btn3')}</Button>
					) : null}*/}
					{gridBtn.isCustom ? gridBtn.customComponent : null}
					{renderButtons(buttons)}
					{position === 'postfix' && children}

					<Button icon={<IcoSvg data={icoSvgData.icoMore} />} onClick={gridBtn.plusFunction}>더보기</Button>
				</div>
			</div>
		</>
	);
}

export default PageGrid;
