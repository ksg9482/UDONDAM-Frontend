import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import axios from 'axios';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { IsLoginHandler } from '../redux/modules/IsLogin';
import { UserInfoHandler } from '../redux/modules/UserInfo';
import { IsGuestHandler } from '../redux/modules/IsGuest';
import SearchPassword from '../components/Login/SearchPassword';
import GuestLoginModal from '../components/Login/GuestLoginModal';
import LoadingIndicator from '../components/utils/LoadingIndicator';
import SocialGoogleLogin from '../components/SocialGoogleLogin';
import './styles/IntroStyle.css';
const NAVER = process.env.NAVER || 'http://localhost:8080/naver';
const KAKAO = process.env.KAKAO || 'http://localhost:8080/kakao';

export interface loginInfoState {
    email: string,
    password: string
};

export interface IProps {
    modlaOnOff: any
}

export interface modalOnOffState {
    guestModal: boolean,
    seaerchPasswordModal: boolean
}


function Login() {
    const dispatch = useDispatch()
    const history = useHistory()

    function sleep(ms:any) {
        const wakeUpTime = Date.now() + ms;
        while (Date.now() < wakeUpTime) {}
      }

    dispatch(IsGuestHandler(false))
    if (useSelector((state: RootStateOrAny) => state.IsLoginReducer.isLogin) === true) {
        
        if (document.querySelector('.logo_nav')?.classList.contains('hide') === true) {
            
            document.querySelector('.logo_nav_place')?.classList.add('hide')
            document.querySelector('.logo_nav')?.classList.toggle('hide')
            document.querySelector('#nav_bar')?.classList.toggle('hide')

        }
        
        history.push('/Search')

    }
    const [loginInfo, setLoginInfo] = useState<loginInfoState>({
        email: '',
        password: ''
    })
    const [modalOnOff, setModalOnOff] = useState<modalOnOffState>({
        guestModal: false,
        seaerchPasswordModal: false
    })

    const [errorMessage, setErrorMessage] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(true)
    
    const inputHandler = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginInfo({ ...loginInfo, [key]: e.target.value })
    }

    const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (loginInfo.email === '' || loginInfo.password === '') {
            setErrorMessage('????????? ?????? ??????????????? ??????????????????')
        }
        e.preventDefault();
        const body = { email: loginInfo.email, password: loginInfo.password }

        try {
            setIsLoading(true)
            const loginInfoPost = await axios.post(`${process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : "http://localhost:8080"}/login`, body, { withCredentials: true })
            setIsLoading(false)
            const userInfo = loginInfoPost.data.data
            const changeJson:string = JSON.stringify({
                userId: userInfo.userId,
                email: loginInfo.email,
                nickname: userInfo.nickname,
                area: userInfo.area,
                area2: userInfo.area2,
                manager: userInfo.manager,
                socialType: userInfo.socialType
            })
            sessionStorage.setItem('user',changeJson)
            const areadata:string = JSON.stringify([userInfo.area,userInfo.area2])
            sessionStorage.setItem('areaData',areadata)
            dispatch(UserInfoHandler({
                userId: userInfo.userId,
                email: loginInfo.email,
                nickname: userInfo.nickname,
                area: userInfo.area || null,
                area2: userInfo.area2 || null,
                manager: userInfo.manager,
                socialType: userInfo.socialType
            }))
            dispatch(IsLoginHandler(true))
            dispatch(IsGuestHandler(false))

            hideLogo()
            document.querySelector('#nav_bar_desktop')?.classList.remove('hide')
            document.querySelector('.logo_nav_place')?.classList.remove('hide')
            history.push('/Search')

        } catch (error: any) {
            setIsLoading(false)
            if (error.response.status === 401) {
            }
            return;
        }
    }

    const guestModalHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setModalOnOff({ ...modalOnOff, ['guestModal']: !modalOnOff.guestModal })
    }

    const passwordSearchModalHandler = function () {
        setModalOnOff({ ...modalOnOff, ['seaerchPasswordModal']: !modalOnOff.seaerchPasswordModal })
    }

    const socialLoginHandler = (key: string) => async (e: React.MouseEvent<HTMLSpanElement/*?????? ?????? */>) => {
        setIsLoading(true)
        if (key === 'kakao') {
          window.location.href = KAKAO
        } else if(key === 'google'){
            window.location.href = `${process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : "http://localhost:8080"}/google`
        } else if(key === 'naver') {
            window.location.href = NAVER
        }


    }


    //???????????? ????????? ?????? ??????
    const offSeaerchPasswordModal = () => {
        setModalOnOff({ ...modalOnOff, ['seaerchPasswordModal']: false })
    };
    const closeSeaerchPasswordModal = function () {
        offSeaerchPasswordModal()
    };
    const offGuestModalModal = () => {
        setModalOnOff({ ...modalOnOff, ['guestModal']: false })
    };
    const closeGuestModal = function () {
        offGuestModalModal()
    };

    const hideLogoFirsf = function () {
        if (document.querySelector('.logo_nav')?.classList.contains('hide') === false) {
            document.querySelector('.logo_nav')?.classList.toggle('hide')
            document.querySelector('#nav_bar')?.classList.toggle('hide')
            
        }
        if(document.querySelector('.logo_nav_place')?.classList.toggle('hide') === false){
            document.querySelector('.logo_nav_place')?.classList.add('hide')
        }
    }

    const hideLogo = function () {
        if (document.querySelector('.logo_nav')?.classList.contains('hide') === true) {
            document.querySelector('.logo_nav')?.classList.toggle('hide')
            document.querySelector('#nav_bar')?.classList.toggle('hide')
            document.querySelector('.logo_nav_place')?.classList.toggle('hide')
        }

    }

    const inSignUp = function () {
        history.push('/Signup')
    }
    useEffect(() => {
        hideLogoFirsf()
        setIsLoading(false)
    }, [])

    return (
        <div className='container'>
            {isLoading? <LoadingIndicator /> : 
            <div className='login_container'>
            <div></div>
            <div className='login_img_place'>
                <div className='logo_page_div'>
                    <img className='logo_page' src="??????-?????????-Dark-??????x.png" alt="logo" />
                </div>
            </div>
            <form className='submit_box'>
                <div className='submit_box_input'>
                    <input className='login_input' type="text" onChange={inputHandler('email')} placeholder='?????????' />
                    <input className='login_input' type="password" onChange={inputHandler('password')} placeholder='????????????' />
                    {errorMessage !== '' ? 
                    <div>{errorMessage}</div> 
                    : <br />}
                </div>
                <div className='login_button_place'>
                <div className='login_button_box'>
                    <button className='login_button gray_button' onClick={submitHandler}>?????????</button>
                    <button className='login_button gray_button' onClick={guestModalHandler}>??????????????????</button>
                </div>
                </div>

            </form>
            <div className='userguide_box'>
                <ul>
                    <li className='login_li' onClick={inSignUp}>????????????</li>
                    <li className='login_li' onClick={passwordSearchModalHandler}>??????????????? ????????????????</li>
                </ul>
            </div>
            <div className='social'>
                <div className='social_container'>
                    <div className='social_button_container social_google_container' onClick={socialLoginHandler('google')}>
                        <div className='social_container_box'>
                        <img className='social_button social_google' src='Google.png' alt='social' />
                        <div className='social_text social_text_google'>?????? ?????????</div>
                        {/* <SocialGoogleLogin /> */}
                        </div>
                    </div>
                    <div className='social_button_container social_naver_container' onClick={socialLoginHandler('naver')}>
                    <div className='social_container_box'>
                        <img className='social_button social_naver' src='Naver.png' alt='social' />
                        <div className='social_text'>????????? ?????????</div>
                        </div>
                    </div>
                    <div className='social_button_container social_kakao_container' onClick={socialLoginHandler('kakao')}>
                    <div className='social_container_box'>
                        <img className='social_button social_kakao' src='Kakao.png' alt='social' />
                        <div className='social_text'>????????? ?????????</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>}
            {modalOnOff.seaerchPasswordModal ? <SearchPassword closeSeaerchPasswordModal={closeSeaerchPasswordModal} /> : null}
            {modalOnOff.guestModal ? <GuestLoginModal closeGuestModal={closeGuestModal} /> : null}
            
        </div>
    )
}

export default Login