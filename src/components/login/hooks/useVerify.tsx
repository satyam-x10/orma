import { useState, useEffect, useContext } from 'react';
import { login, verifyCode } from '../services/authApi';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import AuthContext from '../../../context/auth/AuthContext';
import { phoneValidator } from '../../../helper/index';
import { log } from 'console';
interface RouteParams {
    option: string;
    event_hash: string;
    // Other parameter properties...
}
let currentUrl = '';
const useVerify = () => {
    const [phoneNumber, setPhoneNumber] = useState<string | null>('');
    const [showCodeView, setShowCodeView] = useState(false);
    const [request_id, setRequestId] = useState<string | null>();
    const [nameVerify, setNameVerify] = useState<boolean>();
    const [name, setName] = useState<string | null>(null)
    const [code, setCode] = useState<string | null>('');
    const [error, setError] = useState('');
    const { option, event_hash }: Partial<RouteParams> = useParams();
    const { updateUser } = useContext(AuthContext)


    let navigate = useNavigate();

    useEffect(() => {
        if (option) {
            let params = new URLSearchParams(option);
            let name = params.get("name");
            let verify = params.get("verify");
            let request_id = params.get("request_id");
            let phone = params.get("phone");

            if (verify && request_id) {
                setRequestId(request_id);
                setNameVerify(name === "true" ? true : false);
                setShowCodeView(true);
                setPhoneNumber(phone);

            }

        }
    }, [option])

    const verifyUser = async () => {
        currentUrl = window.location.pathname;
        let cleanedNumber = phoneNumber?.replace('+', '');
        if (cleanedNumber && cleanedNumber.length > 0 && cleanedNumber.length < 13 && phoneValidator(cleanedNumber)) {
            try {
                let tryLogin = await login(cleanedNumber);
                if (tryLogin?.success === true) {
                    setError('');
                    let name = tryLogin?.name;
                    let request_id = tryLogin?.request_id ? tryLogin.request_id : null;
                    
                    navigate('../../login/verify=true&name=' + name + '&request_id=' + request_id + '&phone=' + cleanedNumber)
                    
                } else {
                    setError('That was an error verifying your number')
                }
            } catch (e) {
                setError('There was an error processing the request')
            }
        } else {
            setError('Please enter a valid phone number')
        }
    }

    const verifyDigitCode = async () => {
        
        let cleanedNumber = phoneNumber?.replace('+', '');
        if (cleanedNumber && phoneValidator(cleanedNumber)) {
            if (code && code.length > 0 && code.length < 5 && request_id && cleanedNumber) {
                try {
                    let tryVerify = await verifyCode(code, request_id, phoneNumber, name);
                    if (tryVerify?.token && tryVerify?.success === true) {
                        Cookies.set('token', tryVerify?.token, { path: '/', expires: 30 });
                        updateUser();
                        if (event_hash) {
                            navigate('../' + event_hash + '/upload')
                        } else {
                            if (currentUrl.includes('login')) {
                                navigate(-2);
                            }
                            else {
                               navigate(-1);
                            }


                        }
                    } else {
                        setError('Code is invalid or expired. please try again!')
                    }
                } catch (e) {
                    setError('There was an error processing the request')
                }
            } else {
                setError('Please enter a valid code')
            }
        } else {
            setError('The request been corrupted, please try again.')
        }
    }

    useEffect(() => {
        if (code && code.length === 4 && (nameVerify === true || (name && name?.length > 0))) {
            verifyDigitCode();
        }
    }, [code]);

    return {
        verifyUser,
        phoneNumber,
        setPhoneNumber,
        error,
        setError,
        showCodeView,
        verifyDigitCode,
        nameVerify,
        code,
        setCode,
        setName,
        currentUrl
    }
}

export default useVerify;