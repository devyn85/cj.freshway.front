interface PropsType {
	pageSize?: number;
	totalPage?: number;
	paginate?: any;
}

const PagePagination = ({ pageSize, totalPage, paginate }: PropsType) => {
	const pageNumbers = [];
	for (let i = 1; i <= Math.ceil(totalPage / pageSize); i++) {
		pageNumbers.push(i);
	}
	return (
		<ul className="pagination">
			<li className="active">
				{pageNumbers.map((number: number) => (
					<a key={number} onClick={() => paginate(number)} className="page-link">
						{number}
					</a>
				))}
			</li>
		</ul>
	);
};

export default PagePagination;
