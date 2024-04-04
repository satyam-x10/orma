import { useContext, FC } from "react";
import AuthContext from '../../context/auth/AuthContext';
import { AuthProviderProps } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSpinner} from '@fortawesome/free-solid-svg-icons'

const loading: FC<AuthProviderProps> = ({ children }) => {
    const {loading} = useContext(AuthContext)
return (
    <div>{loading === true ? <div>
        <div className="loadingPage">
           <FontAwesomeIcon style={{fontSize: '60px'}} icon={faSpinner} spin />
        </div></div> : children}</div>
)
}
export default loading;