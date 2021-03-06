import React, { useState } from 'react'
import { useDispatch, useSelector, RootStateOrAny } from "react-redux";
import { UserInfoHandler } from '../../redux/modules/UserInfo';
import { IsLoginHandler } from '../../redux/modules/IsLogin';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { IProps } from '../../pages/Mypage';

export const ModalContainer = styled.div`
    display:grid;
    justify-items: center;
    width:100%;
    color:black;
    //justify-content:center;
    //align-items:center;
    //align-self:center;
    //align-content:center;
    
  `;

export const ModalBackdrop = styled.div`
   position:absolute;
   position:fixed;
   top:0;
   left:0;
   z-index: 999;
   background-color: rgba(107, 112, 114, 0.37);
   
   width: 100%;
   height: 100%;
   
  `;


export const ModalView = styled.div.attrs(props => ({
  role: 'dialog'
}))`
  
  position:relative;
  top:50%;
  left:50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding:40px;
  width: 18em;
  max-width: 90vw;
  //height: 20em;
  border-radius: 10px;
  text-align: center;
  border: solid 1px black;
  
  .close-btn{
    position:relative;
    color:black;
    bottom:2rem;
    left:7rem;
    font-size:1.7rem
  }
  
  & .modal_text{
    position:relative;
    bottom: 3rem;
    font-size:1.3rem;
    line-height:7rem
    
  }
  & .modal_title{
    position:relative;
    bottom:2rem;
  }
  
  & .long{
    position:relative;
    line-height:2.5rem
  }
  
  & .modal_text_password{
    position:relative;
    font-size:2rem;
    margin-bottom:10px
  }
  
  & .input_password{
    position:relative;
    right:0.5rem;
    height: 18px;
    bottom:1px
  }
  
  
  `;



function MypageModal(props: any) {
  const dispatch = useDispatch();
  const history = useHistory();
  const userInfo = useSelector((state: RootStateOrAny) => state.UserInfoReducer);
  const closeModal = props.closeModal
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const openModalHandler = () => {
    setIsOpen(false)
    closeModal()
  };

  const inputPasswordHandler = function (e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
  }

  const userDeleteHandler = async function (e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    //???????????? ???????????? authorize ????????? ?????????
    try {
      const passwordCheckResp = await axios.post(`${process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : "http://localhost:8080"}/passwordcheck`, { email: userInfo.email, password: password }, { withCredentials: true })
      const userDeleteResult = await axios.delete(`${process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : "http://localhost:8080"}/user`, { withCredentials: true })

      setPassword('')
      //????????????
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('areaData')
      //????????????
      dispatch(UserInfoHandler({
        userId: 0,
        email: '',
        nickname: '',
        area: '??????????????????',
        area2: '??????????????????',
        manager: false,
        socialType: ''
      }))
      dispatch(IsLoginHandler(false))
      history.push('/');
    } catch (error: any) {
      // if(error.response.status === 401){
      //   console.log('??????????????? ??????????????????')
      // }
    }
  }

  return (
    <>

      {!isOpen ? null :
        <ModalContainer>
          <ModalBackdrop >
            <ModalView onClick={(e) => e.stopPropagation()}>

              <div>
                <span className='modal_title' >???????????? ??????</span>
                <span className="close-btn" onClick={openModalHandler}>&times;</span>
              </div>
              <div className='modal_text_container'>
                <div className='modal_text'>????????? ?????? ?????? ???????????????????</div>
                <div className='modal_text long'>??????????????? ????????? ?????? ??????????????? ???????????? ????????? ??? ????????????</div>
              </div>
              <div className='password_submit'>
                <div className='modal_text_password'>???????????? ??????</div>
                {errMessage}
                <div className='submit_container'>
                  <input className='input_password' type='password' value={password} onChange={inputPasswordHandler}></input>
                  <button onClick={userDeleteHandler}>????????????</button>
                </div>

              </div>
            </ModalView>
          </ModalBackdrop>
        </ModalContainer>
      }
    </>
  );
}

export default MypageModal