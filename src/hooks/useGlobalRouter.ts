import { NavigateFunction } from 'react-router-dom';
//How to use router inside axios interceptors. React and Vue
//Axios 인터셉터 내부에서 라우터를 사용하는 방법
//https://dev.to/davidbuc/how-to-use-router-inside-axios-interceptors-react-and-vue-5ece
const useGlobalRouter = { navigate: null } as {
	navigate: null | NavigateFunction;
};

export default useGlobalRouter;
