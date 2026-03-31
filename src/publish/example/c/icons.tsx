/**
 * @file icons.tsx
 * @description 가이드 - icon 페이지
 */

import IcoAvatar from './IcoAvatar';
import { IcoChevronThickLeft, IcoChevronThickRight, IcoRequired, IcoTooltip } from './IcoGroup';
import IcoSvg from './IcoSvg';
import IcoSymbol from './IcoSymbol';
import icoSvgData from './icoSvgData.json';
type typeArr = undefined | string[];
interface DataType {
	[key: string]: string[];
}
interface DataCircleType {
	[key: string]: { path: string[]; circle: string[][] };
}

const Sample = () => {
	const renderIcoSvg = () => {
		const $data: DataType = icoSvgData;
		const arrName: typeArr = [];
		const arrPath = [];

		for (const key in $data) {
			arrPath.push($data[key]);
			arrName.push(key);
		}

		return arrPath.map((a, i) => (
			<li className="guide__item" key={i}>
				<div className="guide__box">
					<IcoSvg data={a} />
					<p className="cate">이름 : {arrName[i]}</p>
				</div>
			</li>
		));
	};

	return (
		<>
			<section className="guide__section">
				<h1 className="guide__hidden">Icon</h1>
				<code className="guide__code">import IcoSvg from '@/publish/example/c/IcoSvg'</code>
				<code className="guide__code">IcoSvg data=icoSvgData.이름</code>
				<code className="guide__code">@include icoSvg(사이즈, 컬러)</code>

				<div className="guide__group ico-svg__list" style={{ marginTop: '20px' }}>
					<h2 className="guide__title">Icon Svg</h2>
					<ul className="guide__list--row">{renderIcoSvg()}</ul>
				</div>
			</section>
		</>
	);
};

export default Sample;
Sample.PublishingLayout = 'BLANK';
