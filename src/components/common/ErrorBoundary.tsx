import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
	children?: ReactNode;
}

interface Props {
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	};

	public static getDerivedStateFromError(): State {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// 추후 처리
	}

	public render() {
		// 오류 발생시 /error 페이지로 이동되지 않게 아래 내용 주석 처리
		// if (this.state.hasError) {
		// 	return this.props.fallback;
		// }

		return this.props.children;
	}
}

export default ErrorBoundary;
