import React,{useEffect} from 'react'
//첫화면
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/modules/reducer'
import { UserInfoHandler } from '../redux/modules/UserInfo'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import './styles/IntroStyle.css'
function Intro() {
    const history = useHistory()
    //리덕스 내용 보는법(밑은 리듀서 내용 보기
    //RootStateOrAny 루트의 스테이트 혹은 전부
    //RootState 루트의 스테이트만

    const introHandler = function () {
        history.push('/Login')
        hideLogo()
    }

    const test = function(){
        //document.querySelector('.nav_link_box')?.classList.add('hide')
        console.log(document.baseURI)
        console.log(document.location.href)
    }

    const hideLogo = function(){
        document.querySelector('.logo_nav')?.classList.toggle('hide')
        document.querySelector('#nav_bar')?.classList.toggle('hide')
      }

    useEffect(()=>{
      test()  
      hideLogo()
    },[])
    
    return (
        <div className='container'>
            <div id='intro_container'>
                <div className='intro_img_div'>
            <img className='logo_page intro_img' src="로고-우동담-Dark-모양만-배경o.png" alt="logo" /><br />
                </div>
            <div className='intro_text'>내 동네를 설정하고 이야기를 나눠보세요!</div><br />
            <div id='intro_button_div'>
            <button className='intro_button' onClick={introHandler}>로그인/회원가입</button>
            </div>
            </div>
       </div>
    )
}

export default Intro