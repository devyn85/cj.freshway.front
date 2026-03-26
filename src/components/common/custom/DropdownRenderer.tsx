import React from 'react';

/**
 * 드롭다운 테이블 렌더링
 * @param {any} columns 테이블 컬럼 정보
 * @param {any} dropdownData 드롭다운에 표시할 데이터
 * @param {any} handleDropdownClick 드롭다운 아이템 클릭 핸들러
 * @param {string} className 추가 CSS 클래스명
 * @param {any} opt 옵션
 * 							bodyRef: 포커스 컨트롤 하기 위한 Ref
 * 							setDropdownOpen: Drop Down 노출 컨트롤
 * 							form: Form
 * 							name: Input 필드명
 * @returns {React.ReactElement} 드롭다운 테이블 JSX 엘리먼트
 * @example // CmSkuSearch.tsx 참고
 * ```
 * // 드롭다운 검색 Hook 설정
	const dropdownConfig = {
		columns: [
			{ key: 'code' as const, title: '코드' },
			{ key: 'name' as const, title: '명', className: 'txt-l' },
		],
		props.form,
		props.name,
		props.code,
		props.returnValueFormat,
	};
 
	const { dropdownOpen, setDropdownOpen, setDropdownData, dropdownData, handleDropdownClick } =
		useSearchDropdownInSearch(dropdownConfig);
 
  return <Dropdown
				placement="bottom"
				open={dropdownOpen}
				trigger={[]} // hover, click 방지 => 명시적으로 상태로만 열림
				popupRender={() => DropdownRenderer(dropdownConfig.columns, dropdownData, handleDropdownClick)}
			>
	```
 */
const DropdownRenderer = (
	columns: any,
	dropdownData: any,
	handleDropdownClick: any,
	className?: string,
	opt?: any,
): React.ReactElement => {
	const handleKeyMove = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
		const current: any = e.currentTarget;

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			current.nextElementSibling?.focus();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			current.previousElementSibling?.focus();
		} else if (e.key === 'Enter') {
			current.click();

			// Drop Down 닫힌 뒤 Input으로 복귀
			setTimeout(() => {
				opt?.form?.getFieldInstance(opt?.name)?.focus(); // 검색 영역
			});
		} else if (e.key === 'Escape') {
			if (opt?.setDropdownOpen) opt?.setDropdownOpen(false); // 검색 영역
			if (opt?._tGrid) opt?._tGrid?.closeSearchDropdownPopup(); // AUI그리드 영역

			// Drop Down 닫힌 뒤 Input으로 복귀
			setTimeout(() => {
				opt?.form?.getFieldInstance(opt?.name)?.focus(); // 검색 영역
				opt?._tGrid?.forceEditingComplete(); // AUI그리드 영역
			});
		}
	};

	return (
		<div className={`dropdown-content ${className || ''}`}>
			<table className="data-table">
				<thead>
					<tr>
						{columns.map((col: any) => (
							<th key={String(col.key)}>{col.title}</th>
						))}
					</tr>
				</thead>
				<tbody ref={opt?.bodyRef}>
					{dropdownData.map((item: any, index: any) => (
						<tr
							key={index}
							tabIndex={0}
							onClick={() => handleDropdownClick(item)}
							onKeyDown={(e: any) => handleKeyMove(e)}
						>
							{columns.map((col: any) => (
								<td key={String(col.key)} id="dropdownTable" className={`${col.className} aui-grid-dropdown-content`}>
									{String(item[col.key] || '')}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default DropdownRenderer;
